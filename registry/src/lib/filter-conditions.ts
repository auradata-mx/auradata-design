// registry: auradata (filter conditions joined by Y/O, with nested groups: the fields, the operators in Spanish, and a pure evaluator)

/** What kind of value a field holds; it decides the operators and the input. */
type FilterFieldType = "text" | "number" | "date" | "select"

type FilterField = {
  id: string
  /** The field as people call it: «Región». */
  label: string
  type: FilterFieldType
  /** The values of a `select` field: the label defaults to the value. */
  options?: { value: string; label?: string }[]
}

type FilterOperator =
  | "contains"
  | "startsWith"
  | "equals"
  | "notEquals"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "before"
  | "after"
  | "isEmpty"
  | "isNotEmpty"

type FilterCondition = {
  id: string
  field: string
  operator: FilterOperator
  /** Text, a number (or its text) or a day (`Date` or `YYYY-MM-DD`); none for `isEmpty`/`isNotEmpty`. */
  value?: unknown
}

/** Conditions (or groups) joined by Y (`and`: all of them) or O (`or`: any of them). */
type FilterGroup = {
  id: string
  combinator: "and" | "or"
  conditions: (FilterCondition | FilterGroup)[]
}

type OperatorOption = { id: FilterOperator; label: string }

/** The operators each field type offers, in the order a menu lists them, written to follow the field's name. */
const OPERATORS: Record<FilterFieldType, OperatorOption[]> = {
  text: [
    { id: "contains", label: "contiene" },
    { id: "startsWith", label: "empieza con" },
    { id: "equals", label: "es" },
    { id: "notEquals", label: "no es" },
    { id: "isEmpty", label: "está vacío" },
    { id: "isNotEmpty", label: "no está vacío" },
  ],
  number: [
    { id: "equals", label: "es igual a" },
    { id: "notEquals", label: "no es igual a" },
    { id: "gt", label: "mayor que" },
    { id: "gte", label: "mayor o igual que" },
    { id: "lt", label: "menor que" },
    { id: "lte", label: "menor o igual que" },
  ],
  date: [
    { id: "equals", label: "es el" },
    { id: "before", label: "antes del" },
    { id: "after", label: "después del" },
  ],
  select: [
    { id: "equals", label: "es" },
    { id: "notEquals", label: "no es" },
  ],
}

/** Operators that need no value. */
const UNARY: FilterOperator[] = ["isEmpty", "isNotEmpty"]

const isGroup = (item: FilterCondition | FilterGroup): item is FilterGroup => "conditions" in item

const isBlank = (value: unknown) => value === undefined || value === null || value === ""

/** Lowercase and without accents: «Mérida» matches «merida». */
const fold = (value: unknown) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()

/** A day as a number: a `YYYY-MM-DD` string is that local day, not UTC midnight; the time of a `Date` is dropped. */
function dayOf(value: unknown) {
  const match = typeof value === "string" ? /^(\d{4})-(\d{2})-(\d{2})$/.exec(value) : null
  const date = match ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])) : new Date(value as string)
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
}

/** A condition that can be evaluated: a known field, an operator of its type, and a value unless it needs none. */
function isComplete(condition: FilterCondition, fields: FilterField[]) {
  const field = fields.find((candidate) => candidate.id === condition.field)
  if (!field || !OPERATORS[field.type].some((operator) => operator.id === condition.operator)) return false
  return UNARY.includes(condition.operator) || !isBlank(condition.value)
}

function compare(value: unknown, condition: FilterCondition, type: FilterFieldType): boolean {
  const { operator } = condition
  if (operator === "isEmpty") return isBlank(value)
  if (operator === "isNotEmpty") return !isBlank(value)
  if (isBlank(value)) return operator === "notEquals"
  if (type === "number") {
    const [a, b] = [Number(value), Number(condition.value)]
    return { equals: a === b, notEquals: a !== b, gt: a > b, gte: a >= b, lt: a < b, lte: a <= b }[
      operator as "equals"
    ] ?? false
  }
  if (type === "date") {
    const [a, b] = [dayOf(value), dayOf(condition.value)]
    return { equals: a === b, before: a < b, after: a > b }[operator as "equals"] ?? false
  }
  const [a, b] = [fold(value), fold(condition.value)]
  return { contains: a.includes(b), startsWith: a.startsWith(b), equals: a === b, notEquals: a !== b }[
    operator as "equals"
  ] ?? false
}

/**
 * Whether a record passes a filter. Conditions still being written (no value, an unknown field) are skipped, so a
 * filter never empties a table halfway through; a group with nothing finished passes. `getValue` reads a field
 * from a record that is not a plain object of fields.
 */
function matchesFilter<TRecord>(
  record: TRecord,
  group: FilterGroup,
  fields: FilterField[],
  getValue: (record: TRecord, field: string) => unknown = (record, field) => (record as Record<string, unknown>)[field]
): boolean {
  const results = group.conditions.flatMap((item) => {
    if (isGroup(item)) return countConditions(item, fields) ? [matchesFilter(record, item, fields, getValue)] : []
    if (!isComplete(item, fields)) return []
    const field = fields.find((candidate) => candidate.id === item.field)!
    return [compare(getValue(record, item.field), item, field.type)]
  })
  if (results.length === 0) return true
  return group.combinator === "and" ? results.every(Boolean) : results.some(Boolean)
}

/** How many conditions of a filter are finished, nested ones too: the count on a «Filtros» button. */
function countConditions(group: FilterGroup, fields: FilterField[]): number {
  return group.conditions.reduce(
    (count, item) => count + (isGroup(item) ? countConditions(item, fields) : isComplete(item, fields) ? 1 : 0),
    0
  )
}

export {
  countConditions,
  isGroup,
  matchesFilter,
  OPERATORS,
  UNARY,
  type FilterCondition,
  type FilterField,
  type FilterFieldType,
  type FilterGroup,
  type FilterOperator,
  type OperatorOption,
}
