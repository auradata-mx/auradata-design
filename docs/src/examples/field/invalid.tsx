'use client';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

export default function FieldInvalid() {
  return (
    <Field className="max-w-sm" data-invalid>
      <FieldLabel htmlFor="field-email">Correo</FieldLabel>
      <Input id="field-email" aria-invalid aria-describedby="field-email-error" defaultValue="ana@" />
      <FieldError id="field-email-error">Escribe un correo completo, como ana@empresa.mx.</FieldError>
    </Field>
  );
}
