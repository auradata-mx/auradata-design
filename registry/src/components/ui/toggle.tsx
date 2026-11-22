// registry: auradata (shadcn toggle: icon-only toggles are square; pressed takes --accent, apart from the hover; the brand focus outline alone)
import * as React from "react"
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const toggleVariants = cva(
  "group/toggle inline-flex data-icon-only:aspect-square data-icon-only:px-0! items-center justify-center gap-1 rounded-lg text-sm font-medium whitespace-nowrap transition-all outline-none hover:bg-muted hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-pressed:bg-accent aria-pressed:text-accent-foreground dark:aria-invalid:ring-destructive/25 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border border-input bg-transparent hover:bg-muted aria-pressed:border-foreground/20",
      },
      size: {
        default:
          "h-8 min-w-8 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        sm: "h-7 min-w-7 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 min-w-9 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/** AuraData: one element child and no text is an icon-only toggle, drawn square as an icon button. CSS cannot tell
 * (`:only-child` ignores the text node beside an icon). */
function isIconOnly(children: React.ReactNode): boolean {
  const nodes = React.Children.toArray(children)
  if (nodes.length !== 1 || !React.isValidElement<{ children?: React.ReactNode }>(nodes[0])) return false
  // A fragment (<><Icon /> Label</>) counts by what it holds.
  return nodes[0].type === React.Fragment ? isIconOnly(nodes[0].props.children) : true
}

function Toggle({
  className,
  variant = "default",
  size = "default",
  children,
  ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive
      data-slot="toggle"
      data-icon-only={isIconOnly(children) || undefined}
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    >
      {children}
    </TogglePrimitive>
  )
}

export { isIconOnly, Toggle, toggleVariants }
