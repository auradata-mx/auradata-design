'use client';

import { useState } from 'react';
import { ChartColumnIcon, LayoutDashboardIcon } from 'lucide-react';
import { AppShell, type NavGroup } from '@/components/blocks/app-shell';
import { Button } from '@/components/ui/button';
import { KpiCard } from '@/components/ui/kpi-card';
import { PageHeader } from '@/components/ui/page-header';

const nav: NavGroup[] = [
  {
    label: 'Explorar',
    items: [
      { title: 'Informes', href: '#informes', icon: LayoutDashboardIcon, active: true },
      { title: 'Gráficas', href: '#graficas', icon: ChartColumnIcon },
    ],
  },
];

const workspaces = [
  { id: 'ventas', name: 'Ventas', description: '12 miembros' },
  { id: 'finanzas', name: 'Finanzas', description: '5 miembros' },
];

export default function AppShellExample() {
  const [workspace, setWorkspace] = useState('ventas');
  const [shared, setShared] = useState(false);

  return (
    <AppShell
      product="BI"
      nav={nav}
      user={{ name: 'Ana López', email: 'ana@empresa.mx' }}
      workspaces={{ workspaces, current: workspace, onSelect: setWorkspace }}
      breadcrumbs={['Informes', 'Ventas']}
      actions={<Button onClick={() => setShared(true)}>Compartir</Button>}
    >
      <div className="grid gap-6">
        <section id="informes">
          <PageHeader title="Ventas del mes" description="Actualizado hace 5 minutos." />
          {shared && <p role="status">Enlace de ejemplo. No se compartió ningún informe.</p>}
        </section>
        <section id="graficas" aria-label="Gráficas" className="grid gap-4 lg:grid-cols-3">
          <KpiCard label="Ventas" value="$4.16 M" change={0.062} comparison="vs. octubre" />
          <KpiCard label="Clientes activos" value="1,284" change={-0.021} comparison="vs. octubre" />
          <KpiCard label="Ticket promedio" value="$3,240" change={0} comparison="vs. octubre" />
        </section>
      </div>
    </AppShell>
  );
}
