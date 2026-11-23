'use client';
import { Field, FieldLabel } from '@/components/ui/field';
import { PhoneInput } from '@/components/ui/phone-input';

export default function PhoneInputWithoutCountryCode() {
  return (
    <Field className="max-w-64">
      <FieldLabel htmlFor="phone-local">Teléfono</FieldLabel>
      <PhoneInput id="phone-local" defaultValue="3312345678" showCountryCode={false} />
    </Field>
  );
}
