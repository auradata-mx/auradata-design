// registry: auradata (a password field with «Mostrar contraseña», and a strength meter on Base UI Meter: four segments, the level in words, and the rules still missing)
"use client"

import * as React from "react"
import { Meter as MeterPrimitive } from "@base-ui/react/meter"
import { cn } from "cn"
import { CheckIcon, EyeIcon, EyeOffIcon, MinusIcon } from "lucide-react"

import { passwordStrength } from "@/lib/password-strength"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"

type PasswordInputProps = Omit<React.ComponentProps<"input">, "type"> & {
  /** The name of the eye button, read by screen readers; it says whether the password shows with `aria-pressed`. */
  toggleLabel?: string
  /** Classes for the box; `className` goes to the input. */
  groupClassName?: string
}

/**
 * A password with an eye button that shows it. Pass `autoComplete="new-password"` when the person is choosing one,
 * so the browser offers to generate it; the default, `current-password`, fills a saved one.
 */
function PasswordInput({
  toggleLabel = "Mostrar contraseña",
  autoComplete = "current-password",
  disabled,
  groupClassName,
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = React.useState(false)
  return (
    <InputGroup disabled={disabled} className={groupClassName}>
      <InputGroupInput
        type={visible ? "text" : "password"}
        autoComplete={autoComplete}
        spellCheck={false}
        disabled={disabled}
        {...props}
      />
      <InputGroupAddon align="inline-end">
        <InputGroupButton
          size="icon-xs"
          aria-label={toggleLabel}
          aria-pressed={visible}
          onClick={() => setVisible((shown) => !shown)}
        >
          {visible ? <EyeOffIcon aria-hidden /> : <EyeIcon aria-hidden />}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}

const SEGMENT_COLOR = [
  "",
  "bg-destructive",
  "bg-warning",
  "bg-success",
  "bg-success",
] as const

type PasswordStrengthProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** The password being typed. */
  value: string
  /** Hides the list of rules: only the meter and the level. */
  hideRules?: boolean
}

/**
 * How strong the typed password is: four segments that fill and change color, the level in words («Seguridad:
 * Buena») and the rules, each with a check when met. Screen readers hear the level as the meter's value.
 */
function PasswordStrength({
  value,
  hideRules = false,
  className,
  ...props
}: PasswordStrengthProps) {
  const { score, label, rules, hint } = passwordStrength(value)
  return (
    <div
      data-slot="password-strength"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    >
      <MeterPrimitive.Root
        value={score}
        min={0}
        max={4}
        getAriaValueText={() => label || "Sin contraseña"}
        className="flex flex-col gap-1.5"
      >
        <div className="flex gap-1" aria-hidden>
          {[1, 2, 3, 4].map((segment) => (
            <div
              key={segment}
              data-filled={segment <= score || undefined}
              className={cn(
                "h-1 flex-1 rounded-full bg-foreground/10 transition-colors",
                segment <= score && SEGMENT_COLOR[score]
              )}
            />
          ))}
        </div>
        <div className="flex items-baseline justify-between gap-2 text-sm">
          <MeterPrimitive.Label className="text-muted-foreground">
            Seguridad
          </MeterPrimitive.Label>
          <span
            className="font-medium text-foreground"
            aria-hidden
            data-slot="password-strength-level"
          >
            {label || "—"}
          </span>
        </div>
      </MeterPrimitive.Root>
      {hint && <p className="text-sm text-foreground">{hint}</p>}
      {!hideRules && (
        <ul className="grid gap-1 text-sm sm:grid-cols-2">
          {rules.map((rule) => (
            <li
              key={rule.id}
              data-met={rule.met || undefined}
              className="flex items-center gap-1.5 text-muted-foreground data-met:text-foreground [&_svg]:size-3.5 [&_svg]:shrink-0"
            >
              {rule.met ? (
                <CheckIcon aria-hidden className="text-success" />
              ) : (
                <MinusIcon aria-hidden />
              )}
              {rule.label}
              <span className="sr-only">
                {rule.met ? "(cumplido)" : "(falta)"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export { PasswordInput, PasswordStrength }
export type { PasswordInputProps, PasswordStrengthProps }
