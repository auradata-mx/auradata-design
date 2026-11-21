import type { Meta, StoryObj } from '@storybook/react-vite'
import { ChevronRightIcon } from 'lucide-react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from '@/components/ui/item'
import { initials } from '@/lib/initials'

const WORKSPACES = [
  { name: 'Finanzas', detail: '24 informes · 8 personas', role: 'Admin' },
  { name: 'Ventas Bajío', detail: '12 informes · 15 personas', role: 'Editor' },
  { name: 'Operaciones', detail: '7 informes · 4 personas', role: 'Lector' },
]

const meta = {
  title: 'Components/Item',
  component: Item,
} satisfies Meta<typeof Item>

export default meta
type Story = StoryObj<typeof meta>

/** The list of workspaces: initials, name, what it holds and your role. */
export const Default: Story = {
  render: (args) => (
    <ItemGroup className="max-w-md">
      {WORKSPACES.map((workspace) => (
        <Item key={workspace.name} variant="outline" role="listitem" {...args}>
          <ItemMedia>
            <Avatar>
              <AvatarFallback>{initials(workspace.name)}</AvatarFallback>
            </Avatar>
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{workspace.name}</ItemTitle>
            <ItemDescription>{workspace.detail}</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Badge variant="secondary">{workspace.role}</Badge>
          </ItemActions>
        </Item>
      ))}
    </ItemGroup>
  ),
}

/** The variants, one with an action and one as a link. */
export const Variants: Story = {
  render: () => (
    <div className="grid max-w-md gap-3">
      <Item>
        <ItemContent>
          <ItemTitle>Sin borde</ItemTitle>
          <ItemDescription>La variante por defecto.</ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="outline">
        <ItemContent>
          <ItemTitle>Ventas 2026</ItemTitle>
          <ItemDescription>Lo editó Ana López hace 2 horas.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            Abrir
          </Button>
        </ItemActions>
      </Item>
      <Item variant="muted" size="sm" render={<a href="#nuevo-espacio" />}>
        <ItemContent>
          <ItemTitle>Crea un espacio de trabajo</ItemTitle>
        </ItemContent>
        <ItemActions>
          <ChevronRightIcon aria-hidden className="size-4" />
        </ItemActions>
      </Item>
    </div>
  ),
}
