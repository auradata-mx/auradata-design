import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { WrenchIcon } from 'lucide-react'

import { AnnouncementBanner } from '@/components/ui/announcement-banner'
import { Button } from '@/components/ui/button'
import { contrast, inBothThemes, paint, rgb, token } from './support/contrast'

const meta = {
  title: 'AuraData/Announcement banner',
  component: AnnouncementBanner,
  // Full width, as at the top of an app.
  parameters: { themeFrame: { padded: false } },
  args: {
    variant: 'info',
    title: 'Nueva versión disponible',
    description: 'Recarga la página para usar las novedades de AuraData BI.',
    action: <Button size="sm">Recargar</Button>,
    onDismiss: fn(),
  },
} satisfies Meta<typeof AnnouncementBanner>

export default meta
type Story = StoryObj<typeof meta>

/** Pinned at the top of the page: the content scrolls under it. */
export const Default: Story = {
  tags: ['mobile'],
  render: (args) => (
    <div>
      <AnnouncementBanner {...args} />
      <div className="grid gap-3 p-6">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="h-24 rounded-xl border bg-card" />
        ))}
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const banner = canvas.getByRole('region', { name: 'Nueva versión disponible' })
    await expect(getComputedStyle(banner).position).toBe('sticky')
    await expect(within(banner).getByRole('button', { name: 'Recargar' })).toBeVisible()
    await expect(within(banner).getByRole('button', { name: 'Cerrar aviso' })).toBeVisible()
  },
}

const STATUS_TOKEN = { info: '--info', success: '--success', warning: '--warning', destructive: '--destructive' } as const

/** One per status; the text keeps the foreground colors (AA), the tint, border and icon carry the status. */
export const Variants: Story = {
  tags: ['mobile'],
  render: () => (
    <div className="grid gap-4">
      <AnnouncementBanner
        variant="info"
        title="Nueva versión disponible"
        description="Recarga la página para usar las novedades."
        action={<Button size="sm">Recargar</Button>}
        onDismiss={() => {}}
      />
      <AnnouncementBanner
        variant="warning"
        icon={<WrenchIcon />}
        title="Mantenimiento programado"
        description={'El sábado 29 de noviembre, de 22:00 a\u00a023:00, AuraData BI no estará disponible.'}
        onDismiss={() => {}}
      />
      <AnnouncementBanner
        variant="success"
        title="Tu conexión con BigQuery ya está activa"
        description="Los datasets se actualizan cada hora."
        action={
          <Button size="sm" variant="outline">
            Ver datasets
          </Button>
        }
      />
      <AnnouncementBanner
        variant="destructive"
        title="No se pudo sincronizar «Ventas 2026»"
        description="Revisa la conexión en Ajustes."
        action={
          <Button size="sm" variant="outline">
            Ir a Ajustes
          </Button>
        }
        onDismiss={() => {}}
      />
      <AnnouncementBanner
        variant="default"
        title="Prueba gratuita: te quedan 12 días"
        action={<Button size="sm">Elegir un plan</Button>}
        onDismiss={() => {}}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const banners = [...canvasElement.querySelectorAll<HTMLElement>('[data-slot=announcement-banner]')]
    await inBothThemes(async (theme) => {
      for (const banner of banners) {
        const variant = banner.dataset.variant as keyof typeof STATUS_TOKEN | 'default'
        const label = `${variant} (${theme})`
        const background = paint(getComputedStyle(banner).backgroundColor, rgb(token('--background')))
        for (const slot of ['announcement-banner-title', 'announcement-banner-description']) {
          const text = banner.querySelector(`[data-slot=${slot}]`)
          if (!text) continue
          const color = paint(getComputedStyle(text).color, rgb(background))
          await expect(contrast(color, background), `${label}: ${slot} AA`).toBeGreaterThanOrEqual(4.5)
        }
        if (variant !== 'default') {
          // T59's status scale: the 50 tint, the 200 border and the 700 icon (AA in both themes).
          const scale = STATUS_TOKEN[variant]
          await expect(background, `${label}: ${scale}-50`).toEqual(token(`${scale}-50`))
          const border = paint(getComputedStyle(banner).borderBottomColor, rgb(background))
          await expect(border, `${label}: ${scale}-200 border`).toEqual(token(`${scale}-200`))
          const icon = paint(getComputedStyle(banner.querySelector('svg')!).color, rgb(background))
          await expect(icon, `${label}: ${scale}-700 icon`).toEqual(token(`${scale}-700`))
          await expect(contrast(icon, background), `${label}: icon 3:1`).toBeGreaterThanOrEqual(3)
        }
      }
    })
  },
}

/** In a narrow container (a phone), the action drops under the text and the close button stays on the first line. */
export const Narrow: Story = {
  parameters: { themeFrame: { padded: true } },
  render: (args) => (
    <div className="max-w-sm border-x">
      <AnnouncementBanner
        {...args}
        variant="warning"
        icon={<WrenchIcon />}
        title="Mantenimiento programado"
        description={'El sábado 29 de noviembre, de 22:00 a\u00a023:00, AuraData BI no estará disponible.'}
        action={
          <Button size="sm" variant="outline">
            Ver detalles
          </Button>
        }
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const banner = within(canvasElement).getByRole('region', { name: 'Mantenimiento programado' })
    const text = banner.querySelector('[data-slot=announcement-banner-content]')!.getBoundingClientRect()
    const action = within(banner).getByRole('button', { name: 'Ver detalles' }).getBoundingClientRect()
    const close = within(banner).getByRole('button', { name: 'Cerrar aviso' }).getBoundingClientRect()
    await expect(action.top).toBeGreaterThanOrEqual(text.bottom)
    await expect(Math.round(action.left)).toBe(Math.round(text.left))
    await expect(close.top).toBeLessThan(text.top + 8)
    await expect(banner.scrollWidth).toBeLessThanOrEqual(banner.clientWidth)
  },
}

/** «Cerrar aviso» hides the banner and tells the app, which remembers it. */
export const Dismiss: Story = {
  render: (args) => (
    <div>
      <AnnouncementBanner {...args} />
      <p className="p-6 text-sm text-muted-foreground">El aviso se cerró: la página sube a su lugar.</p>
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Cerrar aviso' }))
    await expect(args.onDismiss).toHaveBeenCalledOnce()
    await expect(canvas.queryByRole('region', { name: 'Nueva versión disponible' })).toBeNull()
  },
}
