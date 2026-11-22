// registry: auradata (axis labels take the muted text color: Recharts 3 names them .recharts-cartesian-axis-tick-value and paints them #666 inline, 3.3:1 on the dark card)
// registry: auradata (the bar tooltip cursor drops the #ccc outline Recharts 3 draws around it)
// registry: auradata (tooltip values in es-MX with their share and the change against the previous period; a legend that hides and shows series)
import * as React from "react"
import { cn } from "cn"
import * as RechartsPrimitive from "recharts"
import type { TooltipValueType } from "recharts"

import { Delta, previousChange } from "@/components/ui/delta"
import { formatNumber, formatPercent } from "@/lib/format"

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } as const

const INITIAL_DIMENSION = { width: 320, height: 200 } as const
type TooltipNameType = number | string

export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
>

type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }

  return context
}

function ChartContainer({
  id,
  className,
  children,
  config,
  initialDimension = INITIAL_DIMENSION,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >["children"]
  initialDimension?: {
    width: number
    height: number
  }
}) {
  const uniqueId = React.useId()
  const chartId = `chart-${id ?? uniqueId.replace(/:/g, "")}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick-value]:fill-muted-foreground! [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:stroke-transparent [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer
          initialDimension={initialDimension}
        >
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
}

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, config]) => config.theme ?? config.color
  )

  if (!colorConfig.length) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ??
      itemConfig.color
    return color ? `  --color-${key}: ${color};` : null
  })
  .join("\n")}
}
`
          )
          .join("\n"),
      }}
    />
  )
}

const ChartTooltip = RechartsPrimitive.Tooltip

/** The key of a payload item: its data key, or its name when the key is a function. */
function payloadKey(item: { dataKey?: unknown; name?: unknown }) {
  return typeof item.dataKey === "string" || typeof item.dataKey === "number"
    ? String(item.dataKey)
    : String(item.name ?? "value")
}

function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = "dot",
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  color,
  nameKey,
  labelKey,
  valueFormatter,
  showPercent = false,
  percentTotal,
  previousKey,
  comparison,
  goodDirection = "up",
  locale = "es-MX",
}: React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
  React.ComponentProps<"div"> & {
    hideLabel?: boolean
    hideIndicator?: boolean
    indicator?: "line" | "dot" | "dashed"
    nameKey?: string
    labelKey?: string
    /** Writes each value, such as `formatCurrency`; plain es-MX numbers otherwise. */
    valueFormatter?: (value: number, key: string) => React.ReactNode
    /** Each value's share of the total beside it: of the values at this point, or of `percentTotal`. */
    showPercent?: boolean
    percentTotal?: number
    /** The data key that holds each series' previous period (`(key) => \`${key}Anterior\``): its change, with the arrow. */
    previousKey?: (key: string) => string
    /** What the change compares with, such as "vs. 2025". */
    comparison?: React.ReactNode
    /** When a fall is the good news (costs, churn), set "down". */
    goodDirection?: "up" | "down"
    locale?: string
  } & Omit<
    RechartsPrimitive.DefaultTooltipContentProps<
      TooltipValueType,
      TooltipNameType
    >,
    "accessibilityLayer"
  >) {
  const { config } = useChart()

  const tooltipLabel = React.useMemo(() => {
    if (hideLabel || !payload?.length) {
      return null
    }

    const [item] = payload
    const key = `${labelKey ?? item?.dataKey ?? item?.name ?? "value"}`
    const itemConfig = getPayloadConfigFromPayload(config, item, key)
    const value =
      !labelKey && typeof label === "string"
        ? (config[label]?.label ?? label)
        : itemConfig?.label

    if (labelFormatter) {
      return (
        <div className={cn("font-medium", labelClassName)}>
          {labelFormatter(value, payload)}
        </div>
      )
    }

    if (!value) {
      return null
    }

    return <div className={cn("font-medium", labelClassName)}>{value}</div>
  }, [
    label,
    labelFormatter,
    payload,
    hideLabel,
    labelClassName,
    config,
    labelKey,
  ])

  if (!active || !payload?.length) {
    return null
  }

  const nestLabel = payload.length === 1 && indicator !== "dot"
  const shown = payload.filter((item) => item.type !== "none")
  const total =
    percentTotal ??
    shown.reduce((sum, item) => sum + (typeof item.value === "number" ? item.value : 0), 0)

  return (
    <div
      data-slot="chart-tooltip"
      className={cn(
        "grid min-w-32 items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
        className
      )}
    >
      {!nestLabel ? tooltipLabel : null}
      <div className="grid gap-1.5">
        {shown.map((item, index) => {
            const key = `${nameKey ?? item.name ?? item.dataKey ?? "value"}`
            const itemConfig = getPayloadConfigFromPayload(config, item, key)
            const indicatorColor = color ?? item.payload?.fill ?? item.color
            const dataKey = payloadKey(item)
            const value = typeof item.value === "number" ? item.value : undefined
            const share = showPercent && value !== undefined && total > 0 ? value / total : undefined
            const previous = previousKey ? item.payload?.[previousKey(dataKey)] : undefined
            const change =
              value !== undefined && typeof previous === "number" ? previousChange(value, previous) : undefined

            return (
              <div
                key={index}
                className={cn(
                  "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
                  indicator === "dot" && "items-center"
                )}
              >
                {formatter && item?.value !== undefined && item.name ? (
                  formatter(item.value, item.name, item, index, item.payload)
                ) : (
                  <>
                    {itemConfig?.icon ? (
                      <itemConfig.icon />
                    ) : (
                      !hideIndicator && (
                        <div
                          className={cn(
                            "shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)",
                            {
                              "h-2.5 w-2.5": indicator === "dot",
                              "w-1": indicator === "line",
                              "w-0 border-[1.5px] border-dashed bg-transparent":
                                indicator === "dashed",
                              "my-0.5": nestLabel && indicator === "dashed",
                            }
                          )}
                          style={
                            {
                              "--color-bg": indicatorColor,
                              "--color-border": indicatorColor,
                            } as React.CSSProperties
                          }
                        />
                      )
                    )}
                    <div
                      className={cn(
                        "flex flex-1 justify-between gap-4 leading-none",
                        nestLabel ? "items-end" : "items-center"
                      )}
                    >
                      <div className="grid gap-1.5">
                        {nestLabel ? tooltipLabel : null}
                        <span className="text-muted-foreground">
                          {itemConfig?.label ?? item.name}
                        </span>
                      </div>
                      {item.value != null && (
                        <span className="flex items-baseline gap-1.5 whitespace-nowrap">
                          <span className="font-mono font-medium text-foreground tabular-nums">
                            {value === undefined
                              ? String(item.value)
                              : valueFormatter
                                ? valueFormatter(value, dataKey)
                                : formatNumber(value, { locale })}
                          </span>
                          {share !== undefined && (
                            <span className="text-muted-foreground tabular-nums">
                              {formatPercent(share, { locale })}
                            </span>
                          )}
                        </span>
                      )}
                    </div>
                    {change !== undefined && (
                      // Under the name, aligned with it: the indicator keeps its column.
                      <Delta
                        change={change}
                        comparison={comparison}
                        goodDirection={goodDirection}
                        locale={locale}
                        className={cn(
                          "basis-full text-xs leading-none [&>svg]:size-3.5",
                          !hideIndicator && !itemConfig?.icon && (indicator === "dot" ? "pl-4.5" : "pl-3")
                        )}
                      />
                    )}
                  </>
                )}
              </div>
            )
          })}
      </div>
    </div>
  )
}

