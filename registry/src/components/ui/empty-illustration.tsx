// registry: auradata (sober brand illustrations for empty states: no reports, no data, no results, offline)
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

type EmptyIllustrationName = "reports" | "data" | "results" | "offline"

const emptyIllustrationVariants = cva("shrink-0", {
  variants: {
    size: {
      default: "h-30 w-40",
      sm: "h-21 w-28",
    },
  },
  defaultVariants: { size: "default" },
})

/* Shared strokes: lines in the muted text color on card-colored shapes, one accent in the brand primary. */
const LINE = "fill-card stroke-muted-foreground"
const FAINT = "stroke-muted-foreground/45"
const ACCENT = "stroke-primary"

function Reports() {
  return (
    <>
      <rect x="36" y="28" width="88" height="64" rx="8" className={LINE} />
      <path d="M36 42h88" className="stroke-muted-foreground" />
      <circle cx="45" cy="35" r="2" className="fill-muted-foreground" />
      <circle cx="52" cy="35" r="2" className="fill-muted-foreground" />
      <path d="M54 80V66M68 80V56M82 80V70M96 80V61" strokeWidth="6" strokeDasharray="2 4" className={FAINT} />
      <circle cx="120" cy="88" r="12" className="fill-primary" />
      <path d="M120 82v12M114 88h12" strokeWidth="2.5" className="stroke-primary-foreground" />
    </>
  )
}

function Data() {
  return (
    <>
      <path d="M50 38v44c0 5 13.4 9 30 9s30-4 30-9V38" className={LINE} />
      <path d="M50 60c0 5 13.4 9 30 9s30-4 30-9" className="fill-none stroke-muted-foreground" />
      <ellipse cx="80" cy="38" rx="30" ry="9" className={LINE} />
      <circle cx="112" cy="86" r="12" className="fill-card stroke-primary" strokeWidth="2.5" />
      <path d="M106.5 86h11" strokeWidth="2.5" className={ACCENT} />
    </>
  )
}

function Results() {
  return (
    <>
      <rect x="42" y="24" width="56" height="72" rx="6" className={LINE} />
      <path d="M52 40h28M52 50h36M52 60h20" strokeDasharray="2 4" className={FAINT} />
      <circle cx="98" cy="74" r="16" className="fill-card stroke-primary" strokeWidth="3" />
      <path d="M109.5 85.5l12 12" strokeWidth="4" className={ACCENT} />
      <path d="M93.5 69.5l9 9M102.5 69.5l-9 9" strokeWidth="2.5" className={ACCENT} />
    </>
  )
}

function Offline() {
  return (
    <>
      <path d="M58 86h48a17 17 0 0 0 1.5-33.9A24 24 0 0 0 61.4 48 19 19 0 0 0 58 86z" className={LINE} />
      <path d="M50 30l60 64" strokeWidth="3" className={ACCENT} />
    </>
  )
}

const ART = { reports: Reports, data: Data, results: Results, offline: Offline }

/**
 * A line drawing for `EmptyMedia`: «sin informes» (`reports`), «sin datos» (`data`), «sin resultados»
 * (`results`) and «sin conexión» (`offline`). Decorative (`aria-hidden`): the empty state's title says
 * what is missing. Drawn in the theme's colors, so it holds in light and dark.
 */
function EmptyIllustration({
  name,
  size,
  className,
  ...props
}: Omit<React.ComponentProps<"svg">, "children"> &
  VariantProps<typeof emptyIllustrationVariants> & { name: EmptyIllustrationName }) {
  const Art = ART[name]
  return (
    <svg
      data-slot="empty-illustration"
      data-name={name}
      viewBox="0 0 160 120"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={cn(emptyIllustrationVariants({ size }), className)}
      {...props}
    >
      <circle cx="80" cy="60" r="52" className="fill-muted" />
      <Art />
    </svg>
  )
}

export { EmptyIllustration, emptyIllustrationVariants, type EmptyIllustrationName }
