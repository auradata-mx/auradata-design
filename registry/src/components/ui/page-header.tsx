// registry: auradata (the header of every AuraData page: long titles wrap, actions drop under them on a phone)
import { cn } from "cn"

type PageHeaderProps = Omit<React.ComponentProps<"header">, "title"> & {
  title: React.ReactNode
  description?: React.ReactNode
  /** Buttons on the right, such as "Nuevo informe". */
  actions?: React.ReactNode
}

/** The title of a page, an optional line about it and its main actions. */
function PageHeader({ title, description, actions, className, children, ...props }: PageHeaderProps) {
  return (
    <header
      data-slot="page-header"
      className={cn(
        "flex flex-col gap-4 border-b border-border pb-4 sm:flex-row sm:items-end sm:justify-between",
        className
      )}
      {...props}
    >
      {/* The title takes the room left by the actions and wraps; a single long word breaks instead of overflowing. */}
      <div className="grid min-w-0 flex-1 gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-balance wrap-break-word">{title}</h1>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
        {children}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </header>
  )
}

export { PageHeader }
