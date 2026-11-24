// Internal form example used by the brand validation guide.
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { NumberInput } from "@/components/ui/number-input"
import { PasswordInput } from "@/components/ui/password-input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

const ENGINES = [
  { value: "postgresql", label: "PostgreSQL", port: 5432 },
  { value: "mysql", label: "MySQL", port: 3306 },
  { value: "sqlserver", label: "SQL Server", port: 1433 },
] as const

/** What makes a connection valid, with the messages the person reads: what is wrong and how to fix it. */
const connectionSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Escribe un nombre para la conexión.")
    .max(60, "Usa 60 caracteres o menos."),
  engine: z.enum(["postgresql", "mysql", "sqlserver"], {
    error: "Elige el motor de la base de datos.",
  }),
  host: z
    .string()
    .trim()
    .min(1, "Escribe el servidor, como db.empresa.mx.")
    .regex(
      /^[a-z0-9.-]+$/i,
      "Escribe solo el nombre o la IP del servidor, sin https:// ni /."
    ),
  port: z
    .number({ error: "Escribe el puerto, como 5432." })
    .int("Escribe un número entero.")
    .min(1, "El puerto va de 1 a 65535.")
    .max(65535, "El puerto va de 1 a 65535."),
  database: z.string().trim().min(1, "Escribe el nombre de la base de datos."),
  username: z.string().trim().min(1, "Escribe el usuario."),
  password: z.string().min(1, "Escribe la contraseña."),
  ssl: z.boolean(),
})

type ConnectionValues = z.infer<typeof connectionSchema>
type ConnectionInput = z.input<typeof connectionSchema>

/** What the server rejected: per field («Ya existe una conexión con ese nombre.») or for the whole form. */
type ConnectionErrors = Partial<Record<keyof ConnectionValues | "form", string>>

type ConnectionFormProps = {
  defaultValues?: Partial<ConnectionInput>
  /** Saves the connection. Return the server's errors to show them; throw for anything unexpected. */
  onSubmit: (
    values: ConnectionValues
  ) => Promise<ConnectionErrors | void> | ConnectionErrors | void
  onCancel?: () => void
}

const EMPTY: ConnectionInput = {
  name: "",
  engine: "postgresql",
  host: "",
  port: 5432,
  database: "",
  username: "",
  password: "",
  ssl: true,
}

/**
 * A new database connection. Errors show when a field is left and on submit, never while typing; submitting
 * takes the focus to the first field with an error; the save button spins while the server answers.
 */
