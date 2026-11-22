import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, waitFor, within } from 'storybook/test'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/sonner'
import { contrast, inBothThemes, pageBackground, paint, rgb, token } from './support/contrast'

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
    const toastBox = canvasElement.ownerDocument.querySelector('[data-sonner-toast]')!
    await expect(getComputedStyle(toastBox).fontFamily).toMatch(/^Outfit/)
    const action = body.getByRole('button', { name: 'Reintentar' })
    // The brand's small button (28 px), not sonner's 24 px pill.
    await expect(action.getBoundingClientRect().height).toBe(28)
  },
}

/** Which sRGB channel leads in each status tint: green for success, red for error, red and green for warning. */
const STATUS = {
  success: { token: '--success', leads: (r: number, g: number, b: number) => g > r && g > b },
  info: { token: '--info', leads: (r: number, _g: number, b: number) => b > r },
  warning: { token: '--warning', leads: (r: number, g: number, b: number) => r > b && g > b },
  error: { token: '--destructive', leads: (r: number, g: number, b: number) => r > g && r > b },
} as const

/**
 * `richColors` (on the Toaster, or `toast.success(…, { richColors: true })` for one toast): the toast takes a
 * tint of its status color, its border and its icon, as the `alert`; the text keeps the foreground colors, so
 * it reads AA in light and dark (sonner's own rich colors paint the text green, red, amber and blue).
 */
export const Colored: Story = {
  tags: ['mobile'],
  args: { expand: true, position: 'top-center', duration: Infinity, richColors: true, visibleToasts: 4 },
  render: (args, { globals }) => (
    <div className="min-h-120">
      <Toaster {...args} theme={globals.theme === 'dark' ? 'dark' : 'light'} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    toast.dismiss()
    toast.success('Informe publicado', { description: 'Tu equipo ya puede ver «Ventas por región».' })
    toast.info('Hay una nueva versión de AuraData BI', { description: 'Recarga la página para usarla.' })
    toast.warning('El dataset tiene 3 días sin actualizarse', {
      description: 'Los números pueden no estar al día.',
    })
    toast.error('No se pudo conectar con la base de datos', {
      description: 'Revisa la conexión en Ajustes.',
      action: { label: 'Reintentar', onClick: () => {} },
    })
    const doc = canvasElement.ownerDocument
    const body = within(doc.body)
    await waitFor(() => expect(body.getByText('No se pudo conectar con la base de datos')).toBeVisible())
    // As in the alert, the icon sits on the title's first line, not in the middle of a two-line toast.
    for (const box of doc.querySelectorAll<HTMLElement>('[data-sonner-toast]')) {
      const icon = box.querySelector('[data-icon] svg')!.getBoundingClientRect()
      const title = box.querySelector<HTMLElement>('[data-title]')!
      const line = parseFloat(getComputedStyle(title).lineHeight)
      const firstLine = title.getBoundingClientRect().top + line / 2
      await expect(Math.abs(icon.top + icon.height / 2 - firstLine), box.dataset.type).toBeLessThanOrEqual(1)
    }
    await inBothThemes(async (theme) => {
      const page = rgb(pageBackground())
      const popover = token('--popover')
      const foreground = token('--popover-foreground')
      for (const [type, status] of Object.entries(STATUS)) {
        const box = doc.querySelector<HTMLElement>(`[data-sonner-toast][data-type="${type}"]`)!
        const label = `${type} (${theme})`
        await expect(box, `${label}: on screen`).toBeVisible()
        const background = paint(getComputedStyle(box).backgroundColor, page)
        await expect(background, `${label}: tinted`).not.toEqual(popover)
        await expect(status.leads(...(background as [number, number, number])), `${label}: hue`).toBe(true)
        const border = paint(getComputedStyle(box).borderTopColor, rgb(background))
        await expect(border, `${label}: border`).not.toEqual(token('--border'))
        const title = paint(getComputedStyle(box.querySelector('[data-title]')!).color, rgb(background))
        await expect(title, `${label}: title in the foreground color`).toEqual(foreground)
        await expect(contrast(title, background), `${label}: title AA`).toBeGreaterThanOrEqual(4.5)
        const description = paint(getComputedStyle(box.querySelector('[data-description]')!).color, rgb(background))
        await expect(contrast(description, background), `${label}: description AA`).toBeGreaterThanOrEqual(4.5)
        const icon = paint(getComputedStyle(box.querySelector('[data-icon] svg')!).color, rgb(background))
        await expect(icon, `${label}: icon`).toEqual(token(status.token))
      }
    })
  },
}
