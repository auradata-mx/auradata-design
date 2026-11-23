'use client';

import { useId, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Toaster, toastProgress } from '@/components/ui/sonner';

export default function SonnerProgress() {
  const toasterId = useId();
  const [task, setTask] = useState<ReturnType<typeof toastProgress> | null>(null);

  function startExport() {
    const next = toastProgress('Exportando «Ventas por región»…', { toasterId });
    next.update(40);
    setTask(next);
  }

  function finishExport() {
    task?.success('Exportación lista');
    setTask(null);
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Toaster id={toasterId} richColors containerAriaLabel="Progreso de la exportación" />
      <Button variant="outline" onClick={startExport} disabled={task !== null}>
        Iniciar exportación
      </Button>
      <Button variant="outline" onClick={finishExport} disabled={task === null}>
        Terminar exportación
      </Button>
    </div>
  );
}
