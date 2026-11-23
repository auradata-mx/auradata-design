'use client';
import { DatePicker } from '@/components/ui/date-picker';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';

const TODAY = new Date(2026, 10, 21);

export default function DatePickerInvalid() {
  return (
    <Field className="max-w-64" data-invalid>
      <FieldLabel htmlFor="due-invalid">Fecha de entrega</FieldLabel>
      <DatePicker id="due-invalid" today={TODAY} aria-invalid />
      <FieldError>Elige el día en que se envía el informe.</FieldError>
    </Field>
  );
}
