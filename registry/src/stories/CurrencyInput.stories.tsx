import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import { CurrencyInput } from '@/components/ui/currency-input'
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { blur, expectSoftFieldBorder, expectDestructiveBorder } from './play-helpers'

const meta = {
  title: 'AuraData/Currency input',
  component: CurrencyInput,
  args: { onValueChange: fn() },
  render: (args) => (
    <Field className="max-w-64">
      <FieldLabel htmlFor={args.id}>Presupuesto mensual</FieldLabel>
      <CurrencyInput {...args} />
      <FieldDescription>Antes de IVA.</FieldDescription>
    </Field>
  ),
} satisfies Meta<typeof CurrencyInput>

export default meta
type Story = StoryObj<typeof meta>

/** An amount loaded from a record: `1284500.5` shows as `1,284,500.50`. */
export const Default: Story = {
  args: { id: 'budget', defaultValue: 1284500.5 },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('textbox')).toHaveValue('1,284,500.50')
    await expectSoftFieldBorder(canvasElement.querySelector<HTMLElement>('[data-slot=input-group]')!)
  },
}

export const Empty: Story = { args: { id: 'budget-empty', placeholder: '0.00' } }

/**
 * Typing groups the thousands at once and keeps the caret on its digit; the value is a number; leaving the field
 * pads the cents. A form gets the plain number from the hidden input named `budget`.
 */
export const Typing: Story = {
  args: { id: 'budget-typing', name: 'budget' },
  render: (args) => (
    <form aria-label="Presupuesto">
      <Field className="max-w-64">
        <FieldLabel htmlFor={args.id}>Presupuesto mensual</FieldLabel>
        <CurrencyInput {...args} />
      </Field>
    </form>
  ),
  play: async ({ args, canvasElement }) => {
    const input = within(canvasElement).getByRole<HTMLInputElement>('textbox', { name: 'Presupuesto mensual' })
    await userEvent.type(input, '1284500.5')
    await expect(input).toHaveValue('1,284,500.5')
    await expect(args.onValueChange).toHaveBeenLastCalledWith(1284500.5)
    // A digit typed in the middle (after "1,28") lands there and the caret stays after it.
    input.setSelectionRange(4, 4)
    await userEvent.keyboard('9')
    await expect(input).toHaveValue('12,894,500.5')
    await expect(input.selectionStart).toBe(5)
    blur()
    await waitFor(() => expect(input).toHaveValue('12,894,500.50'))
    const form = canvasElement.querySelector('form')!
    await expect(new FormData(form).get('budget')).toBe('12894500.5')
  },
}

/** Whole pesos: `maxFractionDigits={0}` ignores the point. */
export const WholePesos: Story = {
  name: 'Whole pesos',
  args: { id: 'budget-whole', defaultValue: 45000, maxFractionDigits: 0 },
}

export const Disabled: Story = {
  args: { id: 'budget-disabled', defaultValue: 45000, disabled: true },
  render: (args) => (
    <Field className="max-w-64" data-disabled>
      <FieldLabel htmlFor={args.id}>Presupuesto mensual</FieldLabel>
      <CurrencyInput {...args} />
    </Field>
  ),
}

export const Invalid: Story = {
  args: { id: 'budget-invalid', defaultValue: 0, 'aria-invalid': true },
  render: (args) => (
    <Field className="max-w-64" data-invalid>
      <FieldLabel htmlFor={args.id}>Presupuesto mensual</FieldLabel>
      <CurrencyInput {...args} />
      <FieldError>Escribe un monto mayor a $0.</FieldError>
    </Field>
  ),
  play: async ({ canvasElement }) => {
    await expectDestructiveBorder(canvasElement.querySelector<HTMLElement>('[data-slot=input-group]')!)
  },
}
