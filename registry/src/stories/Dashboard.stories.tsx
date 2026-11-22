import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

import { Dashboard, type DashboardProps } from '@/components/blocks/dashboard'

const DATA: DashboardProps = {
  today: new Date(2026, 10, 21),
  kpis: [
    { label: 'Ventas del mes', value: '$4.16 M', change: 0.062, comparison: 'vs. octubre', trend: [3.6, 3.7, 3.8, 3.9, 4.0, 4.16] },
    { label: 'Ticket promedio', value: '$1,284', change: 0.021, comparison: 'vs. octubre', trend: [1.2, 1.22, 1.25, 1.24, 1.26, 1.28] },
    { label: 'Clientes activos', value: '1,434', change: -0.014, comparison: 'vs. octubre', trend: [1.46, 1.45, 1.45, 1.44, 1.44, 1.43] },
    { label: 'Costo de adquisición', value: '$312', change: -0.08, comparison: 'vs. octubre', goodDirection: 'down', trend: [3.5, 3.4, 3.3, 3.3, 3.2, 3.12] },
  ],
  monthly: [
    { mes: 'Jun', ventas: 3_820_000, ventasAnterior: 3_510_000 },
    { mes: 'Jul', ventas: 3_890_000, ventasAnterior: 3_600_000 },
    { mes: 'Ago', ventas: 4_010_000, ventasAnterior: 3_640_000 },
    { mes: 'Sep', ventas: 4_030_000, ventasAnterior: 3_770_000 },
    { mes: 'Oct', ventas: 4_161_000, ventasAnterior: 3_920_000 },
    { mes: 'Nov', ventas: 4_240_000, ventasAnterior: 3_990_000 },
  ],
  channels: [
    { canal: 'Distribuidores', ventas: 1_840_000 },
    { canal: 'Tienda en línea', ventas: 1_210_000 },
    { canal: 'Ventas directas', ventas: 760_000 },
    { canal: 'Marketplaces', ventas: 351_000 },
  ],
  products: [
    { producto: 'Licencias Pro', ventas: 2_140_000 },
    { producto: 'Soporte anual', ventas: 1_320_000 },
    { producto: 'Implementación', ventas: 1_105_000 },
    { producto: 'Capacitación', ventas: 640_000 },
  ],
  funnel: [
    { etapa: 'Visitas al sitio', personas: 12_480 },
    { etapa: 'Registros', personas: 3_210 },
    { etapa: 'Prueba activa', personas: 1_284 },
    { etapa: 'Pago', personas: 412 },
  ],
  customers: [
    { cliente: 'Grupo Industrial del Norte', region: 'Norte', ventas: 412_000, cambio: 0.12 },
    { cliente: 'Comercializadora Bajío', region: 'Centro', ventas: 386_500, cambio: 0.04 },
    { cliente: 'Farmacias del Sureste', region: 'Sur', ventas: 301_200, cambio: -0.03 },
    { cliente: 'Logística Pacífico', region: 'Occidente', ventas: 254_800, cambio: 0.09 },
    { cliente: 'Alimentos Monterrey', region: 'Norte', ventas: 198_300, cambio: -0.06 },
    { cliente: 'Hoteles Riviera', region: 'Sureste', ventas: 176_900, cambio: 0.18 },
  ],
  animate: false,
}

const meta = {
  title: 'Blocks/Dashboard',
  component: Dashboard,
  parameters: { layout: 'fullscreen' },
  args: DATA,
} satisfies Meta<typeof Dashboard>

export default meta
type Story = StoryObj<typeof meta>

/**
 * A whole sales dashboard: the period filter above everything it scopes, four KPIs, the trend against last year,
 * the channel mix, the best sellers, the funnel and the top customers, on the dashboard grid.
 */
export const Sales: Story = {
  tags: ['mobile'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('heading', { level: 1, name: 'Ventas' })).toBeVisible()
    await expect(canvas.getByRole('button', { name: /nov 2026/ })).toBeVisible()
    await expect(canvasElement.querySelectorAll('[data-slot="kpi-card"]')).toHaveLength(4)
    await expect(canvasElement.querySelectorAll('[data-slot="chart-card"]')).toHaveLength(4)
    await expect(canvas.getByText('Clientes principales')).toBeVisible()
    await expect(canvas.getByText('Grupo Industrial del Norte')).toBeVisible()
  },
}

/** Everything loading at once: each piece keeps its size, so nothing jumps when the data lands. */
export const Loading: Story = {
  args: { loading: true },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelectorAll('[aria-busy="true"]').length).toBeGreaterThanOrEqual(9)
  },
}
