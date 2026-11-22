// registry: auradata (a data table on TanStack Table: sort, filter, column visibility and pagination in Spanish, a loading state, a sideways scroll on narrow screens, optional row selection with a floating bar of bulk actions, a toolbar with filter and action slots, compact rows, columns to pin, move and resize, filters per column (values with their counts, number ranges, periods) and chips, and a view state to control or share)
import * as React from "react"
import {
  columnFacetingFeature,
  columnFilteringFeature,
  columnOrderingFeature,
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_includesString,
  FlexRender,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
  useTable,
  type CellData,
  type Column,
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnOrderState,
  type ColumnPinningState,
  type ColumnSizingState,
  type ColumnVisibilityState,
  type FilterFn,
  type Header,
  type Table as TanStackTable,
  type OnChangeFn,
  type PaginationState,
  type RowData,
  type RowSelectionState,
  type SortingState,
  type TableFeatures,
} from "@tanstack/react-table"
import {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  Columns3Icon,
  EllipsisIcon,
  EyeOffIcon,
  PinIcon,
  PinOffIcon,
  Rows4Icon,
  SearchIcon,
} from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableSelectionBar } from "@/components/ui/data-table-selection-bar"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DateRangeFilter } from "@/components/ui/date-range-filter"
import { FacetedFilter, type FacetedFilterOption } from "@/components/ui/faceted-filter"
import { FilterChips } from "@/components/ui/filter-chips"
import { Input } from "@/components/ui/input"
import { RangeFilter, type NumberRange } from "@/components/ui/range-filter"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Toggle } from "@/components/ui/toggle"
import { formatDate, formatNumber } from "@/lib/format"

/** Keeps the rows whose value is one of the chosen ones (a `select` filter); no choice keeps every row. */
// A filter function serves any table, as the stock ones (`CreatedFilterFn<any, any>`).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const filterFn_inSet: FilterFn<any, any> = (row, columnId, chosen: string[]) =>
  chosen.includes(String(row.getValue(columnId)))
filterFn_inSet.autoRemove = (chosen?: string[]) => !chosen?.length

/** Keeps the rows whose number is between the two ends, both included (a `range` filter). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const filterFn_inRange: FilterFn<any, any> = (row, columnId, [low, high]: NumberRange) => {
  const value = Number(row.getValue(columnId))
  return value >= low && value <= high
}
filterFn_inRange.autoRemove = (range?: NumberRange) => !range

type DayRange = { from: Date | undefined; to?: Date }

/** A day from a `Date`, a timestamp or a `YYYY-MM-DD` string (that local day, not UTC midnight). */
function dayOf(value: unknown) {
  const match = typeof value === "string" ? /^(\d{4})-(\d{2})-(\d{2})$/.exec(value) : null
  const date = match ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])) : new Date(value as string)
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
}

/** Keeps the rows whose day falls in the period, both ends included (a `date` filter). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const filterFn_inPeriod: FilterFn<any, any> = (row, columnId, { from, to }: DayRange) => {
  const day = dayOf(row.getValue(columnId))
  return (!from || day >= dayOf(from)) && (!to || day <= dayOf(to))
}
filterFn_inPeriod.autoRemove = (period?: DayRange) => !period?.from && !period?.to

/** What every data table does in the browser: sort, filter, size, pin, order and hide columns, select rows and paginate. */
const dataTableFeatures = tableFeatures({
  columnFacetingFeature,
  columnFilteringFeature,
  columnOrderingFeature,
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  facetedRowModel: createFacetedRowModel(),
  facetedUniqueValues: createFacetedUniqueValues(),
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filterFns: {
    includesString: filterFn_includesString,
    inSet: filterFn_inSet,
    inRange: filterFn_inRange,
    inPeriod: filterFn_inPeriod,
  },
  sortFns,
})

/**
 * A filter a column offers in the toolbar, named by `title` or the column's header:
 * - `select`: a `FacetedFilter` with the column's values and their counts (or the `options` given, to name them);
 * - `range`: a `RangeFilter` over the column's numbers (or `min`/`max`), written with `format`;
 * - `date`: a `DateRangeFilter` over the column's days (`Date`, timestamp or `YYYY-MM-DD`); `today` fixes its presets.
 */
type DataTableColumnFilter =
  | { type: "select"; title?: string; options?: FacetedFilterOption[] }
  | { type: "range"; title?: string; min?: number; max?: number; step?: number; format?: (value: number) => string }
  | { type: "date"; title?: string; today?: Date }

