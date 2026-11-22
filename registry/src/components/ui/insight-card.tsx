// registry: auradata (a finding from the data: what happened, its metric and «Ver detalle»)
import * as React from "react"
import { ArrowDownRightIcon, ArrowRightIcon, ArrowUpRightIcon, SparklesIcon } from "lucide-react"
import { cn } from "cn"

import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { formatPercent } from "@/lib/format"

type InsightCardProps = Omit<React.ComponentProps<"div">, "title"> & {
  /** The finding, as a sentence: «El Norte creció más que ninguna región». */
  title: string
  /** The metric behind it, formatted: «$1.39 M». */
  value: React.ReactNode
  /** The change as a fraction: 0.094 reads «+9.4 %». */
  change?: number
  /** Which way is good news: costs go `down`. */
  goodDirection?: "up" | "down"
  /** Against what: «vs. octubre». */
  comparison?: string
  /** Why, in a line or two. */
  description?: React.ReactNode
  /** «Ver detalle»: a link with `href`, a button with `onClick`. */
  action?: { label?: string; href?: string; onClick?: () => void }
}

/**
 * A finding the data surfaced, for the chat and for a report: «Hallazgo», the finding, its metric and
 * change (colored as the KPI card), why, and «Ver detalle».
 */
function InsightCard({
  title,
  value,
  change,
  goodDirection = "up",
  comparison,
  description,
  action,
  className,
  ...props
}: InsightCardProps) {
  const titleId = React.useId()
  const direction = change === undefined || change === 0 ? "flat" : change > 0 ? "up" : "down"
  const tone = direction === "flat" ? "flat" : direction === goodDirection ? "good" : "bad"
  const Icon = { up: ArrowUpRightIcon, down: ArrowDownRightIcon, flat: ArrowRightIcon }[direction]
  const label = action?.label ?? "Ver detalle"

  return (
    <Card
      role="article"
      aria-labelledby={titleId}
      data-slot="insight-card"
      className={cn("gap-3", className)}
      {...props}
    >
      <CardHeader className="gap-2">
        <p className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <span className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary">
            <SparklesIcon aria-hidden className="size-3.5" />
          </span>
          Hallazgo
        </p>
        <h3 id={titleId} className="font-heading text-base leading-snug font-semibold text-balance">
          {title}
        </h3>
      </CardHeader>
      <CardContent className="grid gap-2">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-2xl font-semibold tracking-tight tabular-nums">{value}</span>
          {change !== undefined && (
            <span data-tone={tone} className="flex items-center gap-1 text-sm text-muted-foreground">
              <Icon
                aria-hidden
                className={cn("size-4 self-center", tone === "good" && "text-success", tone === "bad" && "text-destructive")}
              />
              <span className="font-medium text-foreground tabular-nums">
                {formatPercent(change, { signDisplay: "exceptZero" })}
              </span>
              {comparison && <span>{comparison}</span>}
            </span>
          )}
        </div>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </CardContent>
      {action && (
        <CardFooter className="border-t-0 bg-transparent pt-1">
          {action.href ? (
            <a
              href={action.href}
              onClick={action.onClick}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              {label}
              <ArrowRightIcon data-icon="inline-end" aria-hidden />
            </a>
          ) : (
            <Button variant="outline" size="sm" onClick={action.onClick}>
              {label}
              <ArrowRightIcon data-icon="inline-end" aria-hidden />
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  )
}

export { InsightCard, type InsightCardProps }
