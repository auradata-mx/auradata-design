'use client';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { PhoneInput } from '@/components/ui/phone-input';

export default function PhoneInputDemo() {
  return (
    <Field className="max-w-64">
      <FieldLabel htmlFor="phone">Teléfono</FieldLabel>
      <PhoneInput id="phone" defaultValue="5512345678" />
      <FieldDescription>10 dígitos, con lada.</FieldDescription>
    </Field>
  );
}
