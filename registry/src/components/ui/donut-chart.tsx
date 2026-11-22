// registry: auradata (donut and pie charts of the brand: the whole in the middle, at most six parts with «Otros», a legend that hides parts, shares in the tooltip)
"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"
import { cn } from "cn"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  useChartSeries,
} from "@/components/ui/chart"
import { chartConfig } from "@/lib/chart-palette"
import { formatNumber } from "@/lib/format"

type Row = Record<string, unknown>

type DonutChartProps = {
  /** One row per part. */
  data: Row[]
  /** The key of each part's name. */
  index: string
  /** The key of each part's value. */
  value: string
  /** `pie` for two or three parts; a donut, with the total in the middle, otherwise. */
  variant?: "donut" | "pie"
  /** Writes a value in the tooltip; es-MX numbers by default. */
  valueFormatter?: (value: number) => string
  /** Writes the total in the middle; `valueFormatter` by default. */
  centerFormatter?: (value: number) => string
  /** What the total counts: «Total» by default. */
  centerLabel?: React.ReactNode
  /** The most parts drawn: the smallest beyond it fold into «Otros». Six by default. */
  maxParts?: number
  otherLabel?: string
  legend?: boolean
  /** Opens the tooltip on this part from the start. */
  tooltipIndex?: number
  animate?: boolean
  className?: string
}

const SURFACE = "var(--chart-surface, var(--card))"

type Part = { key: string; name: string; value: number }

/** The parts in data order; past `maxParts`, the largest `maxParts - 1` and «Otros» with the rest. */
function partsOf(data: Row[], index: string, value: string, maxParts: number, otherLabel: string): Part[] {
  const parts = data.map((row) => ({
    name: String(row[index] ?? ""),
    value: typeof row[value] === "number" ? (row[value] as number) : 0,
  }))
  const kept =
    parts.length <= maxParts
      ? parts
      : [
          ...[...parts].sort((a, b) => b.value - a.value).slice(0, maxParts - 1),
          {
            name: otherLabel,
            value: [...parts]
              .sort((a, b) => b.value - a.value)
              .slice(maxParts - 1)
              .reduce((sum, part) => sum + part.value, 0),
          },
        ]
  // Names can hold spaces and accents: the colors go by a key of the position, never by the name.
  return kept.map((part, position) => ({ ...part, key: `part-${position}` }))
}

/** A whole split into parts, read at a glance. To compare the parts with each other, use bars. */
function DonutChart({
  data,
  index,
  value,
  variant = "donut",
  valueFormatter = (number) => formatNumber(number),
  centerFormatter,
  centerLabel = "Total",
  maxParts = 6,
  otherLabel = "Otros",
  legend = true,
  tooltipIndex,
  animate,
  className,
}: DonutChartProps) {
  const parts = React.useMemo(
    () => partsOf(data, index, value, maxParts, otherLabel),
    [data, index, value, maxParts, otherLabel]
  )
  const config = React.useMemo(
    () => chartConfig(Object.fromEntries(parts.map((part) => [part.key, part.name]))),
    [parts]
  )
  const { hidden, toggle, isHidden } = useChartSeries()
  // A hidden part keeps its place and its color, at zero: the others never repaint.
  const shown = parts.map((part) => ({
    ...part,
    value: isHidden(part.key) ? 0 : part.value,
    fill: `var(--color-${part.key})`,
  }))
  const total = shown.reduce((sum, part) => sum + part.value, 0)
  const donut = variant === "donut"

  return (
    <ChartContainer config={config} className={cn("aspect-auto h-64 w-full", className)}>
      <RechartsPrimitive.PieChart accessibilityLayer>
        <ChartTooltip
          defaultIndex={tooltipIndex}
          content={
            <ChartTooltipContent
              nameKey="key"
              hideLabel
              valueFormatter={(number) => valueFormatter(number)}
              showPercent
              percentTotal={total}
            />
          }
        />
        {legend && (
          <ChartLegend
            content={<ChartLegendContent nameKey="key" hiddenSeries={hidden} onSeriesToggle={toggle} />}
          />
        )}
        <RechartsPrimitive.Pie
          data={shown}
          dataKey="value"
          nameKey="key"
          innerRadius={donut ? "62%" : 0}
          outerRadius="88%"
          cornerRadius={donut ? 4 : 0}
          // The gap between parts is the surface, 2 px wide.
          stroke={SURFACE}
          strokeWidth={2}
          isAnimationActive={animate}
        >
          {shown.map((part) => (
            <RechartsPrimitive.Cell key={part.key} fill={part.fill} stroke={part.value ? SURFACE : "none"} />
          ))}
          {donut && (
            <RechartsPrimitive.Label
              position="center"
              content={({ viewBox }) => {
                if (!viewBox || !("cx" in viewBox) || viewBox.cx === undefined || viewBox.cy === undefined) return null
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                    <tspan
                      data-slot="donut-total"
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-2xl font-semibold tabular-nums"
                    >
                      {(centerFormatter ?? valueFormatter)(total)}
                    </tspan>
                    <tspan x={viewBox.cx} y={viewBox.cy + 22} className="fill-muted-foreground text-xs">
                      {centerLabel}
                    </tspan>
                  </text>
                )
              }}
            />
          )}
        </RechartsPrimitive.Pie>
      </RechartsPrimitive.PieChart>
    </ChartContainer>
  )
}

export { DonutChart }
export type { DonutChartProps }
