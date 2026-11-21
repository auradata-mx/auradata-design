// registry: auradata (a KPI card of the brand)
import { ArrowDownRightIcon, ArrowRightIcon, ArrowUpRightIcon } from "lucide-react"
import { cn } from "cn"

import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { formatPercent } from "@/lib/format"

type KpiCardProps = Omit<React.ComponentProps<typeof Card>, "children"> & {
  label: React.ReactNode
  value: React.ReactNode
  /** The change against the previous period, as a fraction: 0.12 is +12 %. */
  change?: number
  /** What the change compares with, such as "vs. septiembre". */
  comparison?: React.ReactNode
  /** When a fall is the good news (costs, churn), set "down". */
  goodDirection?: "up" | "down"
  locale?: string
}

/** One number that matters, with its change against the previous period. */
function KpiCard({
  label,
  value,
  change,
  comparison,
  goodDirection = "up",
  locale = "es-MX",
  className,
  ...props
}: KpiCardProps) {
  const direction = change === undefined || change === 0 ? "flat" : change > 0 ? "up" : "down"
  const tone = direction === "flat" ? "flat" : direction === goodDirection ? "good" : "bad"
  const Icon = { up: ArrowUpRightIcon, down: ArrowDownRightIcon, flat: ArrowRightIcon }[direction]
  return (
    <Card data-slot="kpi-card" className={cn("gap-2", className)} {...props}>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-1">
        <div className="text-3xl font-semibold tracking-tight tabular-nums">{value}</div>
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
