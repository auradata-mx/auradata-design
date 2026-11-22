// registry: auradata (an endless row of client logos that stops on hover, focus or its pause button)
import * as React from "react"
import { PauseIcon, PlayIcon } from "lucide-react"
import { cn } from "cn"

type MarqueeProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** The logos (or cards): each becomes a list item. */
  items: React.ReactNode[]
  /** The list's accessible name, as «Clientes». */
  label: string
  /** Seconds for one pass of the items. */
  duration?: number
  /** Move right instead of left. */
  reverse?: boolean
  /** Space between items, also kept between the last item and the next pass: any CSS length. */
  gap?: string
  /** Copies of the row laid end to end; add one when a short row leaves a hole on wide screens. */
  copies?: number
  pauseLabel?: string
  resumeLabel?: string
}

// Each copy moves by its own width; with the gap after the last item too, the next copy lands exactly
// where the first began, so the loop never jumps.
const KEYFRAMES = "@keyframes marquee-scroll{to{transform:translate3d(-100%,0,0)}}"

/**
 * Moving content needs a way to stop it (WCAG 2.2.2): the row stops while the pointer is over it or
 * focus is inside it, and a pause button, hidden until a keyboard reaches it, keeps it stopped (and
 * stays in view to resume it). A tap on a phone does not stop it: only a mouse or pen hovers. With
 * reduced motion the row does not move at all: the items wrap, centered, and the copies go away.
 */
function Marquee({
  items,
  label,
  duration = 40,
  reverse = false,
  gap = "3rem",
  copies = 3,
  pauseLabel = "Pausar",
  resumeLabel = "Reanudar",
  className,
  style,
  ...props
}: MarqueeProps) {
  const [paused, setPaused] = React.useState(false)
  const [hovered, setHovered] = React.useState(false)
  const hover = (value: boolean) => (event: React.PointerEvent) => {
    if (event.pointerType !== "touch") setHovered(value)
  }
  const track = (copy: number) => (
    <ul
      key={copy}
      data-slot="marquee-track"
      aria-label={copy === 0 ? label : undefined}
      aria-hidden={copy > 0 || undefined}
      inert={copy > 0}
      className={cn(
        "flex shrink-0 items-center gap-(--marquee-gap) pr-(--marquee-gap)",
        "animate-[marquee-scroll_var(--marquee-duration)_linear_infinite] group-data-hovered/marquee:[animation-play-state:paused] group-focus-within/marquee:[animation-play-state:paused] group-data-paused/marquee:[animation-play-state:paused]",
        reverse && "[animation-direction:reverse]",
        "motion-reduce:animate-none motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:pr-0",
        copy > 0 && "motion-reduce:hidden"
      )}
    >
      {items.map((item, index) => (
        <li key={index} className="flex shrink-0 items-center">
          {item}
        </li>
      ))}
    </ul>
  )
  return (
    <div
      data-slot="marquee"
      data-paused={paused || undefined}
      data-hovered={hovered || undefined}
      onPointerEnter={hover(true)}
      onPointerLeave={hover(false)}
      className={cn("group/marquee relative", className)}
      style={{ "--marquee-duration": `${duration}s`, "--marquee-gap": gap, ...style } as React.CSSProperties}
      {...props}
    >
      <style href="marquee-scroll" precedence="default">
        {KEYFRAMES}
      </style>
      <div
        data-slot="marquee-viewport"
        className="flex overflow-hidden mask-[linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)] py-1 motion-reduce:justify-center motion-reduce:mask-none"
      >
        {Array.from({ length: copies }, (_, copy) => track(copy))}
      </div>
      <button
        type="button"
        data-slot="marquee-pause"
        aria-pressed={paused}
        aria-label={paused ? resumeLabel : pauseLabel}
        onClick={() => setPaused((value) => !value)}
        className={cn(
          "absolute top-1/2 right-0 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border bg-background text-foreground shadow-(--aura-shadow-card) motion-reduce:hidden",
          // Hidden until a keyboard reaches it; once it paused the row it stays, to resume it.
          !paused && "not-focus-visible:sr-only"
        )}
      >
        {paused ? <PlayIcon aria-hidden className="size-4" /> : <PauseIcon aria-hidden className="size-4" />}
      </button>
    </div>
  )
}

export { Marquee }
