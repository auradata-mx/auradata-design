import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

const meta = {
  title: 'Components/Dialog',
  component: Dialog,
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger render={<Button variant="outline" />}>Eliminar informe</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Eliminar «Ventas 2026»?</DialogTitle>
          <DialogDescription>Se borran sus gráficas y filtros. No se puede deshacer.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Cancelar</DialogClose>
          <Button variant="destructive">Eliminar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

/** Open, for the visual tests and to see the overlay. */
export const Open: Story = {
  ...Default,
  args: { ...Default.args, defaultOpen: true },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const close = (await body.findByRole('button', { name: 'Cerrar' })).getBoundingClientRect()
    const title = body.getByRole('heading', { name: '¿Eliminar «Ventas 2026»?' }).getBoundingClientRect()
    await expect(Math.abs(close.top + close.height / 2 - (title.top + title.height / 2))).toBeLessThanOrEqual(1)
  },
}

/** The trigger opens the dialog, Escape closes it and the focus goes back to the trigger. */
export const EscapeCloses: Story = {
  ...Default,
  name: 'Escape closes',
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: 'Eliminar informe' })
    const body = within(canvasElement.ownerDocument.body)
    await userEvent.click(trigger)
    await body.findByRole('dialog', { name: '¿Eliminar «Ventas 2026»?' })
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(body.queryByRole('dialog')).toBeNull())
    await waitFor(() => expect(document.activeElement).toBe(trigger))
    // Closed, nothing focused: the screenshot shows the resting trigger.
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}
