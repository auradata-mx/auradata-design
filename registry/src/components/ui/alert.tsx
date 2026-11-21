// registry: auradata (shadcn alert with success, warning and info variants; status colors tint the box and the icon, never the text; the action takes its own column)
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const alertVariants = cva(
  "group/alert relative grid w-full gap-0.5 rounded-lg border px-2.5 py-2 text-left text-sm has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-2 has-data-[slot=alert-action]:grid-cols-[1fr_auto] has-data-[slot=alert-action]:gap-x-3 has-[>svg]:has-data-[slot=alert-action]:grid-cols-[auto_1fr_auto] *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        // AuraData: status colors as text fail WCAG AA in light, so they tint the box, the border
        // and the icon (3:1 as non-text); the title and description keep the foreground colors.
        destructive:
          "border-destructive/40 bg-destructive/10 text-foreground *:[svg]:text-destructive",
        success:
          "border-success/40 bg-success/10 text-foreground *:[svg]:text-success",
        warning:
          "border-warning/50 bg-warning/10 text-foreground *:[svg]:text-warning",
        info: "border-info/40 bg-info/10 text-foreground *:[svg]:text-info",
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
        "text-sm text-balance text-muted-foreground group-has-[>svg]/alert:col-start-2 md:text-pretty [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
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
      // positioned it absolutely in 72 px of padding).
      className={cn("col-start-[-2] row-span-2 row-start-1 self-start", className)}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription, AlertAction }
