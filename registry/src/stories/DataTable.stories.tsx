import type { Meta, StoryObj } from '@storybook/react-vite'
import { strFromU8, unzipSync } from 'fflate'
import { FolderInputIcon, PlusIcon, Trash2Icon } from 'lucide-react'
import * as React from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTable, type DataTableColumn } from '@/components/ui/data-table'
import { DateRangeFilter } from '@/components/ui/date-range-filter'
import type { FilterField } from '@/lib/filter-conditions'
import { formatCurrency, formatDate, formatNumber } from '@/lib/format'

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
 * The full toolbar: the search, the filters (here the period), the density switch, «Exportar», the column menu
 * and the page's own actions. On a phone the pieces wrap onto a second line.
 */
export const Toolbar: Story = {
  tags: ['mobile'],
  args: {
    densityToggle: true,
    exportable: true,
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
    await expect(table).toHaveAttribute('data-row-density', 'compact')
    await expect(rowHeight()).toBeLessThanOrEqual(normal - 8)
    await userEvent.click(toggle)
    await expect(table).toHaveAttribute('data-row-density', 'normal')
    await expect(rowHeight()).toBe(normal)
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}

/** Compact from the start, for the visual tests. */
export const CompactRows: Story = { args: { densityToggle: true, defaultView: { density: 'compact' } } }

const header = (canvasElement: HTMLElement, name: RegExp) =>
  within(canvasElement).getByRole('columnheader', { name })
const headerNames = (canvasElement: HTMLElement) =>
  [...canvasElement.querySelectorAll('thead th')].map((th) => th.textContent?.trim())

/** Opens a header's column menu and picks an item. */
async function columnAction(canvasElement: HTMLElement, column: string, item: string) {
  const canvas = within(canvasElement)
  await userEvent.click(canvas.getByRole('button', { name: `Opciones de la columna «${column}»` }))
  await userEvent.click(await within(document.body).findByRole('menuitem', { name: item }))
  // The menu closes (its exit animation too) before the next step or the axe check.
  await waitFor(() => expect(document.querySelector('[data-base-ui-focus-guard]')).toBeNull())
}

/**
 * Each header gets a menu (sort, pin, move, hide) and a handle on its right edge that drags or, with the
 * arrow keys, changes its width.
 */
export const ColumnTools: Story = {
  tags: ['mobile'],
  args: { columnActions: true, resizableColumns: true },
}

/** «Fijar a la izquierda» keeps «Nombre» in view while the rest scrolls sideways under it. */
export const PinColumn: Story = {
  args: { columnActions: true },
  render: (args) => (
    <div className="max-w-[22rem]">
      <DataTable {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await columnAction(canvasElement, 'Estado', 'Fijar a la izquierda')
    await waitFor(() => expect(headerNames(canvasElement)[0]).toBe('Estado'))
    const estado = header(canvasElement, /Estado/)
    await expect(estado).toHaveAttribute('data-pinned', 'start')
    const scroller = canvasElement.querySelector<HTMLElement>('[data-slot="table-container"]')!
    const left = estado.getBoundingClientRect().left
    scroller.scrollLeft = 200
    await waitFor(() => expect(estado.getBoundingClientRect().left).toBe(left))
    await expect(header(canvasElement, /Nombre/).getBoundingClientRect().left).toBeLessThan(left)
    scroller.scrollLeft = 0
    await columnAction(canvasElement, 'Estado', 'Desfijar')
    await waitFor(() => expect(headerNames(canvasElement).at(-1)).toBe('Estado'))
    await expect(header(canvasElement, /Estado/)).not.toHaveAttribute('data-pinned')
  },
}

/** «Mover a la izquierda» and «Ocultar columna» from a header's menu. */
export const MoveAndHide: Story = {
  args: { columnActions: true },
  play: async ({ canvasElement }) => {
    await expect(headerNames(canvasElement)).toEqual(['Nombre', 'Espacio', 'Actualizado', 'Dueño', 'Estado'])
    await columnAction(canvasElement, 'Espacio', 'Mover a la izquierda')
    await waitFor(() => expect(headerNames(canvasElement).slice(0, 2)).toEqual(['Espacio', 'Nombre']))
    // The first column cannot move further left.
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Opciones de la columna «Espacio»' }))
    await expect(await within(document.body).findByRole('menuitem', { name: 'Mover a la izquierda' })).toHaveAttribute(
      'aria-disabled',
      'true'
    )
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(document.querySelector('[data-base-ui-focus-guard]')).toBeNull())
    await columnAction(canvasElement, 'Dueño', 'Ocultar columna')
    await waitFor(() => expect(headerNames(canvasElement)).toEqual(['Espacio', 'Nombre', 'Actualizado', 'Estado']))
    // A header's menu sorts too.
    await columnAction(canvasElement, 'Actualizado', 'Orden descendente')
    await expect(header(canvasElement, /Actualizado/)).toHaveAttribute('aria-sort', 'descending')
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}

/** The width handle: the arrow keys change it by 16 px, a drag by the distance moved. */
export const ResizeColumn: Story = {
  args: { resizableColumns: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const nombre = header(canvasElement, /Nombre/)
    const width = () => Math.round(nombre.getBoundingClientRect().width)
    const before = width()
    const handle = canvas.getByRole('separator', { name: 'Ancho de la columna «Nombre»' })
    await expect(handle).toHaveAttribute('aria-valuenow', '240')
    handle.focus()
    await userEvent.keyboard('{ArrowRight}{ArrowRight}')
    await expect(handle).toHaveAttribute('aria-valuenow', '272')
    await waitFor(() => expect(width()).toBe(before + 32))
    await userEvent.keyboard('{ArrowLeft}')
    await expect(handle).toHaveAttribute('aria-valuenow', '256')
    // Drag the edge 40 px to the right.
    const box = handle.getBoundingClientRect()
    const x = box.left + box.width / 2
    const y = box.top + box.height / 2
    handle.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: x, clientY: y }))
    document.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: x + 40, clientY: y }))
    document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, clientX: x + 40, clientY: y }))
    await waitFor(() => expect(handle).toHaveAttribute('aria-valuenow', '296'))
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}

