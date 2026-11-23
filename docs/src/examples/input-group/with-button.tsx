'use client';
import { CopyIcon } from 'lucide-react';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group';

export default function InputGroupWithButton() {
  return (
    <InputGroup className="max-w-xs">
      <InputGroupInput readOnly defaultValue="https://bi.auradata.mx/r/7f3c9a" aria-label="Enlace del informe" />
      <InputGroupAddon align="inline-end">
        <InputGroupButton size="icon-xs" aria-label="Copiar enlace">
          <CopyIcon aria-hidden />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
}
