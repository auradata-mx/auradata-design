'use client';
import { useState } from 'react';
import { PlusIcon, SearchIcon, Share2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tour, type TourStep } from '@/components/ui/tour';

const steps: TourStep[] = [
  {
    target: '#tour-demo-new',
    title: 'Crea un informe',
    description: 'Empieza desde un dataset o desde una plantilla.',
  },
  {
    target: '#tour-demo-search',
    title: 'Busca lo que sea',
    description: 'Informes, datasets y acciones, también con ⌘K.',
  },
  {
    target: '#tour-demo-share',
    title: 'Comparte con tu equipo',
    description: 'Invita por correo o copia un enlace de solo lectura.',
    side: 'left',
  },
];

export default function TourDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div className="grid w-full gap-4">
      <div className="flex flex-wrap items-center gap-2 rounded-xl border p-3">
        <Button id="tour-demo-new">
          <PlusIcon data-icon="inline-start" aria-hidden />
          Nuevo informe
        </Button>
        <Button id="tour-demo-search" variant="outline">
          <SearchIcon data-icon="inline-start" aria-hidden />
          Buscar…
        </Button>
        <Button id="tour-demo-share" variant="outline" className="ml-auto">
          <Share2Icon data-icon="inline-start" aria-hidden />
          Compartir
        </Button>
      </div>
      <Button variant="link" className="w-fit justify-self-end px-0" onClick={() => setOpen(true)}>
        Ver el tour
      </Button>
      <Tour steps={steps} open={open} onOpenChange={setOpen} />
    </div>
  );
}
