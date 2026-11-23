'use client';

import { BarChart, LineChart } from '@/components/ui/cartesian-chart'
import { DonutChart } from '@/components/ui/donut-chart'
import { Gauge } from '@/components/ui/gauge'
import { formatCompact, formatCurrency } from '@/lib/format'

const SALES = [
  { month: 'Jul', norte: 1180, centro: 1920, sur: 790 },
  { month: 'Ago', norte: 1210, centro: 1980, sur: 820 },
  { month: 'Sep', norte: 1150, centro: 2010, sur: 870 },
  { month: 'Oct', norte: 1284, centro: 2031, sur: 846 },
]

const MONTHLY = [
  { mes: 'Jun', ventas: 3820000, ventasAnterior: 3510000 },
  { mes: 'Jul', ventas: 3890000, ventasAnterior: 3600000 },
  { mes: 'Ago', ventas: 4010000, ventasAnterior: 3640000 },
  { mes: 'Sep', ventas: 4030000, ventasAnterior: 3770000 },
  { mes: 'Oct', ventas: 4161000, ventasAnterior: 3920000 },
]

const CHANNELS = [
  { canal: 'Distribuidores', ventas: 1840000 },
  { canal: 'Tienda en línea', ventas: 1210000 },
  { canal: 'Ventas directas', ventas: 760000 },
  { canal: 'Marketplaces', ventas: 351000 },
]

export function ChartExamples() {
  return (
    <div className="not-prose my-6 grid gap-8 md:grid-cols-2">
      <figure className="grid gap-2">
        <LineChart
          data={MONTHLY}
          index="mes"
          series={{ ventas: 'Ventas' }}
          previousKey={(key) => `${key}Anterior`}
          comparison="vs. 2025"
          startAtZero={false}
          valueFormatter={(value) => formatCurrency(value)}
          axisFormatter={(value) => formatCompact(value, { currency: 'MXN' })}
          animate={false}
          className="h-56 [--chart-surface:var(--background)]"
        />
        <figcaption className="text-xs text-muted-foreground">Líneas: 2026 contra 2025, punteado.</figcaption>
      </figure>
      <figure className="grid gap-2">
        <BarChart
          data={SALES}
          index="month"
          series={{ norte: 'Norte', centro: 'Centro', sur: 'Sur' }}
          stacked
          animate={false}
          className="h-56 [--chart-surface:var(--background)]"
        />
        <figcaption className="text-xs text-muted-foreground">Barras apiladas: el total y sus partes.</figcaption>
      </figure>
      <figure className="grid gap-2">
        <DonutChart
          data={CHANNELS}
          index="canal"
          value="ventas"
          valueFormatter={(value) => formatCurrency(value)}
          centerFormatter={(value) => formatCompact(value, { currency: 'MXN' })}
          animate={false}
          className="h-56 [--chart-surface:var(--background)]"
        />
        <figcaption className="text-xs text-muted-foreground">Dona: cuatro canales y el total al centro.</figcaption>
      </figure>
      <figure className="grid content-start justify-items-center gap-2">
        <Gauge value={0.72} label="Meta del trimestre" />
        <figcaption className="text-xs text-muted-foreground">Gauge: una sola cifra contra su total.</figcaption>
      </figure>
    </div>
  );
}