/**
 * «Nombre» pinned from the start (`defaultView`) on a narrow screen, scrolled to the end, for the visual tests.
 * Without the header menus: a menu button half under the pinned column fails axe's 24 px target size.
 */
export const Pinned: Story = {
  tags: ['mobile'],
  args: {
    // A narrower «Nombre», so on a phone most of the width still scrolls.
    columns: COLUMNS.map((column) => (column.header === 'Nombre' ? { ...column, size: 168 } : column)),
    defaultView: { columnPinning: { start: ['nombre'], end: [] } },
  },
  render: (args) => (
    <div className="max-w-[22rem]">
      <DataTable {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const scroller = canvasElement.querySelector<HTMLElement>('[data-slot="table-container"]')!
    scroller.scrollLeft = scroller.scrollWidth
    await waitFor(() =>
      expect(canvasElement.querySelector('[data-slot="data-table-region"]')).toHaveAttribute('data-more', 'start')
    )
  },
}

/**
 * Inside a section with the theme's compact density (`data-density="compact"`, T59), the table follows it: it
 * never resets the density of what it sits in. Its own «Filas compactas» only packs the rows.
 */
export const InCompactSection: Story = {
  args: { densityToggle: true },
  render: (args) => (
    <div data-density="compact">
      <DataTable {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvasElement.querySelector('[data-slot="data-table"]')).not.toHaveAttribute('data-density')
    // h-8 is 32 px at the stock step and 28 px in compact density.
    await expect(canvas.getByRole('button', { name: 'Columnas' }).getBoundingClientRect().height).toBe(28)
  },
}

/** «Espacio» and «Estado» declare `meta.filter`: the toolbar gets a filter for each, with the counts. */
const FILTER_COLUMNS: DataTableColumn<Informe, string>[] = COLUMNS.map((column) =>
  column.header === 'Espacio' || column.header === 'Estado' ? { ...column, meta: { filter: { type: 'select' } } } : column
)

/**
 * Filters per column: each counts its values among the rows the other filters leave; the chips under the toolbar
 * say what is filtered and «Limpiar todo» undoes it.
 */
export const ColumnFilters: Story = {
  args: { columns: FILTER_COLUMNS },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const page = within(document.body)
    const rows = () => canvasElement.querySelectorAll('tbody tr')
    const toolbar = within(canvasElement.querySelector<HTMLElement>('[data-slot="data-table-toolbar"]')!)
    await userEvent.click(toolbar.getByRole('button', { name: 'Estado' }))
    let dialog = await page.findByRole('dialog', { name: 'Estado' })
    await expect(within(dialog).getByRole('option', { name: /Publicado/ })).toHaveTextContent('15')
    await userEvent.click(within(dialog).getByRole('option', { name: /Borrador/ }))
    await waitFor(() => expect(rows()).toHaveLength(4))
    await expect(canvas.getByText('Página 1 de 1')).toBeInTheDocument()
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(page.queryByRole('dialog')).toBeNull())

    const chips = canvas.getByRole('group', { name: 'Filtros activos' })
    await expect(chips).toHaveTextContent('Estado: Borrador')
    // «Espacio» now counts only the drafts.
    await userEvent.click(toolbar.getByRole('button', { name: /^Espacio/ }))
    dialog = await page.findByRole('dialog', { name: 'Espacio' })
    await expect(within(dialog).getByRole('option', { name: /Finanzas/ })).toHaveTextContent('Finanzas1')
    await userEvent.click(within(dialog).getByRole('option', { name: /Ventas/ }))
    await waitFor(() => expect(rows()).toHaveLength(1))
    await expect(canvas.getByText('Sin resultados')).toBeInTheDocument()
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(page.queryByRole('dialog')).toBeNull())

    await userEvent.click(within(chips).getByRole('button', { name: 'Limpiar todo' }))
    await waitFor(() => expect(rows()).toHaveLength(10))
    await expect(canvas.queryByRole('group', { name: 'Filtros activos' })).toBeNull()
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}

