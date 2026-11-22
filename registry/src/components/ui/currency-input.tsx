// registry: auradata (an amount in Mexican pesos that groups its thousands while you type, with the caret kept on its digit, and pads the cents on blur)
"use client"

import * as React from "react"

import {
  caretAfterFormat,
  finishAmountInput,
  formatAmountInput,
} from "@/lib/amount-input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"

type CurrencyInputProps = Omit<
  React.ComponentProps<"input">,
  "value" | "defaultValue" | "type" | "inputMode"
> & {
  /** The amount as a number, `null` when empty. Controlled with `onValueChange`. */
  value?: number | null
  defaultValue?: number | null
  onValueChange?: (value: number | null) => void
  /** 2 for pesos and cents (default), 0 for whole pesos. */
  maxFractionDigits?: number
  /** The code after the amount. */
  currency?: string
  /** Classes for the box; `className` goes to the input. */
  groupClassName?: string
}

/** The text a number shows as: `1284500.5` → `"1,284,500.50"`. */
function textOf(value: number | null | undefined, maxFractionDigits: number) {
  if (value == null || Number.isNaN(value)) return ""
  return finishAmountInput(
    formatAmountInput(String(value), { maxFractionDigits }).text
  )
}

/**
 * An amount in pesos: «$» before, «MXN» after, the thousands grouped as you type (`1,284,500.5`), the cents in
 * pairs on blur. The value is a number; with `name`, a hidden input submits it as plain digits (`1284500.5`).
 */
function CurrencyInput({
  value,
  defaultValue = null,
  onValueChange,
  maxFractionDigits = 2,
  currency = "MXN",
  name,
  disabled,
  className,
  groupClassName,
  onChange,
  onBlur,
  ref,
  ...props
}: CurrencyInputProps) {
  const [text, setText] = React.useState(() =>
    textOf(value ?? defaultValue, maxFractionDigits)
  )
  const [previousValue, setPreviousValue] = React.useState(value)
  // A new controlled value from outside (a reset, a loaded record) replaces the text; the value the person is
  // typing does not, so "12." keeps its point.
  if (value !== previousValue) {
    setPreviousValue(value)
    if (value !== formatAmountInput(text, { maxFractionDigits }).value) {
      setText(textOf(value, maxFractionDigits))
    }
  }

  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const caret = React.useRef<number | null>(null)
  React.useLayoutEffect(() => {
    if (caret.current !== null && inputRef.current === document.activeElement) {
      inputRef.current?.setSelectionRange(caret.current, caret.current)
    }
    caret.current = null
  }, [text])

  const setRefs = React.useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node
      if (typeof ref === "function") ref(node)
      else if (ref) ref.current = node
    },
    [ref]
  )

  const current = formatAmountInput(text, { maxFractionDigits }).value

  return (
    <InputGroup disabled={disabled} className={groupClassName}>
      <InputGroupAddon>
        <InputGroupText>$</InputGroupText>
      </InputGroupAddon>
      <InputGroupInput
        ref={setRefs}
        data-slot="input-group-control"
        type="text"
        inputMode="decimal"
        autoComplete="off"
        value={text}
        disabled={disabled}
        className={className ?? "tabular-nums"}
        onChange={(event) => {
          const input = event.currentTarget
          const next = formatAmountInput(input.value, { maxFractionDigits })
          caret.current = caretAfterFormat(
            input.value,
            input.selectionStart ?? input.value.length,
            next.text
          )
          setText(next.text)
          if (next.value !== current) onValueChange?.(next.value)
          onChange?.(event)
        }}
        onBlur={(event) => {
          setText(finishAmountInput(text))
          onBlur?.(event)
        }}
        {...props}
      />
      <InputGroupAddon align="inline-end">
        <InputGroupText>{currency}</InputGroupText>
      </InputGroupAddon>
      {name && (
        <input
          type="hidden"
          name={name}
          value={current ?? ""}
          disabled={disabled}
        />
      )}
    </InputGroup>
  )
}

export { CurrencyInput }
export type { CurrencyInputProps }
