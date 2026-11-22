// registry: auradata (every plan side by side: grouped features, checks read aloud, a scrolling frame on phones)
import * as React from "react"
import { CheckIcon, MinusIcon } from "lucide-react"
import { cn } from "cn"

import { Badge } from "@/components/ui/badge"
import { SectionHeader } from "@/components/ui/section-header"
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

/** `true`/`false` draw a check or a dash; anything else is shown as is («25», «Ilimitados»). */
export type ComparisonValue = boolean | React.ReactNode

export type ComparisonGroup = {
  name: React.ReactNode
  rows: { feature: React.ReactNode; values: ComparisonValue[] }[]
}

type PlanComparisonProps = Omit<React.ComponentProps<"section">, "title"> & {
  eyebrow?: React.ReactNode
  title: React.ReactNode
  highlight?: React.ReactNode
  description?: React.ReactNode
  /** The columns, in the order of each row's `values`. */
  plans: { name: React.ReactNode; featured?: boolean }[]
  groups: ComparisonGroup[]
  labels?: { caption?: string; feature?: string; included?: string; notIncluded?: string; recommended?: string }
}

const LABELS = {
  caption: "Comparación de planes",
  feature: "Función",
  included: "Incluido",
  notIncluded: "No incluido",
  recommended: "Recomendado",
}

/**
 * A comparison table under a section header. Each group is a `tbody` headed by its name, each feature
 * heads its row, and a check or a dash carries «Incluido» or «No incluido» for screen readers. The
 * recommended plan's column is tinted and badged. On a phone the table scrolls sideways inside a
 * keyboard-focusable frame while the feature names stay pinned on the left.
 */
function PlanComparison({
  eyebrow,
  title,
  highlight,
  description,
  plans,
  groups,
  labels: labelsProp,
  className,
  ...props
}: PlanComparisonProps) {
  const headingId = React.useId()
  const captionId = React.useId()
  const labels = { ...LABELS, ...labelsProp }
  const tint = (index: number) => plans[index]?.featured && "bg-primary/5"
  // The pinned column paints the page behind it, so scrolled cells pass under it, not through it.
  const pinned = "sticky left-0 z-10 bg-background"

  return (
    <section
      data-slot="plan-comparison"
      aria-labelledby={headingId}
      className={cn("px-6 py-16 md:px-10 md:py-24", className)}
      {...props}
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          titleId={headingId}
          eyebrow={eyebrow}
          title={title}
          highlight={highlight}
          description={description}
        />
        <div
          role="region"
          aria-labelledby={captionId}
          tabIndex={0}
          // Relative: the sr-only «Incluido» labels are absolute; without it the frame would not clip them
          // and they would widen the page on a phone.
          className="relative mt-12 overflow-x-auto rounded-(--aura-radius-card) border shadow-(--aura-shadow-card) focus-visible:outline-offset-[-2px]"
        >
          <table className="w-full min-w-[36rem] table-fixed text-sm">
            <caption id={captionId} className="sr-only">
              {labels.caption}
            </caption>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                {/* Narrow on a phone: the next plan peeks in at the edge, so the table reads as scrollable. */}
                <TableHead scope="col" className={cn(pinned, "w-36 px-4 sm:w-[38%] sm:px-6")}>
                  <span className="sr-only">{labels.feature}</span>
                </TableHead>
                {plans.map((plan, index) => (
                  <TableHead
                    key={index}
                    scope="col"
                    className={cn("h-auto px-3 py-4 text-center align-bottom whitespace-normal", tint(index))}
                  >
                    <span className="flex flex-col items-center gap-1.5">
                      {plan.featured && <Badge>{labels.recommended}</Badge>}
                      <span data-slot="plan-name" className="font-heading text-base font-semibold">
                        {plan.name}
                      </span>
                    </span>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            {groups.map((group, groupIndex) => (
              <TableBody key={groupIndex} className="[&_tr:last-child]:border-b">
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead scope="rowgroup" colSpan={plans.length + 1} className="h-10 px-0">
                    <span className="sticky left-0 px-4 text-xs font-semibold tracking-wide text-muted-foreground uppercase sm:px-6">
                      {group.name}
                    </span>
                  </TableHead>
                </TableRow>
                {group.rows.map((row, rowIndex) => (
                  <TableRow key={rowIndex} className="hover:bg-transparent">
                    <TableHead
                      scope="row"
                      className={cn(pinned, "h-auto px-4 py-3 font-normal whitespace-normal text-foreground sm:px-6")}
                    >
                      {row.feature}
                    </TableHead>
                    {row.values.map((value, index) => (
                      <TableCell key={index} className={cn("px-3 py-3 text-center whitespace-normal", tint(index))}>
                        <Value value={value} labels={labels} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            ))}
          </table>
        </div>
      </div>
    </section>
  )
}

function Value({ value, labels }: { value: ComparisonValue; labels: typeof LABELS }) {
  if (value === true)
    return (
      <>
        <CheckIcon aria-hidden className="mx-auto size-4 text-primary" />
        <span className="sr-only">{labels.included}</span>
      </>
    )
  if (value === false)
    return (
      <>
        <MinusIcon aria-hidden className="mx-auto size-4 text-muted-foreground" />
        <span className="sr-only">{labels.notIncluded}</span>
      </>
    )
  return <>{value}</>
}

export { PlanComparison }