/** Two filters on, for the visual tests: the buttons name the values, the chips sit under the toolbar. */
export const ColumnFiltersActive: Story = {
  tags: ['mobile'],
  args: {
    columns: FILTER_COLUMNS,
    defaultView: { columnFilters: [{ id: 'estado', value: ['Publicado', 'Desactualizado'] }, { id: 'espacio', value: ['Ventas'] }] },
  },
}

type Venta = { sucursal: string; region: string; ventas: number; fecha: string }

const VENTAS: Venta[] = [
  ['Monterrey Centro', 'Norte', 412500, '2026-11-18'],
  ['Saltillo', 'Norte', 98400, '2026-11-03'],
  ['Guadalajara Sur', 'Occidente', 276300, '2026-10-27'],
  ['Zapopan', 'Occidente', 154900, '2026-11-12'],
  ['CDMX Reforma', 'Centro', 488000, '2026-11-20'],
  ['CDMX Coyoacán', 'Centro', 231700, '2026-09-30'],
  ['Puebla', 'Centro', 87600, '2026-11-07'],
  ['Querétaro', 'Bajío', 199800, '2026-10-15'],
  ['León', 'Bajío', 143200, '2026-11-15'],
  ['Mérida', 'Sur', 121500, '2026-08-22'],
  ['Cancún', 'Sur', 305600, '2026-11-01'],
  ['Oaxaca', 'Sur', 45300, '2026-10-05'],
].map(([sucursal, region, ventas, fecha]) => ({ sucursal, region, ventas, fecha }) as Venta)

