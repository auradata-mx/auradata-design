'use client';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

export default function InputInvalid() {
  return (
    <Field className="max-w-xs" data-invalid>
      <FieldLabel htmlFor="email">Correo</FieldLabel>
      <Input id="email" type="email" defaultValue="ana@" aria-invalid />
      <FieldError>Escribe un correo completo, como ana@empresa.mx.</FieldError>
    </Field>
  );
}
