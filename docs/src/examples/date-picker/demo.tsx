'use client';
import { DatePicker } from '@/components/ui/date-picker';
import { Field, FieldLabel } from '@/components/ui/field';

/** A fixed day, so the page renders the same on the server and in the browser. */
const TODAY = new Date(2026, 10, 21);

export default function DatePickerDemo() {
  return (
    <Field className="max-w-64">
      <FieldLabel htmlFor="due">Fecha de entrega</FieldLabel>
      <DatePicker id="due" today={TODAY} defaultValue={new Date(2026, 10, 28)} />
    </Field>
  );
}
