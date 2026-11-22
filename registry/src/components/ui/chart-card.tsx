// registry: auradata (a chart in a card: title, description, its filter, a menu to export a PNG or view the data, and loading, refreshing, empty and error states)
"use client"

import * as React from "react"
import { ChartNoAxesColumnIcon, DownloadIcon, EllipsisIcon, TableIcon } from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { ErrorState } from "@/components/ui/error-state"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { exportChartPng } from "@/lib/chart-export"
import { formatNumber } from "@/lib/format"

type ChartCardColumn = {
  key: string
  label: React.ReactNode
  /** Writes the value in «Ver datos»; numbers are es-MX by default. */
  format?: (value: unknown) => React.ReactNode
}

type ChartCardProps = Omit<React.ComponentProps<typeof Card>, "title"> & {
  title: React.ReactNode
  description?: React.ReactNode
  /** A control that changes only this chart (its measure, its grouping). Filters of the whole page go above the grid. */
  filter?: React.ReactNode
  /** The rows behind the chart: «Ver datos» shows them as a table. */
  data?: Record<string, unknown>[]
  /** The columns of «Ver datos», in order; every key of the first row otherwise. */
  columns?: ChartCardColumn[]
  /** The PNG's name, without `.png`; from the title otherwise. */
  fileName?: string
  /** The chart's height in pixels: the states take the same, so nothing jumps. */
  height?: number
  /** The first load: a skeleton instead of the chart. */
  loading?: boolean
  /** New data on its way: the last chart stays, dimmed. */
  refreshing?: boolean
  /** Nothing to show for this period or filter. */
  empty?: boolean
  emptyTitle?: React.ReactNode
  emptyDescription?: React.ReactNode
  /** It failed: `true`, or the technical detail for «Detalle técnico». */
  error?: boolean | string
  onRetry?: () => void
}

/** Bar heights of the loading skeleton, in percent: a chart's shape, not a block. */
const SKELETON_BARS = [45, 70, 55, 85, 60, 95, 75, 50]

/** The values of a cell: numbers in es-MX, the rest as text. */
function cellOf(value: unknown, column: ChartCardColumn) {
  if (column.format) return column.format(value)
  if (typeof value === "number") return formatNumber(value)
  return value === null || value === undefined ? "—" : String(value)
}

/** One chart with what a reader needs around it: what it shows, its own filter, its data and its states. */
function ChartCard({
  title,
  description,
  filter,
  data,
  columns,
  fileName,
  height = 256,
  loading = false,
  refreshing = false,
  empty = false,
  emptyTitle = "Sin datos para este periodo",
  emptyDescription = "Prueba con otro rango de fechas o quita algún filtro.",
  error,
  onRetry,
  className,
  children,
  ...props
}: ChartCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null)
  const [dataOpen, setDataOpen] = React.useState(false)
  const failed = error !== undefined && error !== false
  const ready = !loading && !failed && !empty
  const tableColumns = columns ?? Object.keys(data?.[0] ?? {}).map((key) => ({ key, label: key }))
  const titleText = typeof title === "string" ? title : undefined
  const descriptionText = typeof description === "string" ? description : undefined

  function exportPng() {
    if (!cardRef.current) return
    void exportChartPng(cardRef.current, { title: titleText, description: descriptionText, fileName })
  }

  let body: React.ReactNode = children
  if (loading) {
    body = (
      <div aria-hidden className="flex flex-1 items-end justify-around gap-2 border-b pb-px">
        {SKELETON_BARS.map((size, index) => (
          <Skeleton key={index} className="max-w-6 flex-1 rounded-b-none" style={{ height: `${size}%` }} />
        ))}
      </div>
    )
  } else if (failed) {
    body = (
      <ErrorState
        title="No pudimos cargar la gráfica"
        onRetry={onRetry}
        detail={typeof error === "string" ? error : undefined}
        className="flex-1 border-0 p-4 md:p-6"
      />
    )
  } else if (empty) {
    body = (
      <Empty className="flex-1 p-4 md:p-6">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ChartNoAxesColumnIcon aria-hidden />
          </EmptyMedia>
          <EmptyTitle>{emptyTitle}</EmptyTitle>
          {emptyDescription && <EmptyDescription>{emptyDescription}</EmptyDescription>}
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <Card
      ref={cardRef}
      data-slot="chart-card"
      aria-busy={loading || refreshing ? true : undefined}
      className={cn("@container/chart-card", className)}
      {...props}
    >
      {/* Title and menu on the first row; the filter beside them from 28rem, under the title below it. */}
      <div
        data-slot="chart-card-header"
        className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-2 gap-y-3 px-(--card-spacing) @md/chart-card:grid-cols-[minmax(0,1fr)_auto_auto]"
      >
        <div className="col-start-1 row-start-1 grid gap-1">
          <div data-slot="chart-card-title" className="font-heading text-base leading-snug font-medium text-balance">
            {title}
          </div>
          {description && (
            <div data-slot="chart-card-description" className="text-sm text-muted-foreground">
              {description}
            </div>
          )}
        </div>
        {filter && (
          <div
            data-slot="chart-card-filter"
            className="col-span-2 row-start-2 flex min-w-0 items-center gap-2 @md/chart-card:col-span-1 @md/chart-card:col-start-2 @md/chart-card:row-start-1"
          >
            {filter}
          </div>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Opciones de la gráfica"
                className="col-start-2 row-start-1 -me-1.5 @md/chart-card:col-start-3"
              />
            }
          >
            <EllipsisIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem disabled={!ready} onClick={exportPng}>
              <DownloadIcon aria-hidden />
              Exportar PNG
            </DropdownMenuItem>
            {data && (
              <DropdownMenuItem disabled={!ready || data.length === 0} onClick={() => setDataOpen(true)}>
                <TableIcon aria-hidden />
                Ver datos
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div
        data-slot="chart-card-body"
        // The chart fills the body; the states take its height, so the card never jumps.
        className={cn(
          "flex flex-col px-(--card-spacing) transition-opacity *:data-[slot=chart]:aspect-auto *:data-[slot=chart]:size-full motion-reduce:transition-none",
          refreshing && "opacity-50"
        )}
        style={ready || loading ? { height } : { minHeight: height }}
      >
        {body}
      </div>
      {data && (
        <Dialog open={dataOpen} onOpenChange={setDataOpen}>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{description ?? "Los datos de la gráfica."}</DialogDescription>
            </DialogHeader>
            <div className="-mx-4 max-h-[60vh] overflow-auto px-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    {tableColumns.map((column, index) => (
                      <TableHead key={column.key} className={cn(index > 0 && "text-right")}>
                        {column.label}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {tableColumns.map((column, index) => (
                        <TableCell key={column.key} className={cn(index > 0 && "text-right tabular-nums")}>
                          {cellOf(row[column.key], column)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  )
}

export { ChartCard }
export type { ChartCardColumn }
