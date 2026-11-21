// registry: auradata (the settings page of an AuraData app)
import { Button } from "@/components/ui/button"
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldSeparator, FieldSet, FieldLegend } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { PageHeader } from "@/components/ui/page-header"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const LANGUAGES = [
  { value: "es", label: "Español" },
  { value: "en", label: "English" },
]

/** Profile and notifications, in tabs, with one save button per tab. */
export function Settings() {
  return (
    <div className="grid max-w-3xl gap-6">
      <PageHeader title="Ajustes" description="Tu perfil y cómo te avisamos." />
      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="pt-4">
          <form className="grid gap-6">
            <FieldSet>
              <FieldLegend>Perfil</FieldLegend>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="name">Nombre</FieldLabel>
                  <Input id="name" defaultValue="Ana López" autoComplete="name" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="settings-email">Correo</FieldLabel>
                  <Input id="settings-email" type="email" defaultValue="ana@empresa.mx" autoComplete="email" />
                  <FieldDescription>Te escribimos aquí cuando un informe falla.</FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="language">Idioma</FieldLabel>
                  <Select items={LANGUAGES} defaultValue="es">
                    <SelectTrigger id="language" className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map((language) => (
                        <SelectItem key={language.value} value={language.value}>
                          {language.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </FieldGroup>
            </FieldSet>
            <div>
              <Button type="submit">Guardar cambios</Button>
            </div>
          </form>
        </TabsContent>
        <TabsContent value="notifications" className="pt-4">
          <FieldSet>
            <FieldLegend>Notificaciones</FieldLegend>
            <FieldGroup>
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldLabel htmlFor="failed">Informes que fallan</FieldLabel>
                  <FieldDescription>Un correo cuando un informe no se puede actualizar.</FieldDescription>
                </FieldContent>
                <Switch id="failed" defaultChecked />
              </Field>
              <FieldSeparator />
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldLabel htmlFor="weekly">Resumen semanal</FieldLabel>
                  <FieldDescription>Los cambios de tus informes, cada lunes.</FieldDescription>
                </FieldContent>
                <Switch id="weekly" />
              </Field>
            </FieldGroup>
          </FieldSet>
        </TabsContent>
      </Tabs>
    </div>
  )
}
