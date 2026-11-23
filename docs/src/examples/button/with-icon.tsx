'use client';
import { DownloadIcon, PlusIcon, RefreshCwIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ButtonWithIcon() {
  return (
    <>
      <Button variant="outline">
        <DownloadIcon data-icon="inline-start" aria-hidden />
        Descargar
      </Button>
      <Button size="icon" variant="outline" aria-label="Nuevo informe">
        <PlusIcon aria-hidden />
      </Button>
      <Button size="icon" variant="ghost" aria-label="Actualizar datos">
        <RefreshCwIcon aria-hidden />
      </Button>
    </>
  );
}