const VENTAS_COLUMNS: DataTableColumn<Venta>[] = [
  { accessorKey: 'sucursal', header: 'Sucursal', size: 200, cell: ({ getValue }) => <span className="font-medium">{getValue()}</span> },
  { accessorKey: 'region', header: 'Región', size: 140, meta: { filter: { type: 'select' } } },
  {
    accessorKey: 'ventas',
    header: 'Ventas',
    size: 160,
    meta: { filter: { type: 'range', step: 1000, format: (value: number) => formatCurrency(value) } },
    cell: ({ getValue }) => <span className="tabular-nums">{formatCurrency(getValue())}</span>,
  },
  {
    accessorKey: 'fecha',
    header: 'Fecha',
    size: 140,
    meta: { filter: { type: 'date', today: new Date(2026, 10, 21) } },
    cell: ({ getValue }) => <span className="tabular-nums">{formatDate(getValue())}</span>,
  },
]

/**
 * A number range and a period beside the values filter: «Ventas» from $100,000 and «Fecha» this month leave the
 * big November branches; the chips write each filter with the field's format.
 */
export const RangeAndDateFilters: Story = {
  render: () => <DataTable columns={VENTAS_COLUMNS} data={VENTAS} filterPlaceholder="Buscar sucursales…" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const page = within(document.body)
    const toolbar = within(canvasElement.querySelector<HTMLElement>('[data-slot="data-table-toolbar"]')!)
    const rows = () => canvasElement.querySelectorAll('tbody tr')
    await expect(rows()).toHaveLength(10)

    await userEvent.click(toolbar.getByRole('button', { name: 'Ventas' }))
    let dialog = await page.findByRole('dialog', { name: 'Ventas' })
    const min = within(dialog).getByRole('spinbutton', { name: 'Mínimo' })
    await expect(min).toHaveValue(45300)
    await userEvent.clear(min)
    await userEvent.type(min, '100000{Enter}')
    await waitFor(() => expect(rows()).toHaveLength(9))
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(page.queryByRole('dialog')).toBeNull())

    await userEvent.click(toolbar.getByRole('button', { name: /Fecha/ }))
    dialog = await page.findByRole('dialog', { name: 'Periodo' })
    await userEvent.click(within(dialog).getByRole('button', { name: 'Este mes' }))
    await waitFor(() => expect(rows()).toHaveLength(5))
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(page.queryByRole('dialog')).toBeNull())

    const chips = canvas.getByRole('group', { name: 'Filtros activos' })
    await expect(chips).toHaveTextContent('Ventas: $100,000 – $488,000')
    await expect(chips).toHaveTextContent('Fecha: 1 nov 2026 – 21 nov 2026')
    await userEvent.click(within(chips).getByRole('button', { name: 'Quitar el filtro «Ventas»' }))
    await waitFor(() => expect(rows()).toHaveLength(7))
    await userEvent.click(within(chips).getByRole('button', { name: 'Limpiar todo' }))
    await waitFor(() => expect(rows()).toHaveLength(10))
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}

/** A range and a period on, for the visual tests, on a phone too. */
export const RangeAndDateActive: Story = {
  tags: ['mobile'],
  render: () => (
    <DataTable
      columns={VENTAS_COLUMNS}
      data={VENTAS}
      filterPlaceholder="Buscar sucursales…"
      defaultView={{
        columnFilters: [
          { id: 'ventas', value: [100000, 500000] },
          { id: 'fecha', value: { from: new Date(2026, 10, 1), to: new Date(2026, 10, 21) } },
        ],
      }}
    />
  ),
}

const VENTAS_FIELDS: FilterField[] = [
  { id: 'sucursal', label: 'Sucursal', type: 'text' },
  { id: 'region', label: 'Región', type: 'select', options: ['Norte', 'Centro', 'Bajío', 'Occidente', 'Sur'].map((value) => ({ value })) },
  { id: 'ventas', label: 'Ventas', type: 'number' },
  { id: 'fecha', label: 'Fecha', type: 'date' },
]

/**
 * «Filtros» opens the filter builder: any field, joined by Y/O, in groups. The button counts the finished
 * conditions and a chip says the advanced filter is on.
 */
