// registry: auradata (a date range filter with the periods AuraData reports use, in Spanish)
import * as React from "react"
import {
  isSameDay,
  startOfDay,
  startOfMonth,
  startOfQuarter,
  startOfYear,
  subDays,
} from "date-fns"
import { es } from "date-fns/locale/es"
import { CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { formatDate } from "@/lib/format"

type DateRangePreset = "today" | "last-7-days" | "this-month" | "this-quarter" | "this-year"

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

type DateRangeFilterProps = Omit<React.ComponentProps<typeof Button>, "value" | "defaultValue" | "onChange"> & {
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

/** A button that opens the presets (Hoy, Últimos 7 días, Este mes…) and a two-month calendar for any range. */
function DateRangeFilter({
  value,
  defaultValue,
  onValueChange,
  placeholder = "Elige un periodo",
  today: todayProp,
  locale = "es-MX",
  defaultOpen,
  className,
  ...props
}: DateRangeFilterProps) {
  const [today] = React.useState(() => startOfDay(todayProp ?? new Date()))
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue)
  const range = value ?? uncontrolled
  const [month, setMonth] = React.useState(() => startOfMonth(subDays(range?.to ?? today, 31)))
  const active = presetOf(range, today)

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
      <PopoverContent align="start" aria-label="Periodo" className="w-auto flex-row gap-0 p-0">
        <div role="group" aria-label="Periodos" className="flex w-40 flex-col gap-0.5 border-r p-2">
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
          locale={es}
          numberOfMonths={2}
          // Two months side by side: a day of the next month in the first grid reads as a second end.
          showOutsideDays={false}
          month={month}
          onMonthChange={setMonth}
          selected={range}
          onSelect={change}
          disabled={{ after: today }}
          className="p-3"
        />
      </PopoverContent>
    </Popover>
  )
}

export { DateRangeFilter, presetRange, type DateRangeFilterProps, type DateRangePreset }
