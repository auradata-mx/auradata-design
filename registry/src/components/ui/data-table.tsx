// registry: auradata (a data table on TanStack Table: sort, filter, column visibility and pagination in Spanish, a loading state, a sideways scroll on narrow screens, and optional row selection with a floating bar of bulk actions)
import * as React from "react"
import {
  columnFilteringFeature,
  columnSizingFeature,
  columnVisibilityFeature,
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
  type ColumnDef,
  type ColumnVisibilityState,
  type OnChangeFn,
  type PaginationState,
  type RowData,
  type RowSelectionState,
  type SortingState,
} from "@tanstack/react-table"
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon, Columns3Icon, SearchIcon } from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableSelectionBar } from "@/components/ui/data-table-selection-bar"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

/** What every data table does in the browser: sort, filter (global), size and hide columns, select rows and paginate. */
const dataTableFeatures = tableFeatures({
  columnFilteringFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filterFns: { includesString: filterFn_includesString },
  sortFns,
})

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

/**
 * A table of records with sortable headers, a text filter over every column, a column menu and pages.
 * Columns are TanStack `ColumnDef`s; give each a string `header` so the column menu can name it. Give the
 * columns a `size` (px) and they keep their widths across pages, sorting, loading and the empty state (a
 * column without one takes 150 px); the table then scrolls sideways when they add up to more than its box.
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
  className,
  ...props
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [columnVisibility, setColumnVisibility] = React.useState<ColumnVisibilityState>({})
  const [pagination, setPagination] = React.useState<PaginationState>({ pageIndex: 0, pageSize })
  const pageSizeLabel = React.useId()
  const [regionRef, more] = useMoreColumns()
  const [rowSelection, setRowSelection] = useControllable(rowSelectionProp, defaultRowSelection, onRowSelectionChange)

  const allColumns = React.useMemo<DataTableColumn<TData>[]>(
    () =>
      selectable
        ? [
            {
              id: "select",
              size: 44,
              enableSorting: false,
              enableHiding: false,
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
            ...columns,
          ]
        : columns,
    [columns, selectable, rowLabel]
  )

  const table = useTable({
    features: dataTableFeatures,
    data,
    columns: allColumns,
    getRowId,
    enableRowSelection: selectable,
    state: { sorting, globalFilter, columnVisibility, pagination, rowSelection },
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
  })

  const rows = table.getRowModel().rows
  // Sized columns: a fixed layout, so the widths come from the sizes and never from the page's content.
  const sized = columns.some((column) => column.size !== undefined)
  const pageCount = Math.max(table.getPageCount(), 1)
  const hideable = table.getAllLeafColumns().filter((column) => column.getCanHide())
  const selectedRows = bulkActions ? table.getSelectedRowModel().rows.map((row) => row.original) : []
  const clearSelection = () => {
    // The bar is about to go: when it has the focus, the header checkbox takes it, so the keyboard stays in the table.
    const focused = document.activeElement
    if (focused?.closest("[data-slot=data-table-selection-bar]"))
      focused.closest("[data-slot=data-table]")?.querySelector<HTMLElement>("[data-select-all]")?.focus()
    table.resetRowSelection(true)
  }

  return (
    <div data-slot="data-table" className={cn("grid gap-3", className)} {...props}>
      <div className="flex items-center gap-2">
        {filterPlaceholder !== null && (
          <div className="relative w-full max-w-xs">
            <SearchIcon
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              type="search"
              value={globalFilter}
              onChange={(event) => table.setGlobalFilter(event.target.value)}
              placeholder={filterPlaceholder}
              aria-label={filterPlaceholder}
              className="pl-8"
            />
          </div>
        )}
        {hideable.length > 0 && (
          <DropdownMenu defaultOpen={defaultColumnsOpen}>
            <DropdownMenuTrigger render={<Button variant="outline" className="ml-auto" />}>
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
      </div>

      {/* On a narrow screen the table scrolls sideways inside its border; a fade marks the side with more columns. */}
      <div
        ref={regionRef}
        data-slot="data-table-region"
        data-more={more}
        aria-busy={loading || undefined}
        className="@container relative overflow-hidden rounded-lg border"
      >
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-linear-to-r from-background to-transparent transition-opacity",
            more === "start" || more === "both" ? "opacity-100" : "opacity-0"
          )}
        />
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-linear-to-l from-background to-transparent transition-opacity",
            more === "end" || more === "both" ? "opacity-100" : "opacity-0"
          )}
        />
        {/* The first and last columns sit 16px inside the rounded border, not 8px; the empty message's
            single spanning cell keeps no padding, so it centers in the visible table. */}
        <Table
          className={cn(
            "[&_td:first-child:not([colspan])]:pl-4 [&_td:last-child:not([colspan])]:pr-4 [&_th:first-child]:pl-4 [&_th:last-child]:pr-4",
            sized && "table-fixed [&_td]:truncate"
          )}
        >
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const sorted = header.column.getIsSorted()
                  const canSort = header.column.getCanSort()
                  const content = header.isPlaceholder ? null : <FlexRender header={header} />
                  const SortIcon = sorted === "asc" ? ArrowUpIcon : sorted === "desc" ? ArrowDownIcon : ArrowUpDownIcon
                  return (
                    <TableHead
                      key={header.id}
                      style={sized ? { width: header.getSize() } : undefined}
                      aria-sort={
                        canSort ? (sorted === "asc" ? "ascending" : sorted === "desc" ? "descending" : "none") : undefined
                      }
                    >
                      {/* The label in the cells' size, its text on the cells' text: the negative margin takes
                          back the button's padding and 1px border. */}
                      {canSort && !header.isPlaceholder ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="-ml-2.75 text-sm"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {content}
                          <SortIcon
                            data-icon="inline-end"
                            aria-hidden
                            className={cn(!sorted && "text-muted-foreground")}
                          />
                        </Button>
                      ) : (
                        content
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: pagination.pageSize }, (_, index) => (
                <TableRow key={index}>
                  {table.getVisibleLeafColumns().map((column) => (
                    <TableCell key={column.id}>
                      <Skeleton aria-hidden className="h-5 w-full min-w-16" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : rows.length ? (
              rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() ? "selected" : undefined}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      <FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={table.getVisibleLeafColumns().length || 1} className="p-0">
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
            value={pagination.pageSize}
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
          Página {pagination.pageIndex + 1} de {pageCount}
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

export { DataTable, dataTableFeatures, type DataTableColumn, type DataTableProps }
