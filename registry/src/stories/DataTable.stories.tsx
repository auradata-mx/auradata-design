import type { Meta, StoryObj } from '@storybook/react-vite'
import { FolderInputIcon, PlusIcon, Trash2Icon } from 'lucide-react'
import type * as React from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTable, type DataTableColumn } from '@/components/ui/data-table'
import { DateRangeFilter } from '@/components/ui/date-range-filter'
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
  { accessorKey: 'nombre', header: 'Nombre', size: 240, cell: ({ getValue }) => <span className="font-medium">{getValue()}</span> },
  { accessorKey: 'espacio', header: 'Espacio', size: 140 },
  {
    accessorKey: 'actualizado',
    header: 'Actualizado',
    size: 140,
    cell: ({ getValue }) => <span className="tabular-nums">{formatDate(getValue())}</span>,
  },
  { accessorKey: 'dueno', header: 'Dueño', size: 160 },
  {
    accessorKey: 'estado',
    header: 'Estado',
    size: 160,
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

/**
 * No data yet, or a filter with no match. On a phone the headers scroll sideways, but the message stays in
 * view: it is as wide as the visible table, not centered across every column.
 */
export const Empty: Story = {
  args: { data: [], emptyMessage: 'Aún no hay informes en este espacio.' },
  render: (args) => (
    <div className="max-w-[22rem]">
      <DataTable {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const region = canvasElement.querySelector<HTMLElement>('[data-slot="data-table-region"]')!.getBoundingClientRect()
    const message = within(canvasElement).getByText('Aún no hay informes en este espacio.')
    const range = document.createRange()
    range.selectNodeContents(message)
    const text = range.getBoundingClientRect()
    await expect(text.left).toBeGreaterThanOrEqual(region.left + 16)
    await expect(text.right).toBeLessThanOrEqual(region.right - 16)
    // Centered in the visible table, within 2 px.
    const center = (text.left + text.right) / 2
    await expect(Math.abs(center - (region.left + region.right) / 2)).toBeLessThanOrEqual(2)
  },
}

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
    const widths = () => [...canvasElement.querySelectorAll('th')].map((th) => Math.round(th.getBoundingClientRect().width))
    const before = widths()
    await userEvent.click(canvas.getByRole('button', { name: 'Siguiente' }))
    await expect(canvas.getByText('Página 2 de 3')).toBeInTheDocument()
    // Sized columns keep their widths from page to page.
    await expect(widths()).toEqual(before)
    await expect(canvas.getByRole('button', { name: 'Anterior' })).toBeEnabled()
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}

/** The bulk actions of the selection stories: they only report what they were given. */
const moveRows = fn()
const deleteRows = fn()

const selectionArgs = {
  selectable: true,
  getRowId: (informe: Informe) => informe.nombre,
  rowLabel: (informe: Informe) => informe.nombre,
  bulkActions: (selected: Informe[], clear: () => void) => (
    <>
      <Button variant="outline" size="sm" onClick={() => moveRows(selected.map((informe) => informe.nombre))}>
        <FolderInputIcon data-icon="inline-start" aria-hidden />
        Mover
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => {
          deleteRows(selected.map((informe) => informe.nombre))
          clear()
        }}
      >
        <Trash2Icon data-icon="inline-start" aria-hidden />
        Eliminar
      </Button>
    </>
  ),
} satisfies Partial<React.ComponentProps<typeof DataTable<Informe>>>

/**
 * Rows with a checkbox: a click selects one, the header selects the page. A bar floats over the bottom of the
 * screen with the count and the bulk actions, and «Quitar selección» clears it.
 */
