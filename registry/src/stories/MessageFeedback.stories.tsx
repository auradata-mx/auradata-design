import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'

import { MessageFeedback } from '@/components/ui/message-feedback'

const meta = {
  title: 'AuraData/Message feedback',
  component: MessageFeedback,
  args: { onFeedback: fn() },
} satisfies Meta<typeof MessageFeedback>

export default meta
type Story = StoryObj<typeof meta>

/** «Útil» records 👍 at once and stays pressed; pressing it again takes it back. */
export const Helpful: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const up = canvas.getByRole('button', { name: 'Útil' })
    await expect(up).toHaveAttribute('aria-pressed', 'false')
    await userEvent.click(up)
    await expect(up).toHaveAttribute('aria-pressed', 'true')
    await expect(args.onFeedback).toHaveBeenLastCalledWith('up')
    await expect(canvas.getByRole('status')).toHaveTextContent('Gracias por tu opinión.')
    await userEvent.click(up)
    await expect(up).toHaveAttribute('aria-pressed', 'false')
    await expect(args.onFeedback).toHaveBeenLastCalledWith(null)
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}

/** «No útil» records 👎 at once and asks why, optionally: a reason, a comment, «Enviar». */
export const WithReason: Story = {
  tags: ['mobile'],
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'No útil' }))
    await expect(args.onFeedback).toHaveBeenLastCalledWith('down')
    const form = canvas.getByRole('group', { name: '¿Qué falló?' })
    await userEvent.click(within(form).getByRole('button', { name: 'Datos incorrectos' }))
    await expect(within(form).getByRole('button', { name: 'Datos incorrectos' })).toHaveAttribute('aria-pressed', 'true')
    await userEvent.type(within(form).getByRole('textbox', { name: 'Cuéntanos más (opcional)' }), 'Faltan las ventas del Bajío.')
    await userEvent.click(within(form).getByRole('button', { name: 'Enviar' }))
    await expect(args.onFeedback).toHaveBeenLastCalledWith('down', {
      reason: 'Datos incorrectos',
      comment: 'Faltan las ventas del Bajío.',
    })
    await expect(canvas.queryByRole('group', { name: '¿Qué falló?' })).toBeNull()
    await expect(canvas.getByRole('status')).toHaveTextContent('Gracias por tu opinión.')
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}

/** «Omitir» closes the question: the 👎 stays recorded, without a reason. */
export const SkipReason: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'No útil' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Omitir' }))
    await expect(canvas.queryByRole('group', { name: '¿Qué falló?' })).toBeNull()
    await expect(canvas.getByRole('button', { name: 'No útil' })).toHaveAttribute('aria-pressed', 'true')
    await expect(args.onFeedback).toHaveBeenCalledTimes(1)
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}

/** The reason form, open, as a reader sees it after «No útil». */
export const ReasonOpen: Story = {
  args: { defaultValue: 'down', defaultAsking: true },
}
