import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, waitFor, within } from 'storybook/test'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/sonner'

const meta = {
  title: 'Components/Sonner',
  component: Toaster,
} satisfies Meta<typeof Toaster>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-3">
      <Toaster {...args} />
      <Button variant="outline" onClick={() => toast('Informe guardado')}>
        Normal
      </Button>
      <Button variant="outline" onClick={() => toast.success('Informe publicado')}>
        Éxito
      </Button>
      <Button variant="outline" onClick={() => toast.warning('El dataset tiene 3 días sin actualizarse')}>
        Aviso
      </Button>
      <Button variant="outline" onClick={() => toast.error('No se pudo conectar con la base de datos')}>
        Error
      </Button>
    </div>
  ),
}

/**
 * Toasts on screen for the visual tests: success, error with an action, and a load that finished.
 * `duration: Infinity` keeps them until the screenshot; `expand` shows them all, not stacked. The theme
 * comes from the toolbar: the Toaster reads next-themes, which Storybook does not run (L37).
 */
export const Visible: Story = {
  args: { expand: true, position: 'top-center', duration: Infinity },
  render: (args, { globals }) => (
    <div className="min-h-80">
      <Toaster {...args} theme={globals.theme === 'dark' ? 'dark' : 'light'} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    toast.dismiss()
    toast.success('Informe publicado', { description: 'Tu equipo ya puede ver «Ventas por región».' })
    toast.error('No se pudo conectar con la base de datos', {
      action: { label: 'Reintentar', onClick: () => {} },
    })
    const id = toast.loading('Exportando «Ventas 2026» a PDF…')
    toast.success('PDF listo para descargar', { id })
    const body = within(canvasElement.ownerDocument.body)
    await waitFor(() => expect(body.getByText('PDF listo para descargar')).toBeVisible())
    await waitFor(() => expect(body.getByRole('button', { name: 'Reintentar' })).toBeVisible())
  },
}
