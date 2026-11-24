import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState, type ComponentProps } from 'react'

import { Button } from '@/components/ui/button'
import { Progress, ProgressLabel, ProgressValue } from '@/components/ui/progress'
import { formatPercent } from '@/lib/format'

const meta = {
  title: 'Components/Progress',
  component: Progress,
  args: { value: 64 },
} satisfies Meta<typeof Progress>

export default meta
type Story = StoryObj<typeof meta>

function DatasetProgress({ className = 'max-w-sm', ...args }: ComponentProps<typeof Progress>) {
  return (
    <Progress {...args} className={className}>
      <ProgressLabel>Actualizando «Pedidos 2026»</ProgressLabel>
      {/* The brand's percent: «64 %», as lib/format writes it. */}
      <ProgressValue>{(_, value) => (value === null ? null : formatPercent(value / 100))}</ProgressValue>
    </Progress>
  )
}

function ProgressDemo({ value, ...args }: ComponentProps<typeof Progress>) {
  const [current, setCurrent] = useState(value)
  const complete = (current ?? 0) >= 100

  return (
    <div className="flex max-w-sm flex-col items-start gap-4">
      <DatasetProgress {...args} value={current} className="w-full" />
      <Button size="sm" variant="outline" onClick={() => setCurrent(complete ? 0 : Math.min(100, (current ?? 0) + 24))}>
        {complete ? 'Reiniciar' : 'Avanzar'}
      </Button>
    </div>
  )
}

/** Advance the refresh to see the fill move; reset it to see the reverse transition. */
export const Default: Story = {
  render: (args) => <ProgressDemo key={args.value ?? 'indeterminate'} {...args} />,
}

export const Complete: Story = { render: (args) => <DatasetProgress {...args} />, args: { value: 100 } }
