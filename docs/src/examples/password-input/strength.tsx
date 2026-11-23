'use client';
import { useState } from 'react';
import { Field, FieldLabel } from '@/components/ui/field';
import { PasswordInput, PasswordStrength } from '@/components/ui/password-input';

export default function PasswordInputStrength() {
  const [password, setPassword] = useState('Ventas2026');

  return (
    <Field className="max-w-sm">
      <FieldLabel htmlFor="new-password">Nueva contraseña</FieldLabel>
      <PasswordInput
        id="new-password"
        autoComplete="new-password"
        value={password}
        onChange={(event) => setPassword(event.currentTarget.value)}
        aria-describedby="new-password-strength"
      />
      <PasswordStrength id="new-password-strength" value={password} />
    </Field>
  );
}
