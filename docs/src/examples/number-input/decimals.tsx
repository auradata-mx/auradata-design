'use client';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { NumberInput } from '@/components/ui/number-input';

export default function NumberInputDecimals() {
  return (
    <Field className="max-w-48">
      <FieldLabel htmlFor="rate">Tipo de cambio</FieldLabel>
      <NumberInput
        id="rate"
        defaultValue={18.25}
        min={0}
        step={0.05}
        format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
      />
      <FieldDescription>Pesos por dólar.</FieldDescription>
    </Field>
  );
}
