'use client';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp';

export default function InputOTPTwoFactor() {
  return (
    <form className="flex w-full max-w-sm flex-col gap-6" onSubmit={(event) => event.preventDefault()}>
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold">Verifica que eres tú</h2>
        <p className="text-sm text-muted-foreground">Abre tu app de autenticación y escribe el código de AuraData BI.</p>
      </div>
      <Field className="w-fit">
        <FieldLabel htmlFor="otp-2fa">Código de verificación</FieldLabel>
        <InputOTP id="otp-2fa" maxLength={6} pattern={REGEXP_ONLY_DIGITS}>
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
      </Field>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button type="submit">Verificar</Button>
        <Button type="button" variant="ghost">
          Usar un código de respaldo
        </Button>
      </div>
    </form>
  );
}
