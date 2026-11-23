'use client';

import { CartesianGrid, XAxis, YAxis, Line, LineChart } from 'recharts';

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

export default function ChartInteractiveLegend() {
  const series = useChartSeries();

  return (
    <ChartContainer config={CONFIG} className="h-64 w-full">
      <LineChart data={DATA} accessibilityLayer aria-label="Consultas por región">
        <CartesianGrid vertical={false} />
        <XAxis dataKey="mes" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} width={48} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend
          content={<ChartLegendContent hiddenSeries={series.hidden} onSeriesToggle={series.toggle} />}
          itemSorter={null}
        />
        {Object.keys(CONFIG).map((key) => (
          <Line
            key={key}
            dataKey={key}
            stroke={`var(--color-${key})`}
            strokeWidth={2} dot={false}
            hide={series.isHidden(key)}
            isAnimationActive={false}
          />
        ))}
      </LineChart>
    </ChartContainer>
  );
}
