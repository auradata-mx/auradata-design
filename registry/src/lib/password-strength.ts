// registry: auradata (how strong a password is, in Spanish: four plain rules, a level from Débil to Fuerte and a hint for common passwords)

type PasswordRule = {
  id: "length" | "case" | "number" | "symbol"
  label: string
  met: boolean
}

type PasswordStrength = {
  /** 0 with nothing typed, then 1 (Débil) to 4 (Fuerte). */
  score: 0 | 1 | 2 | 3 | 4
  label: "" | "Débil" | "Regular" | "Buena" | "Fuerte"
  rules: PasswordRule[]
  /** Why it is weak when the rules do not say it. */
  hint?: string
}

const MIN_LENGTH = 8
const LABELS = ["", "Débil", "Regular", "Buena", "Fuerte"] as const

/** The words people try first, in Spanish and English, and the brand itself. */
const COMMON = new Set([
  "password",
  "contrasena",
  "qwerty",
  "admin",
  "administrador",
  "bienvenido",
  "welcome",
  "letmein",
  "mexico",
  "auradata",
  "iloveyou",
  "teamo",
])

function isCommon(password: string) {
  const letters = password
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z]/g, "")
  const digits = password.replace(/\D/g, "")
  return (
    COMMON.has(letters) ||
    (letters === "" && /^(\d)\1*$|^0?123456789?0?$/.test(digits))
  )
}

/**
 * The level of a password and the rules behind it. The rules are plain on purpose, so the person sees what to add;
 * a password under 8 characters, or one of the most common ones, stays «Débil» whatever it mixes.
 */
function passwordStrength(password: string): PasswordStrength {
  const rules: PasswordRule[] = [
    {
      id: "length",
      label: `Al menos ${MIN_LENGTH} caracteres`,
      met: [...password].length >= MIN_LENGTH,
    },
    {
      id: "case",
      label: "Mayúsculas y minúsculas",
      met: /\p{Lu}/u.test(password) && /\p{Ll}/u.test(password),
    },
    { id: "number", label: "Un número", met: /\p{N}/u.test(password) },
    {
      id: "symbol",
      label: "Un símbolo, como ! o #",
      met: /[^\p{L}\p{N}\s]/u.test(password),
    },
  ]
  if (!password) return { score: 0, label: "", rules }

  const common = isCommon(password)
  const met = rules.filter((rule) => rule.met).length
  const score = (
    common || !rules[0].met ? 1 : Math.max(1, met)
  ) as PasswordStrength["score"]
  return {
    score,
    label: LABELS[score],
    rules,
    ...(common ? { hint: "Es una contraseña muy común. Elige otra." } : {}),
  }
}

export { passwordStrength }
export type { PasswordRule, PasswordStrength }
