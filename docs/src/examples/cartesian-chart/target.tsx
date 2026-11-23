'use client';

import { ComboChart } from '@/components/ui/cartesian-chart';
import { formatCurrency } from '@/lib/format';

const DATA = [
  { mes: 'Ago', ventas: 3890000, meta: 3900000 },
  { mes: 'Sep', ventas: 4030000, meta: 4000000 },
  { mes: 'Oct', ventas: 4161000, meta: 4100000 },
];

export default function CartesianChartTarget() {
  return (
    <ComboChart
      data={DATA}
      index="mes"
      bars={{ ventas: 'Ventas' }}
      lines={{ meta: 'Meta' }}
      valueFormatter={(value) => formatCurrency(value)}
      animate={false}
      className="h-64 w-full [--chart-surface:var(--background)]"
    />
  );
}
