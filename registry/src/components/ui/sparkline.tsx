// registry: auradata (a sparkline of the brand: the shape of a trend next to its number, toned like the KPI change, decoration unless labelled)
import { cn } from "cn"

const WIDTH = 96
const HEIGHT = 32

type SparklineTone = "good" | "bad" | "flat" | "none"

type SparklineProps = Omit<React.ComponentProps<"svg">, "values"> & {
  /** The recent values, oldest first. */
  values: number[]
  /** Whether the trend is good news, as the KPI change: success, destructive, muted; Azul Aura with `none`. */
  tone?: SparklineTone
  /** A light wash under the line. */
  area?: boolean
  /** A dot on the last value. */
  showEnd?: boolean
  /** What the trend says, for a sparkline that is the only place it is told: an image with this name. Decoration otherwise. */
  label?: string
}

/** The trend scaled to fill the box, 2 px inside it; flat when every value is the same. */
function pointsOf(values: number[]) {
  const min = Math.min(...values)
  const max = Math.max(...values)
  const step = WIDTH / (values.length - 1)
  const y = (value: number) => (max === min ? HEIGHT / 2 : 2 + ((max - value) / (max - min)) * (HEIGHT - 4))
  return values.map((value, index) => [index * step, y(value)] as const)
}

const pathOf = (points: (readonly [number, number])[]) =>
  points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ")

/** The shape of a trend: no axes, no numbers. Sits next to the number it belongs to. */
function Sparkline({ values, tone = "none", area = false, showEnd = false, label, className, ...props }: SparklineProps) {
  if (values.length < 2) return null
  const points = pointsOf(values)
  const [endX, endY] = points[points.length - 1]
  return (
    <svg
      data-slot="sparkline"
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="none"
      className={cn(
        "h-8 w-24 shrink-0 overflow-visible",
        tone === "good" && "text-success",
        tone === "bad" && "text-destructive",
        tone === "flat" && "text-muted-foreground",
        tone === "none" && "text-chart-1",
        className
      )}
      {...props}
    >
      {area && (
        <polygon
          data-slot="sparkline-area"
          points={`0,${HEIGHT} ${pathOf(points)} ${WIDTH},${HEIGHT}`}
          fill="currentColor"
          fillOpacity={0.1}
        />
      )}
      <polyline
        points={pathOf(points)}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      {showEnd && (
        // A zero-length line with round caps: a round dot that the box's stretching never turns into an oval.
        <polyline
          data-slot="sparkline-end"
          points={`${endX},${endY} ${endX},${endY}`}
          stroke="currentColor"
          strokeWidth={7}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      )}
    </svg>
  )
}

export { Sparkline }
export type { SparklineTone }
