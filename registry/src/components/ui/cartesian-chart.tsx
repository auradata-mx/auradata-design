// registry: auradata (line, area, bar and combo charts of the brand: palette in order, es-MX axes and tooltips, round ticks from zero, a legend that hides series, the previous period)
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
import { formatCompact, formatNumber } from "@/lib/format"

type Row = Record<string, unknown>

type CartesianChartProps = {
  /** One row per point of the index (a month, a product), with a number per series. */
  data: Row[]
  /** The key of the index: the categories or dates along the axis. */
  index: string
  /** Series to draw, in order, by key: `{ norte: "Norte", sur: "Sur" }`. They take the palette in that order. */
  series: Record<string, string>
  /** Writes a value in the tooltip, such as `formatCurrency`; es-MX numbers by default. */
  valueFormatter?: (value: number) => string
  /** Writes a value on the axis; short by default (`1.2 K`). */
  axisFormatter?: (value: number) => string
  /** Writes an index value on the axis and in the tooltip. */
  indexFormatter?: (value: string) => string
  /** The legend; on by default with two or more series, where it also hides and shows them. */
  legend?: boolean
  /** Each value's share of its point in the tooltip: for parts of a total. */
  showPercent?: boolean
  /**
   * The key of each series' previous period: `(key) => \`${key}Anterior\``. The tooltip gives the change with its
   * arrow; line and area charts also draw it as a dashed line of the same color.
   */
  previousKey?: (key: string) => string
  /** What the change compares with, such as "vs. 2025". */
  comparison?: React.ReactNode
  /** When a fall is the good news (costs, churn), set "down". */
  goodDirection?: "up" | "down"
  /** Opens the tooltip at this point from the start: for a screenshot or a highlighted point. */
  tooltipIndex?: number
  /** Animates the marks in; `false` in stories and screenshots. */
  animate?: boolean
  className?: string
}

/**
 * The surface behind the marks: the gap between stacked segments and the ring around dots take its color. A card by
 * default; a chart on the page background sets `[--chart-surface:var(--background)]`.
 */
const SURFACE = "var(--chart-surface, var(--card))"
const STEPS = [1, 2, 2.5, 5]

/** Round ticks from zero that cover `max` in at most five steps: 0, 500, 1,000… */
function niceTicks(max: number, intervals = 5) {
  if (!(max > 0)) return undefined
  let power = 10 ** Math.floor(Math.log10(max / intervals))
  for (;;) {
    for (const multiple of STEPS) {
      const step = multiple * power
      const count = Math.ceil(max / step - 1e-9)
      if (count <= intervals) {
        return Array.from({ length: count + 1 }, (_, index) => Number((index * step).toPrecision(12)))
      }
    }
    power *= 10
  }
}

/** The largest value to show: of each series, or of their sum when stacked. Undefined with negatives. */
function maxOf(data: Row[], keys: string[], stacked: boolean) {
  let max = 0
  for (const row of data) {
    const values = keys.map((key) => row[key]).filter((value): value is number => typeof value === "number")
    if (values.some((value) => value < 0)) return undefined
    max = Math.max(max, stacked ? values.reduce((sum, value) => sum + value, 0) : Math.max(0, ...values))
  }
  return max
}

type Kind = "line" | "area" | "bar" | "combo"

type FrameProps = Omit<CartesianChartProps, "series"> & {
  kind: Kind
  /** Bars, or every series of a line or area chart. */
  series: Record<string, string>
  /** The lines of a combo chart, drawn over its bars. */
  lines?: Record<string, string>
  stacked?: boolean
  horizontal?: boolean
}

