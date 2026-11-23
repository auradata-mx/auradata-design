'use client';

import { useState } from 'react';
import {
  MasterDetail,
  MasterDetailBack,
  MasterDetailItem,
  MasterDetailList,
  MasterDetailPane,
} from '@/components/ui/master-detail';

const REPORTS = [
  { title: 'Ventas por región', description: 'Ingresos de octubre por región.' },
  { title: 'Cobranza por región', description: 'Facturas pendientes del trimestre.' },
];

export default function MasterDetailDemo() {
  const [selected, setSelected] = useState<(typeof REPORTS)[number] | null>(null);

  return (
    <MasterDetail showDetail={selected !== null} className="min-h-48 w-full rounded-lg border">
      <MasterDetailList aria-label="Informes">
        {REPORTS.map((report) => (
          <MasterDetailItem key={report.title} active={selected === report} onClick={() => setSelected(report)}>
            {report.title}
          </MasterDetailItem>
        ))}
      </MasterDetailList>
      <MasterDetailPane aria-label={selected?.title ?? 'Detalle del informe'} className="grid content-start gap-2 p-4">
        {selected ? (
          <>
            <MasterDetailBack onClick={() => setSelected(null)}>Informes</MasterDetailBack>
            <h3 className="font-semibold">{selected.title}</h3>
            <p className="text-sm text-muted-foreground">{selected.description}</p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">Elige un informe. Su detalle aparece aquí.</p>
        )}
      </MasterDetailPane>
    </MasterDetail>
  );
}
