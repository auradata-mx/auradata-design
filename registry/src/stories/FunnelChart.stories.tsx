import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

import { FunnelChart } from '@/components/ui/funnel-chart'

const STAGES = [
  { etapa: 'Visitas al sitio', personas: 12480 },
  { etapa: 'Registros', personas: 3210 },
  { etapa: 'Prueba activa', personas: 1284 },
  { etapa: 'Pago', personas: 412 },
]

const meta = {
  title: 'Gráficas/Funnel chart',
  id: 'auradata-funnel-chart',
  component: FunnelChart,
  args: { data: STAGES, index: 'etapa', value: 'personas', className: 'w-full max-w-xl' },
} satisfies Meta<typeof FunnelChart>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Stages that lose people: one bar per stage, centered and as wide as its share of the first, with the conversion
 * from the stage before. A list, so it reads the same without the bars.
 */
export const Default: Story = {
  tags: ['mobile'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const stages = canvas.getAllByRole('listitem')
    await expect(stages).toHaveLength(4)
    await expect(stages[0]).toHaveTextContent('Visitas al sitio')
    await expect(stages[0]).toHaveTextContent('12,480')
    // 3,210 of 12,480 visits signed up.
    await expect(within(stages[1]).getByText('25.7 % del paso anterior')).toBeVisible()
    await expect(within(stages[3]).getByText('32.1 % del paso anterior')).toBeVisible()
    await expect(canvas.getByText('3.3 %')).toBeVisible()
    const widths = [...canvasElement.querySelectorAll<HTMLElement>('[data-slot="funnel-bar"]')].map((bar) => bar.style.width)
    await expect(widths).toEqual(['100%', '25.72%', '10.29%', '3.3%'])
  },
}
