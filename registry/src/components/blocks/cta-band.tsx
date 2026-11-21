// registry: auradata (the closing call to action of auradata.mx)
import { useId } from "react"
import { cn } from "cn"

import { AuraBackground } from "@/components/ui/aura-background"
import { Eyebrow } from "@/components/ui/eyebrow"
import { GradientHeading } from "@/components/ui/gradient-heading"

type CtaBandProps = Omit<React.ComponentProps<"section">, "title"> & {
  eyebrow?: React.ReactNode
  title: React.ReactNode
  highlight?: React.ReactNode
  description?: React.ReactNode
  /** The buttons: the main one first. */
  actions?: React.ReactNode
}

/** The end of a page that leads to contact: a floating card with the grid and one brand glow. */
function CtaBand({ eyebrow, title, highlight, description, actions, className, ...props }: CtaBandProps) {
  const headingId = useId()
  return (
    <section
      data-slot="cta-band"
      aria-labelledby={headingId}
      className={cn("px-6 py-16 md:px-10 md:py-24", className)}
      {...props}
    >
      <div className="relative isolate mx-auto flex max-w-6xl flex-col items-center overflow-hidden rounded-(--aura-radius-card) border border-border bg-card px-6 py-12 text-center text-card-foreground shadow-(--aura-shadow-float) sm:px-12 md:py-16">
        <AuraBackground grid variant="band" />
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <GradientHeading id={headingId} highlight={highlight} inline className="mt-6 max-w-180">
          {title}
        </GradientHeading>
        {description && <p className="mt-5 max-w-140 text-lg text-pretty text-muted-foreground">{description}</p>}
        {actions && <div className="mt-10 flex flex-wrap items-center justify-center gap-3">{actions}</div>}
      </div>
    </section>
  )
}

export { CtaBand }
