'use client';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

export default function InputField() {
  return (
    <Field className="max-w-xs">
      <FieldLabel htmlFor="report-name">Nombre del informe</FieldLabel>
      <Input id="report-name" defaultValue="Ventas 2026" />
      <FieldDescription>Así aparece en la lista de informes.</FieldDescription>
    </Field>
  );
}
