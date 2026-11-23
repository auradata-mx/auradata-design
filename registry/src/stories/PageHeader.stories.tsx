import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, waitFor, within } from 'storybook/test'

import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/ui/page-header'

const meta = {
  title: 'AuraData/Page header',
  component: PageHeader,
  args: {
    title: 'Informes',
    description: 'Los informes de tu equipo, del más reciente al más antiguo.',
    actions: (
      <>
        <Button variant="outline">Importar</Button>
        <Button>Nuevo informe</Button>
      </>
    ),
  },
} satisfies Meta<typeof PageHeader>

export default meta
type Story = StoryObj<typeof meta>

/** Also checked on a phone (390×844) by the `mobile` Playwright project. */
export const Default: Story = { tags: ['mobile'] }
export const TitleOnly: Story = { args: { description: undefined, actions: undefined } }

/**
 * A long title wraps on its own lines, never cut: beside the actions on a wide screen, and on a phone the
 * actions drop under it (the `mobile` Playwright project checks it at 390×844).
 */
export const LongTitle: Story = {
  tags: ['mobile'],
  // The story test runs at 1280 px, where the actions must stay beside the title.
  globals: { viewport: { value: 'desktop', isRotated: false } },
  args: {
    title: 'Rentabilidad por sucursal y línea de producto en el Bajío y Occidente, contra el presupuesto anual, de enero a noviembre de 2026',
    description: 'Comparado con el mismo periodo de 2025. Los montos están en pesos mexicanos, sin IVA.',
  },
  play: async ({ canvasElement }) => {
    const header = canvasElement.querySelector<HTMLElement>('[data-slot="page-header"]')!
    const title = within(header).getByRole('heading', { level: 1 })
    const actions = within(header).getByRole('button', { name: 'Nuevo informe' }).parentElement!
    await expect(header.scrollWidth).toBeLessThanOrEqual(header.clientWidth)
    await expect(title.scrollWidth).toBeLessThanOrEqual(title.clientWidth)
    const wide = header.clientWidth >= 640
    const beside = actions.getBoundingClientRect().left >= title.getBoundingClientRect().right
    await expect(beside).toBe(wide)
  },
}

/** `sticky`: sticks to the top of its scroll container and progressively blurs content passing behind it. */
export const Sticky: Story = {
  parameters: { themeFrame: { padded: false } },
  render: (args) => (
    <div data-testid="page" tabIndex={0} aria-label="Informes" className="h-96 overflow-y-auto px-6 pb-6">
      <PageHeader {...args} sticky />
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 8 }, (_, index) => (
          <article key={index} className="rounded-xl border bg-card p-4">
            <div className={index % 2 ? 'h-16 rounded-lg bg-chart-2/35' : 'h-16 rounded-lg bg-chart-1/35'} />
            <h2 className="mt-3 font-medium">Informe {index + 1}</h2>
            <p className="text-sm text-muted-foreground">Actualizado hoy</p>
          </article>
        ))}
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const page = within(canvasElement).getByTestId('page')
    page.scrollTop = 120
    await waitFor(() => expect(page.scrollTop).toBe(120))
    const header = canvasElement.querySelector('[data-slot="page-header"]')!
    await expect(header).toHaveAttribute('data-sticky', 'true')
    await expect(header.querySelector('[data-slot="progressive-blur"]')).not.toBeNull()
  },
}
