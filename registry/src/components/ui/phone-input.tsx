// registry: auradata (a Mexican phone field: 10 digits grouped as you type, +52 shown and accepted but optional, the caret kept on its digit)
"use client"

import * as React from "react"

import {
  caretAfterDigits,
  formatPhoneMx,
  phoneDigits,
  toE164Mx,
} from "@/lib/phone"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"

type PhoneInputProps = Omit<
  React.ComponentProps<"input">,
  "value" | "defaultValue" | "type" | "inputMode"
> & {
  /** The 10 digits (fewer while typing), with no +52 and no spaces. Controlled with `onValueChange`. */
  value?: string
  defaultValue?: string
  onValueChange?: (digits: string) => void
  /** Shows «+52» before the number. Typed or pasted, +52 is accepted either way. */
  showCountryCode?: boolean
  /** Classes for the box; `className` goes to the input. */
  groupClassName?: string
}

/**
 * A Mexican phone number: `55 1234 5678` or `999 123 4567`, grouped as you type. Pasting `+52 1 55 1234 5678`
 * keeps the 10 digits. Validate with `isValidPhoneMx` from `lib/phone`; with `name`, a hidden input submits the
 * number as `+525512345678` once it is complete.
 */
function PhoneInput({
  value,
  defaultValue = "",
  onValueChange,
  showCountryCode = true,
  name,
  disabled,
  className,
  groupClassName,
  onChange,
  ref,
  ...props
}: PhoneInputProps) {
  const [uncontrolled, setUncontrolled] = React.useState(() =>
    phoneDigits(defaultValue)
  )
  const digits = value === undefined ? uncontrolled : phoneDigits(value)
  const text = formatPhoneMx(digits)

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

  return (
    <InputGroup disabled={disabled} className={groupClassName}>
      {showCountryCode && (
        <InputGroupAddon>
          <InputGroupText>+52</InputGroupText>
        </InputGroupAddon>
      )}
      <InputGroupInput
        ref={setRefs}
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        value={text}
        disabled={disabled}
        className={className ?? "tabular-nums"}
        onChange={(event) => {
          const input = event.currentTarget
          const next = phoneDigits(input.value)
          caret.current = caretAfterDigits(
            input.value,
            input.selectionStart ?? input.value.length,
            formatPhoneMx(next)
          )
          if (value === undefined) setUncontrolled(next)
          if (next !== digits) onValueChange?.(next)
          onChange?.(event)
        }}
        {...props}
      />
      {name && (
        <input
          type="hidden"
          name={name}
          value={toE164Mx(digits) ?? digits}
          disabled={disabled}
        />
      )}
    </InputGroup>
  )
}

export { PhoneInput }
export type { PhoneInputProps }
