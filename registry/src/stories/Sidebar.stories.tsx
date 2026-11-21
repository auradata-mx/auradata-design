import type { Meta, StoryObj } from '@storybook/react-vite'
import { ChartColumnIcon, DatabaseIcon, LayoutDashboardIcon, SettingsIcon } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'

const ITEMS = [
  { title: 'Informes', icon: LayoutDashboardIcon, active: true },
  { title: 'Gráficas', icon: ChartColumnIcon },
  { title: 'Datasets', icon: DatabaseIcon },
]

const meta = {
  title: 'Components/Sidebar',
  component: SidebarProvider,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof SidebarProvider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <SidebarProvider className="min-h-96" {...args}>
      <Sidebar collapsible="icon">
        <SidebarHeader className="px-4 py-3 font-semibold">AuraData</SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Explorar</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {ITEMS.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton isActive={item.active} tooltip={item.title}>
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Ajustes">
                <SettingsIcon />
                <span>Ajustes</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="p-4">
        <SidebarTrigger />
      </SidebarInset>
    </SidebarProvider>
  ),
}
