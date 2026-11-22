import type * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { REGEXP_ONLY_DIGITS } from 'input-otp'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp'
import { blur, expectBorderReads, expectDestructiveBorder } from './play-helpers'

type CodeProps = Omit<Extract<React.ComponentProps<typeof InputOTP>, { children: React.ReactNode }>, 'children'>

/** A six-digit code in two groups of three, as authenticator apps show it. */
function SixDigits(props: CodeProps) {
  return (
    <InputOTP {...props}>
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
  )
}

const meta = {
  title: 'Components/Input OTP',
  component: SixDigits,
  args: { maxLength: 6, pattern: REGEXP_ONLY_DIGITS, onComplete: fn() },
  render: (args) => (
    <Field className="w-fit">
      <FieldLabel htmlFor={args.id}>Código de verificación</FieldLabel>
      <SixDigits {...args} />
      <FieldDescription>El código de 6 dígitos de tu app de autenticación.</FieldDescription>
    </Field>
  ),
} satisfies Meta<typeof SixDigits>

export default meta
type Story = StoryObj<typeof meta>

const slots = (canvasElement: HTMLElement) => [
  ...canvasElement.querySelectorAll<HTMLElement>('[data-slot=input-otp-slot]'),
]

/** Six digits in two groups of three. Each box reads 3:1 against the page, as the text controls. */
export const Default: Story = {
  args: { id: 'otp' },
  play: async ({ canvasElement }) => {
    await expectBorderReads(slots(canvasElement)[0])
    // The browser and the phone offer the code from a text message.
    await expect(within(canvasElement).getByRole('textbox', { name: 'Código de verificación' })).toHaveAttribute(
      'autocomplete',
      'one-time-code'
    )
  },
}

export const Filled: Story = { args: { id: 'otp-filled', defaultValue: '482913' } }

/**
 * Typing fills the boxes one by one and the box being typed in carries the brand outline, not a new border; letters
 * are ignored; the sixth digit calls `onComplete`.
 */
export const Typing: Story = {
  args: { id: 'otp-typing' },
  play: async ({ args, canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox', { name: 'Código de verificación' })
    const [first, second] = slots(canvasElement)
    const resting = getComputedStyle(second).borderTopColor
    await userEvent.click(input)
    await waitFor(() => expect(first).toHaveAttribute('data-active', 'true'))
    await expect(getComputedStyle(first).borderTopColor).toBe(resting)
    await expect(getComputedStyle(first).outlineStyle).toBe('solid')
    await userEvent.keyboard('48a2913')
    await expect(input).toHaveValue('482913')
    await expect(args.onComplete).toHaveBeenCalledWith('482913')
    await expect(slots(canvasElement).map((slot) => slot.textContent)).toEqual(['4', '8', '2', '9', '1', '3'])
    blur()
  },
}

/** A wrong code: every box takes the crisp red border, the digits keep the text color. */
export const Invalid: Story = {
  args: { id: 'otp-invalid', defaultValue: '482913', 'aria-invalid': true },
  render: (args) => (
    <Field className="w-fit" data-invalid>
      <FieldLabel htmlFor={args.id}>Código de verificación</FieldLabel>
      <SixDigits {...args} />
      <FieldError>El código no es válido o ya venció. Escribe el que muestra tu app ahora.</FieldError>
    </Field>
  ),
  play: async ({ canvasElement }) => {
    const [first] = slots(canvasElement)
    // The digits keep the text color; red is for the border and the message. (Read before the theme switches.)
    const probe = document.createElement('span')
    probe.style.color = 'var(--foreground)'
    canvasElement.append(probe)
    await expect(getComputedStyle(first).color).toBe(getComputedStyle(probe).color)
    probe.remove()
    await expectDestructiveBorder(first)
  },
}

export const Disabled: Story = { args: { id: 'otp-disabled', defaultValue: '482913', disabled: true } }

/** The sign-in step: the code, how to get it, and the actions, on a phone too. */
export const TwoFactor: Story = {
  name: 'Two-factor step',
  tags: ['mobile'],
  args: { id: 'otp-2fa' },
  render: (args) => (
    <form className="flex w-full max-w-sm flex-col gap-6" onSubmit={(event) => event.preventDefault()}>
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold">Verifica que eres tú</h2>
        <p className="text-sm text-muted-foreground">
          Abre tu app de autenticación y escribe el código de AuraData BI.
        </p>
      </div>
      <Field className="w-fit">
        <FieldLabel htmlFor={args.id}>Código de verificación</FieldLabel>
        <SixDigits id={args.id} maxLength={6} pattern={REGEXP_ONLY_DIGITS} />
      </Field>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button type="submit">Verificar</Button>
        <Button type="button" variant="ghost">
          Usar un código de respaldo
        </Button>
      </div>
    </form>
  ),
}
