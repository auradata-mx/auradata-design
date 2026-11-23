'use client';
import { Field, FieldLabel } from '@/components/ui/field';
import { NativeSelect, NativeSelectOptGroup, NativeSelectOption } from '@/components/ui/native-select';

export default function NativeSelectDemo() {
  return (
    <Field className="max-w-xs">
      <FieldLabel htmlFor="region">Región</FieldLabel>
      <NativeSelect id="region" defaultValue="bajio">
        <NativeSelectOption value="">Todas las regiones</NativeSelectOption>
        <NativeSelectOptGroup label="Norte">
          <NativeSelectOption value="noreste">Noreste</NativeSelectOption>
          <NativeSelectOption value="noroeste">Noroeste</NativeSelectOption>
        </NativeSelectOptGroup>
        <NativeSelectOptGroup label="Centro">
          <NativeSelectOption value="bajio">Bajío</NativeSelectOption>
          <NativeSelectOption value="occidente">Occidente</NativeSelectOption>
        </NativeSelectOptGroup>
      </NativeSelect>
    </Field>
  );
}