const FILTER_FNS = { select: "inSet", range: "inRange", date: "inPeriod" } as const

declare module "@tanstack/table-core" {
  // The data table reads `meta.filter` from a column; the type parameters must match TanStack's declaration.
  /* eslint-disable @typescript-eslint/no-unused-vars */
  interface ColumnMeta<
    in out TFeatures extends TableFeatures,
    in out TData extends RowData,
    TValue extends CellData = CellData,
  > {
    filter?: DataTableColumnFilter
  }
  /* eslint-enable @typescript-eslint/no-unused-vars */
}

/** A column of a `DataTable`: a TanStack v9 `ColumnDef` with the data table features. */
// TanStack types each column's value separately; a table mixes them.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DataTableColumn<TData extends RowData, TValue = any> = ColumnDef<typeof dataTableFeatures, TData, TValue>

type DataTableProps<TData extends RowData> = Omit<React.ComponentProps<"div">, "children"> & {
  columns: DataTableColumn<TData>[]
  data: TData[]
  /** The placeholder and accessible name of the text filter. Pass `null` to hide the filter. */
  filterPlaceholder?: string | null
  /** What an empty table, or a filter with no match, says. */
  emptyMessage?: React.ReactNode
  pageSize?: number
  pageSizeOptions?: number[]
  /** Open the column menu on mount, for its story and visual test. */
  defaultColumnsOpen?: boolean
  /** The rows are loading: skeleton rows for a full page, the table region `aria-busy`, the pager disabled. */
  loading?: boolean
  /** A checkbox on each row and one in the header for the page. The selection outlives sorting, filtering and pages. */
  selectable?: boolean
  /** A stable id per row (its key in `rowSelection`); the index by default. */
  getRowId?: (row: TData, index: number) => string
  /** The row's name in its checkbox label: «Seleccionar «Ventas por región»». «Seleccionar fila» without it. */
  rowLabel?: (row: TData) => string
  /** The selected rows, controlled. Use `defaultRowSelection` to only start with some. */
  rowSelection?: RowSelectionState
  defaultRowSelection?: RowSelectionState
  onRowSelectionChange?: (selection: RowSelectionState) => void
  /** The actions of the floating bar while rows are selected; `clear` empties the selection. */
  bulkActions?: (selected: TData[], clear: () => void) => React.ReactNode
  /** Filters beside the search, in the toolbar: a `DateRangeFilter`, the filter system's popovers. */
  filters?: React.ReactNode
  /** The page's own actions at the end of the toolbar («Nuevo informe»). */
  actions?: React.ReactNode
  /** A «Filas compactas» switch in the toolbar. */
  densityToggle?: boolean
  /** A menu on each header: sort, pin to a side, move one place, hide. */
  columnActions?: boolean
  /** A handle on each header's right edge: drag it, or focus it and use the arrow keys, to change the width. */
  resizableColumns?: boolean
  /**
   * How the table is shown (sort, search, columns, page, density), for a URL or a saved view. Any slice given
   * here is controlled; `defaultView` only sets where the others start. `onViewChange` hears every change.
   */
  view?: Partial<DataTableView>
  defaultView?: Partial<DataTableView>
  onViewChange?: (view: DataTableView) => void
}

/** `normal`: 40 px header and rows of 8 px padding; `compact`: 32 px header and 4 px. */
type DataTableDensity = "normal" | "compact"

/** What a person changes in how a table looks, without changing its data. Row selection is not part of it. */
type DataTableView = {
  sorting: SortingState
  globalFilter: string
  /** The filters of the columns with `meta.filter`: `{ id, value }`, a `select` value being the chosen values. */
  columnFilters: ColumnFiltersState
  columnVisibility: ColumnVisibilityState
  /** Column ids in display order; empty keeps the order of `columns`. */
  columnOrder: ColumnOrderState
  columnPinning: ColumnPinningState
  /** Widths in px by column id, over each column's `size`. */
  columnSizing: ColumnSizingState
  pagination: PaginationState
  density: DataTableDensity
}

/**
 * The view state: each slice the parent passes is controlled, the rest lives here. Several slices can change
 * in one event (a search also goes back to the first page), so every change builds on the latest one.
 */
