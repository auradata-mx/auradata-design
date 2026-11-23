'use client';

import { FunnelChart } from '@/components/ui/funnel-chart';

const STAGES = [
  { etapa: 'Invitación enviada', personas: 240 },
  { etapa: 'Cuenta creada', personas: 168 },
  { etapa: 'Primer informe', personas: 96 },
];

export default function FunnelChartTotal() {
  return (
    <FunnelChart
      data={STAGES}
      index="etapa"
      value="personas"
      totalLabel="Llegaron al primer informe"
      className="w-full"
    />
  );
}
