'use client';
import { Textarea } from '@/components/ui/textarea';

export default function TextareaDemo() {
  return (
    <Textarea
      className="max-w-sm"
      placeholder="Describe qué muestra el informe"
      aria-label="Descripción del informe"
    />
  );
}
