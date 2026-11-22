// registry: auradata (the section label of auradata.mx)
import { cn } from "cn"

/** The label above a section title: a mono pill with a dot in the brand colors. */
function Eyebrow({ className, children, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="eyebrow"
      className={cn(
        "inline-flex w-fit max-w-full items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 font-mono text-[0.6875rem] font-medium tracking-[0.04em] text-muted-foreground uppercase backdrop-blur-sm sm:text-xs",
        className
      )}
      {...props}
    >
      <span
        aria-hidden
        className="size-1.5 shrink-0 rounded-full bg-[linear-gradient(135deg,var(--aura-brand-blue),var(--aura-brand-green))]"
      />
      {/* A pill holds one line: a label too long for a small phone ends in an ellipsis instead of wrapping. */}
      <span className="min-w-0 truncate">{children}</span>
    </p>
  )
}

export { Eyebrow }
