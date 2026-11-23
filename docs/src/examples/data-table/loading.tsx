'use client';
import { DataTable, type DataTableColumn } from '@/components/ui/data-table';

type Informe = { nombre: string; espacio: string };

const COLUMNS: DataTableColumn<Informe, string>[] = [
  { accessorKey: 'nombre', header: 'Nombre', size: 240 },
  { accessorKey: 'espacio', header: 'Espacio', size: 160 },
];

export default function DataTableLoading() {
  return <DataTable className="w-full" columns={COLUMNS} data={[]} pageSize={3} loading filterPlaceholder="Buscar informes…" />;
}
