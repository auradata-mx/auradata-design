import type { Meta, StoryObj } from '@storybook/react-vite'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { CHART_COLORS, chartConfig } from '@/lib/chart-palette'

const DATA = [
  { month: 'Jul', norte: 1180, centro: 1920, sur: 790 },
  { month: 'Ago', norte: 1210, centro: 1980, sur: 820 },
  { month: 'Sep', norte: 1150, centro: 2010, sur: 870 },
  { month: 'Oct', norte: 1284, centro: 2031, sur: 846 },
]

const config = chartConfig({ norte: 'Norte', centro: 'Centro', sur: 'Sur' })

const meta = {
  title: 'AuraData/Chart',
  component: ChartContainer,
  args: { config, children: <></> },
} satisfies Meta<typeof ChartContainer>

export default meta
type Story = StoryObj<typeof meta>

/** Series take the brand palette in order: no chart writes a color. */
export const Bars: Story = {
  render: (args) => (
    <ChartContainer {...args} className="h-64 w-full max-w-xl">
      <BarChart data={DATA} accessibilityLayer>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        {Object.keys(config).map((key) => (
          <Bar key={key} dataKey={key} fill={`var(--color-${key})`} radius={4} />
        ))}
      </BarChart>
    </ChartContainer>
  ),
}

export const Palette: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      {CHART_COLORS.map((color, index) => (
        <div key={color} className="grid gap-1 text-xs">
          <div className="size-12 rounded-md" style={{ background: color }} />
          <span className="font-mono">--chart-{index + 1}</span>
        </div>
      ))}
    </div>
  ),
}
