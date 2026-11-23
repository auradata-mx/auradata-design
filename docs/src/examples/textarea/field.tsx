'use client';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';

export default function TextareaField() {
  return (
    <Field className="max-w-sm">
      <FieldLabel htmlFor="report-description">Descripción</FieldLabel>
      <Textarea
        id="report-description"
        defaultValue="Ventas por sucursal y por mes, con la meta del trimestre."
      />
      <FieldDescription>Aparece debajo del título del informe.</FieldDescription>
    </Field>
  );
}
