'use client';
import { Field, FieldDescription, FieldLabel, FieldLegend, FieldSet } from '@/components/ui/field';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const FREQUENCIES = [
  { value: 'diario', label: 'Diario' },
  { value: 'semanal', label: 'Cada lunes' },
  { value: 'mensual', label: 'El día 1 de cada mes' },
];

export default function RadioGroupDemo() {
  return (
    <FieldSet className="max-w-sm">
      <FieldLegend variant="label">Enviar el informe</FieldLegend>
      <RadioGroup defaultValue="semanal">
        {FREQUENCIES.map((frequency) => (
          <Field key={frequency.value} orientation="horizontal">
            <RadioGroupItem id={`frecuencia-${frequency.value}`} value={frequency.value} />
            <FieldLabel htmlFor={`frecuencia-${frequency.value}`}>{frequency.label}</FieldLabel>
          </Field>
        ))}
      </RadioGroup>
      <FieldDescription>Llega a las 8:00 a todo el equipo.</FieldDescription>
    </FieldSet>
  );
}
