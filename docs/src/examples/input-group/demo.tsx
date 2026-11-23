'use client';
import { SearchIcon } from 'lucide-react';
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@/components/ui/input-group';

export default function InputGroupDemo() {
  return (
    <div className="grid w-full max-w-xs gap-3">
      <InputGroup>
        <InputGroupInput placeholder="Buscar informes…" aria-label="Buscar informes" />
        <InputGroupAddon>
          <SearchIcon aria-hidden />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupAddon>
          <InputGroupText>$</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput defaultValue="1,284,500" aria-label="Meta de ventas" />
        <InputGroupAddon align="inline-end">
          <InputGroupText>MXN</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
