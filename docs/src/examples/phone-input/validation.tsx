'use client';
import { useState } from 'react';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { PhoneInput } from '@/components/ui/phone-input';
import { isValidPhoneMx } from '@/lib/phone';

export default function PhoneInputValidation() {
  const [digits, setDigits] = useState('551234');
  const [touched, setTouched] = useState(true);
  const invalid = touched && !isValidPhoneMx(digits);

  return (
    <Field className="max-w-64" data-invalid={invalid || undefined}>
      <FieldLabel htmlFor="phone-invalid">Teléfono</FieldLabel>
      <PhoneInput
        id="phone-invalid"
        value={digits}
        onValueChange={setDigits}
        onFocus={() => setTouched(false)}
        onBlur={() => setTouched(true)}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? 'phone-invalid-error' : undefined}
      />
      {invalid && (
        <FieldError id="phone-invalid-error">Escribe los 10 dígitos, con lada: 55 1234 5678.</FieldError>
      )}
    </Field>
  );
}
