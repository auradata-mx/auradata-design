'use client';

import { KpiCard } from '@/components/blocks/kpi-card';
import { formatCompact } from '@/lib/format';

export default function KpiCardDemo() {
  return (
    <KpiCard
      className="w-full max-w-md"
      label="Ventas de octubre"
      value={formatCompact(4161000, { currency: 'MXN' })}
      change={0.062}
      comparison="vs. septiembre"
      trend={[3820000, 3890000, 4010000, 4030000, 4161000]}
    />
  );
}
