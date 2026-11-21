// registry: auradata (the hero of auradata.mx)
import { useId } from "react"
import { cn } from "cn"

import { AuraBackground } from "@/components/ui/aura-background"
import { Eyebrow } from "@/components/ui/eyebrow"
import { GradientHeading } from "@/components/ui/gradient-heading"

type HeroProps = Omit<React.ComponentProps<"section">, "title"> & {
  eyebrow?: React.ReactNode
  title: React.ReactNode
  /** The second line of the title, in the brand gradient. */
  highlight?: React.ReactNode
  description?: React.ReactNode
  /** The buttons under the lead. */
  actions?: React.ReactNode
  /** A screenshot or illustration beside the text on wide screens. */
  visual?: React.ReactNode
  /** `home` for the first page, `page` (smaller) for inner pages. */
  size?: "home" | "page"
}

/** The top of a marketing page: the aura and grid behind an eyebrow, a gradient title, a lead and actions. */
function Hero({
  eyebrow,
  title,
  highlight,
  description,
  actions,
  visual,
  size = "home",
  className,
  ...props
}: HeroProps) {
  const headingId = useId()
  return (
    <section
      data-slot="hero"
      aria-labelledby={headingId}
      className={cn("relative isolate overflow-hidden px-6 pt-24 pb-16 md:px-10 md:pt-32 md:pb-24", className)}
      {...props}
    >
      <AuraBackground grid />
      <div className={cn("mx-auto max-w-6xl", visual && "grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-14")}>
        <div className="flex flex-col items-start">
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <GradientHeading
            id={headingId}
            as="h1"
            size={size === "home" ? "hero" : "page"}
            highlight={highlight}
            className="mt-6 max-w-170"
          >
            {title}
          </GradientHeading>
          {description && (
            <p className="mt-6 max-w-140 text-lg text-pretty text-muted-foreground sm:text-xl">{description}</p>
          )}
          {actions && <div className="mt-10 flex flex-wrap items-center gap-3">{actions}</div>}
        </div>
        {visual}
      </div>
    </section>
  )
}

export { Hero }
