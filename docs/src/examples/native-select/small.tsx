'use client';
import { Field, FieldLabel } from '@/components/ui/field';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';

export default function NativeSelectSmall() {
  return (
    <Field className="max-w-40">
      <FieldLabel htmlFor="rows-per-page">Filas por página</FieldLabel>
      <NativeSelect id="rows-per-page" size="sm" defaultValue="25">
        <NativeSelectOption value="10">10</NativeSelectOption>
        <NativeSelectOption value="25">25</NativeSelectOption>
        <NativeSelectOption value="50">50</NativeSelectOption>
      </NativeSelect>
    </Field>
  );
}
