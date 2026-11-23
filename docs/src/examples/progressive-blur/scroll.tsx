'use client';

import { ScrollBlur } from '@/components/ui/progressive-blur';

export default function ProgressiveblurScroll() {
  const reports = [
    'Ventas por región',
    'Nómina mensual',
    'Inventario por almacén',
    'Cuentas por cobrar',
    'Margen por producto',
    'Clientes nuevos',
  ];

  return (
    <ScrollBlur
      className="w-full max-w-md rounded-lg border"
      viewportClassName="max-h-32"
      size="2rem"
      aria-label="Informes recientes"
    >
      <ul className="divide-y">
        {reports.map((report) => (
          <li key={report} className="px-4 py-3 text-sm">
            {report}
          </li>
        ))}
      </ul>
    </ScrollBlur>
  );
}
