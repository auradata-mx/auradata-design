import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { Badge } from '@/components/ui/badge'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { GradientBorder } from '@/components/ui/gradient-border'

const meta = {
  title: 'AuraData/Gradient border',
  component: GradientBorder,
} satisfies Meta<typeof GradientBorder>

export default meta
type Story = StoryObj<typeof meta>

const card = (
  <Card>
    <CardHeader className="gap-2">
      <Badge className="w-fit">Recomendado</Badge>
      <CardTitle className="text-base">Plan Equipo</CardTitle>
      <CardDescription>Para áreas que comparten tableros todos los días.</CardDescription>
    </CardHeader>
  </Card>
)

/**
 * The brand gradient as the thin border of the one element a view highlights, drifting slowly. It
 * replaces the card's own hairline and stays still with reduced motion.
 */
export const Default: Story = {
  render: (args) => (
    <GradientBorder {...args} className="max-w-sm">
      {card}
    </GradientBorder>
  ),
  play: async ({ canvasElement }) => {
    const ring = canvasElement.querySelector('[data-slot=gradient-border-ring]')!
    await expect(ring).toHaveAttribute('aria-hidden', 'true')
    await expect(getComputedStyle(ring).animationName).toBe('gradient-border-pan')
    await expect(getComputedStyle(ring).backgroundImage).toContain('linear-gradient')
    // The card's own hairline gives way to the gradient.
    const inner = canvasElement.querySelector('[data-slot=card]')!
    await expect(getComputedStyle(inner).boxShadow).not.toContain('0px 0px 0px 1px')
  },
}

/** Still, for places where nothing else should move. */
export const Static: Story = {
  args: { animated: false, width: 2 },
  render: Default.render,
  play: async ({ canvasElement }) => {
    const ring = canvasElement.querySelector('[data-slot=gradient-border-ring]')!
    await expect(getComputedStyle(ring).animationName).toBe('none')
  },
}
