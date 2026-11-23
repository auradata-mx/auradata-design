'use client';
import { Field, FieldLabel } from '@/components/ui/field';
import { NumberInput } from '@/components/ui/number-input';

export default function NumberInputDemo() {
  return (
    <Field className="max-w-40">
      <FieldLabel htmlFor="port">Puerto</FieldLabel>
      <NumberInput id="port" defaultValue={5432} min={1} max={65535} largeStep={100} format={{ useGrouping: false }} />
    </Field>
  );
}
