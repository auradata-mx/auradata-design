// registry: auradata (the AuraData sign-in page, with error and pending states)
import { CircleAlertIcon } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Logo, ProductTag } from "@/components/ui/logo"

type LoginProps = {
  /** The product next to the logo, such as "BI". */
  product?: string
  /** The form, with the inputs named `email` and `password`: read them with `new FormData(event.currentTarget)`. */
  onSubmit?: React.ComponentProps<"form">["onSubmit"]
  /** Why signing in failed, from the server: an alert above the form, both inputs marked invalid. */
  error?: string
  /** Signing in: the button spins and the inputs wait. */
  pending?: boolean
}

/** Sign in with email and password, centered on the layout background. */
export function Login({ product, onSubmit, error, pending = false }: LoginProps) {
  const invalid = error ? true : undefined
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-sidebar p-6 md:p-10">
      <a href="/" className="flex items-center gap-3">
        <Logo className="h-8" />
        {product && <ProductTag>{product}</ProductTag>}
      </a>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Inicia sesión</CardTitle>
          <CardDescription>Entra con el correo de tu empresa.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <FieldGroup>
              {error && (
                <Alert variant="destructive">
                  <CircleAlertIcon aria-hidden />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Field>
                <FieldLabel htmlFor="email">Correo</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="ana@empresa.mx"
                  required
                  disabled={pending}
                  aria-invalid={invalid}
                />
              </Field>
              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                  <a href="#" className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
                    ¿La olvidaste?
                  </a>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  disabled={pending}
                  aria-invalid={invalid}
                />
              </Field>
              <Field>
                <Button type="submit" className="w-full" loading={pending}>
                  {pending ? "Entrando…" : "Entrar"}
                </Button>
                <FieldDescription className="text-center">
                  ¿Sin cuenta? Pídela a quien administra tu espacio.
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
