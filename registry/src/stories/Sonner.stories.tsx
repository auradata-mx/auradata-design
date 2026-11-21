import type { Meta, StoryObj } from '@storybook/react-vite'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/sonner'

const meta = {
  title: 'Components/Sonner',
  component: Toaster,
} satisfies Meta<typeof Toaster>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-3">
      <Toaster {...args} />
      <Button variant="outline" onClick={() => toast('Informe guardado')}>
        Normal
      </Button>
      <Button variant="outline" onClick={() => toast.success('Informe publicado')}>
        Éxito
      </Button>
      <Button variant="outline" onClick={() => toast.warning('El dataset tiene 3 días sin actualizarse')}>
        Aviso
      </Button>
      <Button variant="outline" onClick={() => toast.error('No se pudo conectar con la base de datos')}>
        Error
      </Button>
    </div>
  ),
}
