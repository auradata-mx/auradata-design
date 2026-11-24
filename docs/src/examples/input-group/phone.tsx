import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@/components/ui/input-group';

export default function InputGroupPhone() {
  return (
    <InputGroup className="max-w-xs">
      <InputGroupAddon>
        <InputGroupText>+52</InputGroupText>
      </InputGroupAddon>
      <InputGroupInput type="tel" autoComplete="tel-national" aria-label="Teléfono en México (+52)" placeholder="55 1234 5678" />
    </InputGroup>
  );
}
