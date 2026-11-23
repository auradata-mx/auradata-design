'use client';
import { Field, FieldLabel } from '@/components/ui/field';
import { TimePicker } from '@/components/ui/time-picker';

export default function TimePickerDemo() {
  return (
    <Field className="max-w-40">
      <FieldLabel htmlFor="send-time">Hora de envío</FieldLabel>
      <TimePicker id="send-time" defaultValue="09:00" />
    </Field>
  );
}
