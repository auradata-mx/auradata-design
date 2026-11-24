'use client';
import { useState } from 'react';
import { FlagIcon, Trash2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable, type DataTableColumn } from '@/components/ui/data-table';

type Informe = { nombre: string; espacio: string };

const INFORMES: Informe[] = [
  { nombre: 'Ventas por región', espacio: 'Ventas' },
  { nombre: 'Margen por producto', espacio: 'Finanzas' },
  { nombre: 'Pedidos del mes', espacio: 'Operaciones' },
  { nombre: 'Clientes activos', espacio: 'Marketing' },
];

const COLUMNS: DataTableColumn<Informe, string>[] = [
  { accessorKey: 'nombre', header: 'Nombre', size: 240 },
  { accessorKey: 'espacio', header: 'Espacio', size: 160 },
];

export default function DataTableSelection() {
  const [status, setStatus] = useState('');

  return (
    <div className="grid w-full gap-3">
      <DataTable
        className="w-full"
        columns={COLUMNS}
        data={INFORMES}
        filterPlaceholder={null}
        selectable
        getRowId={(informe) => informe.nombre}
        rowLabel={(informe) => informe.nombre}
        bulkActions={(selected, clear) => (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setStatus(`Marcados para revisión: ${selected.map((informe) => informe.nombre).join(', ')}.`);
                clear();
              }}
            >
              <FlagIcon data-icon="inline-start" aria-hidden />
              Marcar para revisión
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                setStatus(`Eliminados: ${selected.map((informe) => informe.nombre).join(', ')}.`);
                clear();
              }}
            >
              <Trash2Icon data-icon="inline-start" aria-hidden />
              Eliminar
            </Button>
          </>
        )}
      />
      <p role="status" className="text-sm text-muted-foreground">
        {status}
      </p>
    </div>
  );
}
