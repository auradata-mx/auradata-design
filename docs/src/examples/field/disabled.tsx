'use client';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

export default function FieldDisabled() {
  return (
    <Field className="max-w-sm" data-disabled>
      <FieldLabel htmlFor="field-workspace">Espacio</FieldLabel>
      <Input id="field-workspace" defaultValue="Ventas" disabled />
      <FieldDescription>Solo un administrador cambia el espacio de un informe.</FieldDescription>
    </Field>
  );
}
