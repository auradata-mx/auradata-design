'use client';

import { CartesianGrid, XAxis, YAxis, Bar, BarChart } from 'recharts';

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  useChartSeries,
} from '@/components/ui/chart';
import { chartConfig } from '@/lib/chart-palette';

const DATA = [
  { mes: 'Ago', norte: 1210, sur: 820 },
  { mes: 'Sep', norte: 1150, sur: 870 },
  { mes: 'Oct', norte: 1284, sur: 846 },
];
const CONFIG = chartConfig({ norte: 'Norte', sur: 'Sur' });

export default function ChartDemo() {
  const series = useChartSeries();

  return (
    <ChartContainer config={CONFIG} className="h-64 w-full">
      <BarChart data={DATA} accessibilityLayer aria-label="Consultas por región">
        <CartesianGrid vertical={false} />
        <XAxis dataKey="mes" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} width={48} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend
          content={<ChartLegendContent hiddenSeries={series.hidden} onSeriesToggle={series.toggle} />}
          itemSorter={null}
        />
        {Object.keys(CONFIG).map((key) => (
          <Bar
            key={key}
            dataKey={key}
            fill={`var(--color-${key})`}
            radius={[4, 4, 0, 0]} maxBarSize={24}
            hide={series.isHidden(key)}
            isAnimationActive={false}
          />
        ))}
      </BarChart>
    </ChartContainer>
  );
}
