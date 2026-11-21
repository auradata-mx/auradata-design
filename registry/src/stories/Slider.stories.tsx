import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { formatCurrency } from '@/lib/format'

const meta = {
  title: 'Components/Slider',
  component: Slider,
} satisfies Meta<typeof Slider>

export default meta
type Story = StoryObj<typeof meta>

/** A numeric filter: minimum sales per branch, with its label and current value. */
function MinimumSales({ disabled }: { disabled?: boolean }) {
  const [value, setValue] = useState(250_000)
  return (
    <div className="grid max-w-sm gap-3">
      <div className="flex items-center justify-between gap-4">
        <Label id="ventas-minimas">Ventas mínimas por sucursal</Label>
        <span className="text-sm text-muted-foreground tabular-nums">{formatCurrency(value)}</span>
      </div>
      <Slider
        aria-labelledby="ventas-minimas"
        value={value}
        onValueChange={(next) => setValue(next as number)}
        min={0}
        max={1_000_000}
        step={50_000}
        disabled={disabled}
      />
    </div>
  )
}

export const Default: Story = { render: () => <MinimumSales /> }
export const Disabled: Story = { render: () => <MinimumSales disabled /> }

/** A range: two thumbs for the gross margin between 15 % and 40 %. */
export const Range: Story = {
  render: () => (
    <div className="grid max-w-sm gap-3">
      <div className="flex items-center justify-between gap-4">
        <Label id="margen">Margen bruto</Label>
        <span className="text-sm text-muted-foreground tabular-nums">15 % – 40 %</span>
      </div>
      <Slider aria-labelledby="margen" defaultValue={[15, 40]} min={0} max={100} />
    </div>
  ),
}
