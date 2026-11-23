// registry: auradata (the header of every AuraData page: long titles wrap, actions drop under them on a phone, and `sticky` blurs scrolling content under the bar)
import { cn } from "cn"

import { ProgressiveBlur } from "@/components/ui/progressive-blur"

type PageHeaderProps = Omit<React.ComponentProps<"header">, "title"> & {
  title: React.ReactNode
  description?: React.ReactNode
  /** Buttons on the right, such as "Nuevo informe". */
  actions?: React.ReactNode
  /** Sticks to the top of its scroll container and progressively blurs content passing under it. */
  sticky?: boolean
}

/** The title of a page, an optional line about it and its main actions. */
function PageHeader({ title, description, actions, sticky = false, className, children, ...props }: PageHeaderProps) {
  return (
    <header
      data-slot="page-header"
      data-sticky={sticky || undefined}
      className={cn(
        "flex flex-col gap-4 border-b border-border pb-4 sm:flex-row sm:items-end sm:justify-between",
        sticky && "sticky top-0 z-10 isolate bg-background/65 pt-4",
        className
      )}
      {...props}
    >
      {sticky && <ProgressiveBlur side="top" tint size="calc(100% + 1.5rem)" blur={12} className="-z-10" />}
      {/* The title takes the room left by the actions and wraps; a single long word breaks instead of overflowing. */}
      <div className="grid min-w-0 flex-1 gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-balance wrap-break-word">{title}</h1>
        {description && <p className="text-sm text-pretty text-muted-foreground">{description}</p>}
        {children}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </header>
  )
}

export { PageHeader }
