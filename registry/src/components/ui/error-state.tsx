// registry: auradata (an error state on the shadcn empty state, with a retry and the technical detail)
import { CircleAlertIcon, RotateCwIcon } from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"

type ErrorStateProps = Omit<React.ComponentProps<typeof Empty>, "title"> & {
  title?: React.ReactNode
  description?: React.ReactNode
  /** Shows «Reintentar». */
  onRetry?: () => void
  retryLabel?: React.ReactNode
  /** The error for support (a message, a code, a trace): hidden under «Detalle técnico». */
  detail?: string
}

/** Something failed where content should be: what happened, a retry and, folded, the technical detail. */
function ErrorState({
  title = "No pudimos cargar esto",
  description = "Algo falló de nuestro lado. Inténtalo de nuevo en unos segundos.",
  onRetry,
  retryLabel = "Reintentar",
  detail,
  className,
  children,
  ...props
}: ErrorStateProps) {
  return (
    <Empty data-slot="error-state" role="alert" className={cn("border", className)} {...props}>
      <EmptyHeader>
        <EmptyMedia variant="icon" className="bg-destructive text-destructive-foreground">
          <CircleAlertIcon aria-hidden />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        {description && <EmptyDescription>{description}</EmptyDescription>}
      </EmptyHeader>
      {(onRetry || detail || children) && (
        <EmptyContent>
          {onRetry && (
            <Button variant="outline" onClick={onRetry}>
              <RotateCwIcon data-icon="inline-start" />
              {retryLabel}
            </Button>
          )}
          {children}
          {detail && (
            <details className="w-full text-left text-xs text-muted-foreground">
              <summary className="cursor-pointer rounded-sm text-center outline-none select-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50">
                Detalle técnico
              </summary>
              <pre className="mt-2 max-h-40 overflow-auto rounded-md bg-muted p-3 font-mono whitespace-pre-wrap text-foreground">
                {detail}
              </pre>
            </details>
          )}
        </EmptyContent>
      )}
    </Empty>
  )
}

export { ErrorState }
