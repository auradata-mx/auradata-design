'use client';
import { SendIcon } from 'lucide-react';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from '@/components/ui/input-group';

export default function InputGroupWithTextarea() {
  return (
    <InputGroup className="max-w-md">
      <InputGroupAddon align="block-start">
        <InputGroupText>Pregunta a tus datos</InputGroupText>
      </InputGroupAddon>
      <InputGroupTextarea placeholder="¿Qué región vendió más en octubre?" aria-label="Pregunta" />
      <InputGroupAddon align="block-end">
        <InputGroupText className="text-xs">Usa el dataset «Pedidos 2026»</InputGroupText>
        <InputGroupButton variant="default" size="sm" className="ml-auto">
          <SendIcon data-icon="inline-start" aria-hidden />
          Enviar
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
}
