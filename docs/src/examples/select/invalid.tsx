'use client';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const PERIODS = [
  { value: 'week', label: 'Esta semana' },
  { value: 'month', label: 'Este mes' },
  { value: 'quarter', label: 'Este trimestre' },
  { value: 'year', label: 'Este año' },
];

export default function SelectInvalid() {
  return (
    <Field className="max-w-xs" data-invalid>
      <FieldLabel htmlFor="period-invalid">Periodo</FieldLabel>
      <Select items={PERIODS} defaultValue={null}>
        <SelectTrigger id="period-invalid" className="w-48" aria-invalid>
          <SelectValue placeholder="Elige un periodo" />
        </SelectTrigger>
        <SelectContent>
          {PERIODS.map((period) => (
            <SelectItem key={period.value} value={period.value}>
              {period.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FieldError>Elige el periodo del informe.</FieldError>
    </Field>
  );
}
