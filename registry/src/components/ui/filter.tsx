// registry: auradata (one filter of the filter system: values, a number range or a period, in a button that opens a popover)
import * as React from "react"
import {
  addMonths,
  isSameDay,
  startOfDay,
  startOfMonth,
  startOfQuarter,
  startOfYear,
  subDays,
  subMonths,
} from "date-fns"
import { CalendarIcon, CheckIcon, ListFilterIcon, SlidersHorizontalIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { cn } from "cn"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { useIsMobile } from "@/hooks/use-mobile"
import { formatDate, formatNumber } from "@/lib/format"

/** The button's own props: `type` names the kind of filter here, and the value props are the filter's. */
type FilterButtonProps = Omit<React.ComponentProps<typeof Button>, "type" | "value" | "defaultValue" | "onChange">

type FilterOption = {
  value: string
  /** What the option says; the value by default. */
  label?: string
  /** How many records have this value: shown beside it. */
  count?: number
  icon?: React.ComponentType<{ className?: string }>
}

type NumberRange = [number, number]

type DateRangePreset = "today" | "last-7-days" | "this-month" | "this-quarter" | "this-year"

type SelectFilterProps = FilterButtonProps & {
  /** The field: «Estado», «Región». The button says it, and the popover is named after it. */
  title: string
  options: FilterOption[]
  /** The chosen values, controlled; `defaultValue` only starts there. */
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
  defaultOpen?: boolean
}

type NumberFilterProps = FilterButtonProps & {
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

type DateFilterProps = FilterButtonProps & {
  value?: DateRange
  defaultValue?: DateRange
  onValueChange?: (range: DateRange | undefined) => void
  /** What the button says with no range. */
  placeholder?: string
  /** The day the presets count from. Defaults to the current day; fix it for stories and tests. */
  today?: Date
  locale?: string
  defaultOpen?: boolean
}

type FilterProps =
  | ({ type: "select" } & SelectFilterProps)
  | ({ type: "range" } & NumberFilterProps)
  | ({ type: "date" } & DateFilterProps)

/**
 * One filter of the filter system, by `type`:
 * - `select`: the values of one field, with a search, a checkbox each and their counts;
 * - `range`: a number between two ends, with a two-thumb slider and the two ends as numbers;
 * - `date`: a period, with the presets AuraData reports use and a calendar for any range.
 *
 * It knows nothing about tables: a dashboard passes the options and keeps the value; `DataTable` makes one per
 * column with `meta.filter`.
 */
function Filter(props: FilterProps) {
  if (props.type === "range") return <NumberFilter {...withoutType(props)} />
  if (props.type === "date") return <DateFilter {...withoutType(props)} />
  return <SelectFilter {...withoutType(props)} />
}

/** `type` only picks the filter: it is not the button's `type`, so it never reaches it. */
function withoutType<T extends { type: string }>(props: T): Omit<T, "type"> {
  const rest: Partial<T> = { ...props }
  delete rest.type
  return rest as Omit<T, "type">
}

/** The dashed button of a field's filter: its icon, its name and, once it filters, a summary after a separator. */
function DashedTrigger({
  icon,
  title,
  summary,
  className,
  ...props
}: FilterButtonProps & { icon: React.ReactNode; title: string; summary?: React.ReactNode }) {
  return (
    <PopoverTrigger render={<Button variant="outline" className={cn("border-dashed", className)} {...props} />}>
      {icon}
      {title}
      {summary && (
        <>
          <Separator orientation="vertical" className="mx-0.5 h-4 self-center" />
          {summary}
        </>
      )}
    </PopoverTrigger>
  )
}

/** Up to this many chosen values show by name on the button; more show as a count. */
const MAX_NAMED = 2

function SelectFilter({
  title,
  options,
  value: valueProp,
  defaultValue = [],
  onValueChange,
  defaultOpen,
  ...props
}: SelectFilterProps) {
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
      <DashedTrigger
        icon={<ListFilterIcon data-icon="inline-start" aria-hidden />}
        title={title}
        summary={
          value.length === 0 ? undefined : value.length > MAX_NAMED ? (
            <Badge variant="secondary" className="rounded-sm px-1 font-normal">
              {`${formatNumber(value.length)} seleccionados`}
            </Badge>
          ) : (
            value.map((v) => (
              <Badge key={v} variant="secondary" className="max-w-32 rounded-sm px-1 font-normal">
                {labelOf(v)}
              </Badge>
            ))
          )
        }
        {...props}
      />
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

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

/**
 * The slider gives the feel of the span, the inputs the exact figure; an input applies on Enter or when it loses
 * focus, never while it is typed.
 */
function NumberFilter({
  title,
  min,
  max,
  step = 1,
  value: valueProp,
  defaultValue,
  onValueChange,
  format = (value) => formatNumber(value),
  defaultOpen,
  ...props
}: NumberFilterProps) {
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
      <DashedTrigger
        icon={<SlidersHorizontalIcon data-icon="inline-start" aria-hidden />}
        title={title}
        summary={
          value && (
            <Badge variant="secondary" className="rounded-sm px-1 font-normal tabular-nums">
              {`${format(value[0])} – ${format(value[1])}`}
            </Badge>
          )
        }
        {...props}
      />
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

const PRESETS: { id: DateRangePreset; label: string; from: (today: Date) => Date }[] = [
  { id: "today", label: "Hoy", from: (today) => today },
  { id: "last-7-days", label: "Últimos 7 días", from: (today) => subDays(today, 6) },
  { id: "this-month", label: "Este mes", from: startOfMonth },
  { id: "this-quarter", label: "Este trimestre", from: startOfQuarter },
  { id: "this-year", label: "Este año", from: startOfYear },
]

/** The range of a preset, from its first day to today. */
function presetRange(preset: DateRangePreset, today = new Date()): DateRange {
  const to = startOfDay(today)
  return { from: PRESETS.find(({ id }) => id === preset)!.from(to), to }
}

/** The preset a range matches, if any. */
function presetOf(range: DateRange | undefined, today: Date) {
  if (!range?.from || !range.to) return undefined
  return PRESETS.find(({ id }) => {
    const { from, to } = presetRange(id, today)
    return isSameDay(from!, range.from!) && isSameDay(to!, range.to!)
  })?.id
}

/** "1 nov 2026 – 21 nov 2026", or one day when the range starts and ends on it. */
function rangeLabel(range: DateRange | undefined, locale: string) {
  if (!range?.from) return undefined
  const from = formatDate(range.from, { locale })
  if (!range.to || isSameDay(range.from, range.to)) return from
  return `${from} – ${formatDate(range.to, { locale })}`
}

/** A button that opens the presets (Hoy, Últimos 7 días, Este mes…) and a two-month calendar for any range. */
function DateFilter({
  value,
  defaultValue,
  onValueChange,
  placeholder = "Elige un periodo",
  today: todayProp,
  locale = "es-MX",
  defaultOpen,
  className,
  ...props
}: DateFilterProps) {
  const [today] = React.useState(() => startOfDay(todayProp ?? new Date()))
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue)
  const range = value ?? uncontrolled
  const [month, setMonth] = React.useState(() => startOfMonth(subDays(range?.to ?? today, 31)))
  // `month` is the first of the two months shown side by side; a phone shows only the second, where the range ends.
  const isMobile = useIsMobile()
  const active = presetOf(range, today)
  const presetsRef = React.useRef<HTMLDivElement>(null)

  const change = (next: DateRange | undefined) => {
    if (value === undefined) setUncontrolled(next)
    onValueChange?.(next)
  }
  const choosePreset = (preset: DateRangePreset) => {
    const next = presetRange(preset, today)
    change(next)
    setMonth(startOfMonth(subDays(next.to!, 31)))
  }

  const label = rangeLabel(range, locale)
  return (
    <Popover defaultOpen={defaultOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            className={cn("justify-start font-normal tabular-nums", !label && "text-muted-foreground", className)}
            {...props}
          />
        }
      >
        <CalendarIcon data-icon="inline-start" aria-hidden />
        {label ?? placeholder}
      </PopoverTrigger>
      {/* Below 768px (one month) the presets are a two-column grid above the calendar, as wide as it; from 768px
          (two months) they are a column beside it. One breakpoint for both, as `useIsMobile`. */}
      <PopoverContent
        align="start"
        aria-label="Periodo"
        // The pressed preset takes the first focus, not the first one in the list.
        initialFocus={() => presetsRef.current?.querySelector<HTMLElement>('[aria-pressed="true"]') ?? true}
        className="w-min gap-0 p-0 md:w-auto md:flex-row"
      >
        <div
          ref={presetsRef}
          role="group"
          aria-label="Periodos"
          className="grid grid-cols-2 gap-0.5 border-b p-2 md:flex md:w-40 md:flex-col md:border-r md:border-b-0"
        >
          {PRESETS.map((preset) => (
            <Button
              key={preset.id}
              variant={active === preset.id ? "default" : "ghost"}
              size="sm"
              aria-pressed={active === preset.id}
              className="justify-start"
              onClick={() => choosePreset(preset.id)}
            >
              {preset.label}
            </Button>
          ))}
          <Button
            variant={range?.from && !active ? "default" : "ghost"}
            size="sm"
            aria-pressed={Boolean(range?.from && !active)}
            className="justify-start"
            onClick={() => change(undefined)}
          >
            Personalizado
          </Button>
        </div>
        <Calendar
          mode="range"
          // One month on a phone, so the popover fits the screen; two side by side from 768px.
          numberOfMonths={isMobile ? 1 : 2}
          // A day of the next month in the first grid would read as a second end of the range.
          showOutsideDays={false}
          month={isMobile ? addMonths(month, 1) : month}
          onMonthChange={(shown) => setMonth(isMobile ? subMonths(shown, 1) : shown)}
          selected={range}
          onSelect={change}
          disabled={{ after: today }}
          today={today}
          // Bigger days below 768px, where a finger picks them.
          className="p-3 max-md:[--cell-size:--spacing(9)]"
        />
      </PopoverContent>
    </Popover>
  )
}

export { Filter, presetRange, type DateRangePreset, type FilterOption, type FilterProps, type NumberRange }
