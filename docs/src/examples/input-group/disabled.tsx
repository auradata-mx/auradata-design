'use client';
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@/components/ui/input-group';

export default function InputGroupDisabled() {
  return (
    <InputGroup className="max-w-xs" disabled>
      <InputGroupAddon>
        <InputGroupText>$</InputGroupText>
      </InputGroupAddon>
      <InputGroupInput defaultValue="1,284,500" aria-label="Meta de ventas" />
      <InputGroupAddon align="inline-end">
        <InputGroupText>MXN</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  );
}
