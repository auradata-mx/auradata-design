import type { Meta, StoryObj } from '@storybook/react-vite'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

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
