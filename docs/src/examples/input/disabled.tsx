'use client';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

export default function InputDisabled() {
  return (
    <Field className="max-w-xs" data-disabled>
      <FieldLabel htmlFor="workspace">Espacio</FieldLabel>
      <Input id="workspace" defaultValue="Ventas" disabled />
      <FieldDescription>El espacio lo fija tu administrador.</FieldDescription>
    </Field>
  );
}
