// registry: auradata (the main call to action, with a sheen that crosses it every few seconds)
import * as React from "react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"

// The sheen rests off the left edge (`-translate-x-full`, the `translate` property) and the animation's
// `transform` adds to it: it crosses in the first 40% of the loop, then rests, a glint every 3.5 s.
// Stopped (reduced motion, a screenshot tool), it stays off the button.
const KEYFRAMES = "@keyframes shimmer-sweep{0%{transform:translateX(0)}40%,100%{transform:translateX(200%)}}"

/**
 * Our `Button` with a light sheen sweeping across it: for the one main call to action of a marketing
 * page. The sheen is decorative (`aria-hidden`, no clicks), hides with reduced motion and while the
 * button is loading. It passes under the label, so the text stays crisp. It is a band of white light in both themes (dark mode's button text is dark, so
 * its own color would read as a shadow), never the brand gradient.
 */
function ShimmerButton({ className, children, loading, ...props }: React.ComponentProps<typeof Button>) {
  return (
    <Button className={cn("relative isolate overflow-hidden", className)} loading={loading} {...props}>
      {children}
      {!loading && (
        <>
          <style href="shimmer-sweep" precedence="default">
            {KEYFRAMES}
          </style>
          <span
            data-slot="shimmer"
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 -translate-x-full animate-[shimmer-sweep_3.5s_ease-in-out_infinite] bg-[linear-gradient(105deg,transparent_30%,rgb(255_255_255/0.35)_50%,transparent_70%)] motion-reduce:hidden"
          />
        </>
      )}
    </Button>
  )
}

export { ShimmerButton }
