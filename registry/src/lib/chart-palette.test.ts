import { describe, expect, test } from "vitest"

import { chartConfig, divergingFill, divergingStep, sequentialFill, sequentialStep } from "./chart-palette"

test("chartConfig gives each series the next categorical color", () => {
  expect(chartConfig({ norte: "Norte", sur: "Sur" })).toEqual({
    norte: { label: "Norte", color: "var(--chart-1)" },
    sur: { label: "Sur", color: "var(--chart-2)" },
  })
})

describe("sequentialStep", () => {
  test("maps the domain onto steps 1 to 9", () => {
    expect(sequentialStep(0, [0, 80])).toBe(1)
    expect(sequentialStep(40, [0, 80])).toBe(5)
    expect(sequentialStep(80, [0, 80])).toBe(9)
    expect(sequentialStep(11, [0, 80])).toBe(2)
  })

  test("clamps values outside the domain and survives an empty one", () => {
    expect(sequentialStep(-5, [0, 80])).toBe(1)
    expect(sequentialStep(120, [0, 80])).toBe(9)
    expect(sequentialStep(3, [3, 3])).toBe(1)
  })
})

describe("divergingStep", () => {
  test("puts the center on the neutral 5, negatives below and positives above", () => {
    expect(divergingStep(0, 10)).toBe(5)
    expect(divergingStep(-10, 10)).toBe(1)
    expect(divergingStep(10, 10)).toBe(9)
    expect(divergingStep(5, 10)).toBe(7)
    expect(divergingStep(-5, 10)).toBe(3)
  })

  test("clamps past the limit and takes another center", () => {
    expect(divergingStep(-40, 10)).toBe(1)
    expect(divergingStep(40, 10)).toBe(9)
    expect(divergingStep(1.1, 0.1, 1)).toBe(9)
    expect(divergingStep(1, 0.1, 1)).toBe(5)
  })
})

// The same label rule the token contrast tests check: AA on every step, light and dark.
test("sequentialFill paints the step and a label that reads on it", () => {
  expect(sequentialFill(0, [0, 80])).toEqual({ backgroundColor: "var(--sequential-1)", color: "var(--foreground)" })
  expect(sequentialFill(40, [0, 80])).toEqual({ backgroundColor: "var(--sequential-5)", color: "var(--foreground)" })
  expect(sequentialFill(50, [0, 80])).toEqual({ backgroundColor: "var(--sequential-6)", color: "var(--background)" })
})

test("divergingFill paints the step and a label that reads on it", () => {
  expect(divergingFill(-10, 10)).toEqual({ backgroundColor: "var(--diverging-1)", color: "var(--background)" })
  expect(divergingFill(-5, 10)).toEqual({ backgroundColor: "var(--diverging-3)", color: "var(--foreground)" })
  expect(divergingFill(0, 10)).toEqual({ backgroundColor: "var(--diverging-5)", color: "var(--foreground)" })
  expect(divergingFill(8, 10)).toEqual({ backgroundColor: "var(--diverging-8)", color: "var(--background)" })
})
