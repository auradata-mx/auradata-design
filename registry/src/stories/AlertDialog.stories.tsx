import type { Meta, StoryObj } from '@storybook/react-vite'
import { Trash2Icon } from 'lucide-react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

const meta = {
  title: 'Components/Alert dialog',
  component: AlertDialog,
} satisfies Meta<typeof AlertDialog>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <AlertDialog {...args}>
      <AlertDialogTrigger render={<Button variant="destructive" />}>Eliminar informe</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia>
            <Trash2Icon aria-hidden />
          </AlertDialogMedia>
          <AlertDialogTitle>¿Eliminar informe?</AlertDialogTitle>
          <AlertDialogDescription>
            Se borran «Ventas 2026», sus 12 gráficas y sus filtros. No se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction variant="destructive">Eliminar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
}

/** Open, for the visual tests and to see the overlay. */
export const Open: Story = { ...Default, args: { ...Default.args, defaultOpen: true } }

/** The small size: a short question, the actions side by side. */
export const Small: Story = {
  args: { defaultOpen: true },
  render: (args) => (
    <AlertDialog {...args}>
      <AlertDialogTrigger render={<Button variant="outline" />}>Salir sin guardar</AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>¿Salir sin guardar?</AlertDialogTitle>
          <AlertDialogDescription>Pierdes los cambios del filtro de regiones.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Seguir editando</AlertDialogCancel>
          <AlertDialogAction>Salir</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
}
