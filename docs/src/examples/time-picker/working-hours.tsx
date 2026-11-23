'use client';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { TimePicker } from '@/components/ui/time-picker';

export default function TimePickerWorkingHours() {
  return (
    <Field className="max-w-40">
      <FieldLabel htmlFor="send-time-hours">Hora de envío</FieldLabel>
      <TimePicker id="send-time-hours" step={15} min="08:00" max="18:00" placeholder="Elige una hora" />
      <FieldDescription>De 8:00 a 18:00.</FieldDescription>
    </Field>
  );
}
