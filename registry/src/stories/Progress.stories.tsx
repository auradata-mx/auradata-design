import type { Meta, StoryObj } from '@storybook/react-vite'

import { Progress, ProgressLabel, ProgressValue } from '@/components/ui/progress'
import { formatPercent } from '@/lib/format'

const meta = {
  title: 'Components/Progress',
  component: Progress,
  args: { value: 64 },
} satisfies Meta<typeof Progress>

export default meta
type Story = StoryObj<typeof meta>

/** A dataset refresh on its way: the label and the value read together. */
export const Default: Story = {
  render: (args) => (
    <Progress {...args} className="max-w-sm">
      <ProgressLabel>Actualizando «Pedidos 2026»</ProgressLabel>
      {/* The brand's percent: «64 %», as lib/format writes it. */}
      <ProgressValue>{(_, value) => (value === null ? null : formatPercent(value / 100))}</ProgressValue>
    </Progress>
  ),
}

export const Complete: Story = { ...Default, args: { value: 100 } }
