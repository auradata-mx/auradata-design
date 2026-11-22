import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { AreaChart, BarChart, ComboChart, LineChart } from '@/components/ui/cartesian-chart'
import { formatCompact, formatCurrency } from '@/lib/format'

/** Sales by region in 2026, thousands of pesos. */
const MONTHS = [
  { mes: 'Ene', norte: 980, centro: 1710, sur: 640, norteAnterior: 900 },
  { mes: 'Feb', norte: 1020, centro: 1760, sur: 655, norteAnterior: 930 },
  { mes: 'Mar', norte: 1105, centro: 1840, sur: 700, norteAnterior: 1010 },
  { mes: 'Abr', norte: 1060, centro: 1805, sur: 720, norteAnterior: 1040 },
  { mes: 'May', norte: 1130, centro: 1880, sur: 745, norteAnterior: 1075 },
  { mes: 'Jun', norte: 1160, centro: 1900, sur: 760, norteAnterior: 1120 },
  { mes: 'Jul', norte: 1180, centro: 1920, sur: 790, norteAnterior: 1150 },
  { mes: 'Ago', norte: 1210, centro: 1980, sur: 820, norteAnterior: 1165 },
  { mes: 'Sep', norte: 1150, centro: 2010, sur: 870, norteAnterior: 1190 },
  { mes: 'Oct', norte: 1284, centro: 2031, sur: 846, norteAnterior: 1210 },
]
const REGIONS = { norte: 'Norte', centro: 'Centro', sur: 'Sur' }
const pesos = (value: number) => formatCurrency(value * 1000)
const pesosShort = (value: number) => formatCompact(value * 1000, { currency: 'MXN' })

const meta = {
  title: 'AuraData/Charts',
  component: LineChart,
  args: {
    data: MONTHS,
    index: 'mes',
    series: REGIONS,
    animate: false,
    // These charts sit on the page, not in a card: the gaps and rings take the page color.
    className: 'h-72 w-full max-w-2xl [--chart-surface:var(--background)]',
  },
} satisfies Meta<typeof LineChart>

export default meta
type Story = StoryObj<typeof meta>

/** How it changes over time: 2 px lines in the palette order, the legend hides and shows each region. */
export const Line: Story = {
  tags: ['mobile'],
  args: { valueFormatter: pesos, axisFormatter: pesosShort },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await waitFor(() => expect(canvasElement.querySelectorAll('.recharts-line-curve')).toHaveLength(3))
    // Round ticks from zero, written short in pesos.
    const ticks = () =>
      [...canvasElement.querySelectorAll('.recharts-yAxis-tick-labels .recharts-cartesian-axis-tick-value')].map((tick) => tick.textContent)
    await waitFor(() => expect(ticks()).toEqual([0, 500, 1000, 1500, 2000, 2500].map(pesosShort)))
    // Hiding Centro rescales the axis to what is left.
    await userEvent.click(canvas.getByRole('button', { name: 'Centro' }))
    await waitFor(() => expect(ticks()).toEqual([0, 500, 1000, 1500].map(pesosShort)))
    await userEvent.click(canvas.getByRole('button', { name: 'Centro' }))
    await waitFor(() => expect(canvasElement.querySelectorAll('.recharts-line-curve')).toHaveLength(3))
    canvas.getByRole('button', { name: 'Centro' }).blur()
  },
}

/**
 * One series against the previous period: the year before is a dashed line of the same color, and the tooltip
 * gives the change with its arrow. One series needs no legend: the title names it.
 */
export const LineWithPrevious: Story = {
  args: {
    series: { norte: 'Norte 2026' },
    previousKey: (key: string) => `${key}Anterior`,
    comparison: 'vs. 2025',
    valueFormatter: pesos,
    axisFormatter: pesosShort,
    tooltipIndex: 9,
  },
  play: async ({ canvasElement }) => {
    await waitFor(() => expect(canvasElement.querySelectorAll('.recharts-line-curve')).toHaveLength(2))
    await expect(canvasElement.querySelector('[data-slot="chart-legend"]')).toBeNull()
    const previous = canvasElement.querySelector('.series-norteAnterior .recharts-line-curve')
    await expect(previous).toHaveAttribute('stroke-dasharray', '4 4')
    const tooltip = await waitFor(() => {
      const element = canvasElement.querySelector<HTMLElement>('[data-slot="chart-tooltip"]')
      if (!element) throw new Error('no tooltip yet')
      return element
    })
    // October: $1,284,000 against $1,210,000 a year before.
    await expect(tooltip).toHaveTextContent('$1,284,000')
    await expect(within(tooltip).getByText('+6.1 %')).toBeVisible()
  },
}

