'use client';

import { LineChart } from '@/components/ui/cartesian-chart';
import { formatCurrency } from '@/lib/format';

const DATA = [
  { mes: 'Ago', ventas: 3890000, ventasAnterior: 3600000 },
  { mes: 'Sep', ventas: 4030000, ventasAnterior: 3770000 },
  { mes: 'Oct', ventas: 4161000, ventasAnterior: 3920000 },
];

export default function CartesianChartPrevious() {
  return (
    <LineChart
      data={DATA}
      index="mes"
      series={{ ventas: 'Ventas' }}
      previousKey={(key) => `${key}Anterior`}
      comparison="vs. 2025"
      startAtZero={false}
      valueFormatter={(value) => formatCurrency(value)}
      animate={false}
      className="h-64 w-full [--chart-surface:var(--background)]"
    />
  );
}
