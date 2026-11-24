// registry: auradata (an error state on the shadcn empty state, with a retry and the technical detail)
"use client"

import { ChevronRightIcon, CircleAlertIcon, RotateCwIcon } from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { useScrollBlurViewport, ViewportScrollBlur } from "@/components/ui/progressive-blur"

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
  const [viewport, viewportRef] = useScrollBlurViewport<HTMLPreElement>()

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
            <details className="group/detail w-full text-left text-xs text-muted-foreground">
              {/* Our chevron instead of the browser's triangle: it turns when the detail opens. */}
              <summary className="mx-auto flex w-fit cursor-pointer list-none items-center gap-1 rounded-sm outline-none select-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 [&::-webkit-details-marker]:hidden">
                <ChevronRightIcon
                  aria-hidden
                  className="size-3.5 transition-transform group-open/detail:rotate-90 motion-reduce:transition-none"
                />
                Detalle técnico
              </summary>
              <div className="relative isolate mt-2 min-w-0 rounded-md">
                <pre
                  ref={viewportRef}
                  className="max-h-40 overflow-auto rounded-[inherit] bg-muted p-3 font-mono whitespace-pre-wrap text-foreground"
                >
                  <code className="block w-max max-w-full">{detail}</code>
                </pre>
                <ViewportScrollBlur viewport={viewport} bothAxes />
              </div>
            </details>
          )}
        </EmptyContent>
      )}
    </Empty>
  )
}

export { ErrorState }
