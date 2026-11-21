import type { Meta, StoryObj } from '@storybook/react-vite'

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

export const Row: Story = {
  render: () => (
    <div className="grid gap-4 sm:grid-cols-3">
      <KpiCard label="Ventas del mes" value="$4.16 M" change={0.062} comparison="vs. septiembre" />
      <KpiCard label="Clientes activos" value="1,284" change={-0.021} comparison="vs. septiembre" />
      <KpiCard label="Ticket promedio" value="$3,240" change={0} comparison="vs. septiembre" />
    </div>
  ),
}
