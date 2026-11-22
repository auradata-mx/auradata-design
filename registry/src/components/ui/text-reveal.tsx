// registry: auradata (text whose words rise and light up as the page scrolls, in CSS alone)
import * as React from "react"
import { cn } from "cn"

// Only where the browser has scroll-driven animations and nobody asked for reduced motion: anywhere
// else the rule does not exist and the text is plain. Each word follows its own view timeline, through
// a slice of the range that starts later for later words. A word starts in the muted text color, never
// transparent: every frame of the scroll keeps AA contrast. With no `to`, it lands on its own color.
const CSS =
  "@keyframes text-reveal{from{color:var(--muted-foreground);translate:0 .25em}}" +
  "@media (prefers-reduced-motion:no-preference){@supports (animation-timeline:view()){" +
  "[data-slot=text-reveal-word]{animation:text-reveal linear both;animation-timeline:view();" +
  "animation-range:cover var(--reveal-start) cover var(--reveal-end)}}}"

type TextRevealProps = React.ComponentProps<"p"> & {
  as?: "p" | "h1" | "h2" | "h3" | "span" | "div"
  /** How much of the scroll the words share: later words start later inside it (percent of `cover`). */
  spread?: number
}

/**
 * Words that rise and light up from the muted text color, one after another, while they scroll into
 * the lower half of the view: readable at every step, never faded below AA.
 * Plain-text children are split into words (still one sentence for screen readers and search); any
 * other children reveal as one block. No JavaScript runs on scroll: it is a CSS scroll-driven
 * animation, so it stays smooth on a phone, and older browsers or reduced motion show the text as is.
 */
function TextReveal({ as: Element = "p", spread = 25, className, children, ...props }: TextRevealProps) {
  const words = typeof children === "string" ? children.split(/\s+/).filter(Boolean) : null
  const word = (content: React.ReactNode, index: number, count: number) => {
    const start = 8 + (spread * index) / Math.max(count - 1, 1)
    return (
      <span
        data-slot="text-reveal-word"
        className="inline-block"
        style={{ "--reveal-start": `${start}%`, "--reveal-end": `${start + 12}%` } as React.CSSProperties}
      >
        {content}
      </span>
    )
  }
  return (
    <Element data-slot="text-reveal" className={cn(className)} {...props}>
      <style href="text-reveal" precedence="default">
        {CSS}
      </style>
      {words
        ? words.map((text, index) => (
            <React.Fragment key={index}>
              {index > 0 && " "}
              {word(text, index, words.length)}
            </React.Fragment>
          ))
        : word(children, 0, 1)}
    </Element>
  )
}

export { TextReveal }
