'use client';

import { CsvPreview } from '@/components/ui/csv-preview';
import { parseCsv } from '@/lib/file-upload';

const CSV = `Región,Ventas,Clientes
Norte,"1,284,500",312
Centro,"2,041,300",488
Sur,"846,000",201`;

export default function CsvPreviewDemo() {
  return <CsvPreview rows={parseCsv(CSV, { maxRows: 6 })} totalRows={1284} className="w-full min-w-0" />;
}
