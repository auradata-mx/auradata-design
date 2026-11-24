// registry: auradata (shadcn badge with solid destructive, success, warning and info variants; a long label truncates; the brand focus outline alone, no border change)
import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit max-w-full shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/25 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        secondary:
          "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        // AuraData: a solid fill. The stock tint put #DC2626 on #FCE9E9, 4.1:1, below WCAG AA.
        destructive:
          "bg-destructive text-destructive-foreground [a]:hover:underline",
        // Keep both status colors opaque at hover so the underlying surface cannot reduce contrast.
        success: "bg-success text-success-foreground [a]:hover:underline",
        warning: "bg-warning text-warning-foreground [a]:hover:underline",
        info: "bg-info text-info-foreground [a]:hover:underline",
        outline:
          "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        ghost:
          "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

// AuraData: text runs go in a truncating span (an inline-flex box cannot end its own text in «…»); icons stay
// direct children, as the [&>svg] and data-icon styles expect.
function truncateText(children: React.ReactNode) {
  return React.Children.map(children, (child) =>
    typeof child === "string" || typeof child === "number" ? (
      <span data-slot="badge-label" className="min-w-0 truncate">
        {child}
      </span>
    ) : (
      child
    )
  )
}

function Badge({
  className,
  variant = "default",
  render,
  children,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
        children: truncateText(children),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
