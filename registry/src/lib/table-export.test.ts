import { strFromU8, unzipSync } from "fflate"
import { describe, expect, it } from "vitest"

import { toCsv, toXlsx, type ExportColumn } from "./table-export"

type Venta = { sucursal: string; ventas: number; fecha: string; nota?: string }

const COLUMNS: ExportColumn<Venta>[] = [
  { header: "Sucursal", value: (row) => row.sucursal },
  { header: "Ventas", value: (row) => row.ventas },
  { header: "Fecha", value: (row) => row.fecha },
  { header: "Nota", value: (row) => row.nota },
]

const ROWS: Venta[] = [
  { sucursal: "Monterrey Centro", ventas: 412500, fecha: "2026-11-18" },
  { sucursal: 'CDMX "Reforma", piso 2', ventas: 488000.5, fecha: "2026-11-20", nota: "Meta\nsuperada" },
  { sucursal: "=HYPERLINK(\"http://x\")", ventas: -1200, fecha: "2026-11-01", nota: "+52 81 1234" },
]

describe("toCsv", () => {
  const csv = toCsv(ROWS, COLUMNS)
  const lines = csv.replace(/^\uFEFF/, "").split("\r\n")

  it("starts with a BOM so Excel reads the accents, and ends lines with CRLF", () => {
    expect(csv.startsWith("\uFEFF")).toBe(true)
    expect(lines[0]).toBe("Sucursal,Ventas,Fecha,Nota")
  })

  it("writes numbers as plain numbers, with a dot, never grouped", () => {
    expect(lines[1]).toBe("Monterrey Centro,412500,2026-11-18,")
  })

  it("quotes a value with a comma, a quote or a line break, doubling its quotes", () => {
    expect(csv).toContain('"CDMX ""Reforma"", piso 2",488000.5,2026-11-20,"Meta\nsuperada"')
  })

  it("keeps text that a spreadsheet would run as a formula from running", () => {
    expect(csv).toContain(`"'=HYPERLINK(""http://x"")",-1200,2026-11-01,'+52 81 1234`)
  })

  it("takes another delimiter and no BOM", () => {
    expect(toCsv(ROWS.slice(0, 1), COLUMNS, { delimiter: ";", bom: false })).toBe(
      "Sucursal;Ventas;Fecha;Nota\r\nMonterrey Centro;412500;2026-11-18;"
    )
  })
})

describe("toXlsx", () => {
  const files = unzipSync(toXlsx(ROWS, COLUMNS, { sheetName: "Ventas" }))
  const sheet = strFromU8(files["xl/worksheets/sheet1.xml"])

  it("is a workbook Excel opens: the parts and the sheet's name", () => {
    expect(Object.keys(files)).toEqual(
      expect.arrayContaining([
        "[Content_Types].xml",
        "_rels/.rels",
        "xl/workbook.xml",
        "xl/_rels/workbook.xml.rels",
        "xl/styles.xml",
        "xl/worksheets/sheet1.xml",
      ])
    )
    expect(strFromU8(files["xl/workbook.xml"])).toContain('<sheet name="Ventas" sheetId="1" r:id="rId1"/>')
  })

  it("writes the header in bold and the text as inline strings, escaped", () => {
    expect(sheet).toContain('<c r="A1" t="inlineStr" s="1"><is><t>Sucursal</t></is></c>')
    expect(sheet).toContain("<t>CDMX &quot;Reforma&quot;, piso 2</t>")
    expect(sheet).toContain('<t xml:space="preserve">Meta\nsuperada</t>')
  })

  it("writes numbers as numbers and YYYY-MM-DD days as dates", () => {
    expect(sheet).toContain('<c r="B2"><v>412500</v></c>')
    // 18 nov 2026 is day 46344 of Excel's calendar.
    expect(sheet).toContain('<c r="C2" s="2"><v>46344</v></c>')
  })

  it("leaves empty values as empty cells and a formula-looking text as text", () => {
    expect(sheet).not.toContain('r="D2"')
    expect(sheet).toContain("<t>=HYPERLINK(&quot;http://x&quot;)</t>")
  })
})
