import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { AuraBackground } from '@/components/ui/aura-background'

const meta = {
  title: 'AuraData/Aura background',
  component: AuraBackground,
  parameters: { layout: 'fullscreen', themeFrame: { padded: false } },
  render: (args) => (
    <div className="relative isolate flex h-96 items-center justify-center overflow-hidden">
      <AuraBackground {...args} />
      <p className="text-lg font-medium">Tus datos, con claridad.</p>
    </div>
  ),
} satisfies Meta<typeof AuraBackground>

export default meta
type Story = StoryObj<typeof meta>

/** The drifting aura behind a hero. Decorative: screen readers skip it. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const aura = canvasElement.querySelector('[data-slot=aura-background]')!
    await expect(aura).toHaveAttribute('aria-hidden', 'true')
    await expect(aura.querySelector('[data-slot=aura-grid]')).toBeNull()
  },
}

/** With the faint grid that fades toward the edges. */
export const WithGrid: Story = {
  args: { grid: true },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('[data-slot=aura-grid]')).not.toBeNull()
  },
}

/** The centered glow of a call-to-action band. */
export const Band: Story = { args: { variant: 'band', grid: true } }
