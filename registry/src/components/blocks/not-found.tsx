// registry: auradata (the AuraData 404 page)
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"

type NotFoundProps = {
  /** Where «Volver al inicio» goes. */
  homeHref?: string
}

/** The page for an address that does not exist: the logo, what happened and the way back. */
export function NotFound({ homeHref = "/" }: NotFoundProps) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-8 bg-background p-6 text-center md:p-10">
      <Logo className="h-8" />
      <div className="grid max-w-md gap-3">
        <p className="font-mono text-sm text-muted-foreground">Error 404</p>
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-balance">No encontramos esta página</h1>
        <p className="text-muted-foreground text-balance">
          Puede que el enlace esté mal escrito o que la página ya no exista. Revisa la dirección o vuelve al inicio.
        </p>
      </div>
      <Button size="lg" render={<a href={homeHref} />} nativeButton={false}>
        Volver al inicio
      </Button>
    </div>
  )
}
