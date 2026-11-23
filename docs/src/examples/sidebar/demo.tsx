'use client';
import { ChartColumnIcon, DatabaseIcon, LayoutDashboardIcon, SettingsIcon } from 'lucide-react';
import { Logo, ProductTag } from '@/components/ui/logo';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

const items = [
  { title: 'Informes', icon: LayoutDashboardIcon, active: true },
  { title: 'Gráficas', icon: ChartColumnIcon },
  { title: 'Datasets', icon: DatabaseIcon },
];

// Contained in a box for this page: `relative` on the provider and `absolute h-full` on the sidebar keep it inside.
// In an app, leave both out (the sidebar fills the screen's height) and use `SidebarInset` for the content.
export default function SidebarDemo() {
  return (
    <SidebarProvider className="relative h-96 min-h-0 overflow-hidden rounded-xl border">
      <Sidebar collapsible="icon" className="absolute h-full">
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
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton isActive={item.active} tooltip={item.title}>
                      <item.icon aria-hidden />
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
                <SettingsIcon aria-hidden />
                <span>Ajustes</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <div className="flex flex-1 flex-col gap-2 bg-background p-4">
        <SidebarTrigger />
        <p className="text-sm text-muted-foreground">El contenido de la página.</p>
      </div>
    </SidebarProvider>
  );
}
