// registry: auradata (a gradual blur for sticky headers and the edges of scrolling lists)
import * as React from "react"
import { cn } from "cn"

type Side = "top" | "bottom" | "left" | "right"

type ProgressiveBlurProps = React.ComponentProps<"div"> & {
  /** The edge where the blur is strongest; it fades to nothing toward the other side. */
  side?: Side
  /** How far the blur reaches from its edge: any CSS length. */
  size?: string
  /** The blur at the edge, in px. Each layer inward halves it. */
  blur?: number
  /** How many blur layers build the gradient. More is smoother, fewer is lighter on a phone. */
  layers?: number
  /** Also fade the page background in from the edge, so text under a bar stays readable. */
  tint?: boolean
}

const PLACE: Record<Side, string> = {
  top: "inset-x-0 top-0 h-(--blur-size)",
  bottom: "inset-x-0 bottom-0 h-(--blur-size)",
  left: "inset-y-0 left-0 w-(--blur-size)",
  right: "inset-y-0 right-0 w-(--blur-size)",
}

/** The background fade, from the edge inward. */
const TINT: Record<Side, string> = {
  top: "bg-linear-to-b",
  bottom: "bg-linear-to-t",
  left: "bg-linear-to-r",
  right: "bg-linear-to-l",
}

/** The direction from the edge inward, for the masks. */
const INWARD: Record<Side, string> = { top: "to bottom", bottom: "to top", left: "to right", right: "to left" }

/**
 * Stacked `backdrop-filter` layers, each masked to a shorter band near the edge and twice as blurred
 * as the one before, read as one blur that grows toward the edge. Put it inside a `relative` box; it
 * blurs whatever is painted under it, so in a sticky header give it `-z-10` (the header being its own
 * stacking context, `sticky z-10`) to keep the header's content sharp. It is decorative, never takes
 * a click and does not move. Browsers without `backdrop-filter` show only the tint.
 */
function ProgressiveBlur({
  side = "top",
  size = "4rem",
  blur = 16,
  layers = 5,
  tint = false,
  className,
  style,
  ...props
}: ProgressiveBlurProps) {
  const step = 100 / layers
  return (
    <div
      data-slot="progressive-blur"
      data-side={side}
      aria-hidden="true"
      className={cn("pointer-events-none absolute", PLACE[side], className)}
      style={{ "--blur-size": size, ...style } as React.CSSProperties}
      {...props}
    >
      {Array.from({ length: layers }, (_, index) => {
        // The first layer is the faintest and reaches furthest; the last, the edge only.
        const filter = `blur(${blur / 2 ** (layers - 1 - index)}px)`
        const end = 100 - index * step
        const mask = `linear-gradient(${INWARD[side]}, #000 ${Math.max(end - step, 0)}%, transparent ${end}%)`
        return (
          <div
            key={index}
            data-slot="progressive-blur-layer"
            className="absolute inset-0"
            style={{ backdropFilter: filter, WebkitBackdropFilter: filter, maskImage: mask, WebkitMaskImage: mask }}
          />
        )
      })}
      {tint && (
        <div data-slot="progressive-blur-tint" className={cn("absolute inset-0 from-background/85 to-transparent", TINT[side])} />
      )}
    </div>
  )
}

type More = "none" | "start" | "end" | "both"

type ScrollBlurProps = React.ComponentProps<"div"> & {
  orientation?: "vertical" | "horizontal"
  /** Passed to both edges. */
  size?: string
  blur?: number
  /** The scrolling box's own classes; `className` goes on the frame. */
  viewportClassName?: string
}

/**
 * A scrolling box whose edges blur while there is more content beyond them (`data-more` on the frame:
 * none, start, end or both). The viewport is a keyboard-focusable region: give it an `aria-label`.
 */
function ScrollBlur({
  orientation = "vertical",
  size = "3rem",
  blur = 12,
  className,
  viewportClassName,
  children,
  ...props
}: ScrollBlurProps) {
  const viewport = React.useRef<HTMLDivElement>(null)
  const [more, setMore] = React.useState<More>("none")
  const vertical = orientation === "vertical"

  React.useEffect(() => {
    const element = viewport.current
    if (!element) return
    const update = () => {
      const offset = vertical ? element.scrollTop : element.scrollLeft
      const room = vertical
        ? element.scrollHeight - element.clientHeight
        : element.scrollWidth - element.clientWidth
      // A pixel of slack: zoomed pages scroll to fractions and never quite reach the end.
      const start = Math.abs(offset) > 1
      const end = room - Math.abs(offset) > 1
      setMore(start && end ? "both" : start ? "start" : end ? "end" : "none")
    }
    update()
    element.addEventListener("scroll", update, { passive: true })
    const observer = new ResizeObserver(update)
    observer.observe(element)
    for (const child of element.children) observer.observe(child)
    return () => {
      element.removeEventListener("scroll", update)
      observer.disconnect()
    }
  }, [vertical])

  const edge = "z-10 transition-opacity duration-200 motion-reduce:transition-none"
  const show = (side: "start" | "end") => (more === side || more === "both" ? "opacity-100" : "opacity-0")
  return (
    <div data-slot="scroll-blur" data-more={more} className={cn("relative isolate overflow-hidden", className)}>
      <div
        ref={viewport}
        data-slot="scroll-blur-viewport"
        role="region"
        tabIndex={0}
        className={cn(
          "size-full overscroll-contain rounded-[inherit] focus-visible:outline-offset-[-2px]",
          vertical ? "overflow-y-auto" : "overflow-x-auto",
          viewportClassName
        )}
        {...props}
      >
        {children}
      </div>
      <ProgressiveBlur side={vertical ? "top" : "left"} size={size} blur={blur} tint className={cn(edge, show("start"))} />
      <ProgressiveBlur side={vertical ? "bottom" : "right"} size={size} blur={blur} tint className={cn(edge, show("end"))} />
    </div>
  )
}

export { ProgressiveBlur, ScrollBlur }
