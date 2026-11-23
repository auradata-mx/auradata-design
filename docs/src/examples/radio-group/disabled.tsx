'use client';
import { Field, FieldLabel, FieldLegend, FieldSet } from '@/components/ui/field';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const FREQUENCIES = [
  { value: 'diario', label: 'Diario' },
  { value: 'semanal', label: 'Cada lunes' },
  { value: 'mensual', label: 'El día 1 de cada mes' },
];

export default function RadioGroupDisabled() {
  return (
    <FieldSet className="max-w-sm">
      <FieldLegend variant="label">Enviar el informe</FieldLegend>
      <RadioGroup defaultValue="semanal" disabled>
        {FREQUENCIES.map((frequency) => (
          <Field key={frequency.value} orientation="horizontal" data-disabled>
            <RadioGroupItem id={`deshabilitado-${frequency.value}`} value={frequency.value} />
            <FieldLabel htmlFor={`deshabilitado-${frequency.value}`}>{frequency.label}</FieldLabel>
          </Field>
        ))}
      </RadioGroup>
    </FieldSet>
  );
}
