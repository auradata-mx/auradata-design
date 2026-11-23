'use client';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { NumberInput } from '@/components/ui/number-input';

export default function NumberInputInvalid() {
  return (
    <Field className="max-w-48" data-invalid>
      <FieldLabel htmlFor="rows">Filas por página</FieldLabel>
      <NumberInput id="rows" defaultValue={0} min={0} aria-invalid />
      <FieldError>Elige al menos 1 fila.</FieldError>
    </Field>
  );
}