export const AdvancedFilter: Story = {
  render: () => (
    <DataTable columns={VENTAS_COLUMNS} data={VENTAS} filterPlaceholder="Buscar sucursales…" filterFields={VENTAS_FIELDS} />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const page = within(document.body)
    const toolbar = within(canvasElement.querySelector<HTMLElement>('[data-slot="data-table-toolbar"]')!)
    const rows = () => canvasElement.querySelectorAll('tbody tr')
    await userEvent.click(toolbar.getByRole('button', { name: 'Filtros' }))
    const dialog = await page.findByRole('dialog', { name: 'Filtros avanzados' })
    await userEvent.click(within(dialog).getByRole('button', { name: 'Agregar condición' }))
    const row = within(dialog).getByRole('group', { name: 'Condición 1' })
    await userEvent.selectOptions(within(row).getByRole('combobox', { name: 'Campo' }), 'ventas')
    await userEvent.selectOptions(within(row).getByRole('combobox', { name: 'Operador' }), 'gt')
    await userEvent.type(within(row).getByRole('spinbutton', { name: 'Valor' }), '300000')
    await waitFor(() => expect(rows()).toHaveLength(3))
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(page.queryByRole('dialog')).toBeNull())
    await expect(toolbar.getByRole('button', { name: /Filtros/ })).toHaveTextContent('Filtros1')
    const chips = canvas.getByRole('group', { name: 'Filtros activos' })
    await expect(chips).toHaveTextContent('Filtros avanzados: 1 condición')
    await userEvent.click(within(chips).getByRole('button', { name: 'Quitar el filtro «Filtros avanzados»' }))
    await waitFor(() => expect(rows()).toHaveLength(10))
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}

/** An advanced filter on, with the builder open, for the visual tests: on a phone it takes the screen's width. */
export const AdvancedFilterOpen: Story = {
  tags: ['mobile'],
  render: () => (
    <DataTable
      columns={VENTAS_COLUMNS}
      data={VENTAS}
      filterPlaceholder="Buscar sucursales…"
      filterFields={VENTAS_FIELDS}
      defaultView={{
        advancedFilter: {
          id: 'root',
          combinator: 'and',
          conditions: [
            { id: 'c1', field: 'ventas', operator: 'gte', value: 100000 },
            { id: 'c2', field: 'region', operator: 'notEquals', value: 'Centro' },
          ],
        },
      }}
    />
  ),
  play: async ({ canvasElement }) => {
    const toolbar = within(canvasElement.querySelector<HTMLElement>('[data-slot="data-table-toolbar"]')!)
    await userEvent.click(toolbar.getByRole('button', { name: /Filtros/ }))
    await within(document.body).findByRole('dialog', { name: 'Filtros avanzados' })
  },
}

/** The detail of an informe, under its row. */
const informeDetail = (informe: Informe) => (
  <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-sm">
    <dt className="text-muted-foreground">Espacio</dt>
    <dd>{informe.espacio}</dd>
    <dt className="text-muted-foreground">Dueño</dt>
    <dd>{informe.dueno}</dd>
    <dt className="text-muted-foreground">Actualizado</dt>
    <dd>{formatDate(informe.actualizado, { month: 'long' })}</dd>
  </dl>
)

/** A chevron opens a row's detail under it; on a phone the detail stays in view while the columns scroll. */
export const ExpandableRows: Story = {
  args: { renderDetail: informeDetail, rowLabel: (informe: Informe) => informe.nombre },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const toggle = canvas.getByRole('button', { name: 'Mostrar el detalle de «Margen por producto»' })
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(toggle)
    await expect(toggle).toHaveAttribute('aria-expanded', 'true')
    const detail = document.getElementById(toggle.getAttribute('aria-controls')!)!
    await expect(detail).toHaveTextContent('Luis Méndez')
    // The detail row sits right under its row.
    await expect(toggle.closest('tr')!.nextElementSibling).toContainElement(detail)
    await userEvent.click(toggle)
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await expect(document.getElementById(toggle.getAttribute('aria-controls')!)).toBeNull()
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}