function CartesianFrame({
  kind,
  data,
  index,
  series,
  lines = {},
  stacked = false,
  horizontal = false,
  valueFormatter = (value) => formatNumber(value),
  axisFormatter = (value) => formatCompact(value),
  indexFormatter,
  legend,
  showPercent,
  previousKey,
  comparison,
  goodDirection,
  tooltipIndex,
  animate,
  className,
}: FrameProps) {
  const config = React.useMemo(() => chartConfig({ ...series, ...lines }), [series, lines])
  const { hidden, toggle, isHidden } = useChartSeries()
  const keys = Object.keys(series)
  const lineKeys = Object.keys(lines)
  const visible = keys.filter((key) => !isHidden(key))
  const visibleLines = lineKeys.filter((key) => !isHidden(key))
  const drawsPrevious = Boolean(previousKey) && (kind === "line" || kind === "area")
  const previousKeys = drawsPrevious && previousKey ? visible.map(previousKey) : []

  // The axis follows what shows: hiding the biggest series rescales the rest.
  const max = Math.max(
    maxOf(data, visible, stacked) ?? Number.NaN,
    maxOf(data, [...visibleLines, ...previousKeys], false) ?? Number.NaN
  )
  const ticks = Number.isNaN(max) ? undefined : niceTicks(max)
  const valueAxis = {
    tickLine: false,
    axisLine: false,
    tickFormatter: axisFormatter,
    ...(ticks ? { ticks, domain: [0, ticks[ticks.length - 1]] } : {}),
  }
  const indexAxis = {
    dataKey: index,
    tickLine: false,
    axisLine: false,
    tickMargin: 8,
    tickFormatter: indexFormatter,
  }
  // Only the top segment of a stack is rounded: the end of the data, never a joint.
  const topKey = stacked ? visible[visible.length - 1] : undefined
  const radius = (key: string): number | [number, number, number, number] =>
    stacked && key !== topKey ? 0 : horizontal ? [0, 4, 4, 0] : [4, 4, 0, 0]
  const showLegend = legend ?? keys.length + lineKeys.length > 1

  const Chart =
    kind === "line"
      ? RechartsPrimitive.LineChart
      : kind === "area"
        ? RechartsPrimitive.AreaChart
        : kind === "bar"
          ? RechartsPrimitive.BarChart
          : RechartsPrimitive.ComposedChart

  return (
    <ChartContainer config={config} className={cn("aspect-auto h-64 w-full", className)}>
      <Chart
        data={data}
        accessibilityLayer
        layout={horizontal ? "vertical" : "horizontal"}
        barGap={2}
        // Room on the right for the last label, centered on the edge.
        margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
      >
        <RechartsPrimitive.CartesianGrid vertical={horizontal} horizontal={!horizontal} />
        {horizontal ? (
          <>
            <RechartsPrimitive.XAxis type="number" {...valueAxis} />
            <RechartsPrimitive.YAxis type="category" width="auto" {...indexAxis} />
          </>
        ) : (
          <>
            <RechartsPrimitive.XAxis minTickGap={16} interval="preserveStartEnd" {...indexAxis} />
            <RechartsPrimitive.YAxis width="auto" {...valueAxis} />
          </>
        )}
        <ChartTooltip
          defaultIndex={tooltipIndex}
          content={
            <ChartTooltipContent
              indicator={kind === "line" ? "line" : "dot"}
              labelFormatter={indexFormatter ? (label) => indexFormatter(String(label)) : undefined}
              valueFormatter={(value) => valueFormatter(value)}
              showPercent={showPercent}
              previousKey={previousKey}
              comparison={comparison}
              goodDirection={goodDirection}
            />
          }
        />
        {showLegend && (
          <ChartLegend
            content={<ChartLegendContent hiddenSeries={hidden} onSeriesToggle={toggle} />}
            itemSorter={null}
          />
        )}
        {keys.map((key) => {
          const color = `var(--color-${key})`
          const common = {
            dataKey: key,
            name: key,
            className: `series-${key}`,
            hide: isHidden(key),
            isAnimationActive: animate,
          }
          if (kind === "line") {
            return (
              <RechartsPrimitive.Line
                key={key}
                {...common}
                type="monotone"
                stroke={color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: color, stroke: SURFACE, strokeWidth: 2 }}
              />
            )
          }
          if (kind === "area") {
            return (
              <RechartsPrimitive.Area
                key={key}
                {...common}
                type="monotone"
                legendType="rect"
                stackId={stacked ? "stack" : undefined}
                stroke={color}
                strokeWidth={2}
                fill={color}
                // A wash under one line; stacked bands need more body to read as parts.
                fillOpacity={stacked ? 0.3 : 0.1}
                activeDot={{ r: 4, fill: color, stroke: SURFACE, strokeWidth: 2 }}
              />
            )
          }
          return (
            <RechartsPrimitive.Bar
              key={key}
              {...common}
              stackId={stacked ? "stack" : undefined}
              fill={color}
              radius={radius(key)}
              maxBarSize={24}
              // The 2 px gap between stacked segments is the surface, not a border.
              stroke={stacked ? SURFACE : undefined}
              strokeWidth={stacked ? 2 : undefined}
            />
          )
        })}
        {previousKey &&
          drawsPrevious &&
          keys.map((key) => (
            <RechartsPrimitive.Line
              key={previousKey(key)}
              dataKey={previousKey(key)}
              className={`series-${previousKey(key)}`}
              type="monotone"
              stroke={`var(--color-${key})`}
              strokeOpacity={0.6}
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
              activeDot={false}
              hide={isHidden(key)}
              legendType="none"
              tooltipType="none"
              isAnimationActive={animate}
            />
          ))}
        {lineKeys.map((key) => (
          <RechartsPrimitive.Line
            key={key}
            dataKey={key}
            name={key}
            className={`series-${key}`}
            type="monotone"
            stroke={`var(--color-${key})`}
            strokeWidth={2}
            dot={{ r: 4, fill: `var(--color-${key})`, stroke: SURFACE, strokeWidth: 2 }}
            activeDot={{ r: 5, fill: `var(--color-${key})`, stroke: SURFACE, strokeWidth: 2 }}
            hide={isHidden(key)}
            isAnimationActive={animate}
          />
        ))}
      </Chart>
    </ChartContainer>
  )
}

/** How a value changes over time. */
function LineChart(props: CartesianChartProps) {
  return <CartesianFrame kind="line" {...props} />
}

/** Volume over time; `stacked` for how a total adds up. */
function AreaChart(props: CartesianChartProps & { stacked?: boolean }) {
  return <CartesianFrame kind="area" {...props} />
}

/** Compare categories: grouped by default, `stacked` for a total and its parts, `horizontal` for long names and rankings. */
function BarChart(props: CartesianChartProps & { stacked?: boolean; horizontal?: boolean }) {
  return <CartesianFrame kind="bar" {...props} />
}

/** Bars and lines of the same unit on one axis, such as sales and their target. Two units take two charts. */
function ComboChart({
  bars,
  lines,
  ...props
}: Omit<CartesianChartProps, "series"> & {
  series?: Record<string, string>
  bars: Record<string, string>
  lines: Record<string, string>
  stacked?: boolean
}) {
  return <CartesianFrame kind="combo" {...props} series={bars} lines={lines} />
}

export { AreaChart, BarChart, ComboChart, LineChart, niceTicks }
export type { CartesianChartProps }
