// registry: auradata (the drifting brand aura behind the marketing sections)
import { cn } from "cn"

type AuraBackgroundProps = React.ComponentProps<"div"> & {
  /** The faint grid that fades toward the edges. */
  grid?: boolean
  /** `hero`: a large aura drifting at the top. `band`: one still glow in the middle, for a call to action. */
  variant?: "hero" | "band"
}

const GRID =
  "bg-[linear-gradient(to_right,color-mix(in_srgb,var(--foreground)_6%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_srgb,var(--foreground)_6%,transparent)_1px,transparent_1px)] bg-size-[56px_56px] mask-[radial-gradient(ellipse_70%_60%_at_50%_30%,#000_30%,transparent_100%)]"

const KEYFRAMES =
  "@keyframes aura-drift{0%{transform:translate3d(0,0,0) scale(1)}50%{transform:translate3d(4%,-3%,0) scale(1.08)}100%{transform:translate3d(-3%,4%,0) scale(.96)}}"

/**
 * A decorative backdrop: put it first inside a `relative isolate overflow-hidden` section. Hidden from
 * screen readers, never takes clicks, and stops drifting when the person asks for reduced motion.
 */
function AuraBackground({ grid = false, variant = "hero", className, ...props }: AuraBackgroundProps) {
  return (
    <div
      data-slot="aura-background"
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        // The hero aura is taller than its section: fade it out toward the bottom, so the section's edge
        // does not cut it into a hard line above the next one.
        variant === "hero" && "mask-[linear-gradient(to_bottom,#000_55%,transparent)]",
        // The band's glow can be as tall as a short section (a phone): fade both its edges the same way.
        variant === "band" && "mask-[linear-gradient(to_bottom,transparent,#000_25%,#000_75%,transparent)]",
        className
      )}
      {...props}
    >
      {/* The keyframes travel with the component: React 19 hoists this once into the head. */}
      <style href="aura-drift" precedence="default">
        {KEYFRAMES}
      </style>
      {grid && <div data-slot="aura-grid" className={cn("absolute inset-0", GRID)} />}
      {variant === "hero" ? (
        <>
          <div className="absolute -top-1/3 left-1/2 h-160 w-225 max-w-none -translate-x-1/2 animate-[aura-drift_18s_ease-in-out_infinite_alternate] rounded-full bg-[conic-gradient(from_160deg_at_50%_50%,var(--aura-brand-blue),var(--aura-brand-violet),var(--aura-brand-green),var(--aura-brand-blue))] opacity-22 blur-[120px] motion-reduce:animate-none dark:opacity-30" />
          <div className="absolute top-1/4 -right-40 size-90 rounded-full bg-(--aura-brand-green)/15 blur-[100px]" />
        </>
      ) : (
        <div className="absolute top-1/2 left-1/2 h-60 w-[min(680px,90%)] -translate-1/2 rounded-full bg-[linear-gradient(90deg,var(--aura-brand-blue),var(--aura-brand-violet),var(--aura-brand-green))] opacity-16 blur-[80px] dark:opacity-25" />
      )}
    </div>
  )
}

export { AuraBackground }
