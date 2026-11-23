// registry: auradata (a guided tour: steps anchored to the page's elements, keyboard first, skippable at any step)
"use client"

import * as React from "react"
import { Popover as PopoverPrimitive } from "@base-ui/react/popover"
import { cn } from "cn"

import { Button } from "@/components/ui/button"

type TourStep = {
  /** The element the step points at: a CSS selector («#nuevo-informe») or a function that finds it. */
  target: string | (() => Element | null)
  title: string
  description: React.ReactNode
  /** Where the card sits next to the target. It flips when there is no room. */
  side?: "top" | "bottom" | "left" | "right"
}

type TourProps = {
  steps: TourStep[]
  open: boolean
  onOpenChange: (open: boolean) => void
  /** The step to open on. The tour keeps its own step afterwards. */
  defaultStep?: number
  onStepChange?: (step: number) => void
  /** «Terminar» on the last step. */
  onComplete?: () => void
  /** «Saltar tour» or Escape, with the step it was left on. */
  onSkip?: (step: number) => void
}

/** The gap between the target and its highlight ring. */
const RING_GAP = 4

function find(target: TourStep["target"]) {
  return typeof target === "string" ? document.querySelector(target) : target()
}

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)"

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION)
  query.addEventListener("change", onChange)
  return () => query.removeEventListener("change", onChange)
}

function useReducedMotion() {
  return React.useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false
  )
}

/**
 * The step's element: brought into view, and its box kept current while the page scrolls or resizes.
 * Null while the tour is closed.
 */
function useTargetRect(target: TourStep["target"] | undefined, open: boolean, reduced: boolean) {
  const [rect, setRect] = React.useState<DOMRect | null>(null)
  React.useLayoutEffect(() => {
    const element = open && target ? find(target) : null
    if (!element) return
    element.scrollIntoView({ block: "nearest", inline: "nearest", behavior: reduced ? "auto" : "smooth" })
    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => setRect(element.getBoundingClientRect()))
    }
    update()
    // A smooth scroll moves the element after this frame: the scroll listener follows it.
    const observer = new ResizeObserver(update)
    observer.observe(element)
    window.addEventListener("scroll", update, true)
    window.addEventListener("resize", update)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener("scroll", update, true)
      window.removeEventListener("resize", update)
    }
  }, [target, open, reduced])
  return open ? rect : null
}

/**
 * A card next to each step's element, with «Paso 1 de 3», «Anterior», «Siguiente» / «Terminar» and
 * «Saltar tour». The page around the element dims; the card is a non-modal dialog, so a click outside
 * leaves it open and Escape skips it. The app owns `open` (it remembers whether the tour was seen).
 */
function Tour({ steps, open, onOpenChange, defaultStep = 0, onStepChange, onComplete, onSkip }: TourProps) {
  const [index, setIndex] = React.useState(defaultStep)
  const primary = React.useRef<HTMLButtonElement>(null)
  const reduced = useReducedMotion()
  const step = steps[Math.min(index, steps.length - 1)]
  const last = index >= steps.length - 1
  const target = step?.target
  const rect = useTargetRect(target, open, reduced)
  // Base UI resolves the anchor itself, from the step's element.
  const anchor = React.useCallback(() => (target ? find(target) : null), [target])

  // The primary button takes the focus on every step, so Enter walks the tour.
  React.useEffect(() => {
    if (open) primary.current?.focus({ preventScroll: true })
  }, [open, index])

  if (!step) return null

  function go(next: number) {
    setIndex(next)
    onStepChange?.(next)
  }

  function close() {
    onOpenChange(false)
    setIndex(defaultStep)
  }

  function skip() {
    onSkip?.(index)
    close()
  }

  return (
    <PopoverPrimitive.Root
      open={open}
      onOpenChange={(next, details) => {
        if (next) return
        // Only Escape (and the card's own buttons) end the tour: a click on the page does not.
        if (details.reason === "escape-key") skip()
      }}
    >
      <PopoverPrimitive.Portal>
        {rect && (
          <div
            aria-hidden
            data-slot="tour-highlight"
            // An outline, not a ring: the dimming below is the box-shadow, and a Tailwind ring is one too.
            className="pointer-events-none fixed z-50 rounded-xl outline-2 outline-primary transition-[top,left,width,height] duration-200 outline-solid motion-reduce:transition-none"
            style={{
              top: rect.top - RING_GAP,
              left: rect.left - RING_GAP,
              width: rect.width + RING_GAP * 2,
              height: rect.height + RING_GAP * 2,
              // The page around the target dims.
              boxShadow: "0 0 0 100vmax rgb(0 0 0 / 0.45)",
            }}
          />
        )}
        <PopoverPrimitive.Positioner
          anchor={anchor}
          side={step.side ?? "bottom"}
          align="start"
          sideOffset={12}
          collisionPadding={16}
          className="isolate z-50"
        >
          <PopoverPrimitive.Popup
            data-slot="tour"
            initialFocus={primary}
            finalFocus={false}
            className={cn(
              "grid w-80 max-w-[calc(100vw-2rem)] gap-4 rounded-xl bg-popover p-4 text-sm text-popover-foreground shadow-(--elevation-overlay) ring-1 ring-foreground/10 outline-none",
              "origin-(--transform-origin) duration-150 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 motion-reduce:animate-none"
            )}
          >
            <div className="grid gap-1.5">
              <p className="text-xs font-medium text-muted-foreground">
                Paso {index + 1} de {steps.length}
              </p>
              <PopoverPrimitive.Title className="font-heading text-base font-semibold">{step.title}</PopoverPrimitive.Title>
              <PopoverPrimitive.Description className="text-muted-foreground">{step.description}</PopoverPrimitive.Description>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="-ml-2.5 text-muted-foreground" onClick={skip}>
                Saltar tour
              </Button>
              <div className="ml-auto flex gap-2">
                {index > 0 && (
                  <Button variant="outline" size="sm" onClick={() => go(index - 1)}>
                    Anterior
                  </Button>
                )}
                <Button
                  ref={primary}
                  size="sm"
                  onClick={() => {
                    if (!last) return go(index + 1)
                    onComplete?.()
                    close()
                  }}
                >
                  {last ? "Terminar" : "Siguiente"}
                </Button>
              </div>
            </div>
          </PopoverPrimitive.Popup>
        </PopoverPrimitive.Positioner>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}

export { Tour, type TourProps, type TourStep }
