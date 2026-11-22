import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, waitFor, within } from 'storybook/test'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Toaster, toastProgress } from '@/components/ui/sonner'
import { contrast, inBothThemes, pageBackground, paint, rgb, token } from './support/contrast'

/** Dismisses every toast and waits until they leave, so a story never finds the toasts of the one before. */
async function clearToasts(doc: Document) {
  toast.dismiss()
  await waitFor(() => expect(doc.querySelector('[data-sonner-toast]')).toBeNull())
}

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
    await clearToasts(canvasElement.ownerDocument)
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
    await clearToasts(canvasElement.ownerDocument)
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

/**
 * A long task: `toastProgress` opens a toast with a bar, `update(40)` moves it, and `success` or `error` ends it
 * in place, with «Descargar» or «Reintentar». Three exports side by side: running, done and failed.
 */
export const Progress: Story = {
  tags: ['mobile'],
  args: { expand: true, position: 'top-center', duration: Infinity },
  render: (args, { globals }) => (
    <div className="min-h-100">
      <Toaster {...args} theme={globals.theme === 'dark' ? 'dark' : 'light'} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await clearToasts(canvasElement.ownerDocument)
    const failed = toastProgress('Exportando «Clientes»…')
    failed.update(70)
    failed.error('No se pudo exportar «Clientes»', {
      description: 'Se perdió la conexión con la base de datos.',
      action: { label: 'Reintentar', onClick: () => {} },
    })
    const done = toastProgress('Exportando «Ventas por región»…')
    done.update(100)
    done.success('Listo', {
      description: '«Ventas por región».xlsx',
      action: { label: 'Descargar', onClick: () => {} },
    })
    const running = toastProgress('Exportando «Ventas 2026»…')
    running.update(40)
    const body = within(canvasElement.ownerDocument.body)
    const bar = await body.findByRole('progressbar', { name: 'Exportando «Ventas 2026»…' })
    await expect(bar).toHaveAttribute('aria-valuenow', '40')
    // es-MX with a no-break space before the sign, as the voice guide.
    await expect(bar).toHaveAttribute('aria-valuetext', '40\u00a0%')
    await expect(bar.querySelector('[data-slot=progress-value]')?.textContent).toBe('40\u00a0%')
    // Done and failed replaced their bars: only the running export has one.
    await expect(body.getAllByRole('progressbar')).toHaveLength(1)
    // Sonner closes a toast when its action is clicked, so the screenshot keeps them unclicked.
    await waitFor(() => expect(body.getByRole('button', { name: 'Descargar' })).toBeVisible())
    await waitFor(() => expect(body.getByRole('button', { name: 'Reintentar' })).toBeVisible())
  },
}

/** A promise in a toast: «Exportando…» while it runs, then «Listo» with «Descargar», or the error with «Reintentar». */
export const WithPromise: Story = {
  args: { expand: true, position: 'top-center', duration: Infinity },
  render: (args, { globals }) => (
    <div className="min-h-70">
      <Toaster {...args} theme={globals.theme === 'dark' ? 'dark' : 'light'} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await clearToasts(canvasElement.ownerDocument)
    const body = within(canvasElement.ownerDocument.body)
    const deferred = () => {
      let resolve!: (file: string) => void
      let reject!: (error: Error) => void
      const promise = new Promise<string>((ok, fail) => ((resolve = ok), (reject = fail)))
      return { promise, resolve, reject }
    }
    const failing = deferred()
    const working = deferred()
    toast.promise(failing.promise, {
      loading: 'Exportando «Clientes»…',
      error: {
        message: 'No se pudo exportar «Clientes»',
        description: 'La consulta tardó demasiado.',
        action: { label: 'Reintentar', onClick: () => {} },
      },
    })
    toast.promise(working.promise, {
      loading: 'Exportando «Ventas 2026»…',
      success: (file) => ({
        message: 'Listo',
        description: file,
        action: { label: 'Descargar', onClick: () => {} },
      }),
    })
    await waitFor(() => expect(body.getByText('Exportando «Ventas 2026»…')).toBeVisible())
    working.resolve('«Ventas 2026».pdf')
    failing.reject(new Error('timeout'))
    await waitFor(() => expect(body.getByRole('button', { name: 'Descargar' })).toBeVisible())
    await waitFor(() => expect(body.getByRole('button', { name: 'Reintentar' })).toBeVisible())
    await expect(body.queryByText(/Exportando/)).toBeNull()
  },
}
