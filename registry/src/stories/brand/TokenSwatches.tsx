/**
 * Token specimens for the brand guide. Every value comes from the token sources of
 * @auradata/tokens, never typed here, and every label keeps WCAG AA on the docs page.
 */
import brand from "../../../../packages/tokens/src/tokens/brand.json"
import light from "../../../../packages/tokens/src/tokens/light.json"

type Token = { $value: string | number; $description?: string }

/** The tokens of one group, without its `$type` and `$description`. */
function entries(group: Record<string, unknown>) {
  return Object.entries(group).filter(([name]) => !name.startsWith("$")) as [string, Token][]
}

function Name({ children }: { children: React.ReactNode }) {
  return <code className="font-mono text-xs text-foreground">{children}</code>
}

function Value({ children }: { children: React.ReactNode }) {
  return <span className="font-mono text-xs text-muted-foreground">{children}</span>
}

/** `--aura-space-*`: a bar as long as each step. */
export function SpaceScale() {
  return (
    <div className="sb-unstyled my-6 grid gap-2">
      {entries(brand.space).map(([name, token]) => (
        <div key={name} className="grid grid-cols-[9rem_4rem_1fr] items-center gap-4">
          <Name>--aura-space-{name}</Name>
          <Value>{token.$value}</Value>
          <div className="h-4 rounded-sm bg-primary" style={{ width: String(token.$value) }} />
        </div>
      ))}
    </div>
  )
}

/** `--aura-radius-*`: a tile with each corner. */
export function RadiusScale() {
  return (
    <div className="sb-unstyled my-6 flex flex-wrap gap-6">
      {entries(brand.radius).map(([name, token]) => (
        <div key={name} className="grid justify-items-start gap-2">
          <div
            className="size-20 border-2 border-primary bg-muted"
            style={{ borderRadius: String(token.$value) }}
          />
          <Name>--aura-radius-{name}</Name>
          <Value>{token.$value}</Value>
        </div>
      ))}
    </div>
  )
}

/** `--aura-shadow-*`: a card on the page background with each shadow, as the theme paints it. */
export function ShadowScale() {
  return (
    <div className="sb-unstyled my-6 grid gap-6 rounded-2xl bg-muted p-8 md:grid-cols-2">
      {entries(light.shadow).map(([name, token]) => (
        <div
          key={name}
          className="grid gap-2 rounded-(--aura-radius-card) bg-card p-6"
          style={{ boxShadow: `var(--aura-shadow-${name})` }}
        >
          <Name>--aura-shadow-{name}</Name>
          <Value>{token.$value}</Value>
        </div>
      ))}
    </div>
  )
}

/** `--aura-ease-*`: the curve of each easing, from its cubic-bezier. */
export function EaseCurves() {
  return (
    <div className="sb-unstyled my-6 flex flex-wrap gap-8">
      {entries(brand.ease).map(([name, token]) => {
        const [x1, y1, x2, y2] = (String(token.$value).match(/-?[\d.]+/g) ?? []).map(Number)
        const point = (x: number, y: number) => `${x * 100} ${100 - y * 100}`
        return (
          <div key={name} className="grid justify-items-start gap-2">
            <svg viewBox="-12 -12 124 124" className="size-32 rounded-lg bg-muted" aria-hidden>
              <path d="M0 100 L100 0" className="stroke-border" strokeWidth={1} fill="none" />
              <path
                d={`M0 100 C${point(x1, y1)} ${point(x2, y2)} 100 0`}
                className="stroke-primary"
                strokeWidth={3}
                fill="none"
              />
            </svg>
            <Name>--aura-ease-{name}</Name>
            <Value>{token.$value}</Value>
          </div>
        )
      })}
    </div>
  )
}
