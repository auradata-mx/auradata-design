// registry: auradata (rows to CSV that Excel opens with its accents, and to a real .xlsx with numbers and dates, plus the download)
import { strToU8, zipSync } from "fflate"

/** A column of an export: its header and how to read its value from a row. */
type ExportColumn<TRow> = { header: string; value: (row: TRow) => unknown }

/** A text a spreadsheet would run as a formula: «=», «+», «-», «@», a tab or a carriage return first. */
const FORMULA = /^[=+\-@\t\r]/

function textOf(value: unknown): string {
  if (value === null || value === undefined) return ""
  if (value instanceof Date) return value.toISOString()
  return String(value)
}

/**
 * Rows as CSV: CRLF lines, a BOM so Excel reads «Mérida» right, numbers as written by `String` (a dot, never
 * grouped). A text that would run as a formula in a spreadsheet gets a leading «'» (CSV injection).
 */
function toCsv<TRow>(
  rows: TRow[],
  columns: ExportColumn<TRow>[],
  { delimiter = ",", bom = true }: { delimiter?: string; bom?: boolean } = {}
) {
  const field = (value: unknown) => {
    let text = textOf(value)
    if (typeof value === "string" && FORMULA.test(text)) text = `'${text}`
    return text.includes(delimiter) || /["\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text
  }
  const lines = [
    columns.map((column) => field(column.header)).join(delimiter),
    ...rows.map((row) => columns.map((column) => field(column.value(row))).join(delimiter)),
  ]
  return (bom ? "\uFEFF" : "") + lines.join("\r\n")
}

const xml = (text: string) =>
  text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;")

/** "A", "B" … "Z", "AA": the letters of a column. */
function columnName(index: number) {
  let name = ""
  for (let n = index + 1; n > 0; n = Math.floor((n - 1) / 26)) name = String.fromCharCode(65 + ((n - 1) % 26)) + name
  return name
}

/** A day as Excel counts it: days since 30 dec 1899. A `YYYY-MM-DD` string is that day; a `Date`, its local day. */
function excelDay(value: Date | string) {
  const [year, month, day] =
    typeof value === "string" ? value.split("-").map(Number) : [value.getFullYear(), value.getMonth() + 1, value.getDate()]
  return (Date.UTC(year, month - 1, day) - Date.UTC(1899, 11, 30)) / 86_400_000
}

const DAY = /^\d{4}-\d{2}-\d{2}$/

/** One cell: a number, a date (style 2) or an inline string; nothing for an empty value. */
function cell(ref: string, value: unknown, header = false) {
  if (value === null || value === undefined || value === "") return ""
  if (!header && typeof value === "number" && Number.isFinite(value)) return `<c r="${ref}"><v>${value}</v></c>`
  if (!header && (value instanceof Date || (typeof value === "string" && DAY.test(value))))
    return `<c r="${ref}" s="2"><v>${excelDay(value)}</v></c>`
  const text = textOf(value)
  const space = /^\s|\s$|\n/.test(text) ? ' xml:space="preserve"' : ""
  return `<c r="${ref}" t="inlineStr"${header ? ' s="1"' : ""}><is><t${space}>${xml(text)}</t></is></c>`
}

/**
 * Rows as an .xlsx workbook (one sheet): the header in bold, numbers as numbers, days as dates Excel formats
 * («18/11/2026» in a Mexican Excel), text as text (never a formula). Columns as wide as their longest value.
 */
function toXlsx<TRow>(rows: TRow[], columns: ExportColumn<TRow>[], { sheetName = "Datos" }: { sheetName?: string } = {}) {
  const values = rows.map((row) => columns.map((column) => column.value(row)))
  const widths = columns.map((column, index) =>
    Math.min(60, Math.max(column.header.length, ...values.map((row) => textOf(row[index]).length)) + 2)
  )
  const sheetRows = [
    `<row r="1">${columns.map((column, index) => cell(`${columnName(index)}1`, column.header, true)).join("")}</row>`,
    ...values.map(
      (row, at) => `<row r="${at + 2}">${row.map((value, index) => cell(`${columnName(index)}${at + 2}`, value)).join("")}</row>`
    ),
  ]
  const head = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
  const main = "http://schemas.openxmlformats.org/spreadsheetml/2006/main"
  const rel = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
  const files = {
    "[Content_Types].xml":
      head +
      '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
      '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
      '<Default Extension="xml" ContentType="application/xml"/>' +
      '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>' +
      '<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>' +
      '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>' +
      "</Types>",
    "_rels/.rels":
      head +
      '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
      `<Relationship Id="rId1" Type="${rel}/officeDocument" Target="xl/workbook.xml"/>` +
      "</Relationships>",
    "xl/workbook.xml":
      head +
      `<workbook xmlns="${main}" xmlns:r="${rel}"><sheets>` +
      `<sheet name="${xml(sheetName.slice(0, 31))}" sheetId="1" r:id="rId1"/>` +
      "</sheets></workbook>",
    "xl/_rels/workbook.xml.rels":
      head +
      '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
      `<Relationship Id="rId1" Type="${rel}/worksheet" Target="worksheets/sheet1.xml"/>` +
      `<Relationship Id="rId2" Type="${rel}/styles" Target="styles.xml"/>` +
      "</Relationships>",
    // Style 0: plain; 1: bold (the header); 2: a short date (numFmt 14, shown in the reader's locale).
    "xl/styles.xml":
      head +
      `<styleSheet xmlns="${main}">` +
      '<fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts>' +
      '<fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills>' +
      '<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>' +
      '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>' +
      '<cellXfs count="3"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>' +
      '<xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/>' +
      '<xf numFmtId="14" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/></cellXfs>' +
      '<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>' +
      "</styleSheet>",
    "xl/worksheets/sheet1.xml":
      head +
      `<worksheet xmlns="${main}">` +
      `<cols>${widths.map((width, index) => `<col min="${index + 1}" max="${index + 1}" width="${width}" customWidth="1"/>`).join("")}</cols>` +
      `<sheetData>${sheetRows.join("")}</sheetData>` +
      "</worksheet>",
  }
  return zipSync(Object.fromEntries(Object.entries(files).map(([name, text]) => [name, strToU8(text)])))
}

/** Saves a file in the browser: an object URL on a hidden link, freed right after. */
function downloadFile(data: BlobPart, fileName: string, type: string) {
  const url = URL.createObjectURL(new Blob([data], { type }))
  const link = document.createElement("a")
  link.href = url
  link.download = fileName
  document.body.append(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 0)
}

const MIME = {
  csv: "text/csv;charset=utf-8",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
} as const

export { downloadFile, MIME, toCsv, toXlsx, type ExportColumn }
