// registry: auradata (a bar that floats over the bottom of the screen while rows are selected: the count, the bulk actions and «Quitar selección»)
import * as React from "react"
import { XIcon } from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { formatNumber } from "@/lib/format"

type DataTableSelectionBarProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** How many items are selected. The bar shows while it is above 0. */
  count: number
  /** The bulk actions: small buttons («Mover», «Eliminar»). */
  children?: React.ReactNode
  /** Clears the selection: «Quitar selección» and Escape inside the bar. */
  onClear: () => void
  /** What the count says: «3 seleccionados» by default. */
  label?: (count: number) => string
}

function selectedLabel(count: number) {
  return `${formatNumber(count)} ${count === 1 ? "seleccionado" : "seleccionados"}`
}

/**
 * The actions over a selection, floating over the bottom of the screen, centered. It works with any
 * selection (a data table, a list of cards); `DataTable` renders one when it gets `bulkActions`. A screen
 * reader hears the count change from a live region that stays mounted, also when the bar is hidden.
 */
function DataTableSelectionBar({
  count,
  children,
  onClear,
  label = selectedLabel,
  className,
  ...props
}: DataTableSelectionBarProps) {
  const text = count > 0 ? label(count) : ""
  return (
    <>
      <span className="sr-only" aria-live="polite">
        {text}
      </span>
      {count > 0 && (
        <div
          role="toolbar"
          aria-label="Acciones de la selección"
          data-slot="data-table-selection-bar"
          onKeyDown={(event) => {
            if (event.key === "Escape") onClear()
          }}
          className={cn(
            // Above the home indicator on a phone; never wider than the screen.
            "fixed inset-x-0 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 mx-auto flex w-fit max-w-[calc(100%-2rem)] items-center gap-2 rounded-xl border bg-popover py-2 pr-2 pl-4 text-sm text-popover-foreground shadow-(--elevation-overlay)",
            "animate-in duration-200 fade-in-0 slide-in-from-bottom-2 motion-reduce:animate-none",
            className
          )}
          {...props}
        >
          <span className="font-medium whitespace-nowrap tabular-nums">
            {text}
          </span>
          {children && (
            <>
              <Separator orientation="vertical" className="mx-1 h-5 self-center" />
              <div className="flex items-center gap-2">{children}</div>
            </>
          )}
          <Button variant="ghost" size="icon-sm" onClick={onClear} aria-label="Quitar selección" title="Quitar selección">
            <XIcon aria-hidden />
          </Button>
        </div>
      )}
    </>
  )
}

export { DataTableSelectionBar, type DataTableSelectionBarProps }
