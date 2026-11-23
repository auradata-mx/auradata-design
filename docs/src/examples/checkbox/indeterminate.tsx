'use client';
import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '@/components/ui/field';

const REGIONS = ['Norte', 'Centro', 'Sur'];

export default function CheckboxIndeterminate() {
  const [picked, setPicked] = useState(['Norte', 'Centro']);
  const all = picked.length === REGIONS.length;
  const some = picked.length > 0 && !all;

  return (
    <FieldSet>
      <FieldLegend variant="label">Regiones del informe</FieldLegend>
      <FieldGroup className="gap-3">
        <Field orientation="horizontal">
          <Checkbox
            id="all-regions"
            checked={all}
            indeterminate={some}
            onCheckedChange={(checked) => setPicked(checked ? REGIONS : [])}
          />
          <FieldLabel htmlFor="all-regions">Todas las regiones</FieldLabel>
        </Field>
        {REGIONS.map((region) => (
          <Field key={region} orientation="horizontal" className="pl-6">
            <Checkbox
              id={`region-${region}`}
              checked={picked.includes(region)}
              onCheckedChange={(checked) =>
                setPicked((current) => (checked ? [...current, region] : current.filter((r) => r !== region)))
              }
            />
            <FieldLabel htmlFor={`region-${region}`}>{region}</FieldLabel>
          </Field>
        ))}
      </FieldGroup>
    </FieldSet>
  );
}
