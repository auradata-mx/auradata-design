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
