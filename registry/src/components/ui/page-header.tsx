// registry: auradata (the header of every AuraData page)
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
      className={cn("flex flex-wrap items-end justify-between gap-4 border-b border-border pb-4", className)}
      {...props}
    >
      <div className="grid gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
        {children}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  )
}

export { PageHeader }
