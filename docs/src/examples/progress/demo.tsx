'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress, ProgressLabel, ProgressValue } from '@/components/ui/progress';

export default function ProgressDemo() {
  const [value, setValue] = useState(40);
  const complete = value === 100;
  const format = new Intl.NumberFormat('es-MX', { style: 'percent' });
  const percentage = (value: number | null) => format.format((value ?? 0) / 100);

  return (
    <div className="flex w-full max-w-sm flex-col items-start gap-4">
      <Progress className="w-full" value={value} getAriaValueText={(_, value) => percentage(value)}>
        <ProgressLabel>Exportación de ventas</ProgressLabel>
        <ProgressValue>{(_, value) => percentage(value)}</ProgressValue>
      </Progress>
      <Button size="sm" variant="outline" onClick={() => setValue(complete ? 0 : Math.min(100, value + 20))}>
        {complete ? 'Reiniciar' : 'Avanzar'}
      </Button>
    </div>
  );
}
