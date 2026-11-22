import { describe, expect, it } from "vitest"

import { formatCompact, formatCurrency, formatDate, formatNumber, formatPercent } from "./format"

// es-MX puts a no-break space (U+00A0) between a number and its unit, so "12.4 %" never wraps.
const nbsp = "\u00a0"

describe("formatCurrency", () => {
  it("formats pesos with no decimals by default", () => {
    expect(formatCurrency(1_284_500)).toBe("$1,284,500")
  })
  it("keeps the sign of a negative amount", () => {
    expect(formatCurrency(-1_284_500)).toBe("-$1,284,500")
  })
  it("takes decimals, another currency and a locale", () => {
    expect(formatCurrency(3240.5, { maximumFractionDigits: 2, minimumFractionDigits: 2 })).toBe("$3,240.50")
    expect(formatCurrency(1200, { currency: "USD", locale: "en-US" })).toBe("$1,200")
  })
})

describe("formatCompact", () => {
  it("shortens money in millions", () => {
    expect(formatCompact(4_160_000, { currency: "MXN" })).toBe(`$4.16${nbsp}M`)
  })
  it("shortens thousands with a capital K", () => {
    expect(formatCompact(1300)).toBe(`1.3${nbsp}K`)
  })
  it("leaves small numbers alone", () => {
    expect(formatCompact(812)).toBe("812")
  })
})

describe("formatPercent", () => {
  it("takes a fraction and puts a space before the sign", () => {
    expect(formatPercent(0.124)).toBe(`12.4${nbsp}%`)
  })
  it("shows the sign of a change when asked", () => {
    expect(formatPercent(0.062, { signDisplay: "exceptZero" })).toBe(`+6.2${nbsp}%`)
    expect(formatPercent(-0.021, { signDisplay: "exceptZero" })).toBe(`\u22122.1${nbsp}%`)
    expect(formatPercent(0, { signDisplay: "exceptZero" })).toBe(`0${nbsp}%`)
  })
  it("writes a fall with a true minus sign (U+2212), not a hyphen", () => {
    expect(formatPercent(-0.021)).toBe(`\u22122.1${nbsp}%`)
  })
  it("follows another locale's own pattern", () => {
    expect(formatPercent(0.124, { locale: "en-US" })).toBe("12.4%")
  })
})

describe("formatNumber", () => {
  it("groups thousands with commas and decimals with a point", () => {
    expect(formatNumber(1_284_500.75)).toBe("1,284,500.75")
  })
  it("passes Intl options through", () => {
    expect(formatNumber(1284.567, { maximumFractionDigits: 1 })).toBe("1,284.6")
  })
})

describe("formatDate", () => {
  it("writes day, short month and year", () => {
    expect(formatDate(new Date(2026, 10, 21))).toBe("21 nov 2026")
  })
  it("reads a date-only string as a local day, not UTC", () => {
    expect(formatDate("2026-11-21")).toBe("21 nov 2026")
  })
  it("takes another locale", () => {
    expect(formatDate(new Date(2026, 4, 3), { locale: "en-US" })).toBe("May 3, 2026")
  })
})
