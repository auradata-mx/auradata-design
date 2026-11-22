// registry: auradata (the release notes of a product: dated, versioned and tagged new, improved or fixed)
import * as React from "react"
import { cn } from "cn"

import { Badge } from "@/components/ui/badge"
import { SectionHeader } from "@/components/ui/section-header"
import { formatDate } from "@/lib/format"

export type ChangelogEntry = {
  /** A `YYYY-MM-DD` day (read as that local day) or a Date. */
  date: string | Date
  version?: string
  type?: "new" | "improved" | "fixed"
  title: React.ReactNode
  description?: React.ReactNode
  items?: React.ReactNode[]
}

type ChangelogProps = Omit<React.ComponentProps<"section">, "title"> & {
  eyebrow?: React.ReactNode
  title: React.ReactNode
  highlight?: React.ReactNode
  description?: React.ReactNode
  /** Newest first. */
  entries: ChangelogEntry[]
  labels?: { list?: string; new?: string; improved?: string; fixed?: string; version?: (version: string) => string }
}

const LABELS = {
  list: "Versiones",
  new: "Nuevo",
  improved: "Mejora",
  fixed: "Corrección",
  version: (version: string) => `Versión ${version}`,
}

const VARIANT = { new: "default", improved: "success", fixed: "warning" } as const

/** "2026-11-18" or a Date → "2026-11-18", for `<time dateTime>`. */
function isoDay(date: string | Date) {
  if (typeof date === "string") return date
  const pad = (value: number) => String(value).padStart(2, "0")
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

/**
 * Release notes as a timeline: each entry's date (`formatDate`, «18 nov 2026», in a `<time>`) and
 * version on the left, from md, and on the right a tag (Nuevo, Mejora, Corrección), its title, text and
 * points. On a phone the date sits above the entry.
 */
function Changelog({
  eyebrow,
  title,
  highlight,
  description,
  entries,
  labels: labelsProp,
  className,
  ...props
}: ChangelogProps) {
  const headingId = React.useId()
  const labels = { ...LABELS, ...labelsProp }
  return (
    <section
      data-slot="changelog"
      aria-labelledby={headingId}
      className={cn("px-6 py-16 md:px-10 md:py-24", className)}
      {...props}
    >
      <div className="mx-auto max-w-4xl">
        <SectionHeader
          titleId={headingId}
          eyebrow={eyebrow}
          title={title}
          highlight={highlight}
          description={description}
        />
        <ol aria-label={labels.list} className="mt-12 flex flex-col">
          {entries.map((entry, index) => (
            // The timeline: a line down the left edge, a dot at each entry. On a phone it runs down the
            // whole entry (date included, the dot beside it); from md, beside the content only.
            <li
              key={index}
              className={cn(
                "relative grid gap-3 border-l pl-6 md:grid-cols-[9rem_1fr] md:gap-8 md:border-l-0 md:pl-0",
                index < entries.length - 1 ? "pb-12" : "pb-2"
              )}
            >
              <div className="flex items-baseline gap-3 md:flex-col md:items-end md:gap-1 md:pt-0.5 md:text-right">
                <time dateTime={isoDay(entry.date)} className="text-sm font-medium">
                  {formatDate(entry.date)}
                </time>
                {entry.version && (
                  <span className="font-mono text-xs text-muted-foreground">
                    <span className="sr-only">{labels.version(entry.version)}</span>
                    <span aria-hidden="true">v{entry.version}</span>
                  </span>
                )}
              </div>
              <div
                className={cn(
                  "flex flex-col items-start gap-3 md:relative md:-mb-12 md:border-l md:pb-12 md:pl-8",
                  index === entries.length - 1 && "md:-mb-2 md:pb-2"
                )}
              >
                <span
                  aria-hidden="true"
                  className="absolute top-1.5 -left-[5px] size-2.5 rounded-full border-2 border-background bg-primary"
                />
                {entry.type && <Badge variant={VARIANT[entry.type]}>{labels[entry.type]}</Badge>}
                <h3 className="font-heading text-xl font-semibold tracking-tight text-balance">{entry.title}</h3>
                {entry.description && <p className="text-pretty text-muted-foreground">{entry.description}</p>}
                {entry.items && (
                  <ul className="flex list-disc flex-col gap-1.5 pl-5 text-sm marker:text-muted-foreground">
                    {entry.items.map((item, itemIndex) => (
                      <li key={itemIndex}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export { Changelog }
