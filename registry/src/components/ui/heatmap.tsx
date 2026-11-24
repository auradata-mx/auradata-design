// registry: auradata (heatmaps of the brand on the sequential and diverging palettes: a table with every value, and a year day by day)
"use client"

import * as React from "react"
import { cn } from "cn"

import { useScrollBlurViewport, ViewportScrollBlur } from "@/components/ui/progressive-blur"
import { divergingFill, sequentialFill } from "@/lib/chart-palette"
import { formatDate, formatNumber } from "@/lib/format"

type HeatmapProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** The row labels, top to bottom. */
  rows: string[]
  /** The column labels, left to right. */
  columns: string[]
  /** One array per row, one value per column; `null` where there is no data. */
  values: (number | null)[][]
  /** What the table shows: its accessible name and caption. */
  caption: string
  /** `sequential` for how much (from zero up), `diverging` for which side of a center (below or above a target). */
  scale?: "sequential" | "diverging"
  /** The sequential domain; from 0 to the largest value by default. */
  domain?: [number, number]
  /** The diverging distance from `center` that takes the strongest color. */
  limit?: number
  /** The diverging center: 0 by default (the target met, no change). */
  center?: number
  /** Writes each value; es-MX numbers by default. */
  valueFormatter?: (value: number) => string
  /** Shows the caption above the table; it stays the table's name either way. */
  showCaption?: boolean
}

const STEPS = [1, 2, 3, 4, 5, 6, 7, 8, 9]

/**
 * A value per pair of categories, colored by how much (sequential) or which side (diverging), with every value
 * written in its cell: the color shows the pattern, the number gives the value. A table, so it reads without color.
 */
