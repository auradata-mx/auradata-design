'use client';

import { ChartCard } from '@/components/blocks/chart-card';
import { BarChart } from '@/components/ui/cartesian-chart';

const DATA = [
  { mes: 'Ago', consultas: 1210 },
  { mes: 'Sep', consultas: 1150 },
  { mes: 'Oct', consultas: 1284 },
];

export default function ChartCardDemo() {
  return (
    <ChartCard
      title="Consultas por mes"
      description="Consultas, agosto a octubre"
      data={DATA}
      columns={[{ key: 'mes', label: 'Mes' }, { key: 'consultas', label: 'Consultas' }]}
      className="w-full"
    >
      <BarChart data={DATA} index="mes" series={{ consultas: 'Consultas' }} animate={false} />
    </ChartCard>
  );
}
