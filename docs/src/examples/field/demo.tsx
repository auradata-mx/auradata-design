'use client';
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function FieldDemo() {
  return (
    <FieldSet className="w-full max-w-sm">
      <FieldLegend>Nuevo informe</FieldLegend>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="field-name">Nombre</FieldLabel>
          <Input id="field-name" placeholder="Ventas 2026" />
          <FieldDescription>Así lo verá tu equipo.</FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="field-notes">Notas</FieldLabel>
          <Textarea id="field-notes" />
        </Field>
      </FieldGroup>
    </FieldSet>
  );
}
