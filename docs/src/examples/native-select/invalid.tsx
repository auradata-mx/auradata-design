'use client';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';

export default function NativeSelectInvalid() {
  return (
    <Field className="max-w-xs" data-invalid>
      <FieldLabel htmlFor="region-invalid">Región</FieldLabel>
      <NativeSelect id="region-invalid" defaultValue="" aria-invalid>
        <NativeSelectOption value="">Elige una región</NativeSelectOption>
        <NativeSelectOption value="bajio">Bajío</NativeSelectOption>
        <NativeSelectOption value="occidente">Occidente</NativeSelectOption>
      </NativeSelect>
      <FieldError>Elige la región del informe.</FieldError>
    </Field>
  );
}
