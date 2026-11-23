'use client';
import { Field, FieldContent, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Switch } from '@/components/ui/switch';

export default function FieldHorizontal() {
  return (
    <Field orientation="horizontal" className="max-w-md">
      <FieldContent>
        <FieldLabel htmlFor="hourly">Actualizar cada hora</FieldLabel>
        <FieldDescription>Vuelve a leer el dataset en punto, de 8:00 a 20:00.</FieldDescription>
      </FieldContent>
      <Switch id="hourly" defaultChecked />
    </Field>
  );
}
