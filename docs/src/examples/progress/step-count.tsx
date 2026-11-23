'use client';

import { Progress, ProgressLabel, ProgressValue } from '@/components/ui/progress';

export default function ProgressStepCount() {
  return (
    <Progress className="w-full max-w-sm" value={2} max={3} getAriaValueText={() => '2 de 3 pasos'}>
      <ProgressLabel>Configuración del espacio</ProgressLabel>
      <ProgressValue>{() => '2 de 3 pasos'}</ProgressValue>
    </Progress>
  );
}
