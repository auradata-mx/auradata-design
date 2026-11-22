import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { PasswordInput, PasswordStrength } from '@/components/ui/password-input'
import { blur, expectBorderReads, expectDestructiveBorder } from './play-helpers'

const meta = {
  title: 'AuraData/Password input',
  component: PasswordInput,
} satisfies Meta<typeof PasswordInput>

export default meta
type Story = StoryObj<typeof meta>

/** Signing in: a saved password fills it (`current-password`); the eye shows it. The box reads 3:1. */
export const Default: Story = {
  render: () => (
    <Field className="max-w-xs">
      <FieldLabel htmlFor="password">Contraseña</FieldLabel>
      <PasswordInput id="password" defaultValue="ventas2026" />
    </Field>
  ),
  play: async ({ canvasElement }) => {
    await expectBorderReads(canvasElement.querySelector<HTMLElement>('[data-slot=input-group]')!)
  },
}

/** The eye button shows and hides the password; it says which with `aria-pressed`, the input keeps the focus ring. */
export const Showing: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText('Contraseña')
    const eye = canvas.getByRole('button', { name: 'Mostrar contraseña' })
    await expect(input).toHaveAttribute('type', 'password')
    await expect(eye).toHaveAttribute('aria-pressed', 'false')
    await userEvent.click(eye)
    await expect(input).toHaveAttribute('type', 'text')
    await expect(eye).toHaveAttribute('aria-pressed', 'true')
    await userEvent.click(eye)
    await expect(input).toHaveAttribute('type', 'password')
    blur()
  },
}

/** Choosing a password: the meter and the rules follow what is typed. */
function NewPassword({ initial = '' }: { initial?: string }) {
  const [password, setPassword] = React.useState(initial)
  return (
    <Field className="max-w-sm">
      <FieldLabel htmlFor="new-password">Nueva contraseña</FieldLabel>
      <PasswordInput
        id="new-password"
        autoComplete="new-password"
        value={password}
        onChange={(event) => setPassword(event.currentTarget.value)}
        aria-describedby="new-password-strength"
      />
      <PasswordStrength id="new-password-strength" value={password} />
    </Field>
  )
}

export const Strength: Story = {
  tags: ['mobile'],
  render: () => <NewPassword initial="Ventas2026" />,
  play: async ({ canvasElement }) => {
    const meter = within(canvasElement).getByRole('meter', { name: 'Seguridad' })
    await expect(meter).toHaveAttribute('aria-valuetext', 'Buena')
    await expect(within(canvasElement).getByLabelText('Nueva contraseña')).toHaveAttribute(
      'autocomplete',
      'new-password'
    )
  },
}

/** Typing climbs from «Débil» to «Fuerte»; each rule gets its check as it is met. */
export const Typing: Story = {
  render: () => <NewPassword />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText('Nueva contraseña')
    const meter = canvas.getByRole('meter', { name: 'Seguridad' })
    await expect(meter).toHaveAttribute('aria-valuetext', 'Sin contraseña')
    await userEvent.type(input, 'ventas')
    await waitFor(() => expect(meter).toHaveAttribute('aria-valuetext', 'Débil'))
    await userEvent.type(input, '20')
    await waitFor(() => expect(meter).toHaveAttribute('aria-valuetext', 'Regular'))
    await userEvent.type(input, 'X')
    await waitFor(() => expect(meter).toHaveAttribute('aria-valuetext', 'Buena'))
    await userEvent.type(input, '!')
    await waitFor(() => expect(meter).toHaveAttribute('aria-valuetext', 'Fuerte'))
    await expect(canvas.getByText('Un símbolo, como ! o #').closest('li')).toHaveAttribute('data-met', 'true')
    blur()
  },
}

/** The four levels, for the visual tests: the segments fill and change color, the word says the level. */
export const Levels: Story = {
  render: () => (
    <div className="grid max-w-sm gap-6">
      {['ventas', 'ventas2026', 'Ventas2026', 'Ventas-2026'].map((password) => (
        <PasswordStrength key={password} value={password} hideRules />
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const levels = within(canvasElement).getAllByRole('meter').map((meter) => meter.getAttribute('aria-valuetext'))
    await expect(levels).toEqual(['Débil', 'Regular', 'Buena', 'Fuerte'])
  },
}

/** A common password is weak whatever it mixes, and the meter says why. */
export const Common: Story = { render: () => <NewPassword initial="Password1!" /> }

/** The confirmation does not match: crisp red border, the typed text keeps its color. */
export const Invalid: Story = {
  render: () => (
    <Field className="max-w-xs" data-invalid>
      <FieldLabel htmlFor="confirm-password">Confirma la contraseña</FieldLabel>
      <PasswordInput id="confirm-password" autoComplete="new-password" defaultValue="Ventas-2025" aria-invalid />
      <FieldError>Las contraseñas no coinciden. Escríbela otra vez.</FieldError>
    </Field>
  ),
  play: async ({ canvasElement }) => {
    await expectDestructiveBorder(canvasElement.querySelector<HTMLElement>('[data-slot=input-group]')!)
  },
}

export const Disabled: Story = {
  render: () => (
    <Field className="max-w-xs" data-disabled>
      <FieldLabel htmlFor="password-disabled">Contraseña</FieldLabel>
      <PasswordInput id="password-disabled" defaultValue="ventas2026" disabled />
      <FieldDescription>Tu equipo inicia sesión con Google.</FieldDescription>
    </Field>
  ),
}