function Heatmap({
  rows,
  columns,
  values,
  caption,
  scale = "sequential",
  domain,
  limit,
  center = 0,
  valueFormatter = (value) => formatNumber(value),
  showCaption = false,
  className,
  ...props
}: HeatmapProps) {
  const [viewport, viewportRef] = useScrollBlurViewport<HTMLDivElement>()
  const numbers = values.flat().filter((value): value is number => typeof value === "number")
  const sequentialDomain: [number, number] = domain ?? [0, Math.max(0, ...numbers)]
  const divergingLimit = limit ?? Math.max(...numbers.map((value) => Math.abs(value - center)), 0)
  const fillOf = (value: number) =>
    scale === "diverging" ? divergingFill(value, divergingLimit, center) : sequentialFill(value, sequentialDomain)
  const [low, high] =
    scale === "diverging" ? [center - divergingLimit, center + divergingLimit] : sequentialDomain

  return (
    <div data-slot="heatmap" className={cn("grid gap-3", className)} {...props}>
      {/* A phone scrolls the table inside itself, never the page; the keyboard can focus it to scroll. */}
      <div className="relative isolate min-w-0 rounded-sm">
        <div ref={viewportRef} role="region" aria-label={caption} tabIndex={0} className="overflow-x-auto rounded-[inherit]">
          <table className="border-separate border-spacing-0.5 text-xs">
            <caption className={cn("pb-2 text-left text-sm font-medium", !showCaption && "sr-only")}>{caption}</caption>
            <thead>
              <tr>
                <td />
                {columns.map((column) => (
                  <th key={column} scope="col" className="px-1 pb-1 font-normal text-muted-foreground">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={row}>
                  <th scope="row" className="pr-2 text-left font-normal whitespace-nowrap text-muted-foreground">
                    {row}
                  </th>
                  {columns.map((column, columnIndex) => {
                    const value = values[rowIndex]?.[columnIndex]
                    if (typeof value !== "number") {
                      return (
                        <td key={column} className="h-9 min-w-11 rounded-sm bg-muted/50 text-center text-muted-foreground">
                          <span aria-hidden>—</span>
                          <span className="sr-only">Sin datos</span>
                        </td>
                      )
                    }
                    return (
                      <td
                        key={column}
                        className="h-9 min-w-11 rounded-sm px-1 text-center font-medium tabular-nums"
                        style={fillOf(value)}
                      >
                        {valueFormatter(value)}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ViewportScrollBlur viewport={viewport} bothAxes />
      </div>
      <ScaleLegend palette={scale} low={valueFormatter(low)} high={valueFormatter(high)} />
    </div>
  )
}

/** The ramp under a heatmap: its nine steps between the two ends' values. */
function ScaleLegend({ palette, low, high }: { palette: "sequential" | "diverging"; low: string; high: string }) {
  return (
    <div data-slot="heatmap-legend" className="flex items-center gap-2 text-xs text-muted-foreground">
      <span className="tabular-nums">{low}</span>
      <div aria-hidden className="flex">
        {STEPS.map((step) => (
          <span key={step} className="h-2.5 w-4 first:rounded-l-sm last:rounded-r-sm" style={{ background: `var(--${palette}-${step})` }} />
        ))}
      </div>
      <span className="tabular-nums">{high}</span>
    </div>
  )
}

type CalendarHeatmapProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** One entry per day, `YYYY-MM-DD`. */
  data: { date: string; value: number }[]
  /** What it shows: the start of the grid's accessible summary. */
  label: string
  /** What a value counts, after the number in the tooltip: «consultas». */
  unit?: string
  /** The first and last day; the data's by default. */
  from?: string
  to?: string
  valueFormatter?: (value: number) => string
}

const DAY = 14
const GAP = 2
const WEEKDAYS = ["Lun", "", "Mié", "", "Vie", "", ""]

/** "2026-11-03" → that local day. */
function dayOf(date: string) {
  const [year, month, day] = date.split("-").map(Number)
  return new Date(year, month - 1, day)
}
const keyOf = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`

/**
 * A value per day across months: weeks as columns, Monday on top, the month names above. Hover gives a day's date and
 * value; for a screen reader the grid is one image with a summary, and the numbers belong in a table («Ver datos»).
 */
function CalendarHeatmap({
  data,
  label,
  unit,
  from,
  to,
  valueFormatter = (value) => formatNumber(value),
  className,
  ...props
}: CalendarHeatmapProps) {
  const scrollerRef = React.useRef<HTMLDivElement>(null)
  const [viewport, viewportRef] = useScrollBlurViewport(scrollerRef)
  const [active, setActive] = React.useState<{ date: string; value: number; left: number; top: number } | null>(null)
  const byDate = new Map(data.map((entry) => [entry.date, entry.value]))
  const sorted = [...data].sort((a, b) => a.date.localeCompare(b.date))
  const first = dayOf(from ?? sorted[0]?.date ?? keyOf(new Date()))
  const last = dayOf(to ?? sorted[sorted.length - 1]?.date ?? keyOf(new Date()))
  const max = Math.max(0, ...data.map((entry) => entry.value))
  const total = data.reduce((sum, entry) => sum + entry.value, 0)
  const busiest = sorted.reduce<(typeof sorted)[number] | undefined>(
    (best, entry) => (!best || entry.value > best.value ? entry : best),
    undefined
  )

  // The grid starts on the Monday of the first day's week; earlier days stay empty.
  const offset = (first.getDay() + 6) % 7
  const days: { date: Date; key: string; column: number; row: number }[] = []
  for (let day = new Date(first), index = offset; day <= last; day.setDate(day.getDate() + 1), index++) {
    days.push({ date: new Date(day), key: keyOf(day), column: Math.floor(index / 7), row: index % 7 })
  }
  const weeks = (days[days.length - 1]?.column ?? 0) + 1
  // Each month name spans the weeks up to the next month; one with less than two weeks of room shows no name.
  const starts = days.filter((day, index) => index === 0 || day.date.getDate() === 1)
  const months = starts
    .map((month, index) => ({ ...month, span: (starts[index + 1]?.column ?? weeks) - month.column }))
    .filter((month) => month.span >= 2)

  // On a phone the latest weeks matter most: open at the end.
  React.useEffect(() => {
    const scroller = scrollerRef.current
    if (scroller) scroller.scrollLeft = getComputedStyle(scroller).direction === "rtl"
      ? -scroller.scrollWidth
      : scroller.scrollWidth
  }, [])

  const unitText = unit ? ` ${unit}` : ""
  const summary = [
    `${label}, ${formatDate(first)} – ${formatDate(last)}`,
    `total ${valueFormatter(total)}${unitText}`,
    busiest ? `el día con más: ${formatDate(busiest.date)}, ${valueFormatter(busiest.value)}${unitText}` : null,
  ]
    .filter(Boolean)
    .join("; ")
  const columns = `repeat(${weeks}, ${DAY}px)`

  return (
    <div data-slot="calendar-heatmap" className={cn("relative grid gap-3", className)} {...props}>
      {/* The weekdays stay put; only the weeks scroll, so a phone never loses which row is Monday. */}
      <div className="flex min-w-0 gap-2 text-xs text-muted-foreground">
        <div aria-hidden className="grid shrink-0 pt-5" style={{ gridTemplateRows: `repeat(7, ${DAY}px)`, rowGap: GAP }}>
          {WEEKDAYS.map((weekday, index) => (
            <span key={index} className="leading-[14px]">
              {weekday}
            </span>
          ))}
        </div>
        {/* One image with its summary, and focusable, so the keyboard can scroll the weeks on a phone. */}
        <div className="relative isolate min-w-0 rounded-sm">
          <div ref={viewportRef} role="img" aria-label={summary} tabIndex={0} className="overflow-x-auto rounded-[inherit] pb-1">
            <div className="grid w-max gap-1">
              <div aria-hidden className="grid h-4" style={{ gridTemplateColumns: columns, columnGap: GAP }}>
                {months.map((month) => (
                  <span
                    key={month.key}
                    className="truncate"
                    style={{ gridColumn: `${month.column + 1} / span ${month.span}` }}
                  >
                    {formatDate(month.date, { month: "short", day: undefined, year: undefined })}
                  </span>
                ))}
              </div>
              <div
                className="grid"
                style={{ gridTemplateColumns: columns, gridTemplateRows: `repeat(7, ${DAY}px)`, gap: GAP }}
                onPointerLeave={() => setActive(null)}
              >
                {days.map((day) => {
                  const value = byDate.get(day.key)
                  return (
                    <span
                      key={day.key}
                      data-slot="calendar-heatmap-day"
                      data-date={day.key}
                      className={cn(
                        "rounded-[3px] hover:outline-2 hover:outline-offset-1 hover:outline-foreground",
                        value === undefined && "bg-muted/50"
                      )}
                      style={{
                        gridColumnStart: day.column + 1,
                        gridRowStart: day.row + 1,
                        ...(value !== undefined ? { backgroundColor: sequentialFill(value, [0, max]).backgroundColor } : {}),
                      }}
                      onPointerEnter={(event) => {
                        if (value === undefined) return setActive(null)
                        const box = event.currentTarget.getBoundingClientRect()
                        const frame = event.currentTarget.closest('[data-slot="calendar-heatmap"]')!.getBoundingClientRect()
                        setActive({ date: day.key, value, left: box.left - frame.left + DAY / 2, top: box.top - frame.top })
                      }}
                    />
                  )
                })}
              </div>
            </div>
          </div>
          <ViewportScrollBlur viewport={viewport} bothAxes />
        </div>
      </div>
      {active && (
        <div
          data-slot="calendar-heatmap-tooltip"
          aria-hidden
          className="pointer-events-none absolute z-10 grid -translate-x-1/2 -translate-y-full gap-0.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs whitespace-nowrap shadow-(--elevation-overlay)"
          style={{ left: active.left, top: active.top - 6 }}
        >
          <span className="font-mono font-medium text-foreground tabular-nums">
            {valueFormatter(active.value)}
            {unitText}
          </span>
          {/* "mar 3 nov 2026": Intl puts "de" between the parts when the weekday comes with them. */}
          <span className="text-muted-foreground">
            {`${formatDate(active.date, { weekday: "short", day: undefined, month: undefined, year: undefined })} ${formatDate(active.date)}`}
          </span>
        </div>
      )}
      <div data-slot="heatmap-legend" className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>Menos</span>
        <div aria-hidden className="flex gap-0.5">
          {STEPS.filter((step) => step % 2 === 1).map((step) => (
            <span key={step} className="size-3 rounded-[3px]" style={{ background: `var(--sequential-${step})` }} />
          ))}
        </div>
        <span>Más</span>
      </div>
    </div>
  )
}

export { CalendarHeatmap, Heatmap }
export type { CalendarHeatmapProps, HeatmapProps }