/** One row open from the start, for the visual tests, on a phone too. */
export const ExpandedRow: Story = {
  tags: ['mobile'],
  args: {
    renderDetail: informeDetail,
    rowLabel: (informe: Informe) => informe.nombre,
    getRowId: (informe: Informe) => informe.nombre,
    defaultExpanded: { 'Margen por producto': true },
  },
}

const onCellEdit = fn()

/** «Nombre» and «Estado» edit in place: the data lives in the story, as it would in an app. */
function EditableTable() {
  const [data, setData] = React.useState(INFORMES)
  const columns = React.useMemo<DataTableColumn<Informe, string>[]>(
    () =>
      COLUMNS.map((column) =>
        column.header === 'Nombre'
          ? { ...column, meta: { editable: { type: 'text' } } }
          : column.header === 'Estado'
            ? {
                ...column,
                meta: {
                  editable: {
                    type: 'select',
                    options: (['Publicado', 'Borrador', 'Desactualizado', 'Con errores'] as Estado[]).map((value) => ({ value })),
                  },
                },
              }
            : column
      ),
    []
  )
  return (
    <DataTable
      columns={columns}
      data={data}
      filterPlaceholder="Buscar informes…"
      getRowId={(informe) => informe.nombre}
      onCellEdit={(informe, columnId, value) => {
        onCellEdit(informe.nombre, columnId, value)
        setData((rows) => rows.map((row) => (row === informe ? { ...row, [columnId]: value } : row)))
      }}
    />
  )
}

/**
 * Click a cell (or Enter on it) to edit; Enter or leaving the field saves, Escape cancels. A screen reader hears
 * the cell and «editar «Nombre»».
 */
export const InlineEdit: Story = {
  render: () => <EditableTable />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const cell = canvas.getByRole('button', { name: /^Ticket promedio\b.*editar «Nombre»$/ })
    await userEvent.click(cell)
    const input = canvas.getByRole('textbox', { name: 'Editar «Nombre»' })
    await expect(input).toHaveFocus()
    await expect(input).toHaveValue('Ticket promedio')
    await userEvent.clear(input)
    await userEvent.type(input, 'Ticket medio{Enter}')
    await expect(onCellEdit).toHaveBeenLastCalledWith('Ticket promedio', 'nombre', 'Ticket medio')
    const saved = canvas.getByRole('button', { name: /^Ticket medio\b.*editar «Nombre»$/ })
    await waitFor(() => expect(saved).toHaveFocus())

    // Escape leaves the value as it was.
    await userEvent.keyboard('{Enter}')
    await userEvent.type(canvas.getByRole('textbox', { name: 'Editar «Nombre»' }), ' anual{Escape}')
    await expect(canvas.getByRole('button', { name: /^Ticket medio\b.*editar «Nombre»$/ })).toBeInTheDocument()
    await expect(onCellEdit).toHaveBeenCalledTimes(1)

    await userEvent.click(canvas.getAllByRole('button', { name: /^Borrador\b.*editar «Estado»$/ })[0])
    await userEvent.selectOptions(canvas.getByRole('combobox', { name: 'Editar «Estado»' }), 'Publicado')
    await expect(onCellEdit).toHaveBeenLastCalledWith('Pedidos del mes', 'estado', 'Publicado')
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}

const onExport = fn()

/**
 * «Exportar» saves the rows in view (filtered and sorted, every page; the selected ones when there is a
 * selection) as CSV or Excel, with the visible columns.
 */
