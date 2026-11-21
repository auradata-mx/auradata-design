/** A type specimen for the docs pages, in the brand fonts and colors (Storybook's Typeset labels fail WCAG AA). */
export function TypeScale({
  font,
  sizes,
  sample,
  weight = 400,
}: {
  font: "sans" | "mono"
  sizes: number[]
  sample: string
  weight?: number
}) {
  return (
    <div className="sb-unstyled my-6 grid gap-3">
      {sizes.map((size) => (
        <div key={size} className="flex items-baseline gap-6">
          <span className="w-12 shrink-0 font-mono text-xs text-muted-foreground">
            {size} px
          </span>
          <span
            className={font === "mono" ? "font-mono" : "font-sans"}
            style={{ fontSize: size, fontWeight: weight, lineHeight: 1.25 }}
          >
            {sample}
          </span>
        </div>
      ))}
    </div>
  )
}
