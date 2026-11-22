// registry: auradata (a gauge of the brand: one value against its whole as a ring or a half gauge, with limits that turn it amber and red and say so)
"use client"

import * as React from "react"
import { cn } from "cn"

import { formatPercent } from "@/lib/format"

type GaugeProps = Omit<React.ComponentProps<"div">, "children"> & {
  value: number
  /** The whole: 1 by default, so `value` is a fraction. */
  max?: number
  /** What it measures: its caption and its accessible name. */
  label: string
  /** Writes the value in the middle; the percent of `max` by default. */
  valueFormatter?: (value: number) => string
  /** A second line under the value, such as «de 50,000». */
  caption?: React.ReactNode
  variant?: "ring" | "half"
  /** Width in pixels: 160 by default. */
  size?: number
  /** Values (in the units of `value`) from which the fill turns amber, then red: for a limit, such as storage. */
  thresholds?: { warning: number; danger: number }
  warningLabel?: string
  dangerLabel?: string
  locale?: string
}

const STROKE = 10

/**
 * One value against its whole, such as a quarter's target or a plan's usage. The track is a lighter step of the
 * fill's own color; with `thresholds` the fill turns amber and red and a word says why.
 */
function Gauge({
  value,
  max = 1,
  label,
  valueFormatter,
  caption,
  variant = "ring",
  size = 160,
  thresholds,
  warningLabel = "Cerca del límite",
  dangerLabel = "Sobre el límite",
  locale = "es-MX",
  className,
  ...props
}: GaugeProps) {
  const labelId = React.useId()
  const share = max > 0 ? Math.min(Math.max(value / max, 0), 1) : 0
  const text = valueFormatter ? valueFormatter(value) : formatPercent(share, { locale, maximumFractionDigits: 0 })
  const tone =
    thresholds && value >= thresholds.danger ? "danger" : thresholds && value >= thresholds.warning ? "warning" : "normal"
  const status = tone === "danger" ? dangerLabel : tone === "warning" ? warningLabel : undefined

  const radius = (size - STROKE) / 2
  const center = size / 2
  const half = variant === "half"
  // Both shapes run on pathLength 100, so the fill is the share in percent.
  const track = half
    ? `M ${STROKE / 2} ${center} A ${radius} ${radius} 0 0 1 ${size - STROKE / 2} ${center}`
    : `M ${center} ${STROKE / 2} A ${radius} ${radius} 0 1 1 ${center - 0.01} ${STROKE / 2}`
  const height = half ? center + STROKE / 2 : size

  return (
    <div
      data-slot="gauge"
      role="meter"
      aria-labelledby={labelId}
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuetext={status ? `${text}, ${status}` : text}
      data-tone={tone}
      className={cn("inline-grid justify-items-center gap-2 text-center", className)}
      {...props}
    >
      <div className="relative" style={{ width: size, height }}>
        <svg
          aria-hidden
          viewBox={`0 0 ${size} ${height}`}
          className={cn(
            "size-full overflow-visible",
            tone === "normal" && "text-chart-1",
            tone === "warning" && "text-warning",
            tone === "danger" && "text-destructive"
          )}
        >
          <path d={track} pathLength={100} fill="none" stroke="currentColor" strokeOpacity={0.16} strokeWidth={STROKE} strokeLinecap="round" />
          {share > 0 && (
            <path
              d={track}
              pathLength={100}
              fill="none"
              stroke="currentColor"
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={`${share * 100} 100`}
              className="transition-[stroke-dasharray] duration-500 ease-out motion-reduce:transition-none"
            />
          )}
        </svg>
        <div
          className={cn(
            "absolute inset-x-0 grid justify-items-center",
            half ? "bottom-0" : "top-1/2 -translate-y-1/2"
          )}
        >
          <span
            className={cn("font-semibold tracking-tight", size < 128 ? "text-lg" : size > 192 ? "text-4xl" : "text-2xl")}
          >
            {text}
          </span>
          {caption && <span className="text-xs text-muted-foreground">{caption}</span>}
        </div>
      </div>
      <div className="grid gap-0.5">
        <span id={labelId} className="text-sm text-muted-foreground">
          {label}
        </span>
        {status && (
          <span className="text-xs font-medium text-foreground">
            {status}
          </span>
        )}
      </div>
    </div>
  )
}

export { Gauge }
export type { GaugeProps }