export const Export: Story = {
  args: { exportable: { fileName: 'informes' }, onExport },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const page = within(document.body)
    await userEvent.click(canvas.getByRole('button', { name: 'Exportar' }))
    await userEvent.click(await page.findByRole('menuitem', { name: 'CSV (.csv)' }))
    const [csv] = onExport.mock.lastCall!
    await expect(csv.fileName).toBe('informes.csv')
    const lines = (csv.data as string).split('\r\n')
    await expect(lines[0]).toBe('\uFEFFNombre,Espacio,Actualizado,Dueño,Estado')
    await expect(lines).toHaveLength(26)
    await waitFor(() => expect(page.queryByRole('menu')).toBeNull())

    await userEvent.type(canvas.getByRole('searchbox', { name: 'Buscar informes…' }), 'inventario')
    await userEvent.click(canvas.getByRole('button', { name: 'Exportar' }))
    await expect(await page.findByText('Filas filtradas: 2')).toBeInTheDocument()
    await userEvent.click(await page.findByRole('menuitem', { name: 'Excel (.xlsx)' }))
    const [xlsx] = onExport.mock.lastCall!
    await expect(xlsx.fileName).toBe('informes.xlsx')
    const sheet = strFromU8(unzipSync(xlsx.data as Uint8Array)['xl/worksheets/sheet1.xml'])
    await expect(sheet).toContain('Inventario por almacén')
    await expect(sheet).toContain('<row r="3">')
    await expect(sheet).not.toContain('<row r="4">')
    await waitFor(() => expect(page.queryByRole('menu')).toBeNull())
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}

/** With rows selected, «Exportar» saves only them. */
export const ExportSelection: Story = {
  args: { ...selectionArgs, exportable: true, onExport },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const page = within(document.body)
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Seleccionar «Ventas por región»' }))
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Seleccionar «Devoluciones»' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Exportar' }))
    await expect(await page.findByText('Filas seleccionadas: 2')).toBeInTheDocument()
    await userEvent.click(await page.findByRole('menuitem', { name: 'CSV (.csv)' }))
    const [csv] = onExport.mock.lastCall!
    await expect(csv.fileName).toBe('datos.csv')
    await expect((csv.data as string).split('\r\n').slice(1)).toEqual([
      'Ventas por región,Ventas,2026-11-01,Ana Torres,Publicado',
      'Devoluciones,Dirección,2026-08-08,Luis Méndez,Borrador',
    ])
    await waitFor(() => expect(page.queryByRole('menu')).toBeNull())
    await userEvent.click(canvas.getByRole('button', { name: 'Quitar selección' }))
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}

/** 5,000 informes: the table only draws the rows in view. */
const MANY: Informe[] = Array.from({ length: 5000 }, (_, index) => ({
  ...INFORMES[index % INFORMES.length],
  nombre: `${INFORMES[index % INFORMES.length].nombre} ${formatNumber(index + 1)}`,
}))

/**
 * Thousands of rows in a box of their own height: the table draws only the rows in view (and a few more), the
 * header stays on top while the body scrolls, and the footer counts the rows instead of paging them.
 */
export const Virtualized: Story = {
  tags: ['mobile'],
  args: { data: MANY, virtualize: { height: 420 } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const scroller = canvasElement.querySelector<HTMLElement>('[data-slot="table-container"]')!
    const drawn = () => canvasElement.querySelectorAll('tbody tr[data-index]').length
    await expect(canvas.getByText('5,000 filas')).toBeInTheDocument()
    await expect(canvas.queryByRole('button', { name: 'Siguiente' })).toBeNull()
    await waitFor(() => expect(drawn()).toBeGreaterThan(5))
    await expect(drawn()).toBeLessThan(40)
    const header = canvasElement.querySelector('thead')!.getBoundingClientRect().top
    scroller.scrollTop = scroller.scrollHeight
    await waitFor(() => expect(canvas.getByText('Tráfico del sitio 5,000')).toBeInTheDocument())
    await expect(drawn()).toBeLessThan(40)
    // The header stays where it was.
    await expect(canvasElement.querySelector('thead')!.getBoundingClientRect().top).toBe(header)
    // A search narrows the 5,000 and the count follows.
    await userEvent.type(canvas.getByRole('searchbox', { name: 'Buscar informes…' }), 'nómina mensual 4,')
    await waitFor(() => expect(canvas.getByText('40 filas')).toBeInTheDocument())
    // Back to the start, for the screenshot.
    await userEvent.clear(canvas.getByRole('searchbox', { name: 'Buscar informes…' }))
    scroller.scrollTop = 0
    await waitFor(() => expect(canvas.getByText('Ventas por región 1')).toBeInTheDocument())
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}
