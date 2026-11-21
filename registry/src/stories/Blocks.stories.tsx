import type { Meta, StoryObj } from '@storybook/react-vite'
import { ChartColumnIcon, DatabaseIcon, LayoutDashboardIcon, UsersIcon } from 'lucide-react'

import { AppShell, type NavGroup } from '@/components/blocks/app-shell'
import { Login } from '@/components/blocks/login'
import { Settings } from '@/components/blocks/settings'
import { Button } from '@/components/ui/button'
import { KpiCard } from '@/components/ui/kpi-card'
import { PageHeader } from '@/components/ui/page-header'

const NAV: NavGroup[] = [
  {
    label: 'Explorar',
    items: [
      { title: 'Informes', href: '#informes', icon: LayoutDashboardIcon, active: true },
      { title: 'Gráficas', href: '#graficas', icon: ChartColumnIcon },
      { title: 'Datasets', href: '#datasets', icon: DatabaseIcon },
    ],
  },
  { label: 'Administrar', items: [{ title: 'Equipo', href: '#equipo', icon: UsersIcon }] },
]
const USER = { name: 'Ana López', email: 'ana@empresa.mx' }

const meta = {
  title: 'Blocks/App',
  // Blocks are whole pages: no padding around them.
  parameters: { layout: 'fullscreen', themeFrame: { padded: false } },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const SignIn: Story = { render: () => <Login product="BI" /> }

export const Shell: Story = {
  render: () => (
    <AppShell product="BI" nav={NAV} user={USER} breadcrumbs={['Informes', 'Ventas 2026']} actions={<Button>Compartir</Button>}>
      <div className="grid gap-6">
        <PageHeader title="Ventas 2026" description="Actualizado hace 5 minutos." />
        <div className="grid gap-4 lg:grid-cols-3">
          <KpiCard label="Ventas del mes" value="$4.16 M" change={0.062} comparison="vs. septiembre" />
          <KpiCard label="Clientes activos" value="1,284" change={-0.021} comparison="vs. septiembre" />
          <KpiCard label="Ticket promedio" value="$3,240" change={0} comparison="vs. septiembre" />
        </div>
      </div>
    </AppShell>
  ),
}

export const SettingsPage: Story = {
  name: 'Settings',
  render: () => (
    <AppShell product="BI" nav={NAV} user={USER} breadcrumbs={['Ajustes']}>
      <Settings />
    </AppShell>
  ),
}
