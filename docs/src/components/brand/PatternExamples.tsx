'use client';

import { ConnectionForm } from '@/components/blocks/connection-form'
import { KpiCard } from '@/components/blocks/kpi-card'
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Filter, presetRange } from '@/components/ui/filter'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/ui/page-header'

const TODAY = new Date(2026, 10, 21)

export function ReportFormExample() {
  return (
    <div className="not-prose my-6 max-w-sm">
      <form onSubmit={(event) => event.preventDefault()} noValidate>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="pattern-name">Nombre del informe</FieldLabel>
            <Input id="pattern-name" defaultValue="Ventas 2026" />
            <FieldDescription>Así lo verá tu equipo.</FieldDescription>
          </Field>
          <Field data-invalid>
            <FieldLabel htmlFor="pattern-email">Correo para el resumen</FieldLabel>
            <Input id="pattern-email" type="email" aria-invalid defaultValue="ana@" />
            <FieldError>{'Escribe un correo completo, como ana@empresa.mx.'}</FieldError>
          </Field>
          <div className="flex gap-2">
            <Button type="submit">Guardar cambios</Button>
            <Button type="button" variant="outline">Cancelar</Button>
          </div>
        </FieldGroup>
      </form>
    </div>
  );
}

export function ConnectionFormExample() {
  return (
    <div className="not-prose my-6 rounded-2xl border p-6">
      <ConnectionForm onSubmit={() => {}} />
    </div>
  );
}

export function ReportExample() {
  return (
    <div className="not-prose my-6 grid gap-6 rounded-2xl border p-6">
      <PageHeader
        title="Ventas 2026"
        description="Actualizado hace 5 minutos."
        actions={
          <>
            <Filter type="date" today={TODAY} defaultValue={presetRange('this-month', TODAY)} />
            <Button>Compartir</Button>
          </>
        }
      />
      <div className="grid gap-4 lg:grid-cols-3">
        <KpiCard label="Ventas del mes" value="$4.16 M" change={0.062} comparison="vs. octubre" />
        <KpiCard label="Clientes activos" value="1,284" change={-0.021} comparison="vs. octubre" />
        <KpiCard label="Costo de envío" value="$182,400" change={0.04} goodDirection="down" comparison="vs. octubre" />
      </div>
    </div>
  );
}
