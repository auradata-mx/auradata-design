// registry: auradata (a title with the brand gradient on its highlighted words)
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const headingVariants = cva("font-heading font-semibold text-balance text-foreground", {
  variants: {
    size: {
      hero: "text-5xl leading-[1.05] tracking-tighter sm:text-6xl lg:text-7xl",
      page: "text-4xl leading-[1.08] tracking-tighter sm:text-5xl lg:text-6xl",
      section: "text-3xl leading-tight tracking-tight sm:text-4xl lg:text-5xl",
    },
  },
  defaultVariants: { size: "section" },
})

/**
 * Words in the brand gradient (100°, blue → violet → green). Inline and as wide as the words, so the
 * gradient spans the text and reaches green at its last letter, not at the edge of the page.
 */
function GradientText({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="gradient-text"
      className={cn(
        "bg-(image:--aura-gradient-brand) box-decoration-clone bg-clip-text pb-[0.08em] text-transparent",
        className
      )}
      {...props}
    />
  )
}

type GradientHeadingProps = React.ComponentProps<"h2"> &
  VariantProps<typeof headingVariants> & {
    as?: "h1" | "h2" | "h3"
    /** The words in the gradient, after the title. */
    highlight?: React.ReactNode
    /** Keep the highlight on the title's line; by default it starts a line of its own. */
    inline?: boolean
  }

/** A title whose highlighted words carry the brand gradient: the only place the gradient goes on text. */
function GradientHeading({
  as: Heading = "h2",
  size,
  highlight,
  inline = false,
  className,
  children,
  ...props
}: GradientHeadingProps) {
  return (
    <Heading data-slot="gradient-heading" className={cn(headingVariants({ size }), className)} {...props}>
      {children}
      {highlight && (
        <>
          {inline ? " " : <br />}
          <GradientText>{highlight}</GradientText>
        </>
      )}
    </Heading>
  )
}

export { GradientHeading, GradientText }
