// registry: auradata (the brand chart palettes: categorical, sequential and diverging)
import type { CSSProperties } from "react"

import type { ChartConfig } from "@/components/ui/chart"

/** The AuraData categorical palette, in order: --chart-1 (Azul Aura) to --chart-8. */
export const CHART_COLORS = Array.from({ length: 8 }, (_, index) => `var(--chart-${index + 1})`)

/**
 * A ChartConfig that gives each series the next brand color, so no chart writes a color.
 * Past eight series the palette starts again: group the rest into "Otros" instead.
 */
export function chartConfig(series: Record<string, string>): ChartConfig {
  return Object.fromEntries(
    Object.entries(series).map(([key, label], index) => [
      key,
      { label, color: CHART_COLORS[index % CHART_COLORS.length] },
    ])
  )
}

/** A step of the sequential or diverging palette: 1 to 9. */
export type PaletteStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

/**
 * Magnitude: the step of `value` in `[min, max]` on --sequential-1 (near zero) to --sequential-9 (the most),
 * one hue in light and dark. Values outside the domain take the nearest end.
 */
export function sequentialStep(value: number, [min, max]: [number, number]): PaletteStep {
  const share = max > min ? clamp((value - min) / (max - min), 0, 1) : 0
  return (1 + Math.round(share * 8)) as PaletteStep
}

/**
 * Polarity: `center` (0 by default) is the neutral --diverging-5; `center - limit` and below is --diverging-1
 * (red), `center + limit` and above is --diverging-9 (blue).
 */
export function divergingStep(value: number, limit: number, center = 0): PaletteStep {
  const share = limit > 0 ? clamp((value - center) / limit, -1, 1) : 0
  return (5 + Math.round(share * 4)) as PaletteStep
}

/**
 * The fill of a cell and a label that reads on it (WCAG AA, light and dark, checked by the token tests):
 * the text color on the light end of each ramp, the page color on the strong end.
 */
type Fill = Pick<CSSProperties, "backgroundColor" | "color">

const fill = (palette: "sequential" | "diverging", step: PaletteStep, onText: boolean): Fill => ({
  backgroundColor: `var(--${palette}-${step})`,
  color: onText ? "var(--foreground)" : "var(--background)",
})

/** `style={sequentialFill(value, [0, max])}` on a heatmap cell: steps 1-5 take the text color, 6-9 the page color. */
export function sequentialFill(value: number, domain: [number, number]): Fill {
  const step = sequentialStep(value, domain)
  return fill("sequential", step, step <= 5)
}

/** `style={divergingFill(change, 0.2)}` on a cell: steps 3-7 take the text color, 1, 2, 8 and 9 the page color. */
export function divergingFill(value: number, limit: number, center = 0): Fill {
  const step = divergingStep(value, limit, center)
  return fill("diverging", step, step >= 3 && step <= 7)
}
