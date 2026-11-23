'use client';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp';

export default function InputOTPDemo() {
  return (
    <Field className="w-fit">
      <FieldLabel htmlFor="otp">Código de verificación</FieldLabel>
      <InputOTP id="otp" maxLength={6} pattern={REGEXP_ONLY_DIGITS}>
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
      <FieldDescription>El código de 6 dígitos de tu app de autenticación.</FieldDescription>
    </Field>
  );
}
