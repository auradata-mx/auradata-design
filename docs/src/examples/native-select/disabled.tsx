'use client';
import { Field, FieldLabel } from '@/components/ui/field';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';

export default function NativeSelectDisabled() {
  return (
    <Field className="max-w-xs" data-disabled>
      <FieldLabel htmlFor="region-disabled">Región</FieldLabel>
      <NativeSelect id="region-disabled" defaultValue="bajio" disabled>
        <NativeSelectOption value="bajio">Bajío</NativeSelectOption>
        <NativeSelectOption value="occidente">Occidente</NativeSelectOption>
      </NativeSelect>
    </Field>
  );
}
