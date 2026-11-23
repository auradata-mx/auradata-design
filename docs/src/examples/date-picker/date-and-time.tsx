'use client';
import { DateTimePicker } from '@/components/ui/date-picker';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';

const TODAY = new Date(2026, 10, 21);

export default function DatePickerDateAndTime() {
  return (
    <Field className="max-w-sm">
      <FieldLabel htmlFor="send-at">Enviar el</FieldLabel>
      <DateTimePicker id="send-at" today={TODAY} defaultValue={new Date(2026, 10, 24, 9, 0)} />
      <FieldDescription>Hora de la Ciudad de México.</FieldDescription>
    </Field>
  );
}
