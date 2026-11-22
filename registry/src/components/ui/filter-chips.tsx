// registry: auradata (the active filters of a page as chips, each with its own «×», and «Limpiar todo»)
import * as React from "react"
import { XIcon } from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"

type FilterChip = {
  id: string
  /** The field: «Región». */
  label: string
  /** What it is filtered to, already written for people: «Norte, Bajío», «$10,000 – $250,000». */
  value: React.ReactNode
}

type FilterChipsProps = Omit<React.ComponentProps<"div">, "children"> & {
  chips: FilterChip[]
  onRemove: (id: string) => void
  /** «Limpiar todo»: shown with any chip. */
  onClearAll?: () => void
}

/**
 * The filters in effect, so they are seen and undone in one place. Pure UI: the page owns the filters and
 * writes each value (with `lib/format` for numbers and dates). Renders nothing while no filter is active.
 */
function FilterChips({ chips, onRemove, onClearAll, className, ...props }: FilterChipsProps) {
  if (chips.length === 0) return null
  return (
    <div
      role="group"
      aria-label="Filtros activos"
      data-slot="filter-chips"
      className={cn("flex flex-wrap items-center gap-2", className)}
      {...props}
    >
      {chips.map((chip) => (
        <span
          key={chip.id}
          data-slot="filter-chip"
          className="inline-flex h-7 max-w-full min-w-0 items-center gap-1 rounded-full border bg-muted/50 pr-0.5 pl-3 text-sm"
        >
          <span className="truncate">
            <span className="text-muted-foreground">{chip.label}:</span> {chip.value}
          </span>
          <Button
            variant="ghost"
            size="icon-xs"
            className="shrink-0 rounded-full"
            onClick={() => onRemove(chip.id)}
            aria-label={`Quitar el filtro «${chip.label}»`}
            title={`Quitar el filtro «${chip.label}»`}
          >
            <XIcon aria-hidden />
          </Button>
        </span>
      ))}
      {onClearAll && (
        <Button variant="ghost" size="sm" onClick={onClearAll}>
          Limpiar todo
        </Button>
      )}
    </div>
  )
}

export { FilterChips, type FilterChip, type FilterChipsProps }
