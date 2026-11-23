// registry: auradata (the bento of benefits of auradata.mx)
import type { LucideIcon } from "lucide-react"
import { useId } from "react"
import { cn } from "cn"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SectionHeader } from "@/components/ui/section-header"

export type Benefit = {
  icon?: LucideIcon
  title: React.ReactNode
  description: React.ReactNode
}

type BenefitsGridProps = Omit<React.ComponentProps<"section">, "title"> & {
  eyebrow?: React.ReactNode
  title: React.ReactNode
  highlight?: React.ReactNode
  description?: React.ReactNode
  items: Benefit[]
}

// On wide screens the cards alternate wide and narrow (wide, narrow / narrow, wide), as a bento.
const wide = (index: number) => index % 4 === 0 || index % 4 === 3

/** A section of benefits: a header and cards that lift on hover. */
function BenefitsGrid({ eyebrow, title, highlight, description, items, className, ...props }: BenefitsGridProps) {
  const headingId = useId()
  return (
    <section
      data-slot="benefits-grid"
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
        <ul className="mt-14 grid gap-4 md:grid-cols-5">
          {items.map((item, index) => (
            <li key={index} className={cn("flex", wide(index) ? "md:col-span-3" : "md:col-span-2")}>
              <Card className="w-full gap-4 py-6 shadow-(--elevation-raised) transition-[translate,box-shadow] duration-700 ease-(--aura-ease-fluid) hover:-translate-y-1 hover:shadow-(--elevation-raised-hover) motion-reduce:transition-none motion-reduce:hover:translate-y-0">
                <CardHeader className="gap-4 px-6">
                  {item.icon && (
                    <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                      <item.icon aria-hidden className="size-5" />
                    </span>
                  )}
                  <CardTitle className="text-lg font-semibold tracking-tight sm:text-xl">
                    <h3>{item.title}</h3>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-6">
                  <CardDescription className="max-w-130 text-base text-pretty">{item.description}</CardDescription>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export { BenefitsGrid }
