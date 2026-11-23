'use client';
import { Field, FieldLabel } from '@/components/ui/field';
import { NumberInput } from '@/components/ui/number-input';

export default function NumberInputDisabled() {
  return (
    <Field className="max-w-40" data-disabled>
      <FieldLabel htmlFor="port-disabled">Puerto</FieldLabel>
      <NumberInput id="port-disabled" defaultValue={5432} format={{ useGrouping: false }} disabled />
    </Field>
  );
}
