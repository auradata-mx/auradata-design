// registry: auradata (the product tour of auradata.mx: one feature per tab, its text beside its screenshot)
import * as React from "react"
import type { LucideIcon } from "lucide-react"
import { CheckIcon } from "lucide-react"
import { cn } from "cn"

import { SectionHeader } from "@/components/ui/section-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export type Feature = {
  /** The tab's id. */
  value: string
  /** The tab's short label. */
  label: string
  icon?: LucideIcon
  title: React.ReactNode
  description: React.ReactNode
  points?: React.ReactNode[]
  /** A screenshot or a mock of it. */
  visual: React.ReactNode
}

type FeatureTabsProps = Omit<React.ComponentProps<"section">, "title"> & {
  eyebrow?: React.ReactNode
  title: React.ReactNode
  highlight?: React.ReactNode
  description?: React.ReactNode
  features: Feature[]
  defaultValue?: string
  /** The tab list's accessible name. */
  label?: string
}

/**
 * A section that shows one feature at a time: line tabs (arrow keys move between them, Base UI) above
 * a panel with the feature's icon, title, text and points beside its visual (below it on a phone).
 * The tab row scrolls sideways on a narrow screen instead of wrapping.
 */
function FeatureTabs({
  eyebrow,
  title,
  highlight,
  description,
  features,
  defaultValue = features[0]?.value,
  label = "Funciones",
  className,
  ...props
}: FeatureTabsProps) {
  const headingId = React.useId()
  return (
    <section
      data-slot="feature-tabs"
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
        <Tabs defaultValue={defaultValue} className="mt-10 gap-10">
          {/* The row scrolls on a phone; the -mx/px pair lets it reach the screen edges. */}
          <div className="-mx-6 overflow-x-auto px-6 md:mx-0 md:px-0">
            <TabsList variant="line" aria-label={label} className="w-max justify-start gap-6 border-b">
              {features.map((feature) => (
                <TabsTrigger key={feature.value} value={feature.value} className="h-11 flex-none text-sm">
                  {feature.icon && <feature.icon aria-hidden data-icon="inline-start" />}
                  {feature.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          {features.map((feature) => (
            <TabsContent
              key={feature.value}
              value={feature.value}
              className="grid items-center gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:gap-14"
            >
              <div className="flex flex-col items-start gap-4">
                {feature.icon && (
                  <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <feature.icon aria-hidden className="size-5" />
                  </span>
                )}
                <h3 className="font-heading text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
                  {feature.title}
                </h3>
                <p className="text-lg text-pretty text-muted-foreground">{feature.description}</p>
                {feature.points && (
                  <ul className="mt-2 flex flex-col gap-2.5">
                    {feature.points.map((point, index) => (
                      <li key={index} className="flex gap-2.5">
                        <CheckIcon aria-hidden className="mt-1 size-4 shrink-0 text-primary" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="min-w-0">{feature.visual}</div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}

export { FeatureTabs }
