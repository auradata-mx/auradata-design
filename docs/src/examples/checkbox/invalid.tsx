'use client';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';

export default function CheckboxInvalid() {
  return (
    <Field orientation="horizontal" data-invalid className="max-w-sm flex-wrap">
      <Checkbox id="terms" aria-invalid aria-describedby="terms-error" />
      <FieldLabel htmlFor="terms">Acepto los términos de uso</FieldLabel>
      <FieldError id="terms-error" className="basis-full pl-6">
        Acepta los términos para crear tu cuenta.
      </FieldError>
    </Field>
  );
}
