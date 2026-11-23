'use client';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';

export default function PageHeaderLongTitle() {
  return (
    <PageHeader
      className="w-full"
      title="Rentabilidad por sucursal y línea de producto en el Bajío y Occidente, contra el presupuesto anual, de enero a noviembre de 2026"
      description="Comparado con el mismo periodo de 2025. Los montos están en pesos mexicanos, sin IVA."
      actions={
        <>
          <Button variant="outline">Exportar</Button>
          <Button>Compartir</Button>
        </>
      }
    />
  );
}
