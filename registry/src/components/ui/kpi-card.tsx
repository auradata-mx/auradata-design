// registry: auradata (a KPI card of the brand, with loading and no-data states, the shared sparkline beside the value and change (below them when the card is narrow), and the shared delta)
import { cn } from "cn"

import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Delta, deltaTone } from "@/components/ui/delta"
import { Sparkline } from "@/components/ui/sparkline"

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
  const tone = change === undefined ? "flat" : deltaTone(change, goodDirection)
  // A value too long for the card wraps instead of spilling out of it.
  const number = <div className="min-w-0 text-3xl font-semibold tracking-tight tabular-nums wrap-anywhere">{value}</div>
  return (
    <Card data-slot="kpi-card" className={cn("gap-2", className)} {...props}>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
      </CardHeader>
      <CardContent>
        {/* The sparkline sits beside the value and its change, never between them; in a card too narrow for both it
            drops below them, so the number never breaks. */}
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <div className="grid min-w-0 gap-1">
            {number}
            {change !== undefined && (
              <Delta change={change} comparison={comparison} goodDirection={goodDirection} locale={locale} />
            )}
          </div>
          {trend && trend.length > 1 && (
            <Sparkline data-slot="kpi-sparkline" values={trend} tone={change === undefined ? "none" : tone} />
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export { KpiCard }
