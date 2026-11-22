// registry: auradata (a data table on TanStack Table: sort, filter, column visibility and pagination in Spanish, a loading state and a sideways scroll on narrow screens)
import * as React from "react"
import {
  columnFilteringFeature,
  columnVisibilityFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_includesString,
  FlexRender,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
  useTable,
  type ColumnDef,
  type ColumnVisibilityState,
  type PaginationState,
  type RowData,
  type SortingState,
} from "@tanstack/react-table"
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon, Columns3Icon, SearchIcon } from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
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

/** What every data table does in the browser: sort, filter (global), hide columns and paginate. */
const dataTableFeatures = tableFeatures({
  columnFilteringFeature,
  columnVisibilityFeature,
  globalFilteringFeature,
  rowPaginationFeature,
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
 * Columns are TanStack `ColumnDef`s; give each a string `header` so the column menu can name it.
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
  className,
  ...props
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [columnVisibility, setColumnVisibility] = React.useState<ColumnVisibilityState>({})
  const [pagination, setPagination] = React.useState<PaginationState>({ pageIndex: 0, pageSize })
  const pageSizeLabel = React.useId()
  const [regionRef, more] = useMoreColumns()

  const table = useTable({
    features: dataTableFeatures,
    data,
    columns,
    state: { sorting, globalFilter, columnVisibility, pagination },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
  })

  const rows = table.getRowModel().rows
  const pageCount = Math.max(table.getPageCount(), 1)
  const hideable = table.getAllLeafColumns().filter((column) => column.getCanHide())

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
        {/* The first and last columns sit 16px inside the rounded border, not 8px. */}
        <Table className="[&_td:first-child]:pl-4 [&_td:last-child]:pr-4 [&_th:first-child]:pl-4 [&_th:last-child]:pr-4">
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
                <TableRow key={row.id}>
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
        <div className="flex items-center gap-2">
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
    </div>
  )
}

export { DataTable, dataTableFeatures, type DataTableColumn, type DataTableProps }
