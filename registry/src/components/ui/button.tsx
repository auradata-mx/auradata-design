// registry: auradata (shadcn button with a solid destructive variant and a loading state: spinner, aria-busy, disabled; fills paint under the border, so filled and outline buttons are the same height; the brand focus outline alone, no border change; a legible busy state; a roomier lg)
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

import { Spinner } from "@/components/ui/spinner"

/**
 * Elevation 1 with depth: a lit top edge at rest, lifted 1px with a larger shadow under the pointer, sunk with an
 * inset shadow when pressed (a menu trigger stays put). Ghost and link buttons stay flat, level 0.
 */
const RAISED =
  "shadow-(--elevation-control) hover:-translate-y-px hover:shadow-(--elevation-control-hover) active:not-aria-[haspopup]:shadow-(--elevation-pressed)"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px motion-reduce:transition-none disabled:pointer-events-none disabled:bg-none disabled:opacity-50 disabled:shadow-none aria-busy:opacity-100 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/25 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: `bg-primary bg-(image:--surface-filled) text-primary-foreground hover:bg-primary/80 ${RAISED}`,
        outline:
          `border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-foreground/15 dark:bg-input/30 dark:hover:bg-input/50 ${RAISED}`,
        secondary:
          `bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground ${RAISED}`,
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        // AuraData: a solid fill. The stock tint put #DC2626 on #FCE9E9, 4.1:1, below WCAG AA.
        destructive:
          `bg-destructive bg-(image:--surface-filled) text-destructive-foreground hover:bg-destructive/90 ${RAISED}`,
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-10 gap-2 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  loading = false,
  disabled,
  children,
  ...props
}: ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    /** The action is running: a spinner before the label, `aria-busy` and disabled, so it is not sent twice. */
    loading?: boolean
  }) {
  const iconOnly = typeof size === "string" && size.startsWith("icon")
  return (
    <ButtonPrimitive
      data-slot="button"
      data-variant={variant}
      className={cn(
        buttonVariants({ variant, size }),
        // The spinner takes the place of a leading icon, so a button with one keeps its width.
        loading && "[&>[data-icon=inline-start]:not([data-slot=spinner])]:hidden",
        className
      )}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && (
        <Spinner
          aria-hidden
          data-icon={iconOnly ? undefined : "inline-start"}
          className="motion-reduce:animate-none"
        />
      )}
      {loading && iconOnly ? null : children}
    </ButtonPrimitive>
  )
}

export { Button, buttonVariants }
