'use client';

import { CsvPreview } from '@/components/ui/csv-preview';
import { parseCsv } from '@/lib/file-upload';

const CSV = `Región,Sucursal,Mes,Ventas,Clientes,Ticket promedio,Devoluciones
Norte,Monterrey Centro,nov 2026,"1,284,500",312,"4,117",12
Centro,Ciudad de México Polanco,nov 2026,"2,041,300",488,"4,183",9`;

export default function CsvPreviewWide() {
  return <CsvPreview rows={parseCsv(CSV, { maxRows: 6 })} className="w-full min-w-0" />;
}
