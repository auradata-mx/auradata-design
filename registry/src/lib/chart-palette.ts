// registry: auradata (the brand chart palette)
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
