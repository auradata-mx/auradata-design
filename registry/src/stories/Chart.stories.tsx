import type { Meta, StoryObj } from '@storybook/react-vite'
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  useChartSeries,
} from '@/components/ui/chart'
import { CHART_COLORS, chartConfig } from '@/lib/chart-palette'
import { formatCompact, formatCurrency } from '@/lib/format'

const DATA = [
  { month: 'Jul', norte: 1180, centro: 1920, sur: 790 },
  { month: 'Ago', norte: 1210, centro: 1980, sur: 820 },
  { month: 'Sep', norte: 1150, centro: 2010, sur: 870 },
  { month: 'Oct', norte: 1284, centro: 2031, sur: 846 },
]

const config = chartConfig({ norte: 'Norte', centro: 'Centro', sur: 'Sur' })

/** The same months a year before, for the comparison in the tooltip. */
const WITH_PREVIOUS = DATA.map((row, index) => ({
  ...row,
  norteAnterior: [1100, 1150, 1120, 1210][index],
  centroAnterior: [1900, 1990, 1950, 2060][index],
  surAnterior: [700, 760, 800, 812][index],
}))

function LegendLines() {
  const series = useChartSeries()
  return (
    <ChartContainer config={config} className="h-64 w-full max-w-xl">
      <LineChart data={DATA} accessibilityLayer margin={{ left: 4, right: 12 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={40}
          ticks={[0, 500, 1000, 1500, 2000, 2500]}
          domain={[0, 2500]}
          tickFormatter={(value: number) => formatCompact(value)}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent hiddenSeries={series.hidden} onSeriesToggle={series.toggle} />} itemSorter={null} />
        {Object.keys(config).map((key) => (
          <Line
            key={key}
            dataKey={key}
            stroke={`var(--color-${key})`}
            strokeWidth={2}
            dot={false}
            hide={series.isHidden(key)}
            isAnimationActive={false}
          />
        ))}
      </LineChart>
    </ChartContainer>
  )
}

const meta = {
  title: 'Gráficas/Chart',
  id: 'auradata-chart',
  component: ChartContainer,
  args: { config, children: <></> },
} satisfies Meta<typeof ChartContainer>

export default meta
type Story = StoryObj<typeof meta>

/** Series take the brand palette in order: no chart writes a color. The axis labels take the theme's muted text. */
export const Bars: Story = {
  render: (args) => (
    <ChartContainer {...args} className="h-64 w-full max-w-xl">
      <BarChart data={DATA} accessibilityLayer>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={40}
          ticks={[0, 500, 1000, 1500, 2000, 2500]}
          domain={[0, 2500]}
          tickFormatter={(value: number) => formatCompact(value)}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        {/* Keep the series order: Recharts sorts the legend by name otherwise. */}
        <ChartLegend content={<ChartLegendContent />} itemSorter={null} />
        {Object.keys(config).map((key) => (
          <Bar key={key} dataKey={key} fill={`var(--color-${key})`} radius={4} isAnimationActive={false} />
        ))}
      </BarChart>
    </ChartContainer>
  ),
  play: async ({ canvasElement }) => {
    await waitFor(() => expect(canvasElement.querySelectorAll('.recharts-cartesian-axis-tick-value').length).toBeGreaterThan(4))
    // Both themes: Recharts' own #666 is close to the light muted text, and only 3.3:1 on the dark card.
    const root = document.documentElement
    const wasDark = root.classList.contains('dark')
    for (const dark of [false, true]) {
      root.classList.toggle('dark', dark)
      const muted = document.createElement('span')
      muted.style.color = 'var(--color-muted-foreground)'
      canvasElement.append(muted)
      const expected = getComputedStyle(muted).color
      muted.remove()
      for (const label of canvasElement.querySelectorAll('.recharts-cartesian-axis-tick-value')) {
        await expect(getComputedStyle(label).fill).toBe(expected)
      }
    }
    root.classList.toggle('dark', wasDark)
  },
}

/** The legend hides and shows a series: each name is a button, pressed while its series shows. Hidden, it keeps its color. */
export const InteractiveLegend: Story = {
  render: () => <LegendLines />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const norte = await canvas.findByRole('button', { name: 'Norte' })
    await waitFor(() => expect(canvasElement.querySelectorAll('.recharts-line-curve')).toHaveLength(3))
    await expect(norte).toHaveAttribute('aria-pressed', 'true')

    await userEvent.click(norte)
    await expect(norte).toHaveAttribute('aria-pressed', 'false')
    await waitFor(() => expect(canvasElement.querySelectorAll('.recharts-line-curve')).toHaveLength(2))

    // The keyboard too: Space on the focused name brings the series back.
    await userEvent.keyboard(' ')
    await expect(norte).toHaveAttribute('aria-pressed', 'true')
    await waitFor(() => expect(canvasElement.querySelectorAll('.recharts-line-curve')).toHaveLength(3))

    // Hide Sur for the screenshot: its name stays, dimmed, with its color.
    const sur = canvas.getByRole('button', { name: 'Sur' })
    await userEvent.click(sur)
    await expect(sur).toHaveAttribute('aria-pressed', 'false')
    sur.blur()
  },
}

/**
 * The richer tooltip: the value in pesos (`valueFormatter`), its share of the month (`showPercent`) and the change
 * against the same month a year before (`previousKey`), with the arrow of the KPI card.
 */
export const RichTooltip: Story = {
  render: () => (
    <ChartContainer config={config} className="h-72 w-full max-w-xl">
      <BarChart data={WITH_PREVIOUS} accessibilityLayer>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={40}
          ticks={[0, 500, 1000, 1500, 2000, 2500]}
          domain={[0, 2500]}
          tickFormatter={(value: number) => formatCompact(value)}
        />
        <ChartTooltip
          defaultIndex={3}
          content={
            <ChartTooltipContent
              valueFormatter={(value) => formatCurrency(value * 1000)}
              showPercent
              previousKey={(key) => `${key}Anterior`}
              comparison="vs. 2025"
            />
          }
        />
        {Object.keys(config).map((key) => (
          <Bar key={key} dataKey={key} fill={`var(--color-${key})`} radius={4} maxBarSize={24} isAnimationActive={false} />
        ))}
      </BarChart>
    </ChartContainer>
  ),
  play: async ({ canvasElement }) => {
    const tooltip = await waitFor(() => {
      const element = canvasElement.querySelector<HTMLElement>('[data-slot="chart-tooltip"]')
      if (!element) throw new Error('no tooltip yet')
      return element
    })
    const rows = within(tooltip)
    // Testing Library reads the no-break space before % as a plain one.
    // October: Norte $1,284,000 of $4,161,000 is 30.9 %; a year before it sold $1,210,000, so +6.1 %.
    await expect(rows.getByText('$1,284,000')).toBeVisible()
    await expect(rows.getByText('30.9 %')).toBeVisible()
    await expect(rows.getByText('+6.1 %')).toBeVisible()
    await expect(rows.getAllByText('vs. 2025')).toHaveLength(3)
    // Centro sold less than in October 2025 (2,031 against 2,060): a fall, the bad tone, with the true minus.
    const centro = rows.getByText('−1.4 %').closest('[data-slot="delta"]')
    await expect(centro).toHaveAttribute('data-tone', 'bad')
  },
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
