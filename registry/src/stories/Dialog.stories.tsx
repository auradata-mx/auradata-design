import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogBody,
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

/** `DialogBody` wraps long content in `ScrollBlur`: edges blur progressively into the header and footer. */
export const Scrollable: Story = {
  args: { defaultOpen: true },
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger render={<Button variant="outline" />}>Ver términos</DialogTrigger>
      <DialogContent className="max-h-96 sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Historial de cambios</DialogTitle>
          <DialogDescription>Últimas actualizaciones del modelo de ventas.</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <div className="grid gap-3 py-1">
            {Array.from({ length: 10 }, (_, index) => (
              <div key={index} className="rounded-lg border p-3">
                <p className="font-medium">Versión 2.{10 - index}</p>
                <p className="text-muted-foreground">Se ajustaron los filtros por región y las metas del trimestre.</p>
              </div>
            ))}
          </div>
        </DialogBody>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Cerrar</DialogClose>
          <Button>Aplicar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const dialog = await body.findByRole('dialog', { name: 'Historial de cambios' })
    const blur = dialog.querySelector('[data-slot="scroll-blur"]')!
    const viewport = dialog.querySelector<HTMLElement>('[data-slot="scroll-blur-viewport"]')!
    await waitFor(() => expect(blur).toHaveAttribute('data-more', 'end'))
    viewport.scrollTop = 90
    await waitFor(() => expect(blur).toHaveAttribute('data-more', 'both'))
  },
}
