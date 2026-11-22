import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

import { Gauge } from '@/components/ui/gauge'
import { formatNumber } from '@/lib/format'

const meta = {
  title: 'AuraData/Gauge',
  component: Gauge,
  args: { value: 0.72, label: 'Meta del trimestre' },
} satisfies Meta<typeof Gauge>

export default meta
type Story = StoryObj<typeof meta>

/** One value against its whole, as a ring: the fill in Azul Aura, its track a lighter step of the same color. */
export const Ring: Story = {
  play: async ({ canvasElement }) => {
    const meter = within(canvasElement).getByRole('meter', { name: 'Meta del trimestre' })
    await expect(meter).toHaveAttribute('aria-valuenow', '0.72')
    await expect(meter).toHaveAttribute('aria-valuemax', '1')
    await expect(meter).toHaveAttribute('aria-valuetext', '72\u00a0%')
    await expect(meter).toHaveTextContent('72 %')
  },
}

/**
 * A half gauge with limits: the fill turns amber past `warning` and red past `danger`, and says so in words, so the
 * color is never the only signal.
 */
export const HalfWithLimits: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-start gap-8">
      <Gauge {...args} variant="half" value={0.48} label="Uso del almacenamiento" thresholds={{ warning: 0.75, danger: 0.9 }} />
      <Gauge {...args} variant="half" value={0.82} label="Uso del almacenamiento" thresholds={{ warning: 0.75, danger: 0.9 }} />
      <Gauge {...args} variant="half" value={0.96} label="Uso del almacenamiento" thresholds={{ warning: 0.75, danger: 0.9 }} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const meters = within(canvasElement).getAllByRole('meter')
    await expect(meters.map((meter) => meter.getAttribute('data-tone'))).toEqual(['normal', 'warning', 'danger'])
    await expect(meters[1]).toHaveTextContent('Cerca del límite')
    await expect(meters[2]).toHaveTextContent('Sobre el límite')
  },
}

/** Any scale: queries used of the plan's 50,000, written with `valueFormatter`. */
export const CustomScale: Story = {
  args: {
    value: 31840,
    max: 50000,
    label: 'Consultas del mes',
    valueFormatter: (value: number) => formatNumber(value),
    caption: 'de 50,000',
  },
}

/** Sizes: 96 px in a dense row, 160 by default, 224 as the hero of a page. */
export const Sizes: Story = {
  tags: ['mobile'],
  render: (args) => (
    <div className="flex flex-wrap items-center gap-6">
      <Gauge {...args} size={96} />
      <Gauge {...args} />
      <Gauge {...args} size={224} />
    </div>
  ),
}
