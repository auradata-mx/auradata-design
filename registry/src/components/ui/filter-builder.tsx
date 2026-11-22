// registry: auradata (an advanced filter: conditions on any field joined by Y/O, with nested groups; pure UI over lib/filter-conditions)
import * as React from "react"
import { ListPlusIcon, PlusIcon, XIcon } from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import {
  isGroup,
  OPERATORS,
  UNARY,
  type FilterCondition,
  type FilterField,
  type FilterGroup,
} from "@/lib/filter-conditions"

type FilterBuilderProps = Omit<React.ComponentProps<"div">, "defaultValue" | "onChange"> & {
  /** The fields a condition can use, with their type. */
  fields: FilterField[]
  /** The filter, controlled; `defaultValue` only starts there. */
  value?: FilterGroup
  defaultValue?: FilterGroup
  onValueChange?: (value: FilterGroup) => void
}

let lastId = 0
const newId = () => `filter-${++lastId}`

const EMPTY: FilterGroup = { id: "root", combinator: "and", conditions: [] }

/** A new condition on the first field, with its first operator. */
function newCondition(fields: FilterField[]): FilterCondition {
  const field = fields[0]
  return { id: newId(), field: field?.id ?? "", operator: field ? OPERATORS[field.type][0].id : "equals" }
}

/** «y» and «o» between conditions, as a sentence reads them. */
const JOIN = { and: "y", or: "o" } as const

/**
 * Builds a filter people read as a sentence: «Donde Ventas mayor que 100000 y Región es Norte». Conditions join with
 * Y (all) or O (any), and a group nests its own Y/O. Pure UI: `matchesFilter` from `lib/filter-conditions` applies the
 * result to any list, and `DataTable` takes it through `filterFields`. Unfinished conditions filter nothing.
 */
function FilterBuilder({
  fields,
  value: valueProp,
  defaultValue = EMPTY,
  onValueChange,
  className,
  ...props
}: FilterBuilderProps) {
  const [local, setLocal] = React.useState(defaultValue)
  const value = valueProp ?? local
  const set = (next: FilterGroup) => {
    if (valueProp === undefined) setLocal(next)
    onValueChange?.(next)
  }

  return (
    <div
      role="group"
      aria-label="Filtros avanzados"
      data-slot="filter-builder"
      className={cn("grid gap-3 text-sm", className)}
      {...props}
    >
      {value.conditions.length === 0 ? (
        <p className="text-muted-foreground">Sin condiciones. Agrega una para filtrar.</p>
      ) : (
        <GroupRows fields={fields} group={value} onChange={set} />
      )}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => set({ ...value, conditions: [...value.conditions, newCondition(fields)] })}
        >
          <PlusIcon data-icon="inline-start" aria-hidden />
          Agregar condición
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            set({
              ...value,
              conditions: [
                ...value.conditions,
                { id: newId(), combinator: "and", conditions: [newCondition(fields)] },
              ],
            })
          }
        >
          <ListPlusIcon data-icon="inline-start" aria-hidden />
          Agregar grupo
        </Button>
        {value.conditions.length > 0 && (
          <Button variant="ghost" size="sm" className="ml-auto" onClick={() => set({ ...value, conditions: [] })}>
            Limpiar
          </Button>
        )}
      </div>
    </div>
  )
}

/** The rows of a group: each starts with «Donde», the Y/O choice, or the word that joins it to the one above. */
function GroupRows({
  fields,
  group,
  onChange,
  name,
}: {
  fields: FilterField[]
  group: FilterGroup
  onChange: (group: FilterGroup) => void
  /** «del grupo 2», for the rows of a nested group. */
  name?: string
}) {
  const replace = (index: number, item: FilterCondition | FilterGroup | null) =>
    onChange({
      ...group,
      conditions: item
        ? group.conditions.map((other, at) => (at === index ? item : other))
        : group.conditions.filter((_, at) => at !== index),
    })

  return (
    <div className="grid gap-2">
      {group.conditions.map((item, index) => {
        const lead =
          index === 0 ? (
            <span className="text-muted-foreground">Donde</span>
          ) : index === 1 ? (
            <NativeSelect
              size="sm"
              aria-label="Unir condiciones"
              value={group.combinator}
              onChange={(event) => onChange({ ...group, combinator: event.target.value as FilterGroup["combinator"] })}
            >
              <NativeSelectOption value="and">Y</NativeSelectOption>
              <NativeSelectOption value="or">O</NativeSelectOption>
            </NativeSelect>
          ) : (
            <span className="pl-2.5 text-muted-foreground">{JOIN[group.combinator]}</span>
          )
        return isGroup(item) ? (
          <div key={item.id} className="grid grid-cols-[3.5rem_1fr] items-start gap-2 sm:grid-cols-[4.5rem_1fr]">
            <div className="flex min-h-8 items-center">{lead}</div>
            <div
              role="group"
              aria-label={`Grupo ${index + 1}`}
              className="grid gap-2 rounded-lg border bg-muted/40 p-2 sm:p-3"
            >
              <GroupRows
                fields={fields}
                group={item}
                onChange={(next) => replace(index, next.conditions.length ? next : null)}
                name={`del grupo ${index + 1}`}
              />
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => replace(index, { ...item, conditions: [...item.conditions, newCondition(fields)] })}
                >
                  <PlusIcon data-icon="inline-start" aria-hidden />
                  Agregar condición
                </Button>
                <Button variant="ghost" size="sm" className="ml-auto" onClick={() => replace(index, null)}>
                  Quitar grupo
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <ConditionRow
            key={item.id}
            label={`Condición ${index + 1}${name ? ` ${name}` : ""}`}
            lead={lead}
            fields={fields}
            condition={item}
            onChange={(next) => replace(index, next)}
          />
        )
      })}
    </div>
  )
}