export const Selection: Story = {
  args: selectionArgs,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByRole('toolbar', { name: 'Acciones de la selección' })).toBeNull()
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Seleccionar «Ventas por región»' }))
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Seleccionar «Pedidos del mes»' }))
    const bar = await canvas.findByRole('toolbar', { name: 'Acciones de la selección' })
    await expect(bar).toHaveTextContent('2 seleccionados')
    const all = canvas.getByRole('checkbox', { name: 'Seleccionar todas las filas de la página' })
    await expect(all).toHaveAttribute('aria-checked', 'mixed')
    const row = canvas.getByRole('checkbox', { name: 'Seleccionar «Ventas por región»' }).closest('tr')!
    await expect(row).toHaveAttribute('data-state', 'selected')

    await userEvent.click(within(bar).getByRole('button', { name: 'Mover' }))
    await expect(moveRows).toHaveBeenLastCalledWith(['Ventas por región', 'Pedidos del mes'])

    await userEvent.click(all)
    await expect(all).toHaveAttribute('aria-checked', 'true')
    await expect(bar).toHaveTextContent('10 seleccionados')
    // The selection outlives the page: the second page starts unselected, the first keeps its 10.
    await userEvent.click(canvas.getByRole('button', { name: 'Siguiente' }))
    await expect(all).toHaveAttribute('aria-checked', 'false')
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Seleccionar «Ventas por canal»' }))
    await expect(bar).toHaveTextContent('11 seleccionados')

    await userEvent.click(within(bar).getByRole('button', { name: 'Eliminar' }))
    await expect(deleteRows).toHaveBeenLastCalledWith(expect.arrayContaining(['Ventas por canal', 'Ventas por región']))
    await expect(deleteRows.mock.lastCall?.[0]).toHaveLength(11)
    await waitFor(() => expect(canvas.queryByRole('toolbar', { name: 'Acciones de la selección' })).toBeNull())
    await expect(all).toHaveAttribute('aria-checked', 'false')
    // The bar had the focus: it goes back to the table, on the header checkbox.
    await expect(all).toHaveFocus()
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}

/** One row selected: «1 seleccionado», and «Quitar selección» clears it. */
export const SelectionClear: Story = {
  args: selectionArgs,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Seleccionar «Margen por producto»' }))
    const bar = await canvas.findByRole('toolbar', { name: 'Acciones de la selección' })
    await expect(bar).toHaveTextContent('1 seleccionado')
    await userEvent.click(within(bar).getByRole('button', { name: 'Quitar selección' }))
    await waitFor(() => expect(canvas.queryByRole('toolbar', { name: 'Acciones de la selección' })).toBeNull())
    await expect(canvas.getByRole('checkbox', { name: 'Seleccionar «Margen por producto»' })).toHaveAttribute(
      'aria-checked',
      'false'
    )
    await expect(canvas.getByRole('checkbox', { name: 'Seleccionar todas las filas de la página' })).toHaveFocus()
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}

/** Three rows selected on mount, for the visual tests: the bar over the table, on a phone too. */
export const SelectionBar: Story = {
  tags: ['mobile'],
  args: {
    ...selectionArgs,
    defaultRowSelection: { 'Ventas por región': true, 'Pedidos del mes': true, 'Ticket promedio': true },
  },
}

/**
 * The full toolbar: the search, the filters (here the period), the density switch, the column menu and the
 * page's own actions. On a phone the pieces wrap onto a second line.
 */
export const Toolbar: Story = {
  tags: ['mobile'],
  args: {
    densityToggle: true,
    filters: <DateRangeFilter today={new Date(2026, 10, 21)} placeholder="Periodo" />,
    actions: (
      <Button>
        <PlusIcon data-icon="inline-start" aria-hidden />
        Nuevo informe
      </Button>
    ),
  },
}

/** «Filas compactas» packs the rows tighter, for long lists; a second click goes back to normal. */
export const Compact: Story = {
  args: { densityToggle: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const table = canvasElement.querySelector<HTMLElement>('[data-slot="data-table"]')!
    const rowHeight = () => canvasElement.querySelector('tbody tr')!.getBoundingClientRect().height
    const normal = rowHeight()
    const toggle = canvas.getByRole('button', { name: 'Filas compactas' })
    await expect(toggle).toHaveAttribute('aria-pressed', 'false')
    await userEvent.click(toggle)
    await expect(toggle).toHaveAttribute('aria-pressed', 'true')
    await expect(table).toHaveAttribute('data-density', 'compact')
    await expect(rowHeight()).toBeLessThanOrEqual(normal - 8)
    await userEvent.click(toggle)
    await expect(table).toHaveAttribute('data-density', 'normal')
    await expect(rowHeight()).toBe(normal)
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}

/** Compact from the start, for the visual tests. */
export const CompactRows: Story = { args: { densityToggle: true, defaultDensity: 'compact' } }