function useView(value: Partial<DataTableView> | undefined, initial: DataTableView, onChange?: (view: DataTableView) => void) {
  const [local, setLocal] = React.useState(initial)
  const current: DataTableView = value ? { ...local, ...value } : local
  const latest = React.useRef(current)
  React.useLayoutEffect(() => {
    latest.current = current
  })
  function setSlice<K extends keyof DataTableView>(key: K): OnChangeFn<DataTableView[K]> {
    return (updater) => {
      const previous = latest.current
      const slice =
        typeof updater === "function"
          ? (updater as (old: DataTableView[K]) => DataTableView[K])(previous[key])
          : updater
      const next = { ...previous, [key]: slice }
      latest.current = next
      setLocal(next)
      onChange?.(next)
    }
  }
  return [current, setSlice] as const
}

/** A value its parent may control: the prop when given, else local state; either way `onChange` hears it. */
function useControllable<T>(value: T | undefined, defaultValue: T, onChange?: (value: T) => void) {
  const [local, setLocal] = React.useState(defaultValue)
  const current = value === undefined ? local : value
  const set: OnChangeFn<T> = (updater) => {
    const next = typeof updater === "function" ? (updater as (old: T) => T)(current) : updater
    if (value === undefined) setLocal(next)
    onChange?.(next)
  }
  return [current, set] as const
}

type MoreColumns = "none" | "start" | "end" | "both"

/**
 * Which sides of a sideways-scrolling table hide columns, kept up to date on scroll and resize.
 * The ref goes on an element that holds the table's own scroll container.
 */
function useMoreColumns() {
  const ref = React.useRef<HTMLDivElement>(null)
  const [more, setMore] = React.useState<MoreColumns>("none")
  React.useEffect(() => {
    const scroller = ref.current?.querySelector<HTMLElement>("[data-slot=table-container]")
    if (!scroller) return
    const update = () => {
      const start = scroller.scrollLeft > 1
      const end = scroller.scrollLeft + scroller.clientWidth < scroller.scrollWidth - 1
      setMore(start && end ? "both" : start ? "start" : end ? "end" : "none")
    }
    update()
    scroller.addEventListener("scroll", update, { passive: true })
    const observer = new ResizeObserver(update)
    observer.observe(scroller)
    if (scroller.firstElementChild) observer.observe(scroller.firstElementChild)
    return () => {
      scroller.removeEventListener("scroll", update)
      observer.disconnect()
    }
  }, [])
  return [ref, more] as const
}

/** The name of a column in the column menu: its string header, else its id. */
function columnLabel(header: unknown, id: string) {
  return typeof header === "string" ? header : id
}

type DataTableInstance<TData extends RowData> = TanStackTable<typeof dataTableFeatures, TData>
type DataTableColumnInstance<TData extends RowData> = Column<typeof dataTableFeatures, TData, unknown>

/**
 * A pinned header or cell sticks to its side over an opaque background that still shows the row's hover and
 * selected tints, with a hairline on the edge facing the columns that scroll under it.
 */
function pinnedProps<TData extends RowData>(column: DataTableColumnInstance<TData>) {
  const pinned = column.getIsPinned()
  if (!pinned) return {}
  return {
    "data-pinned": pinned,
    style: pinned === "start" ? { left: column.getStart("start") } : { right: column.getAfter("end") },
    className: cn(
      "sticky z-[1] bg-background in-[tr:hover]:bg-[color-mix(in_oklab,var(--muted)_50%,var(--background))] in-data-[state=selected]:bg-muted",
      pinned === "start" && column.getIsLastColumn("start") && "border-r",
      pinned === "end" && column.getIsFirstColumn("end") && "border-l"
    ),
  }
}

/** Moves a column one place among the visible columns on its side (pinned start, center, pinned end). */
function neighborOf<TData extends RowData>(
  table: DataTableInstance<TData>,
  column: DataTableColumnInstance<TData>,
  step: -1 | 1
): DataTableColumnInstance<TData> | undefined {
  const side = table.getPinnedVisibleLeafColumns(column.getIsPinned() || "center")
  return side[side.findIndex((other) => other.id === column.id) + step]
}

function moveColumn<TData extends RowData>(table: DataTableInstance<TData>, column: DataTableColumnInstance<TData>, step: -1 | 1) {
  const neighbor = neighborOf(table, column, step)
  if (!neighbor) return
  table.setColumnOrder((order) => {
    const ids = [...order, ...table.getAllLeafColumns().map((other) => other.id).filter((id) => !order.includes(id))]
    const from = ids.indexOf(column.id)
    const to = ids.indexOf(neighbor.id)
    ;[ids[from], ids[to]] = [ids[to], ids[from]]
    return ids
  })
}

