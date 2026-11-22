// registry: auradata (shadcn alert with success, warning and info variants; status colors tint the box and the icon, never the text; the action takes its own column, and drops under the text in a narrow alert)
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const alertVariants = cva(
  "group/alert @container/alert relative grid w-full gap-0.5 rounded-lg border px-2.5 py-2.5 text-left text-sm [--alert-text-col:1] has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-2 has-[>svg]:[--alert-text-col:2] has-data-[slot=alert-action]:grid-cols-[1fr] has-data-[slot=alert-action]:gap-x-3 has-[>svg]:has-data-[slot=alert-action]:grid-cols-[auto_1fr] *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        // AuraData: status colors as text fail WCAG AA in light, so they tint the box, the border
        // and the icon (3:1 as non-text); the title and description keep the foreground colors. In dark, an
        // outline action takes a lighter edge (--input) so it does not melt into the tint.
        destructive:
          "border-destructive/40 bg-destructive/10 text-foreground *:[svg]:text-destructive dark:[--input:color-mix(in_oklab,var(--foreground)_22%,transparent)]",
        success:
          "border-success/40 bg-success/10 text-foreground *:[svg]:text-success dark:[--input:color-mix(in_oklab,var(--foreground)_22%,transparent)]",
        warning:
          "border-warning/50 bg-warning/10 text-foreground *:[svg]:text-warning dark:[--input:color-mix(in_oklab,var(--foreground)_22%,transparent)]",
        info: "border-info/40 bg-info/10 text-foreground *:[svg]:text-info dark:[--input:color-mix(in_oklab,var(--foreground)_22%,transparent)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "font-medium group-has-[>svg]/alert:col-start-2 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground",
        className
      )}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-sm text-pretty text-muted-foreground group-has-[>svg]/alert:col-start-2 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
        className
      )}
      {...props}
    />
  )
}

function AlertAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-action"
      // AuraData: its own grid column, at its natural width, so a long label never covers the title (stock
      // positioned it absolutely in 72 px of padding). In an alert narrower than 24rem (a phone) it drops under
      // the text, aligned with it, so the text keeps the full width.
      className={cn(
        "col-start-[calc(var(--alert-text-col)+1)] row-span-2 row-start-1 self-start @max-sm/alert:col-start-(--alert-text-col) @max-sm/alert:row-span-1 @max-sm/alert:row-start-auto @max-sm/alert:mt-2 @max-sm/alert:justify-self-start",
        className
      )}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription, AlertAction }
