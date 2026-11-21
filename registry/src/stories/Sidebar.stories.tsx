import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
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
import { Logo, ProductTag } from '@/components/ui/logo'

const ITEMS = [
  { title: 'Informes', icon: LayoutDashboardIcon, active: true },
  { title: 'Gráficas', icon: ChartColumnIcon },
  { title: 'Datasets', icon: DatabaseIcon },
]

const meta = {
  title: 'Components/Sidebar',
  component: SidebarProvider,
  // The sidebar is the whole page: no padding around it.
  parameters: { layout: 'fullscreen', themeFrame: { padded: false } },
} satisfies Meta<typeof SidebarProvider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <SidebarProvider className="min-h-96" {...args}>
      <Sidebar collapsible="icon">
        <SidebarHeader className="flex-row items-center gap-3 px-4 py-4 group-data-[collapsible=icon]:px-2">
          <Logo className="h-6 group-data-[collapsible=icon]:hidden" />
          <Logo layout="mark" className="hidden h-5 group-data-[collapsible=icon]:block" />
          <ProductTag className="group-data-[collapsible=icon]:hidden">BI</ProductTag>
        </SidebarHeader>
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

/** Reached with the keyboard (Tab): the first menu button shows the sidebar focus ring. */
export const Focus: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    await userEvent.tab()
    await expect(document.activeElement).toBe(within(canvasElement).getByRole('button', { name: 'Informes' }))
  },
}