const RESIZE_STEP = 16

/** A header cell: the sort button, the column menu and the width handle, each when the table asks for it. */
function DataTableHead<TData extends RowData>({
  header,
  table,
  sized,
  columnActions,
  resizable,
}: {
  header: Header<typeof dataTableFeatures, TData, unknown>
  table: DataTableInstance<TData>
  sized: boolean
  columnActions: boolean
  resizable: boolean
}) {
  const column = header.column
  const sorted = column.getIsSorted()
  const canSort = column.getCanSort()
  const label = columnLabel(column.columnDef.header, column.id)
  const content = header.isPlaceholder ? null : <FlexRender header={header} />
  const SortIcon = sorted === "asc" ? ArrowUpIcon : sorted === "desc" ? ArrowDownIcon : ArrowUpDownIcon
  const pinned = column.getIsPinned()
  const { className: pinnedClassName, style: pinnedStyle, ...pinnedData } = pinnedProps(column)
  const menu = columnActions && !header.isPlaceholder && column.id !== "select"
  const size = header.getSize()
  const { minSize = 64, maxSize = 640 } = column.columnDef

  // The label in the cells' size, its text on the cells' text: the negative margin takes back the button's
  // padding and 1px border.
  const title =
    canSort && !header.isPlaceholder ? (
      <Button variant="ghost" size="sm" className="-ml-2.75 text-sm" onClick={column.getToggleSortingHandler()}>
        {content}
        <SortIcon data-icon="inline-end" aria-hidden className={cn(!sorted && "text-muted-foreground")} />
      </Button>
    ) : (
      content
    )

  return (
    <TableHead
      {...pinnedData}
      className={cn(resizable && "relative", pinnedClassName)}
      style={{ ...(sized ? { width: size } : {}), ...pinnedStyle }}
      aria-sort={canSort ? (sorted === "asc" ? "ascending" : sorted === "desc" ? "descending" : "none") : undefined}
    >
      {menu ? (
        <div className="flex min-w-0 items-center justify-between gap-1">
          {title}
          <DropdownMenu>
            {/* Faint until the header is hovered or focused; always shown on touch screens, which cannot hover. */}
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-xs"
                  className="shrink-0 text-muted-foreground opacity-0 group-hover/head:opacity-100 focus-visible:opacity-100 aria-expanded:opacity-100 pointer-coarse:opacity-100 [th:hover_&]:opacity-100"
                  aria-label={`Opciones de la columna «${label}»`}
                />
              }
            >
              <EllipsisIcon aria-hidden />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              {canSort && (
                <>
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
                      <ArrowUpIcon aria-hidden />
                      Orden ascendente
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
                      <ArrowDownIcon aria-hidden />
                      Orden descendente
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuGroup>
                {pinned ? (
                  <DropdownMenuItem onClick={() => column.pin(false)}>
                    <PinOffIcon aria-hidden />
                    Desfijar
                  </DropdownMenuItem>
                ) : (
                  <>
                    <DropdownMenuItem onClick={() => column.pin("start")}>
                      <PinIcon aria-hidden />
                      Fijar a la izquierda
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => column.pin("end")}>
                      <PinIcon aria-hidden />
                      Fijar a la derecha
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuItem disabled={!neighborOf(table, column, -1)} onClick={() => moveColumn(table, column, -1)}>
                  <ArrowLeftIcon aria-hidden />
                  Mover a la izquierda
                </DropdownMenuItem>
                <DropdownMenuItem disabled={!neighborOf(table, column, 1)} onClick={() => moveColumn(table, column, 1)}>
                  <ArrowRightIcon aria-hidden />
                  Mover a la derecha
                </DropdownMenuItem>
              </DropdownMenuGroup>
              {column.getCanHide() && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
                    <EyeOffIcon aria-hidden />
                    Ocultar columna
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        title
      )}
      {resizable && column.getCanResize() && (
        // A window splitter: a focusable separator with a value, so the arrow keys resize it too.
        <div
          role="separator"
          aria-orientation="vertical"
          aria-label={`Ancho de la columna «${label}»`}
          aria-valuenow={size}
          aria-valuemin={minSize}
          aria-valuemax={maxSize}
          tabIndex={0}
          data-resizing={column.getIsResizing() || undefined}
          onMouseDown={header.getResizeHandler()}
          onTouchStart={header.getResizeHandler()}
          onDoubleClick={() => column.resetSize()}
          onKeyDown={(event) => {
            const step = event.key === "ArrowRight" ? RESIZE_STEP : event.key === "ArrowLeft" ? -RESIZE_STEP : 0
            if (!step) return
            event.preventDefault()
            const width = Math.min(maxSize, Math.max(minSize, size + step))
            table.setColumnSizing((sizing) => ({ ...sizing, [column.id]: width }))
          }}
          className="absolute inset-y-0 -right-1.5 z-[2] w-3 cursor-col-resize touch-none outline-offset-[-2px] select-none after:absolute after:inset-y-2 after:left-1/2 after:w-px after:-translate-x-1/2 after:bg-border hover:after:w-0.5 hover:after:bg-primary focus-visible:after:w-0.5 focus-visible:after:bg-primary data-resizing:after:w-0.5 data-resizing:after:bg-primary"
        />
      )}
    </TableHead>
  )
}

/**
 * A table of records with sortable headers, a text filter over every column, a column menu and pages.
 * Columns are TanStack `ColumnDef`s; give each a string `header` so the column menu can name it. Give the
 * columns a `size` (px) and they keep their widths across pages, sorting, loading and the empty state (a
 * column without one takes 150 px); the table then scrolls sideways when they add up to more than its box.
 *
 * Everything else is opt-in: row selection and bulk actions, toolbar slots and density, header menus to pin,
 * move and hide columns, resizable widths, and a `view` to control or keep (a URL, a saved view).
 */
function DataTable<TData extends RowData>({
  columns,
  data,
  filterPlaceholder = "Buscar…",
  emptyMessage = "Sin resultados",
  pageSize = 10,
  pageSizeOptions = [10, 20, 50],
  defaultColumnsOpen,
  loading = false,
  selectable = false,
  getRowId,
  rowLabel,
  rowSelection: rowSelectionProp,
  defaultRowSelection = {},
  onRowSelectionChange,
  bulkActions,
  filters,
  actions,
  densityToggle = false,
  columnActions = false,
  resizableColumns = false,
  view: viewProp,
  defaultView,
  onViewChange,
  className,
  ...props
}: DataTableProps<TData>) {
  const pageSizeLabel = React.useId()
  const [regionRef, more] = useMoreColumns()
  const [view, setView] = useView(
    viewProp,
    {
      sorting: [],
      globalFilter: "",
      columnFilters: [],
      columnVisibility: {},
      columnOrder: [],
      columnPinning: { start: [], end: [] },
      columnSizing: {},
      pagination: { pageIndex: 0, pageSize },
      density: "normal",
      ...defaultView,
    },
    onViewChange
  )
  const [rowSelection, setRowSelection] = useControllable(rowSelectionProp, defaultRowSelection, onRowSelectionChange)

  // A column filter needs its filter function; a column's own `filterFn` wins.
  const withFilterFns = React.useMemo(
    () =>
      columns.map((column) =>
        column.meta?.filter && !column.filterFn ? { ...column, filterFn: FILTER_FNS[column.meta.filter.type] } : column
      ),
    [columns]
  )
  const allColumns = React.useMemo<DataTableColumn<TData>[]>(
    () =>
      selectable
        ? [
            {
              id: "select",
              size: 44,
              enableSorting: false,
              enableHiding: false,
              enableResizing: false,
              header: ({ table }) => (
                <Checkbox
                  data-select-all=""
                  checked={table.getIsAllPageRowsSelected()}
                  indeterminate={table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()}
                  onCheckedChange={(checked) => table.toggleAllPageRowsSelected(checked)}
                  aria-label="Seleccionar todas las filas de la página"
                />
              ),
              cell: ({ row }) => (
                <Checkbox
                  checked={row.getIsSelected()}
                  disabled={!row.getCanSelect()}
                  onCheckedChange={(checked) => row.toggleSelected(checked)}
                  aria-label={rowLabel ? `Seleccionar «${rowLabel(row.original)}»` : "Seleccionar fila"}
                />
              ),
            },
            ...withFilterFns,
          ]
        : withFilterFns,
    [withFilterFns, selectable, rowLabel]
  )

  // With columns pinned to the start, the checkbox column sticks with them, first.
  const { start: pinnedStart = [], end: pinnedEnd = [] } = view.columnPinning
  const columnPinning =
    selectable && pinnedStart.some((id) => id !== "select")
      ? { start: ["select", ...pinnedStart.filter((id) => id !== "select")], end: pinnedEnd }
      : view.columnPinning

  const table = useTable({
    features: dataTableFeatures,
    data,
    columns: allColumns,
    getRowId,
    enableRowSelection: selectable,
    enableColumnResizing: resizableColumns,
    columnResizeMode: "onChange",
    state: {
      sorting: view.sorting,
      globalFilter: view.globalFilter,
      columnFilters: view.columnFilters,
      columnVisibility: view.columnVisibility,
      columnOrder: view.columnOrder,
      columnPinning,
      columnSizing: view.columnSizing,
      pagination: view.pagination,
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
    onSortingChange: setView("sorting"),
    onGlobalFilterChange: setView("globalFilter"),
    onColumnFiltersChange: setView("columnFilters"),
    onColumnVisibilityChange: setView("columnVisibility"),
    onColumnOrderChange: setView("columnOrder"),
    onColumnPinningChange: setView("columnPinning"),
    onColumnSizingChange: setView("columnSizing"),
    onPaginationChange: setView("pagination"),
  })

  const density = view.density
  const rows = table.getRowModel().rows
  // Sized columns: a fixed layout, so the widths come from the sizes and never from the page's content. Pinned
  // columns stick at offsets that add up those sizes, and a resized column needs one too.
  const pinnedAny = pinnedStart.length > 0 || pinnedEnd.length > 0
  const sized = columns.some((column) => column.size !== undefined) || resizableColumns || columnActions || pinnedAny
  // With resizable widths, a last empty column takes what is left, so every width is exactly what was set.
  const filler = resizableColumns
  const visibleColumns = table.getVisibleLeafColumns()
  const pageCount = Math.max(table.getPageCount(), 1)
  const hideable = table.getAllLeafColumns().filter((column) => column.getCanHide())
  const filterable = table.getAllLeafColumns().filter((column) => column.columnDef.meta?.filter)
  type FilterColumn = (typeof filterable)[number]
  const optionsOf = (column: FilterColumn): FacetedFilterOption[] => {
    // Keyed by text, as the filter compares values: a number column counts under "12".
    const counts = new Map([...column.getFacetedUniqueValues()].map(([value, count]) => [String(value), count]))
    const filter = column.columnDef.meta?.filter
    if (filter?.type === "select" && filter.options)
      return filter.options.map((option) => ({ ...option, count: option.count ?? counts.get(option.value) ?? 0 }))
    // Every value of the column stays listed, with 0 when the other filters leave none, so the list never jumps.
    const values = new Set(table.getCoreRowModel().rows.map((row) => String(row.getValue(column.id))))
    return [...values]
      .sort((a, b) => a.localeCompare(b, "es"))
      .map((value) => ({ value, count: counts.get(value) ?? 0 }))
  }
  /** The span of a range filter: its `min`/`max`, else the column's numbers over every row, so it never shrinks. */
  const spanOf = (column: FilterColumn): NumberRange => {
    const filter = column.columnDef.meta?.filter
    const numbers = table.getCoreRowModel().rows.map((row) => Number(row.getValue(column.id)))
    const given = filter?.type === "range" ? filter : undefined
    return [given?.min ?? Math.min(...numbers), given?.max ?? Math.max(...numbers)]
  }
  const formatOf = (column: FilterColumn) => {
    const filter = column.columnDef.meta?.filter
    return (filter?.type === "range" && filter.format) || ((value: number) => formatNumber(value))
  }
  const titleOf = (column: FilterColumn) =>
    column.columnDef.meta?.filter?.title ?? columnLabel(column.columnDef.header, column.id)
  /** A filter as people read it, for its chip: «Norte, Bajío», «$10,000 – $250,000», «1 nov 2026 – 21 nov 2026». */
  const describe = (column: FilterColumn, value: unknown): string | null => {
    const type = column.columnDef.meta?.filter?.type
    if (type === "range" && Array.isArray(value)) return `${formatOf(column)(value[0])} – ${formatOf(column)(value[1])}`
    if (type === "date" && value && typeof value === "object") {
      const { from, to } = value as DayRange
      if (!from) return null
      return to && dayOf(to) !== dayOf(from) ? `${formatDate(from)} – ${formatDate(to)}` : formatDate(from)
    }
    if (Array.isArray(value) && value.length) {
      const options = optionsOf(column)
      return value.map((v: string) => options.find((option) => option.value === v)?.label ?? v).join(", ")
    }
    return null
  }
  const chips = view.columnFilters.flatMap(({ id, value }) => {
    const column = table.getColumn(id)
    const text = column ? describe(column, value) : null
    return column && text ? [{ id, label: titleOf(column), value: text }] : []
  })
  const filterOf = (column: FilterColumn) => {
    const filter = column.columnDef.meta?.filter
    const title = titleOf(column)
    if (filter?.type === "range") {
      const [min, max] = spanOf(column)
      return (
        <RangeFilter
          key={column.id}
          title={title}
          min={min}
          max={max}
          step={filter.step}
          format={formatOf(column)}
          value={(column.getFilterValue() as NumberRange | undefined) ?? null}
          onValueChange={(range) => column.setFilterValue(range)}
        />
      )
    }
    if (filter?.type === "date")
      return (
        <DateRangeFilter
          key={column.id}
          placeholder={title}
          today={filter.today}
          className="border-dashed"
          // An empty range, not `undefined`: the filter stays controlled, so a removed chip empties it too.
          value={(column.getFilterValue() as DayRange | undefined) ?? { from: undefined }}
          onValueChange={(period) => column.setFilterValue(period?.from ? period : undefined)}
        />
      )
    return (
      <FacetedFilter
        key={column.id}
        title={title}
        options={optionsOf(column)}
        value={(column.getFilterValue() as string[] | undefined) ?? []}
        onValueChange={(chosen) => column.setFilterValue(chosen.length ? chosen : undefined)}
      />
    )
  }
  const selectedRows = bulkActions ? table.getSelectedRowModel().rows.map((row) => row.original) : []
  const clearSelection = () => {
    // The bar is about to go: when it has the focus, the header checkbox takes it, so the keyboard stays in the table.
    const focused = document.activeElement
    if (focused?.closest("[data-slot=data-table-selection-bar]"))
      focused.closest("[data-slot=data-table]")?.querySelector<HTMLElement>("[data-select-all]")?.focus()
    table.resetRowSelection(true)
  }

  return (
    <div data-slot="data-table" data-row-density={density} className={cn("grid gap-3", className)} {...props}>
      {/* The search shrinks first (down to 160 px), then the filters and buttons wrap onto a second line. */}
      <div data-slot="data-table-toolbar" className="flex flex-wrap items-center gap-2">
        {filterPlaceholder !== null && (
          <div className="relative max-w-xs min-w-0 flex-1 basis-40">
            <SearchIcon
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              type="search"
              value={view.globalFilter}
              onChange={(event) => table.setGlobalFilter(event.target.value)}
              placeholder={filterPlaceholder}
              aria-label={filterPlaceholder}
              className="pl-8"
            />
          </div>
        )}
        {/* On a phone the filters take their own line under the search and the buttons; beside them from `sm`. */}
        {(filterable.length > 0 || filters) && (
          <div className="order-last flex basis-full flex-wrap items-center gap-2 sm:order-none sm:basis-auto">
            {filterable.map(filterOf)}
            {filters}
          </div>
        )}
        <div className="ml-auto flex items-center gap-2">
          {densityToggle && (
            <Toggle
              variant="outline"
              pressed={density === "compact"}
              onPressedChange={(pressed) => setView("density")(pressed ? "compact" : "normal")}
              aria-label="Filas compactas"
              title="Filas compactas"
            >
              <Rows4Icon aria-hidden />
            </Toggle>
          )}
          {hideable.length > 0 && (
            <DropdownMenu defaultOpen={defaultColumnsOpen}>
              <DropdownMenuTrigger render={<Button variant="outline" />}>
                <Columns3Icon data-icon="inline-start" />
                Columnas
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Columnas visibles</DropdownMenuLabel>
                  {hideable.map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      checked={column.getIsVisible()}
                      onCheckedChange={(checked) => column.toggleVisibility(checked)}
                    >
                      {columnLabel(column.columnDef.header, column.id)}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {actions}
        </div>
      </div>

      <FilterChips
        chips={chips}
        onRemove={(id) => table.getColumn(id)?.setFilterValue(undefined)}
        onClearAll={() => table.resetColumnFilters(true)}
      />

      {/* On a narrow screen the table scrolls sideways inside its border; a fade marks the side with more columns. */}
      <div
        ref={regionRef}
        data-slot="data-table-region"
        data-more={more}
        aria-busy={loading || undefined}
        className="@container relative overflow-hidden rounded-lg border"
      >
        {/* The fades sit beside the pinned columns, over the ones that scroll. */}
        <div
          aria-hidden
          style={{ left: table.getStartTotalSize() }}
          className={cn(
            "pointer-events-none absolute inset-y-0 z-10 w-8 bg-linear-to-r from-background to-transparent transition-opacity",
            more === "start" || more === "both" ? "opacity-100" : "opacity-0"
          )}
        />
        <div
          aria-hidden
          style={{ right: table.getEndTotalSize() }}
          className={cn(
            "pointer-events-none absolute inset-y-0 z-10 w-8 bg-linear-to-l from-background to-transparent transition-opacity",
            more === "end" || more === "both" ? "opacity-100" : "opacity-0"
          )}
        />
        {/* The first and last columns sit 16px inside the rounded border, not 8px; the empty message's
            single spanning cell keeps no padding, so it centers in the visible table. */}
        <Table
          className={cn(
            "[&_td:first-child:not([colspan])]:pl-4 [&_td:last-child:not([colspan])]:pr-4 [&_th:first-child]:pl-4 [&_th:last-child]:pr-4",
            sized && "table-fixed [&_td]:truncate",
            density === "compact" && "[&_td]:py-1 [&_th]:h-8"
          )}
        >
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <DataTableHead
                    key={header.id}
                    header={header}
                    table={table}
                    sized={sized}
                    columnActions={columnActions}
                    resizable={resizableColumns}
                  />
                ))}
                {filler && <TableHead aria-hidden className="p-0" />}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: view.pagination.pageSize }, (_, index) => (
                <TableRow key={index}>
                  {visibleColumns.map((column) => {
                    const { className: pinnedClassName, ...pinned } = pinnedProps(column)
                    return (
                      <TableCell key={column.id} {...pinned} className={pinnedClassName}>
                        <Skeleton aria-hidden className="h-5 w-full min-w-16" />
                      </TableCell>
                    )
                  })}
                  {filler && <TableCell aria-hidden className="p-0" />}
                </TableRow>
              ))
            ) : rows.length ? (
              rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() ? "selected" : undefined}>
                  {row.getVisibleCells().map((cell) => {
                    const { className: pinnedClassName, ...pinned } = pinnedProps(cell.column)
                    return (
                      <TableCell key={cell.id} {...pinned} className={pinnedClassName}>
                        <FlexRender cell={cell} />
                      </TableCell>
                    )
                  })}
                  {filler && <TableCell aria-hidden className="p-0" />}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={visibleColumns.length + (filler ? 1 : 0) || 1} className="p-0">
                  {/* As wide as the visible table and stuck to its left edge: on a phone the headers scroll
                      sideways, but the message stays centered in view instead of across every column. */}
                  <div className="sticky left-0 flex min-h-24 w-[100cqw] items-center justify-center px-4 py-6 text-center text-balance whitespace-normal text-muted-foreground">
                    {emptyMessage}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-sm sm:justify-end">
        <div className="flex items-center gap-2">
          <span id={pageSizeLabel} className="text-muted-foreground">
            Filas por página
          </span>
          <Select
            items={pageSizeOptions.map((size) => ({ value: size, label: String(size) }))}
            value={view.pagination.pageSize}
            onValueChange={(size) => table.setPageSize(Number(size))}
            disabled={loading}
          >
            <SelectTrigger size="sm" aria-labelledby={pageSizeLabel}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={size}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <span className={cn("tabular-nums", loading && "text-muted-foreground")} aria-live="polite">
          Página {view.pagination.pageIndex + 1} de {pageCount}
        </span>
        {/* When the pager wraps on a phone, the buttons keep to the right. */}
        <div className="ml-auto flex items-center gap-2 sm:ml-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={loading || !table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={loading || !table.getCanNextPage()}>
            Siguiente
          </Button>
        </div>
      </div>

      {bulkActions && (
        <DataTableSelectionBar count={selectedRows.length} onClear={clearSelection}>
          {bulkActions(selectedRows, clearSelection)}
        </DataTableSelectionBar>
      )}
    </div>
  )
}

export {
  DataTable,
  dataTableFeatures,
  type DataTableColumn,
  type DataTableDensity,
  type DataTableProps,
  type DataTableView,
}
