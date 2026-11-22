// registry: auradata (file sizes in es-MX, the type and size checks of an upload with Spanish messages, and a small CSV reader for previews)
import { formatNumber } from "@/lib/format"

const NBSP = "\u00a0"
const UNITS = ["B", "KB", "MB", "GB", "TB"]

/** `1234567` → `1.2 MB` (decimal units, as macOS and the browsers show them; a no-break space before the unit). */
function formatFileSize(bytes: number) {
  let value = bytes
  let unit = 0
  while (value >= 1000 && unit < UNITS.length - 1) {
    value /= 1000
    unit++
  }
  const digits = unit === 0 || value >= 100 ? 0 : 1
  return `${formatNumber(value, { maximumFractionDigits: digits })}${NBSP}${UNITS[unit]}`
}

type FileLike = Pick<File, "name" | "type" | "size">

type FileRules = {
  /** As the input's `accept`: extensions and MIME types, `".csv,text/csv"`, `"image/*"`. */
  accept?: string
  /** Bytes. */
  maxSize?: number
}

type FileProblem = {
  code: "type" | "size"
  /** The whole sentence, with the file name: for a toast or an alert. */
  message: string
  /** The same without the name: for a list where the name is already the title. */
  reason: string
}

function matchesAccept(file: FileLike, accept: string) {
  const name = file.name.toLowerCase()
  const type = file.type.toLowerCase()
  return accept
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean)
    .some((entry) =>
      entry.startsWith(".")
        ? name.endsWith(entry)
        : entry.endsWith("/*")
          ? type.startsWith(entry.slice(0, -1))
          : type === entry
    )
}

/**
 * Why a file cannot go, in the brand voice (what is wrong and what is allowed), or `null` when it can:
 * `«informe.pdf» no es un archivo .csv.`, `«pedidos.csv» pesa 12.4 MB; el máximo es 10 MB.`
 */
function validateFile(
  file: FileLike,
  { accept, maxSize }: FileRules
): FileProblem | null {
  if (accept && !matchesAccept(file, accept)) {
    const extensions = accept
      .split(",")
      .map((entry) => entry.trim())
      .filter((entry) => entry.startsWith("."))
    const kind = extensions.length
      ? `un archivo ${extensions.join(" o ")}`
      : "de un tipo que se pueda subir aquí"
    return {
      code: "type",
      message: `«${file.name}» no es ${kind}.`,
      reason: `No es ${kind}.`,
    }
  }
  if (maxSize !== undefined && file.size > maxSize) {
    const sizes = `${formatFileSize(file.size)}; el máximo es ${formatFileSize(maxSize)}.`
    return {
      code: "size",
      message: `«${file.name}» pesa ${sizes}`,
      reason: `Pesa ${sizes}`,
    }
  }
  return null
}

/** The separator of the first line: comma, semicolon or tab, whichever appears most outside quotes. */
function detectDelimiter(text: string) {
  const counts = { ",": 0, ";": 0, "\t": 0 }
  let quoted = false
  for (const char of text) {
    if (char === '"') quoted = !quoted
    else if (!quoted && (char === "\n" || char === "\r")) break
    else if (!quoted && char in counts) counts[char as keyof typeof counts]++
  }
  return (Object.keys(counts) as (keyof typeof counts)[]).reduce(
    (best, next) => (counts[next] > counts[best] ? next : best)
  )
}

/**
 * The rows of a CSV (RFC 4180: quoted fields keep separators, line breaks and doubled quotes), up to `maxRows`.
 * For previews: it reads text already in memory and stops early, it does not stream a large file.
 */
function parseCsv(
  text: string,
  { maxRows = Infinity }: { maxRows?: number } = {}
) {
  const source = text.replace(/^\uFEFF/, "")
  const delimiter = detectDelimiter(source)
  const rows: string[][] = []
  let row: string[] = []
  let field = ""
  let quoted = false

  const endRow = () => {
    row.push(field)
    field = ""
    if (row.length > 1 || row[0] !== "") rows.push(row)
    row = []
  }

  for (let index = 0; index < source.length && rows.length < maxRows; index++) {
    const char = source[index]
    if (quoted) {
      if (char === '"' && source[index + 1] === '"') {
        field += '"'
        index++
      } else if (char === '"') quoted = false
      else field += char
    } else if (char === '"') quoted = true
    else if (char === delimiter) {
      row.push(field)
      field = ""
    } else if (char === "\n") endRow()
    else if (char !== "\r") field += char
  }
  if (rows.length < maxRows && (field !== "" || row.length)) endRow()
  return rows
}

/**
 * Whether a column holds numbers (amounts, counts, percents), so it aligns right: every non-empty value is digits
 * with separators, a currency sign, a percent or a minus, and there is at least one.
 */
function isNumericColumn(values: string[]) {
  const filled = values.map((value) => value.trim()).filter(Boolean)
  return (
    filled.length > 0 &&
    filled.every((value) => /^[$−-]?\s?\$?[\d,.]+\s?%?$/.test(value))
  )
}

export { formatFileSize, isNumericColumn, parseCsv, validateFile }
export type { FileLike, FileProblem, FileRules }
