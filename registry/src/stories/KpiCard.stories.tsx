import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

import { KpiCard } from '@/components/blocks/kpi-card'

const meta = {
  title: 'Blocks/Parts/KPI card',
  component: KpiCard,
  args: { label: 'Ventas del mes', value: '$4.16 M', change: 0.062, comparison: 'vs. septiembre', className: 'max-w-sm' },
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

const SALES_TREND = [3.1, 3.4, 3.2, 3.6, 3.5, 3.8, 3.7, 3.9, 4.0, 3.8, 3.92, 4.16]

/** While the number loads: skeletons in the shape of the value, the change and the sparkline, as tall as the loaded card. */
export const Loading: Story = {
  render: (args) => (
    <div className="grid max-w-2xl gap-4 sm:grid-cols-2">
      <KpiCard {...args} className={undefined} trend={SALES_TREND} />
      <KpiCard {...args} className={undefined} trend={SALES_TREND} loading />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [loaded, loading] = [...canvasElement.querySelectorAll<HTMLElement>('[data-slot="kpi-card"]')]
    await expect(loading).toHaveAttribute('aria-busy', 'true')
    await expect(within(loading).queryByText('$4.16 M')).toBeNull()
    await expect(loading.querySelectorAll('[data-slot="skeleton"]')).toHaveLength(3)
    await expect(loading.offsetHeight).toBe(loaded.offsetHeight)
  },
}

/** No value for the period: a dash with «Sin datos», and no change arrow, which would mean nothing. */
export const NoData: Story = {
  name: 'No data',
  args: { value: null },
  play: async ({ canvasElement }) => {
    const card = within(canvasElement)
    await expect(card.getByText('—')).toBeInTheDocument()
    await expect(card.getByText('Sin datos')).toBeInTheDocument()
    await expect(canvasElement.querySelector('[data-tone]')).toBeNull()
  },
}

/** A long label and a long value in a narrow card: both wrap inside it, nothing spills out or gets cut. */
export const LongContent: Story = {
  name: 'Long content',
  args: {
    label: 'Ingresos recurrentes anuales de clientes empresariales en la región Bajío',
    value: '$12,480,365,912.75',
    trend: SALES_TREND,
  },
  play: async ({ canvasElement }) => {
    const card = canvasElement.querySelector<HTMLElement>('[data-slot="kpi-card"]')!
    await expect(card.scrollWidth).toBeLessThanOrEqual(card.clientWidth)
  },
}
