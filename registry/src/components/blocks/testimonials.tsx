// registry: auradata (client quotes of auradata.mx in a grid)
import * as React from "react"
import { cn } from "cn"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SectionHeader } from "@/components/ui/section-header"
import { initials } from "@/lib/initials"

export type Testimonial = {
  /** The words alone: the block adds the «» quotes. */
  quote: React.ReactNode
  name: string
  role?: React.ReactNode
  company?: React.ReactNode
  /** A photo; without one the avatar shows the person's initials. */
  avatar?: string
}

type TestimonialsProps = Omit<React.ComponentProps<"section">, "title"> & {
  eyebrow?: React.ReactNode
  title: React.ReactNode
  highlight?: React.ReactNode
  description?: React.ReactNode
  items: Testimonial[]
}

/**
 * A section of client quotes: each a `figure` with its `blockquote` and a `figcaption` naming who said
 * it (name, role · company). A grid of one, two (md) or three (lg) columns, whose cards share each
 * row's height, with the names at the bottom, so they line up across the row. Not CSS columns: a multi-column flow of these cards crashed headless Chromium in dark at
 * three columns, the renderer CI uses. The avatar is decoration beside the name: screen readers skip it.
 */
function Testimonials({ eyebrow, title, highlight, description, items, className, ...props }: TestimonialsProps) {
  const headingId = React.useId()
  return (
    <section
      data-slot="testimonials"
      aria-labelledby={headingId}
      className={cn("px-6 py-16 md:px-10 md:py-24", className)}
      {...props}
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          titleId={headingId}
          eyebrow={eyebrow}
          title={title}
          highlight={highlight}
          description={description}
        />
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <figure
              key={index}
              className="flex flex-col justify-between gap-6 rounded-(--aura-radius-card) border bg-card p-6 text-card-foreground shadow-(--aura-shadow-card)"
            >
              <blockquote className="text-base leading-relaxed text-pretty">«{item.quote}»</blockquote>
              <figcaption className="flex items-center gap-3">
                <Avatar aria-hidden="true" size="lg">
                  {item.avatar && <AvatarImage src={item.avatar} alt="" />}
                  <AvatarFallback>{initials(item.name)}</AvatarFallback>
                </Avatar>
                <span className="flex min-w-0 flex-col">
                  <span className="text-sm font-semibold">{item.name}</span>
                  {(item.role || item.company) && (
                    <span className="text-sm text-muted-foreground">
                      {[item.role, item.company].filter(Boolean).map((part, partIndex) => (
                        <React.Fragment key={partIndex}>
                          {partIndex > 0 && " · "}
                          {part}
                        </React.Fragment>
                      ))}
                    </span>
                  )}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

export { Testimonials }
