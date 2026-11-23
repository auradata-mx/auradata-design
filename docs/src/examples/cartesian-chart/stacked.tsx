'use client';

import { BarChart } from '@/components/ui/cartesian-chart';
import { formatCurrency } from '@/lib/format';

const DATA = [
  { mes: 'Ago', norte: 1210, sur: 820 },
  { mes: 'Sep', norte: 1150, sur: 870 },
  { mes: 'Oct', norte: 1284, sur: 846 },
];

export default function CartesianChartStacked() {
  return (
    <BarChart
      data={DATA}
      index="mes"
      series={{ norte: 'Norte', sur: 'Sur' }}
      stacked
      showPercent
      valueFormatter={(value) => formatCurrency(value)}
      animate={false}
      className="h-64 w-full [--chart-surface:var(--background)]"
    />
  );
}
