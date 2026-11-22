import { describe, expect, it } from "vitest"

import {
  countConditions,
  matchesFilter,
  OPERATORS,
  type FilterField,
  type FilterGroup,
} from "./filter-conditions"

type Venta = { sucursal: string; region: string; ventas: number; fecha: string; notas?: string }

const FIELDS: FilterField[] = [
  { id: "sucursal", label: "Sucursal", type: "text" },
  { id: "region", label: "Región", type: "select", options: [{ value: "Norte" }, { value: "Sur" }] },
  { id: "ventas", label: "Ventas", type: "number" },
  { id: "fecha", label: "Fecha", type: "date" },
  { id: "notas", label: "Notas", type: "text" },
]

const MERIDA: Venta = { sucursal: "Mérida", region: "Sur", ventas: 121500, fecha: "2026-08-22" }
const MONTERREY: Venta = { sucursal: "Monterrey Centro", region: "Norte", ventas: 412500, fecha: "2026-11-18", notas: "Meta" }

const group = (combinator: "and" | "or", conditions: FilterGroup["conditions"]): FilterGroup => ({
  id: "g",
  combinator,
  conditions,
})

describe("matchesFilter", () => {
  it("keeps every record with no conditions", () => {
    expect(matchesFilter(MERIDA, group("and", []), FIELDS)).toBe(true)
  })

  it("compares text without case or accents", () => {
    const filter = group("and", [{ id: "1", field: "sucursal", operator: "contains", value: "merida" }])
    expect(matchesFilter(MERIDA, filter, FIELDS)).toBe(true)
    expect(matchesFilter(MONTERREY, filter, FIELDS)).toBe(false)
    const starts = group("and", [{ id: "1", field: "sucursal", operator: "startsWith", value: "MONTE" }])
    expect(matchesFilter(MONTERREY, starts, FIELDS)).toBe(true)
  })

  it("compares numbers, also when the value was typed as text", () => {
    expect(matchesFilter(MERIDA, group("and", [{ id: "1", field: "ventas", operator: "gte", value: "121500" }]), FIELDS)).toBe(true)
    expect(matchesFilter(MERIDA, group("and", [{ id: "1", field: "ventas", operator: "gt", value: 121500 }]), FIELDS)).toBe(false)
    expect(matchesFilter(MERIDA, group("and", [{ id: "1", field: "ventas", operator: "lt", value: 200000 }]), FIELDS)).toBe(true)
  })

  it("compares days, a YYYY-MM-DD string being that local day", () => {
    const before = group("and", [{ id: "1", field: "fecha", operator: "before", value: "2026-11-01" }])
    expect(matchesFilter(MERIDA, before, FIELDS)).toBe(true)
    expect(matchesFilter(MONTERREY, before, FIELDS)).toBe(false)
    const on = group("and", [{ id: "1", field: "fecha", operator: "equals", value: new Date(2026, 10, 18, 15, 30) }])
    expect(matchesFilter(MONTERREY, on, FIELDS)).toBe(true)
  })

  it("tells empty from filled", () => {
    const empty = group("and", [{ id: "1", field: "notas", operator: "isEmpty" }])
    expect(matchesFilter(MERIDA, empty, FIELDS)).toBe(true)
    expect(matchesFilter(MONTERREY, empty, FIELDS)).toBe(false)
  })

  it("needs every condition with Y and one with O", () => {
    const conditions: FilterGroup["conditions"] = [
      { id: "1", field: "region", operator: "equals", value: "Sur" },
      { id: "2", field: "ventas", operator: "gt", value: 300000 },
    ]
    expect(matchesFilter(MERIDA, group("and", conditions), FIELDS)).toBe(false)
    expect(matchesFilter(MERIDA, group("or", conditions), FIELDS)).toBe(true)
    expect(matchesFilter(MONTERREY, group("or", conditions), FIELDS)).toBe(true)
  })

  it("nests groups: (Norte O Sur) Y ventas > 200,000", () => {
    const filter = group("and", [
      group("or", [
        { id: "1", field: "region", operator: "equals", value: "Norte" },
        { id: "2", field: "region", operator: "equals", value: "Sur" },
      ]),
      { id: "3", field: "ventas", operator: "gt", value: 200000 },
    ])
    expect(matchesFilter(MONTERREY, filter, FIELDS)).toBe(true)
    expect(matchesFilter(MERIDA, filter, FIELDS)).toBe(false)
  })

  it("skips conditions still being written: no value, or a field it does not know", () => {
    const filter = group("and", [
      { id: "1", field: "ventas", operator: "gt" },
      { id: "2", field: "ventas", operator: "gt", value: "" },
      { id: "3", field: "otro", operator: "equals", value: "x" },
    ])
    expect(matchesFilter(MERIDA, filter, FIELDS)).toBe(true)
    // An O group of unfinished conditions does not empty the table either.
    expect(matchesFilter(MERIDA, group("or", filter.conditions), FIELDS)).toBe(true)
  })

  it("reads a value with getValue when the record is not a plain object of fields", () => {
    const filter = group("and", [{ id: "1", field: "ventas", operator: "gt", value: 100 }])
    expect(matchesFilter({ cells: [150] }, filter, FIELDS, (record) => record.cells[0])).toBe(true)
  })
})

describe("countConditions", () => {
  it("counts the finished conditions, nested ones too", () => {
    const filter = group("and", [
      group("or", [
        { id: "1", field: "region", operator: "equals", value: "Norte" },
        { id: "2", field: "region", operator: "equals" },
      ]),
      { id: "3", field: "notas", operator: "isNotEmpty" },
    ])
    expect(countConditions(filter, FIELDS)).toBe(2)
  })
})

describe("OPERATORS", () => {
  it("offers each field type its own operators, in Spanish", () => {
    expect(OPERATORS.text.map((operator) => operator.label)).toContain("contiene")
    expect(OPERATORS.number.map((operator) => operator.label)).toContain("mayor que")
    expect(OPERATORS.date.map((operator) => operator.label)).toEqual(["es el", "antes del", "después del"])
    expect(OPERATORS.select.map((operator) => operator.id)).toEqual(["equals", "notEquals"])
  })
})
