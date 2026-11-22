// registry: auradata (a number that counts up when it comes into view, in the brand's formats)
import * as React from "react"
import { cn } from "cn"

import { formatNumber } from "@/lib/format"

type NumberTickerProps = Omit<React.ComponentProps<"span">, "children"> & {
  value: number
  /** Where the first count starts. */
  from?: number
  /** How each step is written: a `lib/format` function, as `(value) => formatCurrency(value)`. */
  format?: (value: number) => string
  /** Milliseconds of one count. */
  duration?: number
}

const defaultFormat = (value: number) => formatNumber(value, { maximumFractionDigits: 0 })

/** Fast first, landing softly: the brand's `ease-fluid` feel. */
const easeOut = (t: number) => 1 - (1 - t) ** 4

/**
 * Counts from `from` to `value` the first time a third of it is in view, and from the number on screen
 * to any new `value` after that. Screen readers get the final value at once; the counting digits are
 * hidden from them. The digits are tabular and the box is as wide as the widest end, so nothing around
 * it moves. With reduced motion the final value shows without counting.
 */
function NumberTicker({
  value,
  from = 0,
  format = defaultFormat,
  duration = 1200,
  className,
  ...props
}: NumberTickerProps) {
  const root = React.useRef<HTMLSpanElement>(null)
  const digits = React.useRef<HTMLSpanElement>(null)
  const shown = React.useRef(from)
  const [current, setCurrent] = React.useState(from)
  const [inView, setInView] = React.useState(false)

  React.useEffect(() => {
    const element = root.current
    if (!element || typeof IntersectionObserver === "undefined") {
      const frame = requestAnimationFrame(() => setInView(true))
      return () => cancelAnimationFrame(frame)
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setInView(true)
        observer.disconnect()
      },
      { threshold: 0.3 }
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  React.useEffect(() => {
    const element = digits.current
    if (!inView || !element) return
    const start = shown.current
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const length = reduce ? 0 : duration
    // The count follows a Web Animation with no keyframes: whatever finishes or pauses animations
    // (a screenshot tool, the browser's devtools) lands or holds the count with it.
    const clock = length > 0 ? element.animate(null, { duration: length, fill: "forwards" }) : undefined
    let frame = requestAnimationFrame(function step() {
      const time = Number(clock?.currentTime ?? length)
      const progress = !clock || clock.playState === "finished" ? 1 : Math.min(time / length, 1)
      shown.current = progress === 1 ? value : start + (value - start) * easeOut(progress)
      setCurrent(shown.current)
      if (progress < 1) frame = requestAnimationFrame(step)
    })
    return () => {
      cancelAnimationFrame(frame)
      clock?.cancel()
    }
  }, [inView, value, duration])

  return (
    <span
      ref={root}
      data-slot="number-ticker"
      className={cn("relative inline-grid justify-items-end tabular-nums", className)}
      {...props}
    >
      <span className="sr-only">{format(value)}</span>
      {/* Both ends, invisible, in the same cell: the box takes the wider one. */}
      <span aria-hidden="true" className="invisible col-start-1 row-start-1">
        {format(value)}
      </span>
      <span aria-hidden="true" className="invisible col-start-1 row-start-1">
        {format(from)}
      </span>
      <span ref={digits} data-slot="number-ticker-value" aria-hidden="true" className="col-start-1 row-start-1">
        {format(current)}
      </span>
    </span>
  )
}

export { NumberTicker }
