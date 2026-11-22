import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, waitFor } from 'storybook/test'

import { Badge } from '@/components/ui/badge'
import { Logo } from '@/components/ui/logo'
import { ProgressiveBlur, ScrollBlur } from '@/components/ui/progressive-blur'

const meta = {
  title: 'AuraData/Progressive blur',
  component: ProgressiveBlur,
} satisfies Meta<typeof ProgressiveBlur>

export default meta
type Story = StoryObj<typeof meta>

const REPORTS = [
  ['Ventas por región', 'Actualizado hace 5 min'],
  ['Nómina mensual', 'Actualizado hoy'],
  ['Inventario por almacén', 'Actualizado ayer'],
  ['Cuentas por cobrar', 'Actualizado hace 2 días'],
  ['Margen por producto', 'Actualizado hace 3 días'],
  ['Clientes nuevos', 'Actualizado la semana pasada'],
  ['Devoluciones', 'Actualizado la semana pasada'],
  ['Gastos de operación', 'Actualizado hace 2 semanas'],
  ['Pronóstico de ventas', 'Actualizado hace un mes'],
] as const

const REGIONS = ['Norte', 'Bajío', 'Centro', 'Occidente', 'Golfo', 'Sureste', 'Pacífico', 'Noreste', 'Península']

/** A checkerboard backdrop, so the direction of each blur can be read at a glance. */
function Checkerboard() {
  return (
    <div className="grid size-full grid-cols-12 grid-rows-6">
      {Array.from({ length: 72 }, (_, index) => {
        const dark = (Math.floor(index / 12) + index) % 2 === 0
        return <div key={index} className={dark ? 'bg-chart-1' : 'bg-chart-3'} />
      })}
    </div>
  )
}

/** Each side: the blur is strongest at the edge and fades to nothing inward. */
export const Sides: Story = {
  render: () => (
    <div className="grid gap-4 sm:grid-cols-2">
      {(['top', 'bottom', 'left', 'right'] as const).map((side) => (
        <figure key={side} className="flex flex-col gap-2">
          <div className="relative h-40 overflow-hidden rounded-lg border">
            <Checkerboard />
            <ProgressiveBlur side={side} />
          </div>
          <figcaption className="text-sm text-muted-foreground">
            {{ top: 'Arriba', bottom: 'Abajo', left: 'Izquierda', right: 'Derecha' }[side]}
          </figcaption>
        </figure>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const blurs = canvasElement.querySelectorAll('[data-slot=progressive-blur]')
    await expect(blurs).toHaveLength(4)
    for (const blur of blurs) {
      // Decorative: screen readers skip it and it never takes a click.
      await expect(blur).toHaveAttribute('aria-hidden', 'true')
      await expect(getComputedStyle(blur).pointerEvents).toBe('none')
    }
    const layer = blurs[0].querySelector<HTMLElement>('[data-slot=progressive-blur-layer]:last-child')!
    await expect(getComputedStyle(layer).backdropFilter).toBe('blur(16px)')
  },
}

/** A sticky header: the page blurs progressively as it scrolls under the bar. */
export const StickyHeader: Story = {
  parameters: { themeFrame: { padded: false } },
  render: () => (
    <div data-testid="page" tabIndex={0} aria-label="Página" className="h-[28rem] overflow-y-auto">
      <header className="sticky top-0 z-10 flex h-14 items-center justify-between px-6">
        <ProgressiveBlur side="top" tint size="calc(100% + 2rem)" className="-z-10" />
        <Logo className="h-6" />
        <Badge variant="secondary">Beta</Badge>
      </header>
      <div className="grid gap-4 px-6 pt-2 pb-6 sm:grid-cols-2">
        {REPORTS.map(([title, detail], index) => (
          <article key={title} className="rounded-xl border bg-card p-5 shadow-(--aura-shadow-card)">
            <div className={index % 2 ? 'h-20 rounded-lg bg-chart-2/40' : 'h-20 rounded-lg bg-chart-1/40'} />
            <h3 className="mt-4 font-medium">{title}</h3>
            <p className="text-sm text-muted-foreground">{detail}</p>
          </article>
        ))}
      </div>
    </div>
  ),
  play: async ({ canvas }) => {
    // Scroll a little, so the screenshot shows cards under the bar.
    const page = canvas.getByTestId('page')
    page.scrollTop = 120
    await waitFor(() => expect(page.scrollTop).toBe(120))
  },
}

/** A list that scrolls: each edge blurs only while there is more beyond it. */
export const ScrollEdges: Story = {
  render: () => (
    <ScrollBlur aria-label="Informes" className="h-72 max-w-sm rounded-xl border bg-card">
      <ul className="divide-y">
        {REPORTS.map(([title, detail]) => (
          <li key={title} className="flex flex-col px-4 py-3">
            <span className="font-medium">{title}</span>
            <span className="text-sm text-muted-foreground">{detail}</span>
          </li>
        ))}
      </ul>
    </ScrollBlur>
  ),
  play: async ({ canvasElement, canvas }) => {
    const root = canvasElement.querySelector('[data-slot=scroll-blur]')!
    const viewport = canvas.getByRole('region', { name: 'Informes' })
    // At the top: only the bottom edge blurs.
    await waitFor(() => expect(root).toHaveAttribute('data-more', 'end'))
    viewport.scrollTop = 80
    await waitFor(() => expect(root).toHaveAttribute('data-more', 'both'))
    viewport.scrollTop = viewport.scrollHeight
    await waitFor(() => expect(root).toHaveAttribute('data-more', 'start'))
    viewport.scrollTop = 0
    await waitFor(() => expect(root).toHaveAttribute('data-more', 'end'))
    for (const blur of root.querySelectorAll('[data-slot=progressive-blur]')) {
      await expect(blur).toHaveAttribute('aria-hidden', 'true')
    }
  },
}

/** A row that scrolls sideways, as filter chips on a phone. */
export const HorizontalEdges: Story = {
  tags: ['mobile'],
  render: () => (
    <ScrollBlur aria-label="Regiones" orientation="horizontal" className="max-w-md">
      <ul className="flex w-max gap-2 py-1">
        {REGIONS.map((region) => (
          <li key={region}>
            <Badge variant="outline" className="h-8 px-3 text-sm">
              {region}
            </Badge>
          </li>
        ))}
      </ul>
    </ScrollBlur>
  ),
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('[data-slot=scroll-blur]')!
    await waitFor(() => expect(root).toHaveAttribute('data-more', 'end'))
  },
}
