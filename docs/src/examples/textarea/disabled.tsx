'use client';
import { Textarea } from '@/components/ui/textarea';

export default function TextareaDisabled() {
  return (
    <Textarea
      className="max-w-sm"
      defaultValue="Informe compartido por el equipo de Finanzas."
      aria-label="Descripción del informe"
      disabled
    />
  );
}
