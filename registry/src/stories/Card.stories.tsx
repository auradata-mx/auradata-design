import type { Meta, StoryObj } from '@storybook/react-vite'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

const meta = {
  title: 'Components/Card',
  component: Card,
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Report: Story = {
  render: () => (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Ventas por región</CardTitle>
        <CardDescription>Actualizado hace 5 minutos</CardDescription>
      </CardHeader>
      <CardContent className="flex items-baseline gap-2">
        <span className="font-mono text-3xl">$1,284,500</span>
        <Badge variant="secondary">+12.4%</Badge>
      </CardContent>
      <CardFooter className="gap-2">
        <Button>Abrir</Button>
        <Button variant="outline">Compartir</Button>
      </CardFooter>
    </Card>
  ),
}

/** The small size (`size="sm"`): tighter spacing and a smaller title, for dense grids. */
export const Small: Story = {
  render: () => (
    <Card size="sm" className="max-w-xs">
      <CardHeader>
        <CardTitle>Pedidos del mes</CardTitle>
        <CardDescription>Actualizado hace 5 minutos</CardDescription>
      </CardHeader>
      <CardContent>
        <span className="font-mono text-2xl">4,812</span>
      </CardContent>
    </Card>
  ),
}

/** A long title wraps under its own width; the action stays in the top corner. */
export const LongTitle: Story = {
  name: 'Long title',
  render: () => (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Rentabilidad por sucursal y línea de producto en el Bajío y Occidente, enero a noviembre de 2026</CardTitle>
        <CardDescription>Comparado con el mismo periodo de 2025, sin IVA.</CardDescription>
        <CardAction>
          <Badge variant="warning">Desactualizado</Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="flex items-baseline gap-2">
        <span className="font-mono text-3xl">18.4 %</span>
      </CardContent>
    </Card>
  ),
}
