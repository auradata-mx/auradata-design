import type { Meta, StoryObj } from '@storybook/react-vite'

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
export const Default: Story = {}

/** No data yet, or a filter with no match. */
export const Empty: Story = { args: { data: [], emptyMessage: 'Aún no hay informes en este espacio.' } }

/** The column menu open, for the visual tests and to see the overlay. */
export const Open: Story = { args: { defaultColumnsOpen: true } }
