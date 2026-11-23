import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { NumberInput } from '@/components/ui/number-input'
import { blur, expectSoftFieldBorder, expectDestructiveBorder } from './play-helpers'

const meta = {
  title: 'AuraData/Number input',
  component: NumberInput,
  args: { onValueChange: fn() },
} satisfies Meta<typeof NumberInput>

export default meta
type Story = StoryObj<typeof meta>

/** A port: − and + step by one; the arrow keys too, Shift+arrow by `largeStep`. The box reads 3:1. */
export const Default: Story = {
  args: { id: 'port', defaultValue: 5432, min: 1, max: 65535, largeStep: 100, format: { useGrouping: false } },
  render: (args) => (
    <Field className="max-w-40">
      <FieldLabel htmlFor="port">Puerto</FieldLabel>
      <NumberInput {...args} />
    </Field>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expectSoftFieldBorder(canvasElement.querySelector<HTMLElement>('[data-slot=input-group]')!)
    const input = canvas.getByRole('textbox', { name: 'Puerto' })
    await expect(input).toHaveAttribute('aria-roledescription', 'Campo numérico')
    await expect(canvas.getByRole('button', { name: 'Disminuir' })).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Aumentar' })).toBeInTheDocument()
  },
}

/** Buttons and keyboard: + adds one, ArrowDown takes one away, Shift+ArrowUp adds `largeStep`. */
export const Stepping: Story = {
  ...Default,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', { name: 'Puerto' })
    await userEvent.click(canvas.getByRole('button', { name: 'Aumentar' }))
    await expect(input).toHaveValue('5433')
    await expect(args.onValueChange).toHaveBeenLastCalledWith(5433, expect.anything())
    await userEvent.click(input)
    await userEvent.keyboard('{ArrowDown}{ArrowDown}')
    await expect(input).toHaveValue('5431')
    await userEvent.keyboard('{Shift>}{ArrowUp}{/Shift}')
    await expect(input).toHaveValue('5531')
    await userEvent.clear(input)
    await userEvent.type(input, '70000')
    blur()
    // Out of range snaps to `max` when the field is left.
    await waitFor(() => expect(input).toHaveValue('65535'))
  },
}

/** Decimals: `format` and `step` in es-MX; the value stays a number (18.25). */
export const Decimals: Story = {
  args: {
    id: 'rate',
    defaultValue: 18.25,
    min: 0,
    step: 0.05,
    format: { minimumFractionDigits: 2, maximumFractionDigits: 2 },
  },
  render: (args) => (
    <Field className="max-w-48">
      <FieldLabel htmlFor="rate">Tipo de cambio</FieldLabel>
      <NumberInput {...args} />
      <FieldDescription>Pesos por dólar.</FieldDescription>
    </Field>
  ),
}

export const Disabled: Story = {
  args: { id: 'port-disabled', defaultValue: 5432, disabled: true, format: { useGrouping: false } },
  render: (args) => (
    <Field className="max-w-40" data-disabled>
      <FieldLabel htmlFor="port-disabled">Puerto</FieldLabel>
      <NumberInput {...args} />
    </Field>
  ),
}

/** Invalid keeps the number in the text color with a crisp red border. */
export const Invalid: Story = {
  args: { id: 'rows', defaultValue: 0, min: 0, 'aria-invalid': true },
  render: (args) => (
    <Field className="max-w-48" data-invalid>
      <FieldLabel htmlFor="rows">Filas por página</FieldLabel>
      <NumberInput {...args} />
      <FieldError>Elige al menos 1 fila.</FieldError>
    </Field>
  ),
  play: async ({ canvasElement }) => {
    const group = canvasElement.querySelector<HTMLElement>('[data-slot=input-group]')!
    await expectDestructiveBorder(group)
    // At its minimum the − button is disabled, but the field is not: it keeps full opacity.
    await expect(within(canvasElement).getByRole('button', { name: 'Disminuir' })).toBeDisabled()
    await expect(getComputedStyle(group).opacity).toBe('1')
    // The steppers stay neutral: red is for the border and the message.
    const plus = within(canvasElement).getByRole('button', { name: 'Aumentar' })
    await expect(getComputedStyle(plus).color).toBe(getComputedStyle(within(canvasElement).getByRole('textbox')).color)
  },
}
