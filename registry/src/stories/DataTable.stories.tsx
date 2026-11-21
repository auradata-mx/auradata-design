import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { Badge } from '@/components/ui/badge'
import { DataTable, type DataTableColumn } from '@/components/ui/data-table'
import { formatDate } from '@/lib/format'

type Estado = 'Publicado' | 'Borrador' | 'Desactualizado' | 'Con errores'

type Informe = { nombre: string; espacio: string; actualizado: string; dueno: string; estado: Estado }

const ESTADO_VARIANT = {
  Publicado: 'success',
  Borrador: 'info',
  Desactualizado: 'warning',
  'Con errores': 'destructive',
} as const

const NOMBRES = [
  'Ventas por región', 'Margen por producto', 'Pedidos del mes', 'Clientes activos', 'Ticket promedio',
  'Inventario por almacén', 'Cobranza vencida', 'Costo de adquisición', 'Retención de clientes', 'Devoluciones',
  'Ventas por canal', 'Metas comerciales', 'Flujo de efectivo', 'Gastos de operación', 'Nómina mensual',
  'Embudo de ventas', 'Satisfacción de clientes', 'Tiempos de entrega', 'Compras a proveedores', 'Rotación de inventario',
  'Ventas diarias', 'Presupuesto anual', 'Rentabilidad por sucursal', 'Campañas de marketing', 'Tráfico del sitio',
]
const ESPACIOS = ['Ventas', 'Finanzas', 'Operaciones', 'Marketing', 'Dirección']
const DUENOS = ['Ana Torres', 'Luis Méndez', 'Sofía Ramírez', 'Jorge Castillo']
const ESTADOS: Estado[] = ['Publicado', 'Publicado', 'Borrador', 'Publicado', 'Desactualizado', 'Publicado', 'Con errores']

const INFORMES: Informe[] = NOMBRES.map((nombre, index) => ({
  nombre,
  espacio: ESPACIOS[index % ESPACIOS.length],
  actualizado: `2026-${String(11 - (index % 6)).padStart(2, '0')}-${String(1 + ((index * 7) % 28)).padStart(2, '0')}`,
  dueno: DUENOS[index % DUENOS.length],
  estado: ESTADOS[index % ESTADOS.length],
}))

const COLUMNS: DataTableColumn<Informe, string>[] = [
  { accessorKey: 'nombre', header: 'Nombre', cell: ({ getValue }) => <span className="font-medium">{getValue()}</span> },
  { accessorKey: 'espacio', header: 'Espacio' },
  {
    accessorKey: 'actualizado',
    header: 'Actualizado',
    cell: ({ getValue }) => <span className="tabular-nums">{formatDate(getValue())}</span>,
  },
  { accessorKey: 'dueno', header: 'Dueño' },
  {
    accessorKey: 'estado',
    header: 'Estado',
    cell: ({ getValue }) => <Badge variant={ESTADO_VARIANT[getValue() as Estado]}>{getValue()}</Badge>,
  },
]

const meta = {
  title: 'AuraData/Data table',
  component: DataTable<Informe>,
  args: { columns: COLUMNS, data: INFORMES, filterPlaceholder: 'Buscar informes…' },
} satisfies Meta<typeof DataTable<Informe>>

export default meta
type Story = StoryObj<typeof meta>

/** 25 informes, 10 per page: sort by any header, filter by any text. */
/** Also checked on a phone (390×844) by the `mobile` Playwright project. */
export const Default: Story = { tags: ['mobile'] }

/** No data yet, or a filter with no match. */
export const Empty: Story = { args: { data: [], emptyMessage: 'Aún no hay informes en este espacio.' } }

/** The column menu open, for the visual tests and to see the overlay. */
export const Open: Story = { args: { defaultColumnsOpen: true } }

/**
 * A narrow container: the table scrolls sideways inside its border, nothing spills out of the page, and a fade
 * on the edge says there are more columns that way.
 */
export const Narrow: Story = {
  render: (args) => (
    <div className="max-w-[22rem]">
      <DataTable {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const table = canvasElement.querySelector<HTMLElement>('[data-slot="data-table"]')!
    const region = canvasElement.querySelector<HTMLElement>('[data-slot="data-table-region"]')!
    const scroller = canvasElement.querySelector<HTMLElement>('[data-slot="table-container"]')!
    await expect(table.scrollWidth).toBeLessThanOrEqual(table.clientWidth)
    await expect(scroller.scrollWidth).toBeGreaterThan(scroller.clientWidth)
    await waitFor(() => expect(region).toHaveAttribute('data-more', 'end'))
    scroller.scrollLeft = scroller.scrollWidth
    await waitFor(() => expect(region).toHaveAttribute('data-more', 'start'))
    const last = within(scroller).getByRole('columnheader', { name: /Estado/ }).getBoundingClientRect()
    await expect(last.right).toBeLessThanOrEqual(scroller.getBoundingClientRect().right + 1)
    scroller.scrollLeft = 0
    await waitFor(() => expect(region).toHaveAttribute('data-more', 'end'))
  },
}

/** While the rows load: one skeleton row per row of the page, the table region `aria-busy`, the pager disabled. */
export const Loading: Story = {
  args: { data: [], loading: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const region = canvasElement.querySelector<HTMLElement>('[data-slot="data-table-region"]')!
    await expect(region).toHaveAttribute('aria-busy', 'true')
    await expect(region.querySelectorAll('tbody tr')).toHaveLength(10)
    await expect(canvas.queryByText('Sin resultados')).toBeNull()
    await expect(canvas.getByRole('button', { name: 'Anterior' })).toBeDisabled()
    await expect(canvas.getByRole('button', { name: 'Siguiente' })).toBeDisabled()
  },
}

/** A click on «Nombre» sorts the rows by name: its header says so with `aria-sort`. */
export const Sort: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const header = canvas.getByRole('columnheader', { name: /Nombre/ })
    await expect(header).toHaveAttribute('aria-sort', 'none')
    await userEvent.click(within(header).getByRole('button'))
    await expect(header).toHaveAttribute('aria-sort', 'ascending')
    const first = canvasElement.querySelector('tbody tr td')!
    await expect(first).toHaveTextContent('Campañas de marketing')
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}

/** Typing in the search keeps only the rows that match. */
export const Filter: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const rows = () => canvasElement.querySelectorAll('tbody tr')
    await expect(rows()).toHaveLength(10)
    await userEvent.type(canvas.getByRole('searchbox', { name: 'Buscar informes…' }), 'inventario')
    await waitFor(() => expect(rows()).toHaveLength(2))
    await expect(canvas.getByText('Página 1 de 1')).toBeInTheDocument()
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}

/** «Siguiente» goes to the second of three pages. */
export const Paging: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Página 1 de 3')).toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: 'Siguiente' }))
    await expect(canvas.getByText('Página 2 de 3')).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Anterior' })).toBeEnabled()
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}
