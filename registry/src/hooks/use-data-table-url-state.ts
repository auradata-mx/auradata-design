// registry: auradata (a data table's view in the URL: search, sort, page, columns, filters and density, so a link opens the same view)
import * as React from "react"

import type { DataTableView } from "@/components/ui/data-table"

type View = Partial<DataTableView>

/** A day as `YYYY-MM-DD`, in local time: the day people picked, not its UTC midnight. */
const dayText = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
const DAY = /^(\d{4})-(\d{2})-(\d{2})$/
const toDay = (text: unknown) => {
  const match = typeof text === "string" ? DAY.exec(text) : null
  return match ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])) : undefined
}

/** A filter value as JSON; a period's days as `YYYY-MM-DD`. */
function filterText(value: unknown) {
  if (value && typeof value === "object" && !Array.isArray(value) && ("from" in value || "to" in value)) {
    const { from, to } = value as { from?: Date; to?: Date }
    return JSON.stringify({ from: from && dayText(from), to: to && dayText(to) })
  }
  return JSON.stringify(value)
}

function filterValue(text: string) {
  const value = JSON.parse(text) as unknown
  if (value && typeof value === "object" && !Array.isArray(value) && ("from" in value || "to" in value)) {
    const { from, to } = value as { from?: string; to?: string }
    return { from: toDay(from), ...(to ? { to: toDay(to) } : {}) }
  }
  return value
}

/**
 * Writes a view into URL search params, keeping every other param. Only what differs from a fresh table is
 * written, and what went back to it is removed: `q`, `sort=nombre.asc,fecha.desc`, `page` (from 1), `size`,
 * `hide`, `order`, `pin=start|end`, `width=nombre:280`, `density`, `f.<column>` (JSON) and `adv` (JSON). With a
 * `prefix`, every name starts with `<prefix>.`.
 */
function viewToSearchParams(view: View, current: URLSearchParams, prefix?: string, pageSize = 10) {
  const params = new URLSearchParams(current)
  const name = (key: string) => (prefix ? `${prefix}.${key}` : key)
  const set = (key: string, value: string | null | undefined) =>
    value ? params.set(name(key), value) : params.delete(name(key))

  if ("globalFilter" in view) set("q", view.globalFilter)
  if (view.sorting) set("sort", view.sorting.map(({ id, desc }) => `${id}.${desc ? "desc" : "asc"}`).join(","))
  if (view.pagination) {
    set("page", view.pagination.pageIndex > 0 ? String(view.pagination.pageIndex + 1) : null)
    set("size", view.pagination.pageSize !== pageSize ? String(view.pagination.pageSize) : null)
  }
  if (view.columnVisibility)
    set(
      "hide",
      Object.entries(view.columnVisibility)
        .filter(([, visible]) => !visible)
        .map(([id]) => id)
        .join(",")
    )
  if (view.columnOrder) set("order", view.columnOrder.join(","))
  if (view.columnPinning) {
    const { start = [], end = [] } = view.columnPinning
    set("pin", start.length || end.length ? `${start.join(",")}|${end.join(",")}` : null)
  }
  if (view.columnSizing)
    set(
      "width",
      Object.entries(view.columnSizing)
        .map(([id, width]) => `${id}:${Math.round(width)}`)
        .join(",")
    )
  if (view.density) set("density", view.density === "compact" ? "compact" : null)
  if (view.columnFilters) {
    const filterPrefix = `${name("f")}.`
    for (const key of [...params.keys()]) if (key.startsWith(filterPrefix)) params.delete(key)
    for (const { id, value } of view.columnFilters) params.set(`${filterPrefix}${id}`, filterText(value))
  }
  if ("advancedFilter" in view)
    set("adv", view.advancedFilter?.conditions.length ? JSON.stringify(view.advancedFilter) : null)
  return params
}

