/** The sign-in page of the published Storybook: a plain form that posts to the server in registry/server. */
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { CircleAlert } from "lucide-react"

import "./login.css"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Logo, ProductTag } from "@/components/ui/logo"

/** The Continua logos, copied into the build so the page shows them before signing in. */
const LOGO_PATH = "/login/continua"

function SignIn({ next, error }: { next: string; error: boolean }) {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 bg-(--aura-color-bg-layout) p-6 md:p-10">
      <div className="flex items-center gap-3">
        <Logo className="h-8" basePath={LOGO_PATH} />
        <ProductTag>Design</ProductTag>
      </div>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>
            <h1 className="text-xl">Storybook de AuraData</h1>
          </CardTitle>
          <CardDescription>El catálogo de componentes y la guía de marca del equipo.</CardDescription>
        </CardHeader>
        <CardContent>
          <form method="post" action="/login">
            <input type="hidden" name="next" value={next} />
            <FieldGroup>
              {error && (
                <Alert variant="destructive">
                  <CircleAlert aria-hidden="true" />
                  <AlertDescription>La contraseña no es correcta.</AlertDescription>
                </Alert>
              )}
              <Field>
                <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  autoFocus
                  required
                  aria-invalid={error || undefined}
                />
              </Field>
              <Field>
                <Button type="submit" className="w-full">
                  Entrar
                </Button>
                <FieldDescription className="text-center">
                  ¿No la tienes? Pídela a quien administra AuraData.
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}

const query = new URLSearchParams(window.location.search)

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SignIn next={query.get("next") ?? "/"} error={query.get("error") === "1"} />
  </StrictMode>
)
