import type { Meta, StoryObj } from '@storybook/react-vite'

import { expect, within } from 'storybook/test'

import { Badge } from '@/components/ui/badge'

const meta = {
  title: 'Components/Badge',
  component: Badge,
  args: { children: 'Publicado' },
} satisfies Meta<React.ComponentProps<typeof Badge> & { asLinks?: boolean }>

export default meta
type Story = StoryObj<React.ComponentProps<typeof Badge> & { asLinks?: boolean }>

export const Default: Story = {}

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-2">
      <Badge {...args}>Principal</Badge>
      <Badge {...args} variant="secondary">Secundario</Badge>
      <Badge {...args} variant="outline">Contorno</Badge>
      <Badge {...args} variant="success">Éxito</Badge>
      <Badge {...args} variant="warning">Advertencia</Badge>
      <Badge {...args} variant="info">Información</Badge>
      <Badge {...args} variant="destructive">Destructivo</Badge>
      <Badge {...args} variant="ghost">Fantasma</Badge>
      <Badge {...args} variant="link">Enlace</Badge>
    </div>
  ),
}

/** The states of a report, as the data table shows them. */
export const Status: Story = {
  args: { asLinks: false },
  render: ({ asLinks }) => (
    <div className="flex flex-wrap gap-2">
      <Badge render={asLinks ? <a href="#published" /> : undefined} variant="success">Publicado</Badge>
      <Badge render={asLinks ? <a href="#outdated" /> : undefined} variant="warning">Desactualizado</Badge>
      <Badge render={asLinks ? <a href="#draft" /> : undefined} variant="info">Borrador</Badge>
      <Badge render={asLinks ? <a href="#error" /> : undefined} variant="destructive">Con errores</Badge>
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
