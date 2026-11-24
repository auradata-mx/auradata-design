// Internal CSV preview used by the File Dropzone import example.
"use client"

import * as React from "react"
import { cn } from "cn"

import { isNumericColumn } from "@/lib/file-upload"
import { formatNumber } from "@/lib/format"
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type MoreColumns = "none" | "start" | "end" | "both"

/** Which sides of the scrolling box hide columns, kept up to date on scroll and resize. */
function useMoreColumns() {
  const ref = React.useRef<HTMLDivElement>(null)
  const [more, setMore] = React.useState<MoreColumns>("none")
  React.useEffect(() => {
    const scroller = ref.current
    if (!scroller) return
    const update = () => {
      const start = scroller.scrollLeft > 1
      const end =
        scroller.scrollLeft + scroller.clientWidth < scroller.scrollWidth - 1
      setMore(start && end ? "both" : start ? "start" : end ? "end" : "none")
    }
    scroller.addEventListener("scroll", update, { passive: true })
    // Fires once on observe, so the first state needs no call of its own.
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

type CsvPreviewProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** The rows to show, the header first (`parseCsv(text, { maxRows: 6 })`). */
  rows: string[][]
  /** Data rows in the whole file, for the caption: «Primeras 5 filas de 1,284». */
  totalRows?: number
  /** Replaces the caption. */
  caption?: React.ReactNode
}

/**
 * What the file holds, before importing it: the header and the first rows. A wide file scrolls sideways inside
 * its box, which takes the keyboard focus so it can be scrolled without a mouse.
 */
function CsvPreview({
  rows,
  totalRows,
  caption,
  className,
  ...props
}: CsvPreviewProps) {
  const captionId = React.useId()
  const [viewportRef, more] = useMoreColumns()
  const [header = [], ...body] = rows
  const columns = Math.max(header.length, ...body.map((row) => row.length))
  const shown = body.length
  // Numbers align right, as in the data table, so their digits line up.
  const numeric = Array.from({ length: columns }, (_, index) =>
    isNumericColumn(body.map((row) => row[index] ?? ""))
  )
  return (
    <div
      data-slot="csv-preview"
      className={cn("flex min-w-0 flex-col gap-2", className)}
      {...props}
    >
      {/* A wide file scrolls sideways inside the border; a fade marks the side with more columns. */}
      <div
        data-slot="csv-preview-box"
        data-more={more}
        className="relative min-w-0 overflow-hidden rounded-xl border bg-card"
      >
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-linear-to-r from-card to-transparent transition-opacity",
            more === "start" || more === "both" ? "opacity-100" : "opacity-0"
          )}
        />
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-linear-to-l from-card to-transparent transition-opacity",
            more === "end" || more === "both" ? "opacity-100" : "opacity-0"
          )}
        />
        {/* A "viewport" slot: the theme draws its focus outline inside, where the border clips nothing. */}
        <div
          ref={viewportRef}
          data-slot="csv-preview-viewport"
          role="region"
          aria-labelledby={captionId}
          tabIndex={0}
          className="overflow-x-auto"
        >
          <table aria-labelledby={captionId} className="w-full text-sm">
            <TableHeader className="bg-muted/50">
              <TableRow className="hover:bg-transparent">
                {Array.from({ length: columns }, (_, index) => (
                  <TableHead
                    key={index}
                    scope="col"
                    className={cn("px-3", numeric[index] && "text-right")}
                  >
                    {header[index] ?? ""}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {body.map((row, rowIndex) => (
                <TableRow key={rowIndex} className="hover:bg-transparent">
                  {Array.from({ length: columns }, (_, index) => (
                    <TableCell
                      key={index}
                      className={cn(
                        "max-w-64 truncate px-3 tabular-nums",
                        numeric[index] && "text-right"
                      )}
                    >
                      {row[index] ?? ""}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </table>
        </div>
      </div>
      <p id={captionId} className="text-xs text-muted-foreground">
        {caption ??
          (totalRows !== undefined && totalRows > shown
            ? `Primeras ${formatNumber(shown)} filas de ${formatNumber(totalRows)}`
            : `${formatNumber(shown)} ${shown === 1 ? "fila" : "filas"}`)}
      </p>
    </div>
  )
}

export { CsvPreview }
export type { CsvPreviewProps }
