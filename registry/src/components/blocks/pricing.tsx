// registry: auradata (the plans of auradata.mx in MXN, with a monthly/annual switch and a recommended plan)
import * as React from "react"
import { CheckIcon } from "lucide-react"
import { cn } from "cn"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { GradientBorder } from "@/components/ui/gradient-border"
import { SectionHeader } from "@/components/ui/section-header"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { formatCurrency } from "@/lib/format"

export type Billing = "monthly" | "annual"

export type PricingPlan = {
  name: string
  description?: React.ReactNode
  /** Per month, in each period: `annual` is the monthly price when paid for a year. `null`: no list price. */
  price: { monthly: number; annual: number } | null
  /** Shown instead of a price when `price` is null, as «A la medida». */
  priceLabel?: React.ReactNode
  features: React.ReactNode[]
  /** The plan's button, full width. */
  cta?: React.ReactNode
  /** The recommended plan: the brand gradient border and its badge. One per page. */
  featured?: boolean
  badge?: React.ReactNode
}

type PricingProps = Omit<React.ComponentProps<"section">, "title"> & {
  eyebrow?: React.ReactNode
  title: React.ReactNode
  highlight?: React.ReactNode
  description?: React.ReactNode
  plans: PricingPlan[]
  billing?: Billing
  defaultBilling?: Billing
  onBillingChange?: (billing: Billing) => void
  /** Next to «Anual», as «Ahorra 20 %». */
  annualNote?: React.ReactNode
  currency?: string
  labels?: {
    period?: string
    monthly?: string
    annual?: string
    perMonth?: string
    billedMonthly?: string
    /** The yearly total under an annual price: `(total) => …`. */
    billedAnnually?: (total: string) => string
    included?: string
  }
}

const LABELS = {
  period: "Periodo de facturación",
  monthly: "Mensual",
  annual: "Anual",
  perMonth: "/mes",
  billedMonthly: "Facturado cada mes",
  billedAnnually: (total: string) => `${total} al año`,
  included: "Incluye",
}

/**
 * A pricing section: a header, a Mensual/Anual switch and one card per plan with its price in MXN
 * (`formatCurrency`), what it includes and its button. The switch is a pair of toggle buttons in a
 * labelled group, controlled (`billing`) or not (`defaultBilling`); one period is always chosen.
 */
function Pricing({
  eyebrow,
  title,
  highlight,
  description,
  plans,
  billing: billingProp,
  defaultBilling = "monthly",
  onBillingChange,
  annualNote,
  currency = "MXN",
  labels: labelsProp,
  className,
  ...props
}: PricingProps) {
  const headingId = React.useId()
  const labels = { ...LABELS, ...labelsProp }
  const [ownBilling, setOwnBilling] = React.useState<Billing>(defaultBilling)
  const billing = billingProp ?? ownBilling
  const choose = (values: string[]) => {
    const next = values[0] as Billing | undefined
    // Pressing the chosen period again would leave none: keep it.
    if (!next || next === billing) return
    setOwnBilling(next)
    onBillingChange?.(next)
  }

  return (
    <section
      data-slot="pricing"
      aria-labelledby={headingId}
      className={cn("px-6 py-16 md:px-10 md:py-24", className)}
      {...props}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center">
        <SectionHeader
          titleId={headingId}
          eyebrow={eyebrow}
          title={title}
          highlight={highlight}
          description={description}
          align="center"
        />
        <ToggleGroup
          aria-label={labels.period}
          value={[billing]}
          onValueChange={choose}
          variant="outline"
          spacing={0}
          className="mt-10 rounded-full bg-muted p-1 *:rounded-full! *:border-0!"
        >
          <ToggleGroupItem value="monthly" className="h-9 px-4 data-pressed:bg-background data-pressed:shadow-sm">
            {labels.monthly}
          </ToggleGroupItem>
          <ToggleGroupItem value="annual" className="h-9 gap-2 px-4 data-pressed:bg-background data-pressed:shadow-sm">
            {labels.annual}
            {annualNote && (
              <Badge variant="success" className="h-5 px-1.5 text-[11px]">
                {annualNote}
              </Badge>
            )}
          </ToggleGroupItem>
        </ToggleGroup>
        {/* From md the cards share four rows (header, price, button, what it includes) through subgrid:
            a longer description in one card moves every button down with it. */}
        <ul className="mt-10 grid w-full gap-6 md:grid-cols-[repeat(auto-fit,minmax(16rem,1fr))]">
          {plans.map((plan) => (
            <li key={plan.name} className="flex md:row-span-4 md:grid md:grid-rows-subgrid">
              <PlanCard plan={plan} billing={billing} currency={currency} labels={labels} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function PlanCard({
  plan,
  billing,
  currency,
  labels,
}: {
  plan: PricingPlan
  billing: Billing
  currency: string
  labels: typeof LABELS
}) {
  const nameId = React.useId()
  const price = plan.price?.[billing]
  const card = (
    <Card
      className={cn(
        "h-full w-full gap-6 px-6 py-7 md:row-span-4 md:grid md:grid-rows-subgrid",
        plan.featured ? "shadow-(--aura-shadow-float)" : "shadow-(--aura-shadow-card)"
      )}
    >
      <div className="flex flex-col gap-2">
        <div className="flex min-h-6 items-center justify-between gap-3">
          <h3 id={nameId} className="font-heading text-lg font-semibold tracking-tight">
            {plan.name}
          </h3>
          {plan.featured && plan.badge && <Badge>{plan.badge}</Badge>}
        </div>
        {plan.description && <p className="text-sm text-pretty text-muted-foreground">{plan.description}</p>}
      </div>
      <div className="flex flex-col gap-1">
        {price === undefined ? (
          <p className="font-heading text-4xl leading-tight font-semibold tracking-tight">{plan.priceLabel}</p>
        ) : (
          <p className="flex items-baseline gap-1">
            <span className="font-heading text-4xl leading-tight font-semibold tracking-tight tabular-nums">
              {formatCurrency(price, { currency })}
            </span>
            <span className="text-sm text-muted-foreground">{labels.perMonth}</span>
          </p>
        )}
        {/* The same height with or without a price, so the buttons line up across the cards. */}
        <p className="min-h-5 text-sm text-muted-foreground">
          {price === undefined
            ? null
            : billing === "annual"
              ? labels.billedAnnually(formatCurrency(price * 12, { currency }))
              : labels.billedMonthly}
        </p>
      </div>
      {plan.cta}
      <div className="flex flex-col gap-3 border-t pt-6">
        <p className="text-sm font-medium">{labels.included}</p>
        <ul className="flex flex-col gap-2.5 text-sm">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex gap-2.5">
              <CheckIcon aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  )
  return (
    <article aria-labelledby={nameId} className="flex w-full md:row-span-4 md:grid md:grid-rows-subgrid">
      {/* The border sits 1px outside the card, as the other cards' ring does: their text lines up. */}
      {plan.featured ? <GradientBorder className="-m-px flex w-[calc(100%+2px)] md:row-span-4 md:grid md:grid-rows-subgrid">{card}</GradientBorder> : card}
    </article>
  )
}

export { Pricing }
