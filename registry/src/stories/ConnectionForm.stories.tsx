import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import { ConnectionForm } from '@/components/blocks/connection-form'
import { blur } from './play-helpers'

const meta = {
  title: 'Blocks/Forms',
  component: ConnectionForm,
  args: { onSubmit: fn(), onCancel: fn() },
  render: (args) => (
    <div className="p-4 sm:p-8">
      <ConnectionForm {...args} />
    </div>
  ),
  parameters: { layout: 'fullscreen', themeFrame: { padded: false } },
} satisfies Meta<typeof ConnectionForm>

export default meta
type Story = StoryObj<typeof meta>

const FILLED = {
  name: 'Ventas producción',
  host: 'db.auradata.mx',
  database: 'ventas',
  username: 'lectura',
  password: 'S3guro-2026',
}

async function fill(canvasElement: HTMLElement) {
  const canvas = within(canvasElement)
  await userEvent.type(canvas.getByLabelText('Nombre'), FILLED.name)
  await userEvent.type(canvas.getByLabelText('Servidor'), FILLED.host)
  await userEvent.type(canvas.getByLabelText('Base de datos'), FILLED.database)
  await userEvent.type(canvas.getByLabelText('Usuario'), FILLED.username)
  await userEvent.type(canvas.getByLabelText('Contraseña'), FILLED.password)
}

/** «Nueva conexión», empty: PostgreSQL and its port, SSL on. On a phone, one column and the buttons stacked. */
export const NewConnection: Story = { name: 'Nueva conexión', tags: ['mobile'] }

/**
 * Submitting an empty form: every required field says what to write, in Spanish, and the focus goes to the first
 * one; nothing reaches `onSubmit`.
 */
export const SubmitEmpty: Story = {
  name: 'Submit empty',
  tags: ['mobile'],
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Guardar conexión' }))
    const name = canvas.getByLabelText('Nombre')
    await waitFor(() => expect(name).toHaveFocus())
    await expect(name).toHaveAttribute('aria-invalid', 'true')
    await expect(name).toHaveAccessibleDescription('Escribe un nombre para la conexión.')
    for (const message of [
      'Escribe el servidor, como db.empresa.mx.',
      'Escribe el nombre de la base de datos.',
      'Escribe el usuario.',
      'Escribe la contraseña.',
    ]) {
      await expect(canvas.getByText(message)).toBeVisible()
    }
    await expect(args.onSubmit).not.toHaveBeenCalled()
    blur()
  },
}

/** Nothing while typing; a wrong server shows its error when the field is left, and clears as it is fixed. */
export const ValidateOnBlur: Story = {
  name: 'Validate on blur',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const host = canvas.getByLabelText('Servidor')
    await userEvent.type(host, 'https://db.auradata.mx')
    await expect(host).not.toHaveAttribute('aria-invalid')
    await userEvent.tab()
    await waitFor(() => expect(host).toHaveAttribute('aria-invalid', 'true'))
    await expect(canvas.getByText('Escribe solo el nombre o la IP del servidor, sin https:// ni /.')).toBeVisible()
    await userEvent.clear(host)
    await userEvent.type(host, 'db.auradata.mx')
    await waitFor(() => expect(host).not.toHaveAttribute('aria-invalid'))
    blur()
  },
}

/** A new engine brings its usual port, until the person types one of their own. */
export const EnginePort: Story = {
  name: 'Engine and port',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const port = canvas.getByLabelText('Puerto')
    await expect(port).toHaveValue('5432')
    await userEvent.click(canvas.getByRole('combobox', { name: 'Motor' }))
    await userEvent.click(await within(document.body).findByRole('option', { name: 'MySQL' }))
    await waitFor(() => expect(port).toHaveValue('3306'))
    await waitFor(() => expect(within(document.body).queryByRole('listbox')).toBeNull())
    blur()
  },
}

/** A valid form reaches `onSubmit` with typed values: the port is a number, the text trimmed. */
export const Submitting: Story = {
  play: async ({ args, canvasElement }) => {
    await fill(canvasElement)
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Guardar conexión' }))
    await waitFor(() =>
      expect(args.onSubmit).toHaveBeenCalledWith({ ...FILLED, engine: 'postgresql', port: 5432, ssl: true })
    )
    blur()
  },
}

/** While the server answers, the button spins and says «Guardando…». */
export const Saving: Story = {
  args: { onSubmit: fn(() => new Promise<void>(() => {})) },
  play: async ({ canvasElement }) => {
    await fill(canvasElement)
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Guardar conexión' }))
    const button = await within(canvasElement).findByRole('button', { name: /Guardando…/ })
    await expect(button).toHaveAttribute('aria-busy', 'true')
    blur()
  },
}

/**
 * What only the server knows: a taken name goes to its field (with the focus), a timeout above the form in an
 * alert, as Brand/11 says.
 */
export const ServerErrors: Story = {
  name: 'Server errors',
  tags: ['mobile'],
  args: {
    onSubmit: fn(() => ({
      name: 'Ya existe una conexión con ese nombre. Prueba con otro.',
      form: 'El servidor no respondió en 10 segundos. Revisa que acepte conexiones desde AuraData BI.',
    })),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await fill(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Guardar conexión' }))
    await expect(await canvas.findByText('No pudimos guardar la conexión')).toBeVisible()
    const name = canvas.getByLabelText('Nombre')
    await waitFor(() =>
      expect(name).toHaveAccessibleDescription('Ya existe una conexión con ese nombre. Prueba con otro.')
    )
    await waitFor(() => expect(name).toHaveFocus())
    blur()
  },
}
