// registry: auradata (the client logos of auradata.mx, as a still grid or a marquee)
import * as React from "react"
import { cn } from "cn"

import { Marquee } from "@/components/ui/marquee"

export type ClientLogo = {
  name: string
  /** The logo: an `<img alt>` or an SVG with its name; muted, as logos sit on a page. */
  logo: React.ReactNode
}

type LogoCloudProps = Omit<React.ComponentProps<"section">, "title"> & {
  /** The line above the logos, as «Empresas que ya confían en nosotros». */
  title: React.ReactNode
  logos: ClientLogo[]
  /** `grid`: still, two columns on a phone and four from sm. `marquee`: an endless row. */
  variant?: "grid" | "marquee"
  /** The list's accessible name. */
  label?: string
}

/**
 * A strip of client logos under a short line. The grid is still; the marquee moves, stops on hover,
 * focus or its pause button and does not move at all with reduced motion (see `marquee`).
 */
function LogoCloud({ title, logos, variant = "grid", label = "Clientes", className, ...props }: LogoCloudProps) {
  const headingId = React.useId()
  return (
    <section
      data-slot="logo-cloud"
      aria-labelledby={headingId}
      className={cn("px-6 py-12 md:px-10 md:py-16", className)}
      {...props}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <h2 id={headingId} className="text-center text-sm font-medium text-balance text-muted-foreground">
          {title}
        </h2>
        {variant === "marquee" ? (
          <Marquee label={label} items={logos.map((client) => client.logo)} />
        ) : (
          <ul
            aria-label={label}
            className="grid grid-cols-2 items-center justify-items-center gap-x-6 gap-y-8 sm:grid-cols-4"
          >
            {logos.map((client) => (
              <li key={client.name} className="flex max-w-full min-w-0 justify-center *:max-w-full">
                {client.logo}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

export { LogoCloud }
