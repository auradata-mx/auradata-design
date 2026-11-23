'use client';
import { Field, FieldError, FieldLabel, FieldLegend, FieldSet } from '@/components/ui/field';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const FREQUENCIES = [
  { value: 'diario', label: 'Diario' },
  { value: 'semanal', label: 'Cada lunes' },
  { value: 'mensual', label: 'El día 1 de cada mes' },
];

export default function RadioGroupInvalid() {
  return (
    <FieldSet className="max-w-sm" data-invalid>
      <FieldLegend variant="label">Enviar el informe</FieldLegend>
      <RadioGroup aria-invalid>
        {FREQUENCIES.map((frequency) => (
          <Field key={frequency.value} orientation="horizontal">
            <RadioGroupItem id={`invalido-${frequency.value}`} value={frequency.value} aria-invalid />
            <FieldLabel htmlFor={`invalido-${frequency.value}`}>{frequency.label}</FieldLabel>
          </Field>
        ))}
      </RadioGroup>
      <FieldError>Elige cada cuánto lo enviamos.</FieldError>
    </FieldSet>
  );
}
