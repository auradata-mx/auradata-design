// registry: auradata (es-MX number, money, percent and date formats of the brand voice)

/** Every AuraData product writes numbers as in Mexico: $1,284,500 · 12.4 % · 21 nov 2026. */
const DEFAULT_LOCALE = "es-MX"
const NBSP = "\u00a0"

type LocaleOption = { locale?: string }

/** Pesos with no cents unless asked: `$1,284,500`. */
function formatCurrency(
  value: number,
  { locale = DEFAULT_LOCALE, currency = "MXN", ...options }: LocaleOption & Intl.NumberFormatOptions = {}
) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
    ...options,
  }).format(value)
}

/** A big number in short form: `$4.16 M` with a currency, `1.3 K` without one. */
function formatCompact(
  value: number,
  { locale = DEFAULT_LOCALE, currency, ...options }: LocaleOption & Intl.NumberFormatOptions = {}
) {
  const text = new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: 2,
    ...(currency ? { style: "currency", currency } : {}),
    ...options,
  }).format(value)
  // Spanish writes thousands as "k"; the brand uses "K", as next to "M".
  return text.replace(/(\d)\u00a0k$/, `$1${NBSP}K`)
}

/** A fraction as a percent: 0.124 → `12.4 %`. Pass `signDisplay: "exceptZero"` for changes. */
function formatPercent(
  fraction: number,
  {
    locale = DEFAULT_LOCALE,
    maximumFractionDigits = 1,
    signDisplay,
    ...options
  }: LocaleOption & Intl.NumberFormatOptions = {}
) {
  const text = new Intl.NumberFormat(locale, {
    style: "percent",
    maximumFractionDigits,
    signDisplay,
    ...options,
  }).format(fraction)
  // Mexico (and the brand voice) separates the sign: "12.4 %". A no-break space keeps them together.
  return locale.startsWith("es") ? text.replace(/(\d)%/, `$1${NBSP}%`) : text
}

/** A plain number: `1,284,500.75`. */
function formatNumber(
  value: number,
  { locale = DEFAULT_LOCALE, ...options }: LocaleOption & Intl.NumberFormatOptions = {}
) {
  return new Intl.NumberFormat(locale, options).format(value)
}

/** A day: `21 nov 2026`. A `YYYY-MM-DD` string is read as that local day, not as UTC midnight. */
function formatDate(
  date: Date | string | number,
  { locale = DEFAULT_LOCALE, ...options }: LocaleOption & Intl.DateTimeFormatOptions = {}
) {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...options,
  }).format(toDate(date))
}

function toDate(date: Date | string | number) {
  if (typeof date === "string") {
    const day = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date)
    if (day) return new Date(Number(day[1]), Number(day[2]) - 1, Number(day[3]))
  }
  return new Date(date)
}

export { formatCompact, formatCurrency, formatDate, formatNumber, formatPercent }
