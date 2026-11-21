import type { Meta, StoryObj } from '@storybook/react-vite'
import { BoldIcon, StarIcon } from 'lucide-react'

import { Toggle } from '@/components/ui/toggle'

const meta = {
  title: 'Components/Toggle',
  component: Toggle,
  args: { children: <><StarIcon aria-hidden /> Favorito</> },
} satisfies Meta<typeof Toggle>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Pressed: Story = { args: { defaultPressed: true } }
export const Outline: Story = { args: { variant: 'outline' } }
export const Disabled: Story = { args: { disabled: true } }

/** The three sizes, and an icon-only toggle with its accessible name. */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Toggle size="sm" variant="outline">Pequeño</Toggle>
      <Toggle variant="outline">Normal</Toggle>
      <Toggle size="lg" variant="outline">Grande</Toggle>
      <Toggle variant="outline" aria-label="Negritas">
        <BoldIcon aria-hidden />
      </Toggle>
    </div>
  ),
}
