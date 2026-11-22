// registry: auradata (the change against the previous period: arrow, signed percent and what it compares with, shared by the KPI card and the chart tooltip; the comparison wraps whole)
import { ArrowDownRightIcon, ArrowRightIcon, ArrowUpRightIcon } from "lucide-react"
import { cn } from "cn"

import { formatPercent } from "@/lib/format"

type DeltaTone = "good" | "bad" | "flat"

/** Whether a change is good news: up is good unless the metric is one where a fall is (costs, churn). */
function deltaTone(change: number, goodDirection: "up" | "down" = "up"): DeltaTone {
  if (change === 0) return "flat"
  return (change > 0 ? "up" : "down") === goodDirection ? "good" : "bad"
}

/** The change from the previous value as a fraction; none when there is nothing to compare with (no value or zero). */
function previousChange(value: number, previous: number | null | undefined) {
  if (previous === null || previous === undefined || previous === 0 || !Number.isFinite(previous)) return undefined
  return value / previous - 1
}

type DeltaProps = React.ComponentProps<"div"> & {
  /** The change as a fraction: 0.12 is +12 %. */
  change: number
  /** What it compares with, such as "vs. octubre". */
  comparison?: React.ReactNode
  /** When a fall is the good news (costs, churn), set "down". */
  goodDirection?: "up" | "down"
  locale?: string
}

/**
 * The previous period's change, as a fraction (0.062 is +6.2 %): an arrow colored by the tone, the signed percent and
 * what it compares with. Only the arrow takes the color; the number stays in the text color, so it reads AA.
 */
function Delta({ change, comparison, goodDirection = "up", locale = "es-MX", className, ...props }: DeltaProps) {
  const tone = deltaTone(change, goodDirection)
  const Icon = change === 0 ? ArrowRightIcon : change > 0 ? ArrowUpRightIcon : ArrowDownRightIcon
  return (
    <div
      data-slot="delta"
      data-tone={tone}
      // In a narrow card the comparison drops under the number whole, never broken across two lines.
      className={cn("flex flex-wrap items-center gap-x-1 text-sm text-muted-foreground", className)}
      {...props}
    >
      <Icon
        aria-hidden
        className={cn("size-4 shrink-0", tone === "good" && "text-success", tone === "bad" && "text-destructive")}
      />
      <span className="font-medium text-foreground tabular-nums">
        {formatPercent(change, { locale, signDisplay: "exceptZero" })}
      </span>
      {comparison && <span className="whitespace-nowrap">{comparison}</span>}
    </div>
  )
}

export { Delta, deltaTone, previousChange }
export type { DeltaTone }
