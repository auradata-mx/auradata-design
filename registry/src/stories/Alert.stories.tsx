import type { Meta, StoryObj } from '@storybook/react-vite'
import { CircleAlertIcon, CircleCheckIcon, InfoIcon, TriangleAlertIcon } from 'lucide-react'

import { Alert, AlertAction, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

const meta = {
  title: 'Components/Alert',
  component: Alert,
  args: { className: 'max-w-lg' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['default', 'success', 'warning', 'info', 'destructive'] },
  },
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Alert {...args}>
      <InfoIcon />
      <AlertTitle>El informe se actualiza cada hora</AlertTitle>
      <AlertDescription>La última carga de «Ventas por región» terminó a las 9:00.</AlertDescription>
    </Alert>
  ),
}

/** Every variant: the status color tints the box and the icon; the text keeps the foreground. */
export const Variants: Story = {
  render: (args) => (
    <div className="grid gap-3">
      <Alert {...args} variant="success">
        <CircleCheckIcon />
        <AlertTitle>Informe publicado</AlertTitle>
        <AlertDescription>Tu equipo ya puede ver «Ventas por región».</AlertDescription>
      </Alert>
      <Alert {...args} variant="warning">
        <TriangleAlertIcon />
        <AlertTitle>El dataset tiene 3 días sin actualizarse</AlertTitle>
        <AlertDescription>Revisa la conexión de «Pedidos 2026» para traer datos nuevos.</AlertDescription>
      </Alert>
      <Alert {...args} variant="info">
        <InfoIcon />
        <AlertTitle>Nueva versión del espacio Finanzas</AlertTitle>
        <AlertDescription>Los informes anteriores siguen disponibles en el historial.</AlertDescription>
      </Alert>
      <Alert {...args} variant="destructive">
        <CircleAlertIcon />
        <AlertTitle>No pudimos cargar el dataset</AlertTitle>
        <AlertDescription>La conexión con la base de datos de ventas rechazó la consulta.</AlertDescription>
      </Alert>
    </div>
  ),
}

export const WithAction: Story = {
  render: (args) => (
    <Alert {...args} variant="warning">
      <TriangleAlertIcon />
      <AlertTitle>Tu prueba termina en 3 días</AlertTitle>
      <AlertDescription>Elige un plan para conservar tus informes.</AlertDescription>
      <AlertAction>
        <Button size="sm" variant="outline">Ver planes</Button>
      </AlertAction>
    </Alert>
  ),
}

/**
 * A long title and description wrap inside the box; the action keeps its top corner. The alert reserves
 * `pr-18` (72 px) for it, so keep its label short: «Revisar la conexión» ran over the title (L37).
 */
export const LongText: Story = {
  name: 'Long text',
  render: (args) => (
    <Alert {...args} variant="warning">
      <TriangleAlertIcon />
      <AlertTitle>
        El dataset «Rentabilidad por sucursal y línea de producto, Bajío y Occidente» tiene 3 días sin actualizarse
      </AlertTitle>
      <AlertDescription>
        La última carga terminó el 18 de noviembre a las 9:00. Las gráficas de los informes que lo usan muestran
        datos de ese día hasta que la conexión con el almacén de datos vuelva a responder.
      </AlertDescription>
      <AlertAction>
        <Button size="sm" variant="outline">Revisar</Button>
      </AlertAction>
    </Alert>
  ),
}
