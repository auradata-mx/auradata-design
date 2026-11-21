import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

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
