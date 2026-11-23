'use client';
import { CurrencyInput } from '@/components/ui/currency-input';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';

export default function CurrencyInputDemo() {
  return (
    <Field className="max-w-64">
      <FieldLabel htmlFor="budget">Presupuesto mensual</FieldLabel>
      <CurrencyInput id="budget" defaultValue={1284500.5} />
      <FieldDescription>Antes de IVA.</FieldDescription>
    </Field>
  );
}
