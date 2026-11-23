'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DataTableSelectionBar } from '@/components/ui/data-table-selection-bar';

const REPORTS = ['Ventas por región', 'Pedidos del mes', 'Ticket promedio'];

export default function DataTableSelectionBarBulk() {
  const [selected, setSelected] = useState<string[]>([]);
  const [status, setStatus] = useState('');

  function toggle(report: string) {
    setSelected((current) =>
      current.includes(report) ? current.filter((item) => item !== report) : [...current, report],
    );
  }

  return (
    <div className="grid w-full gap-3">
      <fieldset className="grid gap-2">
        <legend className="mb-2 font-medium">Selecciona informes</legend>
        {REPORTS.map((report) => (
          <label key={report} className="flex items-center gap-2">
            <input type="checkbox" checked={selected.includes(report)} onChange={() => toggle(report)} />
            {report}
          </label>
        ))}
      </fieldset>
      <DataTableSelectionBar count={selected.length} onClear={() => setSelected([])}>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setStatus(`Marcados para revisión: ${selected.join(', ')}.`);
            setSelected([]);
          }}
        >
          Marcar para revisión
        </Button>
      </DataTableSelectionBar>
      <p role="status" className="text-sm text-muted-foreground">{status}</p>
    </div>
  );
}
