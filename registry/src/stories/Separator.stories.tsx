import type { Meta, StoryObj } from '@storybook/react-vite'

import { Separator } from '@/components/ui/separator'

const meta = {
  title: 'Components/Separator',
  component: Separator,
  render: (args) => (
    <div className="max-w-sm text-sm">
      <p className="font-medium">Ventas 2026</p>
      <Separator className="my-3" {...args} />
      <div className="flex h-5 items-center gap-3">
        <span>Editar</span>
        <Separator orientation="vertical" />
        <span>Compartir</span>
        <Separator orientation="vertical" />
        <span>Exportar</span>
      </div>
    </div>
  ),
} satisfies Meta<typeof Separator>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** A vertical rule between two blocks of a toolbar. */
export const Vertical: Story = {
  render: () => (
    <div className="flex h-16 items-center gap-4 text-sm">
      <div className="grid">
        <span className="text-muted-foreground">Ventas</span>
        <span className="font-mono">$1,284,500</span>
      </div>
      <Separator orientation="vertical" />
      <div className="grid">
        <span className="text-muted-foreground">Pedidos</span>
        <span className="font-mono">4,812</span>
      </div>
    </div>
  ),
}
