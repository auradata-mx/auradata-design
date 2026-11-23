'use client';
import { Field, FieldLabel } from '@/components/ui/field';
import { PasswordInput } from '@/components/ui/password-input';

export default function PasswordInputDemo() {
  return (
    <Field className="max-w-xs">
      <FieldLabel htmlFor="password">Contraseña</FieldLabel>
      <PasswordInput id="password" defaultValue="ventas2026" />
    </Field>
  );
}
