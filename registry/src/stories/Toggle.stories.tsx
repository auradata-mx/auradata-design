import type { Meta, StoryObj } from '@storybook/react-vite'
import { BoldIcon, StarIcon } from 'lucide-react'
import { expect, within } from 'storybook/test'

import { Toggle } from '@/components/ui/toggle'

const meta = {
  title: 'Components/Toggle',
  component: Toggle,
  args: { children: <><StarIcon aria-hidden /> Favorito</> },
} satisfies Meta<typeof Toggle>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
/** Pressed reads apart from a hover (`--muted`): it takes the stronger `--accent`. */
export const Pressed: Story = {
  args: { defaultPressed: true },
  play: async ({ canvasElement }) => {
    const toggle = within(canvasElement).getByRole('button', { name: 'Favorito' })
    const probe = document.createElement('span')
    probe.className = 'bg-muted'
    canvasElement.append(probe)
    await expect(getComputedStyle(toggle).backgroundColor).not.toBe(getComputedStyle(probe).backgroundColor)
    probe.remove()
    // An icon with a label is not squared as an icon-only toggle is.
    const box = toggle.getBoundingClientRect()
    await expect(box.width).toBeGreaterThan(box.height)
  },
}
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
  play: async ({ canvasElement }) => {
    const box = within(canvasElement).getByRole('button', { name: 'Negritas' }).getBoundingClientRect()
    // An icon-only toggle is a square, as an icon button is.
    await expect(box.width).toBe(box.height)
  },
}
