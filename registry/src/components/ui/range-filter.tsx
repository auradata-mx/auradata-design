// registry: auradata (a filter by a number range: a button that opens a two-thumb slider and the two ends as numbers)
import * as React from "react"
import { SlidersHorizontalIcon } from "lucide-react"
import { cn } from "cn"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { formatNumber } from "@/lib/format"

type NumberRange = [number, number]

type RangeFilterProps = Omit<React.ComponentProps<typeof Button>, "value" | "defaultValue" | "onChange"> & {
  /** The field: «Ventas», «Margen». */
  title: string
  /** The span of the field: the slider's ends, and where a typed end is held. */
  min: number
  max: number
  step?: number
  /** The chosen range, controlled: `null` is no filter. `defaultValue` only starts there. */
  value?: NumberRange | null
  defaultValue?: NumberRange
  /** Hears the new range, or `undefined` when it is cleared. */
  onValueChange?: (value: NumberRange | undefined) => void
  /** How a number reads: `formatCurrency` for money. `formatNumber` by default. */
  format?: (value: number) => string
  defaultOpen?: boolean
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

/**
 * One filter of the filter system: a number between two ends. The slider gives the feel of the span, the inputs
 * the exact figure; an input applies on Enter or when it loses focus, never while it is typed. It knows nothing
 * about tables: `DataTable` makes one per column with `meta.filter.type: "range"`.
 */
function RangeFilter({
  title,
  min,
  max,
  step = 1,
  value: valueProp,
  defaultValue,
  onValueChange,
  format = (value) => formatNumber(value),
  defaultOpen,
  className,
  ...props
}: RangeFilterProps) {
  const [local, setLocal] = React.useState<NumberRange | undefined>(defaultValue)
  const value = valueProp === undefined ? local : (valueProp ?? undefined)
  const [draft, setDraft] = React.useState<NumberRange>(value ?? [min, max])
  const [typed, setTyped] = React.useState<[string, string] | null>(null)
  const id = React.useId()

  // A new value from outside (a chip removed, a saved view) moves the slider and the inputs.
  const [seen, setSeen] = React.useState(value)
  if (seen !== value) {
    setSeen(value)
    setDraft(value ?? [min, max])
    setTyped(null)
  }

  const commit = (next: NumberRange | undefined) => {
    if (valueProp === undefined) setLocal(next)
    onValueChange?.(next)
  }
  const commitDraft = (next: NumberRange) => {
    const ordered: NumberRange = next[0] <= next[1] ? next : [next[1], next[0]]
    setDraft(ordered)
    setTyped(null)
    commit(ordered)
  }
  const commitTyped = (index: 0 | 1) => {
    if (!typed) return
    const number = Number(typed[index])
    if (typed[index].trim() === "" || Number.isNaN(number)) {
      setTyped(null)
      return
    }
    const next: NumberRange = [...draft]
    next[index] = clamp(number, min, max)
    commitDraft(next)
  }
  const text = (index: 0 | 1) => (typed ? typed[index] : String(draft[index]))

  return (
    <Popover defaultOpen={defaultOpen}>
      <PopoverTrigger render={<Button variant="outline" className={cn("border-dashed", className)} {...props} />}>
        <SlidersHorizontalIcon data-icon="inline-start" aria-hidden />
        {title}
        {value && (
          <>
            <Separator orientation="vertical" className="mx-0.5 h-4 self-center" />
            <Badge variant="secondary" className="rounded-sm px-1 font-normal tabular-nums">
              {`${format(value[0])} – ${format(value[1])}`}
            </Badge>
          </>
        )}
      </PopoverTrigger>
      <PopoverContent align="start" aria-label={title} className="grid w-72 gap-4">
        <div className="flex items-baseline justify-between gap-3">
          <span id={`${id}-title`} className="text-sm font-medium">
            {title}
          </span>
          <span className="text-xs text-muted-foreground tabular-nums">{`${format(draft[0])} – ${format(draft[1])}`}</span>
        </div>
        <Slider
          aria-labelledby={`${id}-title`}
          min={min}
          max={max}
          step={step}
          value={draft}
          onValueChange={(next) => {
            setDraft(next as NumberRange)
            setTyped(null)
          }}
          onValueCommitted={(next) => commitDraft(next as NumberRange)}
        />
        <div className="grid grid-cols-2 gap-3">
          {(["Mínimo", "Máximo"] as const).map((label, index) => (
            <div key={label} className="grid gap-1.5">
              <Label htmlFor={`${id}-${index}`} className="text-xs text-muted-foreground">
                {label}
              </Label>
              <Input
                id={`${id}-${index}`}
                type="number"
                inputMode="decimal"
                min={min}
                max={max}
                step={step}
                value={text(index as 0 | 1)}
                onChange={(event) => {
                  const next: [string, string] = typed ?? [String(draft[0]), String(draft[1])]
                  next[index] = event.target.value
                  setTyped([...next])
                }}
                onBlur={() => commitTyped(index as 0 | 1)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") commitTyped(index as 0 | 1)
                }}
                className="tabular-nums"
              />
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            disabled={!value}
            onClick={() => {
              setDraft([min, max])
              setTyped(null)
              commit(undefined)
            }}
          >
            Limpiar
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export { RangeFilter, type NumberRange, type RangeFilterProps }
