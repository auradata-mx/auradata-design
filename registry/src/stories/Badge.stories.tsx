import type { Meta, StoryObj } from '@storybook/react-vite'

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
