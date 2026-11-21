// registry: auradata (the footer of auradata.mx)
import { useId } from "react"
import { cn } from "cn"

import { Logo } from "@/components/ui/logo"

export type FooterLink = { label: React.ReactNode; href: string }
export type FooterColumn = { title: string; links: FooterLink[] }

type SiteFooterProps = React.ComponentProps<"footer"> & {
  /** One line under the logo. */
  tagline?: React.ReactNode
  columns: FooterColumn[]
  /** Such as «© 2026 AuraData. Todos los derechos reservados.» */
  copyright: React.ReactNode
  /** Links beside the copyright (terms, privacy). */
  legal?: FooterLink[]
  /** Where the logo goes. */
  homeHref?: string
}

/** The foot of a marketing site: the logo and a line, columns of links, and the copyright. */
function SiteFooter({ tagline, columns, copyright, legal = [], homeHref = "/", className, ...props }: SiteFooterProps) {
  const baseId = useId()
  return (
    <footer data-slot="site-footer" className={cn("border-t border-border bg-background", className)} {...props}>
      <div className="mx-auto grid max-w-6xl gap-12 px-6 pt-16 pb-12 sm:grid-cols-2 md:px-10 lg:grid-cols-[1.3fr_repeat(3,1fr)]">
        <div className="sm:col-span-2 lg:col-span-1">
          <a href={homeHref} aria-label="AuraData, inicio" className="inline-block rounded-md">
            <Logo className="h-8" />
          </a>
          {tagline && <p className="mt-4 max-w-xs text-sm text-pretty text-muted-foreground">{tagline}</p>}
        </div>
        {columns.map((column, index) => {
          const id = `${baseId}-${index}`
          return (
            <nav key={column.title} aria-labelledby={id}>
              <h2 id={id} className="text-sm font-semibold">
                {column.title}
              </h2>
              <ul className="mt-4 flex flex-col gap-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )
        })}
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-6 py-6 text-xs text-muted-foreground md:px-10">
          <small className="text-xs">{copyright}</small>
          {legal.map((link) => (
            <a key={link.href} href={link.href} className="transition-colors hover:text-foreground">
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}

export { SiteFooter }
