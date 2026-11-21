import type { Meta, StoryObj } from '@storybook/react-vite'
import { LayoutDashboardIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'

const meta = {
  title: 'AuraData/Empty state',
  component: Empty,
} satisfies Meta<typeof Empty>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Empty className="border" {...args}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <LayoutDashboardIcon />
        </EmptyMedia>
        <EmptyTitle>Aún no hay informes</EmptyTitle>
        <EmptyDescription>Crea el primero desde un dataset o importa uno de Power BI.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button>Nuevo informe</Button>
      </EmptyContent>
    </Empty>
  ),
}
