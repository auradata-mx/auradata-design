// registry: auradata (a funnel of the brand: one centered bar per stage, its value and the conversion from the stage before, as a list)
import { cn } from "cn"

import { formatNumber, formatPercent } from "@/lib/format"

type Row = Record<string, unknown>

type FunnelChartProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** One row per stage, first to last. */
  data: Row[]
  /** The key of each stage's name. */
  index: string
  /** The key of each stage's count. */
  value: string
  /** Writes a count; es-MX numbers by default. */
  valueFormatter?: (value: number) => string
  /** What the last stage over the first is called: «Conversión total» by default. */
  totalLabel?: React.ReactNode
  locale?: string
}

/** The share of `part` in `whole`, or none when the whole is empty. */
const shareOf = (part: number, whole: number) => (whole > 0 ? part / whole : undefined)

/**
 * Stages that lose people on the way, such as visits, sign-ups and payments. Each bar is as wide as its share of the
 * first stage; the conversion from the stage before sits under its name, and the total at the end.
 */
function FunnelChart({
  data,
  index,
  value,
  valueFormatter = (number) => formatNumber(number),
  totalLabel = "Conversión total",
  locale = "es-MX",
  className,
  ...props
}: FunnelChartProps) {
  const stages = data.map((row) => ({
    name: String(row[index] ?? ""),
    value: typeof row[value] === "number" ? (row[value] as number) : 0,
  }))
  const first = stages[0]?.value ?? 0
  const last = stages[stages.length - 1]?.value ?? 0
  const total = stages.length > 1 ? shareOf(last, first) : undefined

  return (
    <div data-slot="funnel-chart" className={cn("grid gap-4 text-sm", className)} {...props}>
      <ol className="grid gap-3">
        {stages.map((stage, position) => {
          const width = shareOf(stage.value, first) ?? 0
          const conversion = position > 0 ? shareOf(stage.value, stages[position - 1].value) : undefined
          return (
            <li key={position} className="grid gap-1.5">
              {/* The conversion sits under its own stage's name, above its bar: never between two stages. */}
              <div className="flex items-end justify-between gap-4">
                <div className="grid min-w-0 gap-0.5">
                  <span className="font-medium wrap-break-word">{stage.name}</span>
                  {conversion !== undefined && (
                    <span className="text-xs text-muted-foreground">
                      {`${formatPercent(conversion, { locale })} del paso anterior`}
                    </span>
                  )}
                </div>
                <span className="font-medium tabular-nums">{valueFormatter(stage.value)}</span>
              </div>
              {/* The track keeps every bar on one center line: the funnel's shape. */}
              <div aria-hidden className="flex h-6 justify-center rounded-sm bg-muted/60">
                <div
                  data-slot="funnel-bar"
                  className="h-full min-w-1 rounded-sm bg-chart-1"
                  style={{ width: `${Number((width * 100).toFixed(2))}%` }}
                />
              </div>
            </li>
          )
        })}
      </ol>
      {total !== undefined && (
        <div className="flex items-baseline justify-between gap-4 border-t pt-3">
          <span className="text-muted-foreground">{totalLabel}</span>
          <span className="font-semibold tabular-nums">{formatPercent(total, { locale })}</span>
        </div>
      )}
    </div>
  )
}

export { FunnelChart }
export type { FunnelChartProps }
