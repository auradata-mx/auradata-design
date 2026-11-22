import { describe, expect, it } from "vitest"

import { searchParamsToView, viewToSearchParams } from "./use-data-table-url-state"

const query = (view: Parameters<typeof viewToSearchParams>[0], prefix?: string) =>
  decodeURIComponent(viewToSearchParams(view, new URLSearchParams("id=story&viewMode=story"), prefix).toString())

describe("viewToSearchParams", () => {
  it("writes only what differs from a fresh table, and keeps the other params", () => {
    expect(query({ sorting: [], globalFilter: "", pagination: { pageIndex: 0, pageSize: 10 } })).toBe(
      "id=story&viewMode=story"
    )
  })

  it("writes the search, the sort, the page (from 1) and its size", () => {
    expect(
      query({
        globalFilter: "inventario",
        sorting: [{ id: "nombre", desc: false }, { id: "fecha", desc: true }],
        pagination: { pageIndex: 2, pageSize: 20 },
      })
    ).toBe("id=story&viewMode=story&q=inventario&sort=nombre.asc,fecha.desc&page=3&size=20")
  })

  it("writes the columns: hidden, order, pinned, widths, and the density", () => {
    expect(
      query({
        columnVisibility: { espacio: false, dueno: false, nombre: true },
        columnOrder: ["estado", "nombre"],
        columnPinning: { start: ["nombre"], end: [] },
        columnSizing: { nombre: 280 },
        density: "compact",
      })
    ).toBe(
      "id=story&viewMode=story&hide=espacio,dueno&order=estado,nombre&pin=nombre|&width=nombre:280&density=compact"
    )
  })

  it("writes each column filter as JSON under its column, days as YYYY-MM-DD", () => {
    expect(
      query({
        columnFilters: [
          { id: "region", value: ["Norte", "Sur"] },
          { id: "ventas", value: [100000, 500000] },
          { id: "fecha", value: { from: new Date(2026, 10, 1), to: new Date(2026, 10, 21) } },
        ],
      })
    ).toBe(
      'id=story&viewMode=story&f.region=["Norte","Sur"]&f.ventas=[100000,500000]&f.fecha={"from":"2026-11-01","to":"2026-11-21"}'
    )
  })

  it("puts a prefix on every name, so two tables share a URL", () => {
    expect(query({ globalFilter: "x", columnFilters: [{ id: "region", value: ["Norte"] }] }, "ventas")).toBe(
      'id=story&viewMode=story&ventas.q=x&ventas.f.region=["Norte"]'
    )
  })

  it("drops what went back to the default", () => {
    const params = viewToSearchParams({ globalFilter: "x" }, new URLSearchParams())
    expect(viewToSearchParams({ globalFilter: "" }, params).toString()).toBe("")
  })
})

describe("searchParamsToView", () => {
  it("reads back everything it wrote", () => {
    const view = {
      globalFilter: "nómina, 2026",
      sorting: [{ id: "fecha", desc: true }],
      pagination: { pageIndex: 1, pageSize: 50 },
      columnVisibility: { espacio: false },
      columnOrder: ["estado", "nombre"],
      columnPinning: { start: ["nombre"], end: ["estado"] },
      columnSizing: { nombre: 280 },
      density: "compact" as const,
      columnFilters: [
        { id: "region", value: ["Norte"] },
        { id: "fecha", value: { from: new Date(2026, 10, 1), to: new Date(2026, 10, 21) } },
      ],
      advancedFilter: {
        id: "root",
        combinator: "or" as const,
        conditions: [{ id: "c1", field: "ventas", operator: "gt" as const, value: 300000 }],
      },
    }
    expect(searchParamsToView(viewToSearchParams(view, new URLSearchParams()))).toEqual(view)
  })

  it("ignores what it cannot read: bad JSON, a page under 1, an unknown density", () => {
    expect(searchParamsToView(new URLSearchParams("f.region=[Norte&page=0&density=huge&sort=nombre.sideways"))).toEqual({})
  })

  it("reads only its own prefix", () => {
    expect(searchParamsToView(new URLSearchParams("q=a&ventas.q=b"), "ventas")).toEqual({ globalFilter: "b" })
  })
})
