'use client';
import { CurrencyInput } from '@/components/ui/currency-input';
import { Field, FieldLabel } from '@/components/ui/field';

export default function CurrencyInputWholePesos() {
  return (
    <Field className="max-w-64">
      <FieldLabel htmlFor="budget-whole">Presupuesto mensual</FieldLabel>
      <CurrencyInput id="budget-whole" defaultValue={45000} maxFractionDigits={0} />
    </Field>
  );
}
