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

/** `EmptyMedia` in its default variant: the content as is, here the Continua isotipo, no tile behind it. */
export const DefaultMedia: Story = {
  name: 'Default media',
  render: () => (
    <Empty className="border">
      <EmptyHeader>
        <EmptyMedia>
          <img src="/brand/continua/isotipo-color.svg" alt="" className="size-12" />
        </EmptyMedia>
        <EmptyTitle>Conecta tu primera fuente de datos</EmptyTitle>
        <EmptyDescription>Con una conexión puedes crear datasets e informes.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button>Conectar</Button>
      </EmptyContent>
    </Empty>
  ),
}

/** A long title and description wrap inside the empty state's narrow column. */
export const LongText: Story = {
  name: 'Long text',
  render: () => (
    <Empty className="border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <LayoutDashboardIcon />
        </EmptyMedia>
        <EmptyTitle>Ningún informe del espacio Operaciones Norte coincide con los filtros de región, periodo y dueño</EmptyTitle>
        <EmptyDescription>
          Quita alguno de los filtros o cambia el periodo. Los informes archivados no aparecen aquí: búscalos en el
          historial del espacio, donde se guardan 12 meses.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline">Quitar filtros</Button>
      </EmptyContent>
    </Empty>
  ),
}
