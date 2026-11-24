// registry: auradata (shadcn empty state whose title reads above its description, and a dashed outline that shows in dark; an error variant with a retry and the technical detail)
"use client"

import { cva, type VariantProps } from "class-variance-authority"
import { ChevronRightIcon, CircleAlertIcon, RotateCwIcon } from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import { useScrollBlurViewport, ViewportScrollBlur } from "@/components/ui/progressive-blur"

function Empty({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty"
      className={cn(
        "flex w-full min-w-0 flex-1 flex-col items-center justify-center gap-4 rounded-xl border-dashed border-foreground/15 p-6 text-center text-balance dark:border-foreground/20",
        className
      )}
      {...props}
    />
  )
}

function EmptyHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-header"
      className={cn("flex max-w-sm flex-col items-center gap-2", className)}
      {...props}
    />
  )
}

const emptyMediaVariants = cva(
  "mb-2 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground [&_svg:not([class*='size-'])]:size-4",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function EmptyMedia({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof emptyMediaVariants>) {
  return (
    <div
      data-slot="empty-icon"
      data-variant={variant}
      className={cn(emptyMediaVariants({ variant, className }))}
      {...props}
    />
  )
}

function EmptyTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-title"
      className={cn(
        "font-heading text-base font-semibold tracking-normal sm:text-lg",
        className
      )}
      {...props}
    />
  )
}

function EmptyDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <div
      data-slot="empty-description"
      className={cn(
        "text-sm/relaxed text-muted-foreground [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary",
        className
      )}
      {...props}
    />
  )
}

function EmptyContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-content"
      className={cn(
        "flex w-full max-w-sm min-w-0 flex-col items-center gap-2.5 text-sm text-balance",
        className
      )}
      {...props}
    />
  )
}

type EmptyErrorProps = Omit<React.ComponentProps<typeof Empty>, "title"> & {
  title?: React.ReactNode
  description?: React.ReactNode
  /** Shows «Reintentar». */
  onRetry?: () => void
  retryLabel?: React.ReactNode
  /** The error for support (a message, a code, a trace): hidden under «Detalle técnico». */
  detail?: string
}

/** Something failed where content should be: what happened, a retry and, folded, the technical detail. */
function EmptyError({
  title = "No pudimos cargar esto",
  description = "Algo falló de nuestro lado. Inténtalo de nuevo en unos segundos.",
  onRetry,
  retryLabel = "Reintentar",
  detail,
  className,
  children,
  ...props
}: EmptyErrorProps) {
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

export {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
  EmptyError,
  type EmptyErrorProps,
}
