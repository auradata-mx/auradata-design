'use client';

import { DonutChart } from '@/components/ui/donut-chart';
import { formatCompact, formatCurrency } from '@/lib/format';

const DATA = [
  { canal: 'Distribuidores', ventas: 1840000 },
  { canal: 'Tienda en línea', ventas: 1210000 },
  { canal: 'Ventas directas', ventas: 760000 },
];

export default function DonutChartPie() {
  return (
    <DonutChart
      data={DATA}
      index="canal"
      value="ventas"
      variant="pie"
      valueFormatter={(value) => formatCurrency(value)}
      centerFormatter={(value) => formatCompact(value, { currency: 'MXN' })}
      animate={false}
      className="h-72 w-full max-w-md [--chart-surface:var(--background)]"
    />
  );
}
