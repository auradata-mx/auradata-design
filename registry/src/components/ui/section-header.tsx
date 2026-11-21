// registry: auradata (the eyebrow, title and lead of a marketing section)
import { cn } from "cn"

import { Eyebrow } from "@/components/ui/eyebrow"
import { GradientHeading } from "@/components/ui/gradient-heading"

type SectionHeaderProps = Omit<React.ComponentProps<"div">, "title"> & {
  eyebrow?: React.ReactNode
  title: React.ReactNode
  /** Words after the title in the brand gradient, on the same line. */
  highlight?: React.ReactNode
  description?: React.ReactNode
  align?: "left" | "center"
  /** The heading's id, for a section's `aria-labelledby`. */
  titleId?: string
  as?: "h1" | "h2" | "h3"
}

/** The opening of a marketing section: eyebrow, title (with an optional gradient highlight) and a lead. */
function SectionHeader({
  eyebrow,
  title,
  highlight,
  description,
  align = "left",
  titleId,
  as = "h2",
  className,
  ...props
}: SectionHeaderProps) {
  return (
    <div
      data-slot="section-header"
      className={cn("flex max-w-170 flex-col gap-5", align === "center" && "mx-auto items-center text-center", className)}
      {...props}
    >
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <GradientHeading id={titleId} as={as} highlight={highlight} inline>
        {title}
      </GradientHeading>
      {description && <p className="text-lg text-pretty text-muted-foreground">{description}</p>}
    </div>
  )
}

export { SectionHeader }
