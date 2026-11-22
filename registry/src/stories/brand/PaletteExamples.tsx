/**
 * Live examples for the brand guide: the data palettes through lib/chart-palette and the status scales through
 * their Tailwind classes. They follow the docs theme (light or dark), as an app would.
 */
import { CircleAlertIcon, CircleCheckIcon, InfoIcon, TriangleAlertIcon } from "lucide-react"

import { divergingFill, sequentialFill } from "@/lib/chart-palette"
import { formatNumber, formatPercent } from "@/lib/format"

const DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]
const HOURS = ["8 h", "10 h", "12 h", "14 h", "16 h", "18 h"]
/** Report queries per weekday and hour: busy mid-mornings, quiet weekends. */
const QUERIES = [
  [42, 118, 96, 74, 88, 31],
  [38, 124, 102, 81, 92, 35],
  [45, 131, 99, 77, 86, 29],
  [40, 127, 105, 83, 95, 33],
  [36, 109, 88, 62, 54, 18],
  [6, 14, 19, 12, 8, 4],
  [2, 5, 9, 7, 5, 3],
]
const MAX_QUERIES = Math.max(...QUERIES.flat())

const MONTHS = ["Jul", "Ago", "Sep", "Oct"]
/** Sales against the monthly target, as a share: -0.12 is 12 % below. */
const VS_TARGET: [string, number[]][] = [
  ["Norte", [-0.12, -0.04, 0.03, 0.09]],
  ["Centro", [0.06, 0.11, 0.18, 0.21]],
  ["Sur", [-0.19, -0.15, -0.06, 0.01]],
]

const cell = "h-9 min-w-11 rounded-sm px-1 text-center font-mono text-xs tabular-nums"
const head = "px-1 text-xs font-normal text-muted-foreground"

/** A heatmap as a table: the numbers stay readable, the color only adds the pattern. */
export function SequentialExample() {
  return (
    <div className="sb-unstyled my-6 grid gap-2">
      <p className="text-sm font-medium text-foreground">Consultas de informes por día y hora</p>
      <div className="overflow-x-auto">
        <table className="border-separate border-spacing-0.5">
          <thead>
            <tr>
              <td />
              {HOURS.map((hour) => (
                <th key={hour} scope="col" className={`${head} pb-1`}>
                  {hour}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {QUERIES.map((row, day) => (
              <tr key={DAYS[day]}>
                <th scope="row" className={`${head} pr-2 text-left`}>
                  {DAYS[day]}
                </th>
                {row.map((value, hour) => (
                  <td key={HOURS[hour]} className={cell} style={sequentialFill(value, [0, MAX_QUERIES])}>
                    {formatNumber(value)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/** Above and below a target: red under it, the neutral gray on it, blue over it. */
export function DivergingExample() {
  return (
    <div className="sb-unstyled my-6 grid gap-2">
      <p className="text-sm font-medium text-foreground">Ventas contra la meta del mes</p>
      <div className="overflow-x-auto">
        <table className="border-separate border-spacing-0.5">
          <thead>
            <tr>
              <td />
              {MONTHS.map((month) => (
                <th key={month} scope="col" className={`${head} pb-1`}>
                  {month}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {VS_TARGET.map(([region, values]) => (
              <tr key={region}>
                <th scope="row" className={`${head} pr-2 text-left`}>
                  {region}
                </th>
                {values.map((value, month) => (
                  <td key={MONTHS[month]} className={`${cell} min-w-16`} style={divergingFill(value, 0.2)}>
                    {formatPercent(value, { signDisplay: "exceptZero" })}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/** The same classes on a light and a dark page: the scale inverts in dark, so nothing changes in the markup. */
export function StatusScaleExample() {
  return (
    <div className="sb-unstyled my-6 grid gap-4">
      <div className="rounded-xl border bg-background p-4 text-foreground">
        <StatusSamples />
      </div>
      <div className="dark rounded-xl border bg-background p-4 text-foreground">
        <StatusSamples />
      </div>
    </div>
  )
}

/** Soft badges and a tinted note from the status scales: tint 50, border 200, text 700. */
function StatusSamples() {
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1 rounded-full border border-success-200 bg-success-50 px-2 py-0.5 text-xs font-medium text-success-700">
          <CircleCheckIcon className="size-3.5" aria-hidden /> Publicado
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-warning-200 bg-warning-50 px-2 py-0.5 text-xs font-medium text-warning-700">
          <TriangleAlertIcon className="size-3.5" aria-hidden /> Datos de ayer
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-info-200 bg-info-50 px-2 py-0.5 text-xs font-medium text-info-700">
          <InfoIcon className="size-3.5" aria-hidden /> Programado
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-destructive-200 bg-destructive-50 px-2 py-0.5 text-xs font-medium text-destructive-700">
          <CircleAlertIcon className="size-3.5" aria-hidden /> Falló la carga
        </span>
      </div>
      <div className="flex items-start gap-3 rounded-lg border border-warning-200 bg-warning-50 p-3 text-sm text-foreground">
        <TriangleAlertIcon className="mt-0.5 size-4 shrink-0 text-warning-700" aria-hidden />
        <p>
          <span className="font-medium text-warning-800">El dataset no se actualizó hoy.</span> Las cifras son del
          corte de ayer a las 23:00.
        </p>
      </div>
    </div>
  )
}
