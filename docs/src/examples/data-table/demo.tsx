'use client';
import { Badge } from '@/components/ui/badge';
import { DataTable, type DataTableColumn } from '@/components/ui/data-table';
import { formatDate } from '@/lib/format';

type Informe = { nombre: string; espacio: string; actualizado: string; estado: 'Publicado' | 'Borrador' | 'Con errores' };

const ESTADO_VARIANT = { Publicado: 'success', Borrador: 'info', 'Con errores': 'destructive' } as const;

const INFORMES: Informe[] = [
  { nombre: 'Ventas por región', espacio: 'Ventas', actualizado: '2026-11-18', estado: 'Publicado' },
  { nombre: 'Margen por producto', espacio: 'Finanzas', actualizado: '2026-11-15', estado: 'Publicado' },
  { nombre: 'Pedidos del mes', espacio: 'Operaciones', actualizado: '2026-11-12', estado: 'Borrador' },
  { nombre: 'Clientes activos', espacio: 'Marketing', actualizado: '2026-11-09', estado: 'Publicado' },
  { nombre: 'Ticket promedio', espacio: 'Ventas', actualizado: '2026-11-06', estado: 'Con errores' },
  { nombre: 'Inventario por almacén', espacio: 'Operaciones', actualizado: '2026-11-03', estado: 'Publicado' },
  { nombre: 'Cobranza vencida', espacio: 'Finanzas', actualizado: '2026-10-30', estado: 'Borrador' },
  { nombre: 'Flujo de efectivo', espacio: 'Finanzas', actualizado: '2026-10-27', estado: 'Publicado' },
];

const COLUMNS: DataTableColumn<Informe, string>[] = [
  { accessorKey: 'nombre', header: 'Nombre', size: 220, cell: ({ getValue }) => <span className="font-medium">{getValue()}</span> },
  { accessorKey: 'espacio', header: 'Espacio', size: 140 },
  {
    accessorKey: 'actualizado',
    header: 'Actualizado',
    size: 140,
    cell: ({ getValue }) => <span className="tabular-nums">{formatDate(getValue())}</span>,
  },
  {
    accessorKey: 'estado',
    header: 'Estado',
    size: 140,
    cell: ({ getValue }) => <Badge variant={ESTADO_VARIANT[getValue() as Informe['estado']]}>{getValue()}</Badge>,
  },
];

export default function DataTableDemo() {
  return <DataTable className="w-full" columns={COLUMNS} data={INFORMES} pageSize={5} filterPlaceholder="Buscar informes…" />;
}
