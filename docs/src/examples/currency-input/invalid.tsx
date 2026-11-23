'use client';
import { CurrencyInput } from '@/components/ui/currency-input';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';

export default function CurrencyInputInvalid() {
  return (
    <Field className="max-w-64" data-invalid>
      <FieldLabel htmlFor="budget-invalid">Presupuesto mensual</FieldLabel>
      <CurrencyInput id="budget-invalid" defaultValue={0} aria-invalid />
      <FieldError>Escribe un monto mayor a $0.</FieldError>
    </Field>
  );
}
