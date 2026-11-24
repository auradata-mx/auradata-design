"use client"

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
        <div
          data-slot="progressive-blur-tint"
          className={cn(
            "absolute inset-0 from-[color-mix(in_oklab,var(--blur-tint,var(--background))_85%,transparent)] to-transparent",
            TINT[side]
          )}
        />
      )}
    </div>
  )
}

type More = "none" | "start" | "end" | "both"

function remaining(offset: number, room: number): More {
  // A pixel of slack covers fractional scroll bounds on zoomed pages.
  const start = Math.abs(offset) > 1
  const end = room - Math.abs(offset) > 1
  return start && end ? "both" : start ? "start" : end ? "end" : "none"
}

/** Observe the native viewport without replacing any primitive event handlers or refs. */
function useScrollBlurViewport<T extends HTMLElement>(ref?: React.Ref<T>) {
  const [viewport, setViewport] = React.useState<T | null>(null)
  const viewportRef = React.useCallback((node: T | null) => {
    setViewport(node)
    if (typeof ref === "function") {
      const cleanup = ref(node)
      if (typeof cleanup === "function") {
        return () => {
          cleanup()
          setViewport(null)
        }
      }
    } else if (ref) {
      ref.current = node
    }
  }, [ref])
  return [viewport, viewportRef] as const
}

const NO_OVERFLOW = { vertical: "none", horizontal: "none" } as const

function useOverflowEdges(viewport: HTMLElement | null) {
  const [edges, setEdges] = React.useState<{ vertical: More; horizontal: More }>(NO_OVERFLOW)
  React.useEffect(() => {
    if (!viewport) return
    const measure = () => {
      const vertical = remaining(viewport.scrollTop, viewport.scrollHeight - viewport.clientHeight)
      const horizontal = remaining(viewport.scrollLeft, viewport.scrollWidth - viewport.clientWidth)
      setEdges((current) => current.vertical === vertical && current.horizontal === horizontal
        ? current
        : { vertical, horizontal })
    }

    const resize = new ResizeObserver(measure)
    resize.observe(viewport)
    let children = new Set<Element>()
    const syncChildren = () => {
      const next = new Set(viewport.children)
      for (const child of children) {
        if (!next.has(child)) resize.unobserve(child)
      }
      for (const child of next) {
        if (!children.has(child)) resize.observe(child)
      }
      children = next
      measure()
    }
    const mutations = new MutationObserver(syncChildren)
    mutations.observe(viewport, { childList: true, subtree: true })
    viewport.addEventListener("scroll", measure, { passive: true })
    syncChildren()

    return () => {
      viewport.removeEventListener("scroll", measure)
      resize.disconnect()
      mutations.disconnect()
    }
  }, [viewport])
  return viewport ? edges : NO_OVERFLOW
}

type ScrollBlurEdgesProps = Pick<ProgressiveBlurProps, "size" | "blur" | "tint" | "className"> & {
  orientation?: "vertical" | "horizontal"
  direction?: "ltr" | "rtl"
  showStart: boolean
  showEnd: boolean
}

/** Paint over a viewport, never inside its scrolling contents or above its controls. */
function ScrollBlurEdges({
  orientation = "vertical",
  direction,
  showStart,
  showEnd,
  size = "1rem",
  blur = 5,
  tint,
  className,
}: ScrollBlurEdgesProps) {
  const horizontal = orientation === "horizontal"
  const first = direction === "rtl" && horizontal ? showEnd : showStart
  const last = direction === "rtl" && horizontal ? showStart : showEnd
  const followsDirection = horizontal && direction === undefined

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-[inherit] forced-colors:hidden", className)}
    >
      <ProgressiveBlur
        side={horizontal ? "left" : "top"}
        size={size}
        blur={blur}
        tint={tint}
        className={cn(
          "transition-opacity duration-200 motion-reduce:transition-none",
          first ? "opacity-100" : "opacity-0",
          followsDirection && (last ? "rtl:opacity-100" : "rtl:opacity-0")
        )}
      />
      <ProgressiveBlur
        side={horizontal ? "right" : "bottom"}
        size={size}
        blur={blur}
        tint={tint}
        className={cn(
          "transition-opacity duration-200 motion-reduce:transition-none",
          last ? "opacity-100" : "opacity-0",
          followsDirection && (first ? "rtl:opacity-100" : "rtl:opacity-0")
        )}
      />
    </div>
  )
}

type ViewportScrollBlurProps = Omit<ScrollBlurEdgesProps, "orientation" | "direction" | "showStart" | "showEnd"> & {
  viewport: HTMLElement | null
  bothAxes?: boolean
}

/** Adds visual edges to a scroll viewport owned by an existing primitive. */
function ViewportScrollBlur({ viewport, bothAxes, ...props }: ViewportScrollBlurProps) {
  const { vertical, horizontal } = useOverflowEdges(viewport)
  return (
    <>
      <ScrollBlurEdges showStart={includesEdge(vertical, "start")} showEnd={includesEdge(vertical, "end")} {...props} />
      {bothAxes && (
        <ScrollBlurEdges
          orientation="horizontal"
          showStart={includesEdge(horizontal, "start")}
          showEnd={includesEdge(horizontal, "end")}
          {...props}
        />
      )}
    </>
  )
}

function includesEdge(more: More, side: "start" | "end") {
  return more === side || more === "both"
}

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
  ref,
  ...props
}: ScrollBlurProps) {
  const [viewport, viewportRef] = useScrollBlurViewport(ref)
  const more = useOverflowEdges(viewport)[orientation]

  return (
    <div data-slot="scroll-blur" data-more={more} className={cn("relative isolate flex flex-col overflow-hidden", className)}>
      <div
        ref={viewportRef}
        data-slot="scroll-blur-viewport"
        role="region"
        tabIndex={0}
        className={cn(
          "min-h-0 min-w-0 flex-1 size-full overscroll-contain rounded-[inherit] focus-visible:outline-offset-[-2px]",
          orientation === "vertical" ? "overflow-y-auto" : "overflow-x-auto",
          viewportClassName
        )}
        {...props}
      >
        {children}
      </div>
      <ScrollBlurEdges
        orientation={orientation}
        showStart={includesEdge(more, "start")}
        showEnd={includesEdge(more, "end")}
        size={size}
        blur={blur}
        tint
      />
    </div>
  )
}

export { ProgressiveBlur, ScrollBlur, ScrollBlurEdges, ViewportScrollBlur, useScrollBlurViewport }
