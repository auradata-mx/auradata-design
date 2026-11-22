// registry: auradata (a time picker on our select: 24-hour times every 30 minutes by default, a clock icon, typeahead to jump to an hour)
"use client"

import * as React from "react"
import { cn } from "cn"
import { ClockIcon } from "lucide-react"

import { timeOptions } from "@/lib/date-time"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type TimePickerProps = Omit<
  React.ComponentProps<typeof SelectTrigger>,
  "value" | "defaultValue" | "onChange"
> & {
  /** "HH:mm", 24-hour. */
  value?: string | null
  defaultValue?: string | null
  onValueChange?: (time: string | null) => void
  /** Minutes between options. */
  step?: number
  /** The first and last time offered, "HH:mm". */
  min?: string
  max?: string
  placeholder?: string
  name?: string
  disabled?: boolean
  defaultOpen?: boolean
}

/**
 * A time from a list, 24-hour as AuraData writes it («14:30»), the same in every browser and language. Typing
 * «14» jumps to 14:00; the arrow keys move through the list.
 */
function TimePicker({
  value,
  defaultValue,
  onValueChange,
  step = 30,
  min,
  max,
  placeholder = "Hora",
  name,
  disabled,
  defaultOpen,
  className,
  ...props
}: TimePickerProps) {
  const options = React.useMemo(
    () => timeOptions({ step, min, max }),
    [step, min, max]
  )
  return (
    <Select
      items={options.map((time) => ({ value: time, label: time }))}
      value={value}
      defaultValue={defaultValue}
      onValueChange={(time) => onValueChange?.(time as string | null)}
      name={name}
      disabled={disabled}
      defaultOpen={defaultOpen}
    >
      <SelectTrigger
        data-slot="time-picker"
        className={cn("w-28 tabular-nums", className)}
        {...props}
      >
        <ClockIcon aria-hidden className="text-muted-foreground" />
        <SelectValue placeholder={placeholder} className="flex-1 text-left" />
      </SelectTrigger>
      <SelectContent className="max-h-64">
        {options.map((time) => (
          <SelectItem key={time} value={time} className="tabular-nums">
            {time}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export { TimePicker }
export type { TimePickerProps }
