'use client';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@/components/ui/input-group';

export default function InputGroupInvalid() {
  return (
    <Field className="max-w-xs" data-invalid>
      <FieldLabel htmlFor="goal">Meta de ventas</FieldLabel>
      <InputGroup>
        <InputGroupAddon>
          <InputGroupText>$</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput id="goal" defaultValue="-500" aria-invalid />
        <InputGroupAddon align="inline-end">
          <InputGroupText>MXN</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      <FieldError>La meta debe ser mayor que cero.</FieldError>
    </Field>
  );
}
