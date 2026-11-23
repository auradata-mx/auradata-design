'use client';

import { Gauge } from '@/components/ui/gauge';

export default function GaugeLimits() {
  return (
    <Gauge
      value={41500}
      max={50000}
      label="Consultas del mes"
      variant="half"
      thresholds={{ warning: 37500, danger: 45000 }}
    />
  );
}
