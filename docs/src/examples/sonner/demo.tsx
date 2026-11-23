'use client';

import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { useId } from 'react';
import { Button } from '@/components/ui/button';

export default function SonnerDemo() {
  const toasterId = useId();

  return (
    <>
      <Toaster id={toasterId} richColors containerAriaLabel="Avisos" />
      <Button
        variant="outline"
        onClick={() =>
          toast.success('Informe publicado', {
            toasterId,
            description: 'Tu equipo ya puede ver «Ventas por región».',
          })
        }
      >
        Publicar informe
      </Button>
    </>
  );
}
