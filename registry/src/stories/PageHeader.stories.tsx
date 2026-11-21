import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/ui/page-header'

const meta = {
  title: 'AuraData/Page header',
  component: PageHeader,
  args: {
    title: 'Informes',
    description: 'Los informes de tu equipo, del más reciente al más antiguo.',
    actions: (
      <>
        <Button variant="outline">Importar</Button>
        <Button>Nuevo informe</Button>
      </>
    ),
  },
} satisfies Meta<typeof PageHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const TitleOnly: Story = { args: { description: undefined, actions: undefined } }
