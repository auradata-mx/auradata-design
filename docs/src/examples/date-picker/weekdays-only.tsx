'use client';
import { DatePicker } from '@/components/ui/date-picker';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';

const TODAY = new Date(2026, 10, 21);

export default function DatePickerWeekdaysOnly() {
  return (
    <Field className="max-w-64">
      <FieldLabel htmlFor="due-weekdays">Fecha de entrega</FieldLabel>
      <DatePicker id="due-weekdays" today={TODAY} disabledDays={[{ before: TODAY }, { dayOfWeek: [0, 6] }]} />
      <FieldDescription>De lunes a viernes, desde hoy.</FieldDescription>
    </Field>
  );
}
