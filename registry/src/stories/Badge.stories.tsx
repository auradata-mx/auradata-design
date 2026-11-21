import type { Meta, StoryObj } from '@storybook/react-vite'

import { expect, within } from 'storybook/test'

import { Badge } from '@/components/ui/badge'

const meta = {
  title: 'Components/Badge',
  component: Badge,
  args: { children: 'Publicado' },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-2">
      <Badge {...args}>Default</Badge>
      <Badge {...args} variant="secondary">Secondary</Badge>
      <Badge {...args} variant="outline">Outline</Badge>
      <Badge {...args} variant="success">Success</Badge>
      <Badge {...args} variant="warning">Warning</Badge>
      <Badge {...args} variant="info">Info</Badge>
      <Badge {...args} variant="destructive">Destructive</Badge>
      <Badge {...args} variant="ghost">Ghost</Badge>
      <Badge {...args} variant="link">Link</Badge>
    </div>
  ),
}

/** The states of a report, as the data table shows them. */
export const Status: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="success">Publicado</Badge>
      <Badge variant="warning">Desactualizado</Badge>
      <Badge variant="info">Borrador</Badge>
      <Badge variant="destructive">Con errores</Badge>
    </div>
  ),
}

/**
 * A long label never wraps: the badge stops at its box and the text ends in «…». Better: keep labels short.
 */
export const LongText: Story = {
  name: 'Long text',
  render: () => (
    <div data-testid="box" className="grid max-w-48 gap-2 rounded-md border p-2">
      <Badge variant="warning">Desactualizado desde el 3 de noviembre de 2026</Badge>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const box = within(canvasElement).getByTestId('box')
    const badge = box.querySelector<HTMLElement>('[data-slot="badge"]')!
    const inner = box.getBoundingClientRect()
    const padding = parseFloat(getComputedStyle(box).paddingRight)
    await expect(badge.getBoundingClientRect().right).toBeLessThanOrEqual(inner.right - padding + 0.5)
    const label = within(badge).getByText('Desactualizado desde el 3 de noviembre de 2026')
    await expect(getComputedStyle(label).textOverflow).toBe('ellipsis')
    await expect(label.scrollWidth).toBeGreaterThan(label.clientWidth)
  },
}
