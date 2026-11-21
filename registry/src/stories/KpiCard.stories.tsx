import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { KpiCard } from '@/components/ui/kpi-card'

const meta = {
  title: 'AuraData/KPI card',
  component: KpiCard,
  args: { label: 'Ventas del mes', value: '$4.16 M', change: 0.062, comparison: 'vs. septiembre', className: 'max-w-xs' },
  argTypes: { goodDirection: { control: 'inline-radio', options: ['up', 'down'] } },
} satisfies Meta<typeof KpiCard>

export default meta
type Story = StoryObj<typeof meta>

export const Rising: Story = {}

/** Costs went up: bad news, so the arrow is red. */
export const CostsRising: Story = {
  args: { label: 'Costo de adquisición', value: '$812', change: 0.14, goodDirection: 'down' },
}

/** On a phone the row stacks: the `mobile` Playwright project checks it at 390×844. */
export const Row: Story = {
  tags: ['mobile'],
  render: () => (
    <div className="grid gap-4 sm:grid-cols-3">
      <KpiCard label="Ventas del mes" value="$4.16 M" change={0.062} comparison="vs. septiembre" />
      <KpiCard label="Clientes activos" value="1,284" change={-0.021} comparison="vs. septiembre" />
      <KpiCard label="Ticket promedio" value="$3,240" change={0} comparison="vs. septiembre" />
    </div>
  ),
}

/** The last twelve months as a sparkline, in the color of the change. It is decoration: screen readers skip it. */
export const WithTrend: Story = {
  args: { trend: [3.1, 3.4, 3.2, 3.6, 3.5, 3.8, 3.7, 3.9, 4.0, 3.8, 3.92, 4.16] },
  play: async ({ canvasElement }) => {
    const sparkline = canvasElement.querySelector('[data-slot="kpi-sparkline"]')
    await expect(sparkline).not.toBeNull()
    await expect(sparkline).toHaveAttribute('aria-hidden', 'true')
  },
}

export const RowWithTrends: Story = {
  render: () => (
    <div className="grid gap-4 sm:grid-cols-3">
      <KpiCard
        label="Ventas del mes"
        value="$4.16 M"
        change={0.062}
        comparison="vs. septiembre"
        trend={[3.1, 3.4, 3.2, 3.6, 3.5, 3.8, 3.7, 3.9, 4.0, 3.8, 3.92, 4.16]}
      />
      <KpiCard
        label="Clientes activos"
        value="1,284"
        change={-0.021}
        comparison="vs. septiembre"
        trend={[1190, 1215, 1240, 1262, 1301, 1320, 1335, 1318, 1309, 1296, 1311, 1284]}
      />
      <KpiCard
        label="Ticket promedio"
        value="$3,240"
        change={0}
        comparison="vs. septiembre"
        trend={[3205, 3215, 3222, 3230, 3226, 3235, 3241, 3238, 3245, 3240, 3242, 3240]}
      />
      <KpiCard label="Informes abiertos" value="342" trend={[210, 240, 228, 265, 280, 301, 296, 318, 330, 325, 338, 342]} />
    </div>
  ),
}
