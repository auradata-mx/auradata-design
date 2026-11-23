'use client';

import { Progress, ProgressLabel, ProgressValue } from '@/components/ui/progress';

export default function ProgressDemo() {
  const format = new Intl.NumberFormat('es-MX', { style: 'percent' });
  const percentage = (value: number | null) => format.format((value ?? 0) / 100);

  return (
    <Progress className="w-full max-w-sm" value={40} getAriaValueText={(_, value) => percentage(value)}>
      <ProgressLabel>Exportación de ventas</ProgressLabel>
      <ProgressValue>{(_, value) => percentage(value)}</ProgressValue>
    </Progress>
  );
}
