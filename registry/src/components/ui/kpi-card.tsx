// registry: auradata (a KPI card of the brand, with loading and no-data states)
import { ArrowDownRightIcon, ArrowRightIcon, ArrowUpRightIcon } from "lucide-react"
import { cn } from "cn"

import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatPercent } from "@/lib/format"

type KpiCardProps = Omit<React.ComponentProps<typeof Card>, "children"> & {
  label: React.ReactNode
  /** The number, already formatted. `null` or `undefined` when the period has no data: a dash and «Sin datos». */
  value?: React.ReactNode
  /** The change against the previous period, as a fraction: 0.12 is +12 %. */
  change?: number
  /** What the change compares with, such as "vs. septiembre". */
  comparison?: React.ReactNode
  /** When a fall is the good news (costs, churn), set "down". */
  goodDirection?: "up" | "down"
  locale?: string
  /** The recent values, oldest first: a sparkline beside the value, colored like the change. */
  trend?: number[]
  /** The number is loading: skeletons in its shape, as tall as the loaded card, and `aria-busy`. */
  loading?: boolean
}

const WIDTH = 96
const HEIGHT = 32

/** The trend as one line, scaled to fill the box; flat when every value is the same. */
function sparklinePoints(values: number[]) {
  const min = Math.min(...values)
  const max = Math.max(...values)
  const step = WIDTH / (values.length - 1)
  // 2 px inside the box, so the stroke is not clipped at the top and the bottom.
  const y = (value: number) => (max === min ? HEIGHT / 2 : 2 + ((max - value) / (max - min)) * (HEIGHT - 4))
  return values.map((value, index) => `${(index * step).toFixed(1)},${y(value).toFixed(1)}`).join(" ")
}

function Sparkline({ values, tone }: { values: number[]; tone: "good" | "bad" | "flat" | "none" }) {
  return (
    <svg
      data-slot="kpi-sparkline"
      aria-hidden
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="none"
      className={cn(
        "h-8 w-24 shrink-0 overflow-visible",
        tone === "good" && "text-success",
        tone === "bad" && "text-destructive",
        tone === "flat" && "text-muted-foreground",
        tone === "none" && "text-chart-1"
      )}
    >
      <polyline
        points={sparklinePoints(values)}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

/** One number that matters, with its change against the previous period. */
function KpiCard({
  label,
  value,
  change,
  comparison,
  goodDirection = "up",
  locale = "es-MX",
  trend,
  loading = false,
  className,
  ...props
}: KpiCardProps) {
  if (loading) {
    return (
      <Card data-slot="kpi-card" aria-busy="true" className={cn("gap-2", className)} {...props}>
        <CardHeader>
          <CardDescription>{label}</CardDescription>
        </CardHeader>
        <CardContent aria-hidden className="grid gap-1">
          <div className="flex items-center justify-between gap-4">
            <Skeleton className="h-9 w-32" />
            {trend && <Skeleton className="h-8 w-24 shrink-0" />}
          </div>
          <Skeleton className="h-5 w-40" />
        </CardContent>
      </Card>
    )
  }
  if (value === null || value === undefined) {
    return (
      <Card data-slot="kpi-card" className={cn("gap-2", className)} {...props}>
        <CardHeader>
          <CardDescription>{label}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-1">
          <div aria-hidden className="text-3xl font-semibold tracking-tight text-muted-foreground">
            —
          </div>
          <div className="text-sm text-muted-foreground">Sin datos</div>
        </CardContent>
      </Card>
    )
  }
  const direction = change === undefined || change === 0 ? "flat" : change > 0 ? "up" : "down"
  const tone = direction === "flat" ? "flat" : direction === goodDirection ? "good" : "bad"
  const Icon = { up: ArrowUpRightIcon, down: ArrowDownRightIcon, flat: ArrowRightIcon }[direction]
  // A value too long for the card wraps instead of spilling out of it.
  const number = <div className="min-w-0 text-3xl font-semibold tracking-tight tabular-nums wrap-anywhere">{value}</div>
  return (
    <Card data-slot="kpi-card" className={cn("gap-2", className)} {...props}>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-1">
        {trend && trend.length > 1 ? (
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
            {number}
            <Sparkline values={trend} tone={change === undefined ? "none" : tone} />
          </div>
        ) : (
          number
        )}
        {change !== undefined && (
          <div data-tone={tone} className="flex items-center gap-1 text-sm text-muted-foreground">
            <Icon
              aria-hidden
              className={cn(
                "size-4",
                tone === "good" && "text-success",
                tone === "bad" && "text-destructive"
              )}
            />
            <span className="font-medium text-foreground tabular-nums">{formatPercent(change, { locale, signDisplay: "exceptZero" })}</span>
            {comparison && <span>{comparison}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export { KpiCard }
