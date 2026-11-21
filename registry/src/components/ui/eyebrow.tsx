// registry: auradata (the section label of auradata.mx)
import { cn } from "cn"

/** The label above a section title: a mono pill with a dot in the brand colors. */
function Eyebrow({ className, children, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="eyebrow"
      className={cn(
        "inline-flex w-fit items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 font-mono text-xs font-medium tracking-[0.04em] text-muted-foreground uppercase backdrop-blur-sm",
        className
      )}
      {...props}
    >
      <span
        aria-hidden
        className="size-1.5 shrink-0 rounded-full bg-[linear-gradient(135deg,var(--aura-brand-blue),var(--aura-brand-green))]"
      />
      {children}
    </p>
  )
}

export { Eyebrow }
