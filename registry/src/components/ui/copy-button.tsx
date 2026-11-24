// registry: auradata (a copy-to-clipboard button that draws a confirmation check with an aria-live announcement in Spanish)
import * as React from "react"
import { CopyIcon } from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"

type CopyButtonProps = React.ComponentProps<typeof Button> & {
  /** Text copied to the clipboard on click. */
  value: string
  /** Accessible label at rest (and fallback visible text when none is given). */
  label?: string
  /** Accessible label and aria-live announcement right after copying. */
  copiedLabel?: string
  /** Milliseconds before the copy icon returns. */
  timeout?: number
  /** Called after writing to the clipboard succeeds. */
  onCopied?: () => void
}

/**
 * Copies `value` to the clipboard and draws a check mark with a live-region
 * confirmation. Works icon-only (default) or with a label as `children`.
 */
function CopyButton({
  value,
  label = "Copiar",
  copiedLabel = "Copiado",
  timeout = 1800,
  onCopied,
  variant = "ghost",
  size = "icon-xs",
  className,
  onClick,
  children,
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (!copied) return
    const id = setTimeout(() => setCopied(false), timeout)
    return () => clearTimeout(id)
  }, [copied, timeout])

  const iconOnly = !children

  return (
    <>
      <Button
        data-slot="copy-button"
        data-copied={copied || undefined}
        variant={variant}
        size={size}
        aria-label={iconOnly ? (copied ? copiedLabel : label) : undefined}
        className={cn(className)}
        onClick={(event) => {
          onClick?.(event)
          navigator.clipboard
            ?.writeText(value)
            .then(() => {
              setCopied(true)
              onCopied?.()
            })
            .catch(() => {})
        }}
        {...props}
      >
        <span
          aria-hidden="true"
          data-icon={iconOnly ? undefined : "inline-start"}
          className="relative inline-grid place-items-center"
        >
          <CopyIcon
            className={cn(
              "col-start-1 row-start-1 transition-[opacity,scale,filter] duration-180 ease-(--ease-fluid) motion-reduce:transition-none",
              copied
                ? "scale-50 opacity-0 blur-[1px]"
                : "scale-100 opacity-100 blur-0"
            )}
          />
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn(
              "col-start-1 row-start-1 text-success-700",
              !copied && "opacity-0"
            )}
          >
            <path
              d="m4 12 5 5L20 6"
              pathLength="1"
              className={cn(
                "[stroke-dasharray:1] transition-[stroke-dashoffset] ease-(--ease-fluid) motion-reduce:transition-none",
                copied
                  ? "[stroke-dashoffset:0] duration-300"
                  : "[stroke-dashoffset:1] duration-100"
              )}
            />
          </svg>
        </span>
        {children && <span>{copied ? copiedLabel : children}</span>}
      </Button>
      <span aria-live="polite" className="sr-only">
        {copied ? copiedLabel : ""}
      </span>
    </>
  )
}

export { CopyButton, type CopyButtonProps }
