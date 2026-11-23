'use client';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const PERIODS = [
  { value: 'week', label: 'Esta semana' },
  { value: 'month', label: 'Este mes' },
  { value: 'quarter', label: 'Este trimestre' },
  { value: 'year', label: 'Este año' },
];

export default function SelectField() {
  return (
    <Field className="max-w-xs">
      <FieldLabel htmlFor="period">Periodo</FieldLabel>
      <Select items={PERIODS} defaultValue={null}>
        <SelectTrigger id="period" className="w-48">
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
      <FieldDescription>Los KPI se comparan contra el periodo anterior.</FieldDescription>
    </Field>
  );
}