const ChartLegend = RechartsPrimitive.Legend

/**
 * Which series show. Give the legend `hiddenSeries={hidden}` and `onSeriesToggle={toggle}`, and each series `hide={isHidden(key)}`:
 * the reader hides and shows them from the legend.
 */
function useChartSeries(initialHidden: string[] = []) {
  const [hidden, setHidden] = React.useState(initialHidden)
  const toggle = React.useCallback(
    (key: string) =>
      setHidden((current) =>
        current.includes(key) ? current.filter((other) => other !== key) : [...current, key]
      ),
    []
  )
  const isHidden = React.useCallback((key: string) => hidden.includes(key), [hidden])
  return { hidden, toggle, isHidden }
}

function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = "bottom",
  nameKey,
  hiddenSeries,
  onSeriesToggle,
}: React.ComponentProps<"div"> & {
  hideIcon?: boolean
  nameKey?: string
  /** The keys of the hidden series: their names stay in the legend, dimmed, with an outlined swatch. */
  hiddenSeries?: string[]
  /** Makes each name a button that hides or shows its series (see `useChartSeries`). */
  onSeriesToggle?: (key: string) => void
} & RechartsPrimitive.DefaultLegendContentProps) {
  const { config } = useChart()

  if (!payload?.length) {
    return null
  }

  return (
    <div
      data-slot="chart-legend"
      role={onSeriesToggle ? "group" : undefined}
      aria-label={onSeriesToggle ? "Mostrar u ocultar series" : undefined}
      className={cn(
        "flex flex-wrap items-center justify-center gap-x-4 gap-y-1",
        verticalAlign === "top" ? "pb-3" : "pt-3",
        className
      )}
    >
      {payload
        .filter((item) => item.type !== "none")
        .map((item, index) => {
          const key = `${nameKey ?? item.dataKey ?? "value"}`
          const itemConfig = getPayloadConfigFromPayload(config, item, key)
          const sector = item.payload as Record<string, unknown> | undefined
          const seriesKey =
            nameKey && typeof sector?.[nameKey] === "string"
              ? (sector[nameKey] as string)
              : String(item.dataKey ?? item.value)
          const inactive = Boolean(item.inactive) || Boolean(hiddenSeries?.includes(seriesKey))
          const content = (
            <>
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  // Lines key with a stroke, bars and areas with a square; a hidden series keeps only the outline.
                  className={cn(
                    "shrink-0 border",
                    item.type === "line" ? "h-0.5 w-3 rounded-full" : "h-2 w-2 rounded-[2px]",
                    inactive && "bg-transparent! opacity-60"
                  )}
                  style={{ backgroundColor: item.color, borderColor: item.color }}
                />
              )}
              {itemConfig?.label ?? item.value}
            </>
          )
          const itemClass =
            "flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground"

          return onSeriesToggle ? (
            <button
              key={index}
              type="button"
              aria-pressed={!inactive}
              onClick={() => onSeriesToggle(seriesKey)}
              className={cn(
                itemClass,
                // A 24 px target, without moving the names: the padding comes out of the gap.
                "-mx-1 min-h-6 cursor-pointer rounded-sm px-1 outline-none select-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50",
                inactive && "text-muted-foreground"
              )}
            >
              {content}
            </button>
          ) : (
            <div key={index} className={itemClass}>
              {content}
            </div>
          )
        })}
    </div>
  )
}

function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string
) {
  if (typeof payload !== "object" || payload === null) {
    return undefined
  }

  const payloadPayload =
    "payload" in payload &&
    typeof payload.payload === "object" &&
    payload.payload !== null
      ? payload.payload
      : undefined

  let configLabelKey: string = key

  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === "string"
  ) {
    configLabelKey = payload[key as keyof typeof payload] as string
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[
      key as keyof typeof payloadPayload
    ] as string
  }

  return configLabelKey in config ? config[configLabelKey] : config[key]
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
  useChartSeries,
}
