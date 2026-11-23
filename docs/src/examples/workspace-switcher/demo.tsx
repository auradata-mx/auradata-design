'use client';
import { useState } from 'react';
import { Sidebar, SidebarContent, SidebarGroup, SidebarProvider } from '@/components/ui/sidebar';
import { WorkspaceSwitcher, type Workspace } from '@/components/ui/workspace-switcher';

const workspaces: Workspace[] = [
  { id: 'ventas', name: 'Ventas', description: '12 miembros' },
  { id: 'finanzas', name: 'Finanzas', description: '5 miembros' },
  { id: 'operaciones', name: 'Operaciones Norte', description: '8 miembros' },
];

export default function WorkspaceSwitcherDemo() {
  const [current, setCurrent] = useState('ventas');

  return (
    <SidebarProvider className="h-72 min-h-0 w-fit overflow-hidden rounded-xl border">
      <Sidebar collapsible="none">
        <SidebarContent>
          <SidebarGroup>
            <WorkspaceSwitcher workspaces={workspaces} current={current} onSelect={setCurrent} onCreate={() => {}} />
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}