/** Volume over time: one area with a light wash under its line. */
export const Area: Story = {
  render: (args) => <AreaChart {...args} />,
  args: { series: { centro: 'Centro' }, valueFormatter: pesos, axisFormatter: pesosShort },
}

/** How the total adds up over time: stacked areas, the first series at the bottom. */
export const AreaStacked: Story = {
  render: (args) => <AreaChart {...args} stacked />,
  args: { valueFormatter: pesos, axisFormatter: pesosShort, showPercent: true },
}

/** Compare regions month by month: grouped columns at most 24 px wide, 2 px apart. */
export const BarsGrouped: Story = {
  render: (args) => <BarChart {...args} data={MONTHS.slice(-4)} />,
  args: { valueFormatter: pesos, axisFormatter: pesosShort },
}

/**
 * The total and its parts: stacked columns with a 2 px surface gap between segments, only the top one rounded.
 * The tooltip gives each part's share of the month.
 */
export const BarsStacked: Story = {
  tags: ['mobile'],
  render: (args) => <BarChart {...args} stacked />,
  args: { valueFormatter: pesos, axisFormatter: pesosShort, showPercent: true },
  play: async ({ canvasElement }) => {
    await waitFor(() => expect(canvasElement.querySelectorAll('.recharts-bar-rectangle').length).toBe(30))
    const top = canvasElement.querySelector('.series-sur .recharts-bar-rectangle path')
    const bottom = canvasElement.querySelector('.series-norte .recharts-bar-rectangle path')
    // Rounded corners draw arcs ("A"); the square segments do not.
    await expect(top?.getAttribute('d')).toMatch(/A/)
    await expect(bottom?.getAttribute('d')).not.toMatch(/A/)
    // Hide Sur: Centro is now the top and takes the rounded end.
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Sur' }))
    await waitFor(() =>
      expect(canvasElement.querySelector('.series-centro .recharts-bar-rectangle path')?.getAttribute('d')).toMatch(/A/),
    )
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Sur' }))
    within(canvasElement).getByRole('button', { name: 'Sur' }).blur()
  },
}

const PRODUCTS = [
  { producto: 'Licencias Pro', ventas: 2140 },
  { producto: 'Soporte anual', ventas: 1320 },
  { producto: 'Implementación', ventas: 1105 },
  { producto: 'Capacitación', ventas: 640 },
  { producto: 'Licencias Equipo', ventas: 410 },
]

/** Which is bigger: horizontal bars, longest first, so long names read whole. */
export const BarsHorizontal: Story = {
  tags: ['mobile'],
  render: (args) => <BarChart {...args} horizontal />,
  args: {
    data: PRODUCTS,
    index: 'producto',
    series: { ventas: 'Ventas' },
    valueFormatter: pesos,
    axisFormatter: pesosShort,
    className: 'h-64 w-full max-w-2xl [--chart-surface:var(--background)]',
  },
  play: async ({ canvasElement }) => {
    await waitFor(() => expect(canvasElement.querySelectorAll('.recharts-bar-rectangle')).toHaveLength(5))
    const names = () =>
      [...canvasElement.querySelectorAll('.recharts-yAxis-tick-labels .recharts-cartesian-axis-tick-value')].map((tick) => tick.textContent)
    await waitFor(() => expect(names()).toEqual(PRODUCTS.map((row) => row.producto)))
  },
}

const TARGETS = MONTHS.slice(-6).map((row, index) => ({
  mes: row.mes,
  ventas: row.norte + row.centro + row.sur,
  meta: [3800, 3900, 3950, 4000, 4050, 4100][index],
}))

/**
 * Bars and a line of the same unit on one axis: the sales of each month against its target. Two measures of
 * different units never share a chart: two y axes make any crossing mean nothing.
 */
export const Combo: Story = {
  render: (args) => <ComboChart {...args} bars={{ ventas: 'Ventas' }} lines={{ meta: 'Meta' }} />,
  args: { data: TARGETS, series: {}, valueFormatter: pesos, axisFormatter: pesosShort },
  play: async ({ canvasElement }) => {
    await waitFor(() => expect(canvasElement.querySelectorAll('.recharts-bar-rectangle')).toHaveLength(6))
    await expect(canvasElement.querySelectorAll('.recharts-line-curve')).toHaveLength(1)
    await expect(canvasElement.querySelectorAll('.recharts-yAxis-tick-labels')).toHaveLength(1)
  },
}
