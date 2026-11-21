import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { Sidebar, SidebarContent, SidebarGroup, SidebarProvider } from '@/components/ui/sidebar'
import { WorkspaceSwitcher, type Workspace } from '@/components/ui/workspace-switcher'

const WORKSPACES: Workspace[] = [
  { id: 'ventas', name: 'Ventas', description: '12 miembros' },
  { id: 'finanzas', name: 'Finanzas', description: '5 miembros' },
  { id: 'operaciones', name: 'Operaciones Norte', description: '8 miembros' },
]

function Frame({ defaultOpen, workspaces = WORKSPACES, initial = 'ventas' }: { defaultOpen?: boolean; workspaces?: Workspace[]; initial?: string }) {
  const [current, setCurrent] = useState(initial)
  return (
    <SidebarProvider className="min-h-80">
      <Sidebar collapsible="none" className="border-r">
        <SidebarContent>
          <SidebarGroup>
            <WorkspaceSwitcher
              workspaces={workspaces}
              current={current}
              onSelect={setCurrent}
              onCreate={() => {}}
              defaultOpen={defaultOpen}
            />
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  )
}

const meta = {
  title: 'AuraData/Workspace switcher',
  component: WorkspaceSwitcher,
  parameters: { layout: 'fullscreen', themeFrame: { padded: false } },
  args: { workspaces: WORKSPACES, current: 'ventas' },
} satisfies Meta<typeof WorkspaceSwitcher>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { render: () => <Frame /> }

/** Open, for the visual tests and to see the overlay. */
export const Open: Story = { render: () => <Frame defaultOpen /> }

const LONG: Workspace[] = [
  ...WORKSPACES,
  {
    id: 'direccion',
    name: 'Dirección comercial Bajío, Occidente y Centro',
    description: 'Plan Empresa · 48 miembros en 6 sucursales',
  },
]

/** A long workspace name and description are cut with an ellipsis, in the sidebar and in the menu. */
export const LongName: Story = {
  name: 'Long name',
  render: () => <Frame workspaces={LONG} initial="direccion" />,
}

/** The menu open with the long name. */
export const LongNameOpen: Story = {
  name: 'Long name open',
  render: () => <Frame workspaces={LONG} initial="direccion" defaultOpen />,
}
