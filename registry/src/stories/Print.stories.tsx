import type { Meta, StoryObj } from '@storybook/react-vite'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { ChartColumnIcon, DatabaseIcon, DownloadIcon, LayoutDashboardIcon, PrinterIcon } from 'lucide-react'

import { AppShell, type NavGroup } from '@/components/blocks/app-shell'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartLegend, ChartLegendContent } from '@/components/ui/chart'
import { KpiCard } from '@/components/ui/kpi-card'
import { PageHeader } from '@/components/ui/page-header'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { chartConfig } from '@/lib/chart-palette'
import { formatCurrency, formatDate, formatNumber } from '@/lib/format'

/**
 * A report as the theme prints it: open the story and print (⌘P). On paper the sidebar, breadcrumbs and buttons
 * marked `data-print="hide"` go, dark mode turns light, shadows go, and the source link prints its address.
 * `tests/print.spec.ts` checks it with print media.
 */
const meta = {
  title: 'AuraData/Print',
  parameters: { layout: 'fullscreen', themeFrame: { padded: false } },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const NAV: NavGroup[] = [
  {
    label: 'Explorar',
    items: [
      { title: 'Informes', href: '#informes', icon: LayoutDashboardIcon, active: true },
      { title: 'Gráficas', href: '#graficas', icon: ChartColumnIcon },
      { title: 'Datasets', href: '#datasets', icon: DatabaseIcon },
    ],
  },
]

const SALES = [
  { month: 'Jul', norte: 1180, centro: 1920, sur: 790 },
  { month: 'Ago', norte: 1210, centro: 1980, sur: 820 },
  { month: 'Sep', norte: 1150, centro: 2010, sur: 870 },
  { month: 'Oct', norte: 1284, centro: 2031, sur: 846 },
]
const config = chartConfig({ norte: 'Norte', centro: 'Centro', sur: 'Sur' })

const STORES = [
  { store: 'Monterrey Centro', region: 'Norte', total: 1284500 },
  { store: 'Querétaro Juriquilla', region: 'Centro', total: 2031200 },
  { store: 'Guadalajara Andares', region: 'Occidente', total: 1764900 },
  { store: 'Mérida Altabrisa', region: 'Sur', total: 846300 },
]

export const Report: Story = {
  render: () => (
    <AppShell
      product="BI"
      nav={NAV}
      user={{ name: 'Ana López', email: 'ana@empresa.mx' }}
      breadcrumbs={['Informes', 'Ventas de octubre']}
      actions={
        <Button variant="outline" data-print="hide">
          <PrinterIcon data-icon="inline-start" /> Imprimir
        </Button>
      }
    >
      <div className="grid gap-6">
        <PageHeader
          title="Ventas de octubre"
          description="Las sucursales de México, del 1 al 31 de octubre de 2026."
          actions={
            <Button variant="outline" size="icon" aria-label="Descargar" data-print="hide">
              <DownloadIcon />
            </Button>
          }
        />
        <p data-print="only" className="text-sm text-muted-foreground">
          Impreso el {formatDate('2026-11-21')}
        </p>
        <div className="grid gap-4 lg:grid-cols-3">
          <KpiCard label="Ventas del mes" value="$4.16 M" change={0.062} comparison="vs. septiembre" />
          <KpiCard label="Clientes activos" value={formatNumber(1284)} change={-0.021} comparison="vs. septiembre" />
          <KpiCard label="Ticket promedio" value="$3,240" change={0} comparison="vs. septiembre" />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Ventas por región</CardTitle>
            <CardDescription>Miles de pesos, de julio a octubre</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={config} className="h-56 w-full">
              <BarChart data={SALES} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} width={48} tickFormatter={(value) => formatNumber(value)} />
                <ChartLegend content={<ChartLegendContent />} itemSorter={null} />
                {Object.keys(config).map((key) => (
                  <Bar key={key} dataKey={key} fill={`var(--color-${key})`} radius={4} isAnimationActive={false} />
                ))}
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Sucursales</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sucursal</TableHead>
                  <TableHead>Región</TableHead>
                  <TableHead className="text-right">Ventas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {STORES.map((row) => (
                  <TableRow key={row.store}>
                    <TableCell>{row.store}</TableCell>
                    <TableCell>{row.region}</TableCell>
                    <TableCell className="text-right tabular-nums">{formatCurrency(row.total)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <p className="text-sm text-muted-foreground">
          Fuente: <a className="text-foreground underline underline-offset-4" href="https://auradata.mx/datos/ventas">el dataset de ventas</a>.
        </p>
      </div>
    </AppShell>
  ),
}
