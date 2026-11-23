'use client';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

export default function FieldMultipleErrors() {
  return (
    <Field className="max-w-sm" data-invalid>
      <FieldLabel htmlFor="field-password">Contraseña</FieldLabel>
      <Input
        id="field-password"
        type="password"
        aria-invalid
        aria-describedby="field-password-errors"
        defaultValue="ventas"
      />
      <FieldError
        id="field-password-errors"
        errors={[
          { message: 'Usa al menos 12 caracteres.' },
          { message: 'Agrega un número.' },
          { message: 'Agrega una mayúscula.' },
        ]}
      />
    </Field>
  );
}
