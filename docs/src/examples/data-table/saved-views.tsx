'use client';
import { useState } from 'react';
import { DataTable, type DataTableColumn } from '@/components/ui/data-table';

type Informe = { nombre: string; espacio: string; estado: 'Publicado' | 'Borrador' };

const INFORMES: Informe[] = [
  { nombre: 'Ventas por región', espacio: 'Ventas', estado: 'Publicado' },
  { nombre: 'Margen por producto', espacio: 'Finanzas', estado: 'Publicado' },
  { nombre: 'Pedidos del mes', espacio: 'Operaciones', estado: 'Borrador' },
  { nombre: 'Clientes activos', espacio: 'Marketing', estado: 'Publicado' },
  { nombre: 'Cobranza vencida', espacio: 'Finanzas', estado: 'Borrador' },
];

const COLUMNS: DataTableColumn<Informe, string>[] = [
  { accessorKey: 'nombre', header: 'Nombre', size: 220 },
  { accessorKey: 'espacio', header: 'Espacio', size: 140, meta: { filter: { type: 'select' } } },
  { accessorKey: 'estado', header: 'Estado', size: 140, meta: { filter: { type: 'select' } } },
];

/** Views kept in memory for this page: a reload starts over. Without `storage`, the table uses `localStorage`. */
function memoryStorage() {
  const items = new Map<string, string>();
  return { getItem: (key: string) => items.get(key) ?? null, setItem: (key: string, value: string) => void items.set(key, value) };
}

export default function DataTableSavedViews() {
  const [storage] = useState(memoryStorage);

  return (
    <DataTable
      className="w-full"
      columns={COLUMNS}
      data={INFORMES}
      filterPlaceholder="Buscar informes…"
      savedViews={{ key: 'informes', storage }}
    />
  );
}