/**
 * One condition: field, operator and value. On a phone they stack in one column beside the word that joins them,
 * so no name is cut; from `sm` the row is one line.
 */
function ConditionRow({
  label,
  lead,
  fields,
  condition,
  onChange,
}: {
  label: string
  lead: React.ReactNode
  fields: FilterField[]
  condition: FilterCondition
  onChange: (condition: FilterCondition | null) => void
}) {
  const field = fields.find((candidate) => candidate.id === condition.field) ?? fields[0]
  const operators = field ? OPERATORS[field.type] : []
  const unary = UNARY.includes(condition.operator)
  const valueText = condition.value === undefined || condition.value === null ? "" : String(condition.value)

  let input: React.ReactNode = null
  if (field && !unary) {
    if (field.type === "select") {
      input = (
        <NativeSelect
          size="sm"
          aria-label="Valor"
          className="w-full"
          value={valueText}
          onChange={(event) => onChange({ ...condition, value: event.target.value || undefined })}
        >
          <NativeSelectOption value="">Elige…</NativeSelectOption>
          {field.options?.map((option) => (
            <NativeSelectOption key={option.value} value={option.value}>
              {option.label ?? option.value}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      )
    } else {
      input = (
        <Input
          aria-label="Valor"
          type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
          inputMode={field.type === "number" ? "decimal" : undefined}
          value={valueText}
          onChange={(event) => {
            const text = event.target.value
            const number = Number(text)
            onChange({
              ...condition,
              value: text === "" ? undefined : field.type === "number" && !Number.isNaN(number) ? number : text,
            })
          }}
          // The native date picker's icon follows the color scheme: dark on dark without it.
          className="h-7 dark:scheme-dark"
        />
      )
    }
  }

  return (
    <div
      role="group"
      aria-label={label}
      className="grid grid-cols-[3.5rem_1fr_1.75rem] items-center gap-2 sm:grid-cols-[4.5rem_10rem_11rem_1fr_1.75rem]"
    >
      <div className="col-start-1 row-start-1 flex min-w-0 items-center">{lead}</div>
      <NativeSelect
        size="sm"
        aria-label="Campo"
        className="col-start-2 row-start-1 w-full"
        value={field?.id ?? ""}
        onChange={(event) => {
          const next = fields.find((candidate) => candidate.id === event.target.value)
          if (!next) return
          // A field of another type starts over at its first operator, with no value.
          const sameType = next.type === field?.type
          onChange({
            ...condition,
            field: next.id,
            operator: sameType ? condition.operator : OPERATORS[next.type][0].id,
            value: sameType ? condition.value : undefined,
          })
        }}
      >
        {fields.map((candidate) => (
          <NativeSelectOption key={candidate.id} value={candidate.id}>
            {candidate.label}
          </NativeSelectOption>
        ))}
      </NativeSelect>
      <NativeSelect
        size="sm"
        aria-label="Operador"
        className="col-start-2 row-start-2 w-full sm:col-start-3 sm:row-start-1"
        value={condition.operator}
        onChange={(event) => {
          const operator = event.target.value as FilterCondition["operator"]
          onChange({ ...condition, operator, value: UNARY.includes(operator) ? undefined : condition.value })
        }}
      >
        {operators.map((operator) => (
          <NativeSelectOption key={operator.id} value={operator.id}>
            {operator.label}
          </NativeSelectOption>
        ))}
      </NativeSelect>
      <div className="col-start-2 row-start-3 min-w-0 empty:hidden sm:col-start-4 sm:row-start-1">
        {input}
      </div>
      <Button
        variant="ghost"
        size="icon-sm"
        className="col-start-3 row-start-1 sm:col-start-5"
        onClick={() => onChange(null)}
        aria-label="Quitar condición"
        title="Quitar condición"
      >
        <XIcon aria-hidden />
      </Button>
    </div>
  )
}

export { FilterBuilder, type FilterBuilderProps }
