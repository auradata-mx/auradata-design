'use client';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { PasswordInput } from '@/components/ui/password-input';

export default function PasswordInputInvalid() {
  return (
    <Field className="max-w-xs" data-invalid>
      <FieldLabel htmlFor="confirm-password">Confirma la contraseña</FieldLabel>
      <PasswordInput id="confirm-password" autoComplete="new-password" defaultValue="Ventas-2025" aria-invalid />
      <FieldError>Las contraseñas no coinciden. Escríbela otra vez.</FieldError>
    </Field>
  );
}