function ConnectionForm({
  defaultValues,
  onSubmit,
  onCancel,
}: ConnectionFormProps) {
  const form = useForm<ConnectionInput, unknown, ConnectionValues>({
    resolver: zodResolver(connectionSchema),
    defaultValues: { ...EMPTY, ...defaultValues },
    // Brand/11: format on leaving the field, everything on submit; once shown, an error clears as it is fixed.
    mode: "onTouched",
  })
  const {
    control,
    formState,
    handleSubmit,
    setError,
    setValue,
    getFieldState,
  } = form
  const formError = formState.errors.root?.server?.message

  const submit = handleSubmit(async (values) => {
    const errors = await onSubmit(values)
    if (!errors) return
    const { form: message, ...fields } = errors
    if (message) setError("root.server", { message })
    for (const [name, text] of Object.entries(fields)) {
      setError(
        name as keyof ConnectionValues,
        { message: text },
        { shouldFocus: true }
      )
    }
  })

  return (
    <form
      noValidate
      onSubmit={submit}
      aria-labelledby="connection-form-title"
      className="flex w-full max-w-xl flex-col gap-6"
    >
      <div className="flex flex-col gap-1">
        <h2 id="connection-form-title" className="text-lg font-semibold">
          Nueva conexión
        </h2>
        <p className="text-sm text-pretty text-muted-foreground">
          AuraData BI lee tus datos desde aquí. Usa un usuario de solo lectura.
        </p>
      </div>

      {formError && (
        <Alert variant="destructive">
          <AlertTitle>No pudimos guardar la conexión</AlertTitle>
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      )}

      <FieldGroup>
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <FieldLabel htmlFor="connection-name">Nombre</FieldLabel>
              <Input
                {...field}
                id="connection-name"
                autoComplete="off"
                aria-invalid={fieldState.invalid || undefined}
                aria-describedby="connection-name-help"
              />
              {fieldState.error ? (
                <FieldError id="connection-name-help">
                  {fieldState.error.message}
                </FieldError>
              ) : (
                <FieldDescription id="connection-name-help">
                  Así la verá tu equipo, como «Ventas producción».
                </FieldDescription>
              )}
            </Field>
          )}
        />

        <Controller
          name="engine"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <FieldLabel htmlFor="connection-engine">Motor</FieldLabel>
              <Select
                items={ENGINES.map(({ value, label }) => ({ value, label }))}
                value={field.value}
                onValueChange={(engine) => {
                  field.onChange(engine)
                  // A new engine brings its usual port, unless the person typed one.
                  const known = ENGINES.find(({ value }) => value === engine)
                  if (known && !getFieldState("port").isDirty) {
                    setValue("port", known.port)
                  }
                }}
              >
                <SelectTrigger
                  ref={field.ref}
                  id="connection-engine"
                  className="w-full"
                  onBlur={field.onBlur}
                  aria-invalid={fieldState.invalid || undefined}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ENGINES.map((engine) => (
                    <SelectItem key={engine.value} value={engine.value}>
                      {engine.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />

        <div className="grid gap-5 sm:grid-cols-[1fr_9rem]">
          <Controller
            name="host"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid || undefined}>
                <FieldLabel htmlFor="connection-host">Servidor</FieldLabel>
                <Input
                  {...field}
                  id="connection-host"
                  placeholder="db.empresa.mx"
                  autoComplete="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  aria-invalid={fieldState.invalid || undefined}
                />
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />
          <Controller
            name="port"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid || undefined}>
                <FieldLabel htmlFor="connection-port">Puerto</FieldLabel>
                <NumberInput
                  id="connection-port"
                  inputRef={field.ref}
                  value={field.value ?? null}
                  onValueChange={(port) => field.onChange(port ?? undefined)}
                  onBlur={field.onBlur}
                  min={1}
                  max={65535}
                  format={{ useGrouping: false }}
                  aria-invalid={fieldState.invalid || undefined}
                />
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />
        </div>

        <Controller
          name="database"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <FieldLabel htmlFor="connection-database">
                Base de datos
              </FieldLabel>
              <Input
                {...field}
                id="connection-database"
                autoComplete="off"
                spellCheck={false}
                aria-invalid={fieldState.invalid || undefined}
              />
              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <Controller
            name="username"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid || undefined}>
                <FieldLabel htmlFor="connection-username">Usuario</FieldLabel>
                <Input
                  {...field}
                  id="connection-username"
                  autoComplete="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  aria-invalid={fieldState.invalid || undefined}
                />
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />
          <Controller
            name="password"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid || undefined}>
                <FieldLabel htmlFor="connection-password">
                  Contraseña
                </FieldLabel>
                <PasswordInput
                  {...field}
                  id="connection-password"
                  // The database's password, not the person's: no autofill.
                  autoComplete="off"
                  aria-invalid={fieldState.invalid || undefined}
                />
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />
        </div>

        <Controller
          name="ssl"
          control={control}
          render={({ field }) => (
            <Field orientation="horizontal">
              <FieldContent>
                <FieldLabel htmlFor="connection-ssl">
                  Conexión cifrada (SSL)
                </FieldLabel>
                <FieldDescription>
                  Apágala solo si tu servidor no la acepta.
                </FieldDescription>
              </FieldContent>
              <Switch
                id="connection-ssl"
                ref={field.ref}
                checked={field.value}
                onCheckedChange={field.onChange}
                onBlur={field.onBlur}
              />
            </Field>
          )}
        />
      </FieldGroup>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" loading={formState.isSubmitting}>
          {formState.isSubmitting ? "Guardando…" : "Guardar conexión"}
        </Button>
      </div>
    </form>
  )
}

export { ConnectionForm, connectionSchema }
export type {
  ConnectionErrors,
  ConnectionFormProps,
  ConnectionInput,
  ConnectionValues,
}
