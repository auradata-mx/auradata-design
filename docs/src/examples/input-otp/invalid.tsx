'use client';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp';

export default function InputOTPInvalid() {
  return (
    <Field className="w-fit" data-invalid>
      <FieldLabel htmlFor="otp-invalid">Código de verificación</FieldLabel>
      <InputOTP id="otp-invalid" maxLength={6} pattern={REGEXP_ONLY_DIGITS} defaultValue="482913" aria-invalid>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      <FieldError className="max-w-xs">El código no es válido o ya venció. Escribe el que muestra tu app ahora.</FieldError>
    </Field>
  );
}
