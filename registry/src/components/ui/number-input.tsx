// registry: auradata (a number field with − and + steppers on Base UI NumberField: es-MX by default, Spanish names, the text-control border and states)
"use client"

import * as React from "react"
import { NumberField as NumberFieldPrimitive } from "@base-ui/react/number-field"
import { cn } from "cn"
import { MinusIcon, PlusIcon } from "lucide-react"

import {
  InputGroup,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"

type NumberInputProps = NumberFieldPrimitive.Root.Props &
  Pick<
    React.ComponentProps<"input">,
    | "placeholder"
    | "aria-invalid"
    | "aria-describedby"
    | "aria-label"
    | "aria-labelledby"
    | "autoFocus"
  > & {
    /** Classes for the box (border, width). `className` goes to the root, around it. */
    groupClassName?: string
    /** The names of the stepper buttons, read by screen readers. */
    decrementLabel?: string
    incrementLabel?: string
  }

/**
 * A number with − and + buttons: arrow keys step by `step`, Shift by `largeStep`, Page Up/Down too. The value is
 * a number (`onValueChange(value)`); `format` takes `Intl.NumberFormatOptions` and the field shows it in es-MX.
 */
function NumberInput({
  className,
  groupClassName,
  locale = "es-MX",
  disabled,
  placeholder,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedBy,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  autoFocus,
  decrementLabel = "Disminuir",
  incrementLabel = "Aumentar",
  ...props
}: NumberInputProps) {
  return (
    <NumberFieldPrimitive.Root
      data-slot="number-input"
      locale={locale}
      disabled={disabled}
      className={cn("w-full", className)}
      {...props}
    >
      <NumberFieldPrimitive.Group
        render={<InputGroup disabled={disabled} className={groupClassName} />}
      >
        <NumberFieldPrimitive.Decrement
          aria-label={decrementLabel}
          render={<InputGroupButton size="icon-xs" className="ml-0.5 size-7 text-foreground" />}
        >
          <MinusIcon aria-hidden />
        </NumberFieldPrimitive.Decrement>
        <NumberFieldPrimitive.Input
          data-slot="input-group-control"
          aria-roledescription="Campo numérico"
          placeholder={placeholder}
          aria-invalid={ariaInvalid}
          aria-describedby={ariaDescribedBy}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          autoFocus={autoFocus}
          render={<InputGroupInput className="px-1 text-center tabular-nums" />}
        />
        <NumberFieldPrimitive.Increment
          aria-label={incrementLabel}
          render={<InputGroupButton size="icon-xs" className="mr-0.5 size-7 text-foreground" />}
        >
          <PlusIcon aria-hidden />
        </NumberFieldPrimitive.Increment>
      </NumberFieldPrimitive.Group>
    </NumberFieldPrimitive.Root>
  )
}

export { NumberInput }
export type { NumberInputProps }
