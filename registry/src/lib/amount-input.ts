// registry: auradata (amounts typed in es-MX: thousands separators while typing, the caret kept on its digit, cents padded on blur)
import { formatNumber } from "@/lib/format"

type AmountOptions = {
  /** Decimals the field takes: 2 for pesos and cents, 0 for whole pesos. */
  maxFractionDigits?: number
}

/**
 * What the person typed, as the field should show it while they type, and its number:
 * `"1234.5"` → `{ text: "1,234.5", value: 1234.5 }`. A trailing point stays (`"12."`), so the next digit
 * can be a decimal; anything that is not a digit or the first point is dropped (`"$1,284"` → `"1,284"`).
 */
function formatAmountInput(
  typed: string,
  { maxFractionDigits = 2 }: AmountOptions = {}
) {
  const [rawWhole = "", ...rest] = typed.replace(/[^\d.]/g, "").split(".")
  const hasPoint = maxFractionDigits > 0 && rest.length > 0
  const fraction = rest.join("").slice(0, maxFractionDigits)
  const digits = rawWhole.replace(/^0+(?=\d)/, "")
  if (!digits && !hasPoint) return { text: "", value: null }

  const whole = digits || "0"
  const text =
    formatNumber(Number(whole), { maximumFractionDigits: 0 }) +
    (hasPoint ? `.${fraction}` : "")
  return { text, value: Number(`${whole}.${fraction || 0}`) }
}

/** On blur: cents always in pairs (`"1,234.5"` → `"1,234.50"`), and no lone point (`"1,234."` → `"1,234"`). */
function finishAmountInput(text: string) {
  const [whole, fraction] = text.split(".")
  if (fraction === undefined) return text
  return fraction === "" ? whole : `${whole}.${fraction.padEnd(2, "0")}`
}

const isSignificant = (char: string) => /[\d.]/.test(char)

/**
 * Where the caret goes after reformatting: after the same digit (or point) it followed before, so a separator
 * appearing or moving never pushes it around.
 */
function caretAfterFormat(previous: string, caret: number, next: string) {
  let count = [...previous.slice(0, caret)].filter(isSignificant).length
  if (count === 0) return 0
  for (let index = 0; index < next.length; index++) {
    if (isSignificant(next[index]) && --count === 0) return index + 1
  }
  return next.length
}

export { caretAfterFormat, finishAmountInput, formatAmountInput }
export type { AmountOptions }
