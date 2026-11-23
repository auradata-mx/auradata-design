'use client';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';

export default function TextareaInvalid() {
  return (
    <Field className="max-w-sm" data-invalid>
      <FieldLabel htmlFor="report-description-invalid">Descripción</FieldLabel>
      <Textarea id="report-description-invalid" defaultValue="Ventas" aria-invalid />
      <FieldError>Escribe al menos 20 caracteres: qué muestra y de qué periodo.</FieldError>
    </Field>
  );
}
