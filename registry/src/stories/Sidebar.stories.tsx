import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'
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
  SidebarMenuSkeleton,
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

/** Collapsed to its icons (`defaultOpen={false}` with `collapsible="icon"`): each button keeps its name. */
export const Collapsed: Story = {
  ...Default,
  args: { defaultOpen: false },
  play: async ({ canvasElement }) => {
    const sidebar = canvasElement.querySelector('[data-slot="sidebar"]')!
    await expect(sidebar).toHaveAttribute('data-state', 'collapsed')
    await expect(within(canvasElement).getByRole('button', { name: 'Informes' })).toBeInTheDocument()
  },
}

/**
 * On a phone (under 768 px) the sidebar is a drawer that comes up from the bottom: the play opens it with the
 * trigger, as the `mobile` Playwright project shows at 390×844. On a wide screen it stays the normal sidebar.
 */
export const Mobile: Story = {
  ...Default,
  tags: ['mobile'],
  globals: { viewport: { value: 'mobile', isRotated: false } },
  play: async ({ canvasElement }) => {
    if (!window.matchMedia('(max-width: 767px)').matches) return
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Mostrar u ocultar la barra lateral' }))
    const body = within(canvasElement.ownerDocument.body)
    const drawer = await body.findByRole('dialog', { name: 'Barra lateral' })
    await expect(drawer).toHaveAttribute('data-swipe-direction', 'down')
    // The panel keeps the sidebar slot on a phone too.
    await expect(drawer).toHaveAttribute('data-slot', 'sidebar')
    await waitFor(() => expect(within(drawer).getByRole('button', { name: 'Informes' })).toBeVisible())
    // Base UI focuses the drawer on open; keep the first item unfocused so the screenshot is steady.
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}

/** While the menu loads: skeleton rows with an icon. Their random width is fixed here, so screenshots stay steady. */
export const MenuSkeleton: Story = {
  name: 'Menu skeleton',
  render: (args) => (
    <SidebarProvider className="h-96 min-h-0" {...args}>
      <Sidebar collapsible="none" className="border-r">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Explorar</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu aria-busy="true" aria-label="Cargando el menú">
                {/* The stock skeleton picks a random 50–90 % width on every render: fixed widths here. */}
                {[
                  '[&_[data-sidebar=menu-skeleton-text]]:max-w-[72%]',
                  '[&_[data-sidebar=menu-skeleton-text]]:max-w-[56%]',
                  '[&_[data-sidebar=menu-skeleton-text]]:max-w-[80%]',
                  '[&_[data-sidebar=menu-skeleton-text]]:max-w-[64%]',
                ].map((width) => (
                  <SidebarMenuItem key={width}>
                    <SidebarMenuSkeleton showIcon className={width} />
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  ),
}

function InteractiveSidebar(args: React.ComponentProps<typeof SidebarProvider>) {
  const [active, setActive] = useState('Informes')
  return (
    <SidebarProvider className="min-h-96" {...args}>
      <Sidebar collapsible="none" className="border-r">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Explorar</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {ITEMS.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton isActive={active === item.title} onClick={() => setActive(item.title)}>
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="p-4 text-sm text-muted-foreground">Sección: {active}</SidebarInset>
    </SidebarProvider>
  )
}

/** Clicking another item slides the active indicator down to it. */
export const Switching: Story = {
  render: (args) => <InteractiveSidebar {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const indicator = canvasElement.querySelector<HTMLElement>('[data-slot="sidebar-active-indicator"]')!
    await expect(indicator).not.toBeNull()
    const firstTop = indicator.getBoundingClientRect().top
    await userEvent.click(canvas.getByRole('button', { name: 'Datasets' }))
    await waitFor(() => expect(indicator.getBoundingClientRect().top).toBeGreaterThan(firstTop))
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}
