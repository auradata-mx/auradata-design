import type { Meta, StoryObj } from '@storybook/react-vite'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { expect, fn, spyOn, userEvent, waitFor, within } from 'storybook/test'

import { ChartCard } from '@/components/blocks/chart-card'
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { chartConfig } from '@/lib/chart-palette'
import { formatCompact } from '@/lib/format'

const DATA = [
  { mes: 'Jul', norte: 1180, centro: 1920, sur: 790 },
  { mes: 'Ago', norte: 1210, centro: 1980, sur: 820 },
  { mes: 'Sep', norte: 1150, centro: 2010, sur: 870 },
  { mes: 'Oct', norte: 1284, centro: 2031, sur: 846 },
]
const config = chartConfig({ norte: 'Norte', centro: 'Centro', sur: 'Sur' })
const COLUMNS = [
  { key: 'mes', label: 'Mes' },
  { key: 'norte', label: 'Norte' },
  { key: 'centro', label: 'Centro' },
  { key: 'sur', label: 'Sur' },
]

function SalesChart() {
  return (
    <ChartContainer config={config}>
      <BarChart data={DATA} accessibilityLayer>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="mes" tickLine={false} axisLine={false} />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={40}
          ticks={[0, 500, 1000, 1500, 2000, 2500]}
          domain={[0, 2500]}
          tickFormatter={(value: number) => formatCompact(value)}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} itemSorter={null} />
        {Object.keys(config).map((key) => (
          <Bar key={key} dataKey={key} fill={`var(--color-${key})`} radius={4} maxBarSize={24} isAnimationActive={false} />
        ))}
      </BarChart>
    </ChartContainer>
  )
}

const PERIOD = (
  <ToggleGroup defaultValue={['4m']} variant="outline" size="sm" aria-label="Periodo">
    <ToggleGroupItem value="4m">4 meses</ToggleGroupItem>
    <ToggleGroupItem value="12m">12 meses</ToggleGroupItem>
  </ToggleGroup>
)

const meta = {
  title: 'Blocks/Parts/Chart card',
  component: ChartCard,
  args: {
    title: 'Ventas por región',
    description: 'Miles de pesos, julio a octubre',
    filter: PERIOD,
    data: DATA,
    columns: COLUMNS,
    children: <SalesChart />,
    className: 'w-full max-w-xl',
  },
} satisfies Meta<typeof ChartCard>

export default meta
type Story = StoryObj<typeof meta>

/** Title, description, the filter of this chart, its menu and the chart. Below 28rem the filter drops under the title. */
export const Default: Story = { tags: ['mobile'] }

/** The menu: «Exportar PNG» and «Ver datos». */
export const MenuOpen: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Opciones de la gráfica' }))
    const body = within(canvasElement.ownerDocument.body)
    // The menu fades in: wait for it.
    await waitFor(() => expect(body.getByRole('menuitem', { name: 'Exportar PNG' })).toBeVisible())
    await expect(body.getByRole('menuitem', { name: 'Ver datos' })).toBeVisible()
  },
}

/** «Ver datos» opens the numbers as a table, in es-MX: what a reader without the chart (or a screen reader) needs. */
export const ViewData: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Opciones de la gráfica' }))
    const body = within(canvasElement.ownerDocument.body)
    await userEvent.click(await body.findByRole('menuitem', { name: 'Ver datos' }))
    const dialog = await body.findByRole('dialog', { name: 'Ventas por región' })
    // The dialog fades in: wait for it.
    await waitFor(() => expect(dialog).toBeVisible())
    const table = within(dialog).getByRole('table')
    await expect(within(table).getAllByRole('columnheader').map((cell) => cell.textContent)).toEqual([
      'Mes',
      'Norte',
      'Centro',
      'Sur',
    ])
    await expect(within(table).getAllByRole('row')).toHaveLength(5)
    await expect(within(table).getByRole('cell', { name: '2,031' })).toBeVisible()
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(body.queryByRole('dialog')).toBeNull())
    // Focus went back to the menu button, as it should; blur it for a calm screenshot.
    ;(canvasElement.ownerDocument.activeElement as HTMLElement | null)?.blur()
  },
}

/** «Ver datos» open: the table in a dialog, numbers right-aligned in tabular figures. */
export const DataOpen: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Opciones de la gráfica' }))
    const body = within(canvasElement.ownerDocument.body)
    await userEvent.click(await body.findByRole('menuitem', { name: 'Ver datos' }))
    const dialog = await body.findByRole('dialog', { name: 'Ventas por región' })
    await waitFor(() => expect(dialog).toBeVisible())
  },
}

/** «Exportar PNG» downloads the card (title, chart and legend) as a PNG named after the title. */
export const ExportPng: Story = {
  play: async ({ canvasElement }) => {
    const anchors: HTMLAnchorElement[] = []
    const click = spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) {
      anchors.push(this)
    })
    try {
      await userEvent.click(within(canvasElement).getByRole('button', { name: 'Opciones de la gráfica' }))
      const body = within(canvasElement.ownerDocument.body)
      await userEvent.click(await body.findByRole('menuitem', { name: 'Exportar PNG' }))
      await waitFor(() => expect(anchors).toHaveLength(1), { timeout: 5000 })
      await expect(anchors[0].download).toBe('ventas-por-region.png')
      const blob = await (await fetch(anchors[0].href)).blob()
      await expect(blob.type).toBe('image/png')
      // Title, chart and legend at twice the size: far more than an empty image.
      await expect(blob.size).toBeGreaterThan(10_000)
      // The menu closed after the choice.
      await waitFor(() => expect(body.queryByRole('menu')).toBeNull())
    } finally {
      click.mockRestore()
    }
  },
}

/** Loading: a skeleton as tall as the chart, `aria-busy`, and the menu items wait. */
export const Loading: Story = {
  args: { loading: true },
  play: async ({ canvasElement }) => {
    const card = canvasElement.querySelector('[data-slot="chart-card"]')
    await expect(card).toHaveAttribute('aria-busy', 'true')
    await expect(canvasElement.querySelector('[data-slot="chart-card-body"] [data-slot="skeleton"]')).not.toBeNull()
    await expect(canvasElement.querySelector('[data-slot="chart"]')).toBeNull()
  },
}

/** Refreshing: the last chart stays, dimmed, while new data loads: no jump, no flash. */
export const Refreshing: Story = {
  args: { refreshing: true },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('[data-slot="chart-card"]')).toHaveAttribute('aria-busy', 'true')
    await expect(canvasElement.querySelector('[data-slot="chart"]')).not.toBeNull()
  },
}

/** No data for the period: the shadcn empty state, as tall as the chart. */
export const Empty: Story = {
  args: { empty: true, data: [] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Sin datos para este periodo')).toBeVisible()
    await expect(canvasElement.querySelector('[data-slot="chart"]')).toBeNull()
  },
}

/** It failed: the error state with «Reintentar» and the technical detail. */
export const Error: Story = {
  args: { error: 'GET /api/v1/chart/42/data → 504 Gateway Timeout', onRetry: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('alert')).toHaveTextContent('No pudimos cargar la gráfica')
    await userEvent.click(canvas.getByRole('button', { name: 'Reintentar' }))
    await expect(args.onRetry).toHaveBeenCalledOnce()
    canvas.getByRole('button', { name: 'Reintentar' }).blur()
  },
}
