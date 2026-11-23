'use client';

import { Gauge } from '@/components/ui/gauge';

export default function GaugeDemo() {
  return (
    <Gauge value={0.72} label="Meta del trimestre" />
  );
}
