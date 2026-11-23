'use client';

import { FunnelChart } from '@/components/ui/funnel-chart';

const STAGES = [
  { etapa: 'Visitas al sitio', personas: 12480 },
  { etapa: 'Registros', personas: 3210 },
  { etapa: 'Prueba activa', personas: 1284 },
  { etapa: 'Pago', personas: 412 },
];

export default function FunnelChartDemo() {
  return <FunnelChart data={STAGES} index="etapa" value="personas" className="w-full" />;
}
