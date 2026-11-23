'use client';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';

export default function PageHeaderDemo() {
  return (
    <PageHeader
      className="w-full"
      title="Informes"
      description="Los informes de tu equipo, del más reciente al más antiguo."
      actions={
        <>
          <Button variant="outline">Importar</Button>
          <Button>Nuevo informe</Button>
        </>
      }
    />
  );
}
