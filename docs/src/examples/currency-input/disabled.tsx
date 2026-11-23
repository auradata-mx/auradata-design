'use client';
import { CurrencyInput } from '@/components/ui/currency-input';
import { Field, FieldLabel } from '@/components/ui/field';

export default function CurrencyInputDisabled() {
  return (
    <Field className="max-w-64" data-disabled>
      <FieldLabel htmlFor="budget-disabled">Presupuesto mensual</FieldLabel>
      <CurrencyInput id="budget-disabled" defaultValue={45000} disabled />
    </Field>
  );
}
