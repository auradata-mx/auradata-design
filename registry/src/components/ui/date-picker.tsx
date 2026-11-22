// registry: auradata (a date picker on our Spanish calendar that looks like a form field, and a date with time beside it)
"use client"

import * as React from "react"
import { startOfDay } from "date-fns"
import { CalendarIcon } from "lucide-react"
import type { Matcher } from "react-day-picker"
import { cn } from "cn"

import { timeOf, withTime } from "@/lib/date-time"
import { formatDate } from "@/lib/format"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { TimePicker } from "@/components/ui/time-picker"

type DatePickerProps = Omit<
  React.ComponentProps<typeof Button>,
  "value" | "defaultValue" | "onChange" | "children"
> & {
  value?: Date
  defaultValue?: Date
  onValueChange?: (date: Date | undefined) => void
  /** What the field says with no date. */
  placeholder?: string
  /** Days that cannot be chosen: `{ before: today }`, `{ dayOfWeek: [0, 6] }`. */
  disabledDays?: Matcher | Matcher[]
  /** The day marked as today. Defaults to the current day; fix it for stories and tests. */
  today?: Date
  locale?: string
  defaultOpen?: boolean
}

/** A field that opens the calendar; choosing a day closes it. The day reads «21 nov 2026». */
function DatePicker({
  value,
  defaultValue,
  onValueChange,
  placeholder = "Elige una fecha",
  disabledDays,
  today: todayProp,
  locale = "es-MX",
  defaultOpen = false,
  className,
  ...props
}: DatePickerProps) {
  const [today] = React.useState(() => startOfDay(todayProp ?? new Date()))
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue)
  const [open, setOpen] = React.useState(defaultOpen)
  const date = value ?? uncontrolled
  const calendarRef = React.useRef<HTMLDivElement>(null)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            data-slot="date-picker"
            variant="outline"
            className={cn(
              "w-full justify-start border-[color:var(--control-border,var(--input))] px-2.5 font-normal text-foreground tabular-nums dark:border-[color:var(--control-border,var(--input))]",
              !date && "text-muted-foreground",
              className
            )}
            {...props}
          />
        }
      >
        <CalendarIcon
          data-icon="inline-start"
          aria-hidden
          className="text-muted-foreground"
        />
        {date ? formatDate(date, { locale }) : placeholder}
      </PopoverTrigger>
      <PopoverContent
        // The keyboard lands on the chosen day, or today (the day the calendar makes tabbable), not on the
        // month buttons.
        initialFocus={() =>
          calendarRef.current?.querySelector<HTMLElement>(
            ".rdp-day_button[tabindex='0']"
          ) ?? true
        }
        align="start"
        aria-label="Calendario"
        className="w-auto p-0"
      >
        <div ref={calendarRef}>
          <Calendar
            mode="single"
            selected={date}
            defaultMonth={date ?? today}
            today={today}
            disabled={disabledDays}
            onSelect={(next) => {
              if (value === undefined) setUncontrolled(next)
              onValueChange?.(next)
              if (next) setOpen(false)
            }}
            // Bigger days below 768px, where a finger picks them.
            className="p-3 max-md:[--cell-size:--spacing(9)]"
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}

type DateTimePickerProps = Omit<
  DatePickerProps,
  "value" | "defaultValue" | "onValueChange"
> & {
  value?: Date
  defaultValue?: Date
  onValueChange?: (date: Date | undefined) => void
  /** Minutes between the times offered. */
  step?: number
  /** The name of the time picker, read by screen readers. */
  timeLabel?: string
}

/**
 * A day and a time, one `Date`: the calendar beside a 24-hour time list. A time chosen before the day lands on
 * today; a new day keeps the time.
 */
function DateTimePicker({
  value,
  defaultValue,
  onValueChange,
  step,
  timeLabel = "Hora",
  today: todayProp,
  disabled,
  className,
  "aria-invalid": ariaInvalid,
  ...props
}: DateTimePickerProps) {
  const [today] = React.useState(() => startOfDay(todayProp ?? new Date()))
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue)
  const date = value ?? uncontrolled
  const change = (next: Date | undefined) => {
    if (value === undefined) setUncontrolled(next)
    onValueChange?.(next)
  }
  return (
    <div
      data-slot="date-time-picker"
      className={cn("flex w-full min-w-0 gap-2", className)}
    >
      <DatePicker
        {...props}
        value={date}
        today={today}
        disabled={disabled}
        aria-invalid={ariaInvalid}
        className="min-w-0 flex-1"
        onValueChange={(day) =>
          change(day && withTime(day, timeOf(date) ?? "09:00"))
        }
      />
      <TimePicker
        aria-label={timeLabel}
        aria-invalid={ariaInvalid}
        step={step}
        disabled={disabled}
        value={timeOf(date) ?? null}
        onValueChange={(time) => time && change(withTime(date ?? today, time))}
      />
    </div>
  )
}

export { DatePicker, DateTimePicker }
export type { DatePickerProps, DateTimePickerProps }
