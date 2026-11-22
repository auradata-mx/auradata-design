// registry: auradata (Mexican phone numbers: 10 digits with the area code, +52 optional, grouped as Mexico writes them)

/** Area codes of two digits (Mexico City, Guadalajara, Monterrey); the rest have three. */
const TWO_DIGIT_AREA_CODES = new Set(["55", "56", "33", "81"])

/**
 * The 10 digits of a Mexican number, whatever was typed or pasted: spaces, dashes and parentheses go, a leading
 * +52 goes, and so does the old «1» of mobiles after it (`"+52 1 55 1234 5678"` → `"5512345678"`).
 */
function phoneDigits(typed: string) {
  let digits = typed.replace(/\D/g, "")
  if (digits.length > 10 && digits.startsWith("52")) digits = digits.slice(2)
  if (digits.length === 11 && digits.startsWith("1")) digits = digits.slice(1)
  return digits.slice(0, 10)
}

/** As Mexico writes it, also while typing: `"5512345678"` → `"55 1234 5678"`, `"9991234567"` → `"999 123 4567"`. */
function formatPhoneMx(digits: string) {
  const area = TWO_DIGIT_AREA_CODES.has(digits.slice(0, 2)) ? 2 : 3
  const middle = area === 2 ? 4 : 3
  return [
    digits.slice(0, area),
    digits.slice(area, area + middle),
    digits.slice(area + middle),
  ]
    .filter(Boolean)
    .join(" ")
}

/** Ten digits, and an area code that starts with 2 to 9, as every Mexican number since 2019. */
function isValidPhoneMx(digits: string) {
  return /^[2-9]\d{9}$/.test(digits)
}

/** `"5512345678"` → `"+525512345678"`, the form to store or to dial from abroad; `null` until it is complete. */
function toE164Mx(digits: string) {
  return isValidPhoneMx(digits) ? `+52${digits}` : null
}

/** Where the caret goes after regrouping: after the same digit it followed before. */
function caretAfterDigits(previous: string, caret: number, next: string) {
  let count = previous.slice(0, caret).replace(/\D/g, "").length
  if (count === 0) return 0
  for (let index = 0; index < next.length; index++) {
    if (/\d/.test(next[index]) && --count === 0) return index + 1
  }
  return next.length
}

export {
  caretAfterDigits,
  formatPhoneMx,
  isValidPhoneMx,
  phoneDigits,
  toE164Mx,
}
