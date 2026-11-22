// registry: auradata (the brand gradient as the drifting border of the one highlighted element)
import * as React from "react"
import { cn } from "cn"

type GradientBorderProps = React.ComponentProps<"div"> & {
  /** Let the gradient drift along the border; it stays still with reduced motion either way. */
  animated?: boolean
  /** The border's width in px. */
  width?: number
}

const KEYFRAMES = "@keyframes gradient-border-pan{from{background-position:0% 50%}to{background-position:100% 50%}}"
// Only the padding box stays: the border band, as wide as the padding.
const MASK = "linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0)"

/**
 * Wraps a card (or any rounded box) in a border of `--aura-gradient-brand`. The gradient is twice the
 * width of the box and pans back and forth, so the colors travel along the edge without a seam. Use it
 * on one element per view, the one it recommends: the brand gradient is an accent. The wrapped shadcn
 * `Card` drops its own hairline, and its corners sit inside the border's.
 */
function GradientBorder({ animated = true, width = 1, className, style, children, ...props }: GradientBorderProps) {
  return (
    <div
      data-slot="gradient-border"
      className={cn(
        "relative isolate rounded-[calc(var(--radius-xl)+var(--gradient-border-width))] p-(--gradient-border-width) *:data-[slot=card]:ring-0",
        className
      )}
      style={{ "--gradient-border-width": `${width}px`, ...style } as React.CSSProperties}
      {...props}
    >
      {animated && (
        <style href="gradient-border-pan" precedence="default">
          {KEYFRAMES}
        </style>
      )}
      <div
        data-slot="gradient-border-ring"
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 -z-10 rounded-[inherit] bg-(image:--aura-gradient-brand) p-(--gradient-border-width)",
          animated &&
            "bg-size-[200%_100%] animate-[gradient-border-pan_8s_ease-in-out_infinite_alternate] motion-reduce:animate-none motion-reduce:bg-size-[100%_100%]"
        )}
        style={{ mask: MASK }}
      />
      {children}
    </div>
  )
}

export { GradientBorder }
