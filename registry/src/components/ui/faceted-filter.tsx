// registry: auradata (a filter by a field's values: a button that opens a popover with a search, a checkbox per value and how many records have it)
import * as React from "react"
import { CheckIcon, ListFilterIcon } from "lucide-react"
import { cn } from "cn"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { formatNumber } from "@/lib/format"

type FacetedFilterOption = {
  value: string
  /** What the option says; the value by default. */
  label?: string
  /** How many records have this value: shown beside it. */
  count?: number
  icon?: React.ComponentType<{ className?: string }>
}

type FacetedFilterProps = Omit<React.ComponentProps<typeof Button>, "value" | "defaultValue" | "onChange"> & {
  /** The field: «Estado», «Región». The button says it, and the popover is named after it. */
  title: string
  options: FacetedFilterOption[]
  /** The chosen values, controlled; `defaultValue` only starts there. */
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
  defaultOpen?: boolean
}

/** Up to this many chosen values show by name on the button; more show as a count. */
const MAX_NAMED = 2

/**
 * One filter of the filter system: the values of one field, with a search, a checkbox each and their counts.
 * It knows nothing about tables: a dashboard passes the options and keeps the value; `DataTable` makes one per
 * column with `meta.filter`.
 */
function FacetedFilter({
  title,
  options,
  value: valueProp,
  defaultValue = [],
  onValueChange,
  defaultOpen,
  className,
  ...props
}: FacetedFilterProps) {
  const [local, setLocal] = React.useState(defaultValue)
  const value = valueProp ?? local
  const chosen = new Set(value)
  const setValue = (next: string[]) => {
    if (valueProp === undefined) setLocal(next)
    onValueChange?.(next)
  }
  const toggle = (option: string) =>
    // Keep the order of the options, not the order of the clicks.
    setValue(options.map((o) => o.value).filter((v) => (v === option ? !chosen.has(v) : chosen.has(v))))
  const labelOf = (v: string) => options.find((o) => o.value === v)?.label ?? v

  return (
    <Popover defaultOpen={defaultOpen}>
      <PopoverTrigger
        render={<Button variant="outline" className={cn("border-dashed", className)} {...props} />}
      >
        <ListFilterIcon data-icon="inline-start" aria-hidden />
        {title}
        {value.length > 0 && (
          <>
            <Separator orientation="vertical" className="mx-0.5 h-4 self-center" />
            {value.length > MAX_NAMED ? (
              <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                {`${formatNumber(value.length)} seleccionados`}
              </Badge>
            ) : (
              value.map((v) => (
                <Badge key={v} variant="secondary" className="max-w-32 rounded-sm px-1 font-normal">
                  {labelOf(v)}
                </Badge>
              ))
            )}
          </>
        )}
      </PopoverTrigger>
      <PopoverContent align="start" aria-label={title} className="w-60 p-0">
        {/* cmdk names its input after the Command's label, and its list «Suggestions» unless told otherwise. */}
        <Command label={`Buscar en «${title}»`}>
          <CommandInput placeholder="Buscar…" />
          <CommandList label={title}>
            <CommandEmpty>Sin resultados</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const checked = chosen.has(option.value)
                const Icon = option.icon
                return (
                  <CommandItem
                    key={option.value}
                    value={option.label ?? option.value}
                    onSelect={() => toggle(option.value)}
                    aria-checked={checked}
                    // The stock item draws a check at the end; the box at the start says it here, on the 3:1 control border.
                    className="[&>svg:last-child]:hidden"
                  >
                    <span
                      aria-hidden
                      data-checked={checked || undefined}
                      className="flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-[color:var(--control-border,var(--input))] text-primary-foreground data-checked:border-primary data-checked:bg-primary"
                    >
                      {checked && <CheckIcon className="size-3.5 text-primary-foreground" />}
                    </span>
                    {Icon && <Icon className="text-muted-foreground" />}
                    <span className="min-w-0 flex-1 truncate">{option.label ?? option.value}</span>
                    {option.count !== undefined && (
                      <span className="ml-auto pl-2 text-xs text-muted-foreground tabular-nums">
                        {formatNumber(option.count)}
                      </span>
                    )}
                  </CommandItem>
                )
              })}
            </CommandGroup>
            {/* A border, not a CommandSeparator: a `role=separator` inside the listbox fails axe. */}
            {value.length > 0 && (
              <CommandGroup forceMount className="border-t">
                <CommandItem forceMount onSelect={() => setValue([])} className="justify-center [&>svg:last-child]:hidden">
                  Limpiar filtro
                </CommandItem>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export { FacetedFilter, type FacetedFilterOption, type FacetedFilterProps }