/** Reads a view from URL search params; a param it cannot read is left out, never thrown. */
function searchParamsToView(params: URLSearchParams, prefix?: string, pageSize = 10): View {
  const name = (key: string) => (prefix ? `${prefix}.${key}` : key)
  const get = (key: string) => params.get(name(key))
  const list = (key: string) => get(key)?.split(",").filter(Boolean) ?? []
  const view: View = {}

  const q = get("q")
  if (q) view.globalFilter = q
  const sorting = list("sort").map((part) => /^(.+)\.(asc|desc)$/.exec(part))
  if (sorting.length && sorting.every(Boolean))
    view.sorting = sorting.map((match) => ({ id: match![1], desc: match![2] === "desc" }))
  const page = Number(get("page") ?? 1)
  const size = Number(get("size"))
  if ((Number.isInteger(page) && page > 1) || (Number.isInteger(size) && size > 0))
    view.pagination = {
      pageIndex: Number.isInteger(page) && page > 1 ? page - 1 : 0,
      pageSize: Number.isInteger(size) && size > 0 ? size : pageSize,
    }
  const hidden = list("hide")
  if (hidden.length) view.columnVisibility = Object.fromEntries(hidden.map((id) => [id, false]))
  const order = list("order")
  if (order.length) view.columnOrder = order
  const pin = get("pin")
  if (pin?.includes("|")) {
    const [start, end] = pin.split("|").map((side) => side.split(",").filter(Boolean))
    view.columnPinning = { start, end }
  }
  const widths = list("width")
    .map((part) => /^(.+):(\d+)$/.exec(part))
    .filter(Boolean)
  if (widths.length) view.columnSizing = Object.fromEntries(widths.map((match) => [match![1], Number(match![2])]))
  if (get("density") === "compact") view.density = "compact"
  const filterPrefix = `${name("f")}.`
  const filters = [...params.entries()].flatMap(([key, text]) => {
    if (!key.startsWith(filterPrefix)) return []
    try {
      return [{ id: key.slice(filterPrefix.length), value: filterValue(text) }]
    } catch {
      return []
    }
  })
  if (filters.length) view.columnFilters = filters
  try {
    const adv = get("adv")
    if (adv) view.advancedFilter = JSON.parse(adv)
  } catch {
    // A broken link keeps the rest of its view.
  }
  return view
}

type UrlStateOptions = {
  /** Names the params `<prefix>.q`, `<prefix>.sort`…: for two tables on one page. */
  prefix?: string
  /** The table's `pageSize`, so the URL only says `size` when it differs. 10 by default. */
  pageSize?: number
  /** `replace` (default) keeps one history entry per page; `push` adds one per change, so Back undoes it. */
  history?: "replace" | "push"
}

/**
 * Keeps a `DataTable`'s view in the URL, so a link opens the same search, sort, page, columns and filters, and
 * Back and Forward move through them. Pass the result as `view` and the setter as `onViewChange`:
 *
 *   const [view, setView] = useDataTableUrlState({ prefix: "informes" })
 *   <DataTable view={view} onViewChange={setView} … />
 *
 * Works with any router that leaves `history.replaceState` alone (Vite apps, Next.js App Router); a router that
 * owns the URL can call `viewToSearchParams` and `searchParamsToView` itself.
 */
function useDataTableUrlState({ prefix, pageSize = 10, history = "replace" }: UrlStateOptions = {}) {
  // Every slice, so a link without a filter clears the filter instead of keeping the one on screen.
  const read = React.useCallback(
    (): DataTableView => ({
      sorting: [],
      globalFilter: "",
      columnFilters: [],
      columnVisibility: {},
      columnOrder: [],
      columnPinning: { start: [], end: [] },
      columnSizing: {},
      pagination: { pageIndex: 0, pageSize },
      density: "normal",
      advancedFilter: undefined,
      ...(typeof window === "undefined"
        ? {}
        : searchParamsToView(new URLSearchParams(window.location.search), prefix, pageSize)),
    }),
    [prefix, pageSize]
  )
  const [view, setLocalView] = React.useState<DataTableView>(read)

  React.useEffect(() => {
    const sync = () => setLocalView(read())
    window.addEventListener("popstate", sync)
    return () => window.removeEventListener("popstate", sync)
  }, [read])

  const setView = React.useCallback(
    (next: DataTableView) => {
      setLocalView(next)
      const params = viewToSearchParams(next, new URLSearchParams(window.location.search), prefix, pageSize)
      const search = params.toString()
      const url = `${window.location.pathname}${search ? `?${search}` : ""}${window.location.hash}`
      if (url === `${window.location.pathname}${window.location.search}${window.location.hash}`) return
      window.history[history === "push" ? "pushState" : "replaceState"](window.history.state, "", url)
    },
    [prefix, pageSize, history]
  )

  return [view, setView] as const
}

export { searchParamsToView, useDataTableUrlState, viewToSearchParams, type UrlStateOptions }
