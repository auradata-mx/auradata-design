'use client';
import { Field, FieldContent, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Switch } from '@/components/ui/switch';

export default function SwitchField() {
  return (
    <Field orientation="horizontal" className="max-w-sm">
      <FieldContent>
        <FieldLabel htmlFor="email-alerts">Avisos por correo</FieldLabel>
        <FieldDescription>Te escribimos cuando un informe deja de actualizarse.</FieldDescription>
      </FieldContent>
      <Switch id="email-alerts" defaultChecked />
    </Field>
  );
}
