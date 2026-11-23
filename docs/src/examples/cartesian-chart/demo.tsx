'use client';

import { LineChart } from '@/components/ui/cartesian-chart';
import { formatCurrency } from '@/lib/format';

const DATA = [
  { mes: 'Ago', norte: 1210, sur: 820 },
  { mes: 'Sep', norte: 1150, sur: 870 },
  { mes: 'Oct', norte: 1284, sur: 846 },
];

export default function CartesianChartDemo() {
  return (
    <LineChart
      data={DATA}
      index="mes"
      series={{ norte: 'Norte', sur: 'Sur' }}
      valueFormatter={(value) => formatCurrency(value)}
      animate={false}
      className="h-64 w-full [--chart-surface:var(--background)]"
    />
  );
}
