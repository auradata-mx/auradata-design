import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { PhoneInput } from '@/components/ui/phone-input'
import { isValidPhoneMx } from '@/lib/phone'
import { blur, expectBorderReads, expectDestructiveBorder } from './play-helpers'

const meta = {
  title: 'AuraData/Phone input',
  component: PhoneInput,
  args: { onValueChange: fn() },
  render: (args) => (
    <Field className="max-w-64">
      <FieldLabel htmlFor={args.id}>Teléfono</FieldLabel>
      <PhoneInput {...args} />
      <FieldDescription>10 dígitos, con lada.</FieldDescription>
    </Field>
  ),
} satisfies Meta<typeof PhoneInput>

export default meta
type Story = StoryObj<typeof meta>

/** Mexico City: a two-digit area code, `55 1234 5678`. The box reads 3:1. */
export const Default: Story = {
  args: { id: 'phone', defaultValue: '5512345678' },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('textbox')).toHaveValue('55 1234 5678')
    await expectBorderReads(canvasElement.querySelector<HTMLElement>('[data-slot=input-group]')!)
  },
}

/** Mérida: a three-digit area code, `999 123 4567`. */
export const ThreeDigitAreaCode: Story = {
  name: 'Three-digit area code',
  args: { id: 'phone-merida', defaultValue: '9991234567' },
}

export const Empty: Story = { args: { id: 'phone-empty', placeholder: '55 1234 5678' } }

/** Without the «+52» addon: for forms where every number is Mexican and the prefix is noise. */
export const WithoutCountryCode: Story = {
  name: 'Without country code',
  args: { id: 'phone-local', defaultValue: '3312345678', showCountryCode: false },
}

/**
 * Typing groups the digits; pasting a number with +52 and the old mobile «1» keeps the 10 digits; the caret stays
 * on its digit; the form gets `+525512345678`.
 */
export const Typing: Story = {
  args: { id: 'phone-typing', name: 'phone' },
  render: (args) => (
    <form aria-label="Contacto">
      <Field className="max-w-64">
        <FieldLabel htmlFor={args.id}>Teléfono</FieldLabel>
        <PhoneInput {...args} />
      </Field>
    </form>
  ),
  play: async ({ args, canvasElement }) => {
    const input = within(canvasElement).getByRole<HTMLInputElement>('textbox', { name: 'Teléfono' })
    await userEvent.type(input, '551234')
    await expect(input).toHaveValue('55 1234')
    await expect(args.onValueChange).toHaveBeenLastCalledWith('551234')
    await userEvent.clear(input)
    await userEvent.click(input)
    await userEvent.paste('+52 1 55 1234 5678')
    await expect(input).toHaveValue('55 1234 5678')
    await expect(new FormData(canvasElement.querySelector('form')!).get('phone')).toBe('+525512345678')
    // Deleting the «3» of «1234» regroups the rest and the caret stays where the digit was.
    input.setSelectionRange(6, 6)
    await userEvent.keyboard('{Backspace}')
    await expect(input).toHaveValue('55 1245 678')
    await expect(input.selectionStart).toBe(5)
    blur()
  },
}

/** The example number never breaks across lines: no-break spaces between its groups. */
const EXAMPLE_ERROR = 'Escribe los 10 dígitos, con lada: 55\u00a01234\u00a05678.'

/** Validated when the field is left, as Brand/11 says: an incomplete number shows how to write it. */
function PhoneWithValidation() {
  const [digits, setDigits] = React.useState('551234')
  const [touched, setTouched] = React.useState(true)
  const invalid = touched && !isValidPhoneMx(digits)
  return (
    <Field className="max-w-64" data-invalid={invalid || undefined}>
      <FieldLabel htmlFor="phone-invalid">Teléfono</FieldLabel>
      <PhoneInput
        id="phone-invalid"
        value={digits}
        onValueChange={setDigits}
        onFocus={() => setTouched(false)}
        onBlur={() => setTouched(true)}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? 'phone-invalid-error' : undefined}
      />
      {invalid && <FieldError id="phone-invalid-error">{EXAMPLE_ERROR}</FieldError>}
    </Field>
  )
}

export const Invalid: Story = {
  render: () => <PhoneWithValidation />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expectDestructiveBorder(canvasElement.querySelector<HTMLElement>('[data-slot=input-group]')!)
    await expect(canvas.getByRole('textbox')).toHaveAccessibleDescription(EXAMPLE_ERROR)
    // Completing the number and leaving the field clears the error.
    await userEvent.type(canvas.getByRole('textbox'), '5678')
    blur()
    await waitFor(() => expect(canvas.queryByRole('alert')).toBeNull())
    await userEvent.clear(canvas.getByRole('textbox'))
    await userEvent.type(canvas.getByRole('textbox'), '551234')
    blur()
    await waitFor(() => expect(canvas.getByRole('alert')).toBeInTheDocument())
  },
}

export const Disabled: Story = {
  args: { id: 'phone-disabled', defaultValue: '5512345678', disabled: true },
  render: (args) => (
    <Field className="max-w-64" data-disabled>
      <FieldLabel htmlFor={args.id}>Teléfono</FieldLabel>
      <PhoneInput {...args} />
    </Field>
  ),
}
