// registry: auradata (a card with a soft brand glow that follows the mouse and lights its edge)
import * as React from "react"
import { cn } from "cn"

import { Card } from "@/components/ui/card"

// The glow, centered where the pointer is (the card sets --spotlight-x/y as it moves).
const GLOW = "radial-gradient(var(--spotlight-size) circle at var(--spotlight-x) var(--spotlight-y)"
// Only the border box: the padding (1px) is all that the mask leaves.
const EDGE_MASK = "linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0)"

type SpotlightCardProps = React.ComponentProps<typeof Card> & {
  /** The glow's diameter: any CSS length. */
  spotlightSize?: string
}

/**
 * A shadcn `Card` whose surface takes a faint primary glow under the mouse, brighter on the edge. The
 * glow is decorative (`aria-hidden`), shows only where a device hovers (a mouse or pen, never a finger)
 * and fades in without a transition when reduced motion is asked for. Moving the pointer writes two CSS
 * variables on the card, so React does not render on each move.
 */
function SpotlightCard({ spotlightSize = "22rem", className, style, onPointerMove, children, ...props }: SpotlightCardProps) {
  const move = (event: React.PointerEvent<HTMLDivElement>) => {
    onPointerMove?.(event)
    if (event.pointerType === "touch") return
    const box = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty("--spotlight-x", `${Math.round(event.clientX - box.left)}px`)
    event.currentTarget.style.setProperty("--spotlight-y", `${Math.round(event.clientY - box.top)}px`)
  }
  const layer =
    "pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/spotlight:opacity-100 motion-reduce:transition-none"
  return (
    <Card
      className={cn("group/spotlight relative isolate", className)}
      style={{ "--spotlight-size": spotlightSize, "--spotlight-x": "50%", "--spotlight-y": "0px", ...style } as React.CSSProperties}
      onPointerMove={move}
      {...props}
    >
      <div
        data-slot="spotlight"
        aria-hidden="true"
        className={cn(layer, "-z-10")}
        style={{ backgroundImage: `${GLOW}, color-mix(in srgb, var(--primary) 10%, transparent), transparent 70%)` }}
      />
      <div
        data-slot="spotlight-edge"
        aria-hidden="true"
        className={cn(layer, "z-10 p-px")}
        style={{
          backgroundImage: `${GLOW}, color-mix(in srgb, var(--primary) 55%, transparent), transparent 60%)`,
          mask: EDGE_MASK,
        }}
      />
      {children}
    </Card>
  )
}

export { SpotlightCard }
