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
      <div className="relative isolate mx-auto flex max-w-6xl flex-col items-center overflow-hidden rounded-(--aura-radius-card) border border-border bg-card px-6 py-12 text-center text-card-foreground shadow-(--elevation-overlay) sm:px-12 md:py-16">
        <AuraBackground grid variant="band" />
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <GradientHeading id={headingId} highlight={highlight} inline className="mt-6 max-w-180">
          {title}
        </GradientHeading>
        {description && <p className="mt-5 max-w-140 text-lg text-pretty text-muted-foreground">{description}</p>}
        {/* On a phone the buttons stack at full width, the main one on top; from sm they sit in a row. */}
        {actions && (
          <div className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
            {actions}
          </div>
        )}
      </div>
    </section>
  )
}

export { CtaBand }
