import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { DonutChart } from '@/components/ui/donut-chart'
import { formatCompact, formatCurrency } from '@/lib/format'

/** Sales by channel in October, thousands of pesos. */
const CHANNELS = [
  { canal: 'Distribuidores', ventas: 1840 },
  { canal: 'Tienda en línea', ventas: 1210 },
  { canal: 'Ventas directas', ventas: 760 },
  { canal: 'Marketplaces', ventas: 351 },
]
const pesos = (value: number) => formatCurrency(value * 1000)

const meta = {
  title: 'Gráficas/Donut chart',
  id: 'auradata-donut-chart',
  component: DonutChart,
  args: {
    data: CHANNELS,
    index: 'canal',
    value: 'ventas',
    valueFormatter: pesos,
    centerFormatter: (value: number) => formatCompact(value * 1000, { currency: 'MXN' }),
    animate: false,
    // On the page, not in a card: the gaps between parts take the page color.
    className: 'h-72 w-full max-w-md [--chart-surface:var(--background)]',
  },
} satisfies Meta<typeof DonutChart>

export default meta
type Story = StoryObj<typeof meta>

/** A whole and up to six parts: the total in the middle, the legend hides a part and the total follows. */
export const Default: Story = {
  tags: ['mobile'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const total = () => canvasElement.querySelector('[data-slot="donut-total"]')?.textContent
    await waitFor(() => expect(total()).toBe(formatCompact(4_161_000, { currency: 'MXN' })))
    await expect(canvas.getByText('Total')).toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: 'Distribuidores' }))
    await waitFor(() => expect(total()).toBe(formatCompact(2_321_000, { currency: 'MXN' })))
    await expect(canvas.getByRole('button', { name: 'Distribuidores' })).toHaveAttribute('aria-pressed', 'false')
    await userEvent.click(canvas.getByRole('button', { name: 'Distribuidores' }))
    await waitFor(() => expect(total()).toBe(formatCompact(4_161_000, { currency: 'MXN' })))
    canvas.getByRole('button', { name: 'Distribuidores' }).blur()
  },
}

/** The tooltip gives the value and its share of the whole. */
export const Tooltip: Story = {
  args: { tooltipIndex: 0 },
  play: async ({ canvasElement }) => {
    const tooltip = await waitFor(() => {
      const element = canvasElement.querySelector<HTMLElement>('[data-slot="chart-tooltip"]')
      if (!element) throw new Error('no tooltip yet')
      return element
    })
    await expect(tooltip).toHaveTextContent('Distribuidores')
    await expect(tooltip).toHaveTextContent('$1,840,000')
    // 1,840 of 4,161.
    await expect(within(tooltip).getByText('44.2 %')).toBeVisible()
  },
}

/** The pie: for two or three parts read at a glance. */
export const Pie: Story = {
  args: { variant: 'pie', data: CHANNELS.slice(0, 3) },
}

const STATES = [
  { estado: 'Ciudad de México', clientes: 412 },
  { estado: 'Nuevo León', clientes: 298 },
  { estado: 'Jalisco', clientes: 251 },
  { estado: 'Estado de México', clientes: 187 },
  { estado: 'Puebla', clientes: 96 },
  { estado: 'Querétaro', clientes: 81 },
  { estado: 'Yucatán', clientes: 44 },
  { estado: 'Sonora', clientes: 38 },
  { estado: 'Chihuahua', clientes: 27 },
]

/** Past six parts the smallest fold into «Otros», last: more slices than that cannot be told apart. */
export const ManyParts: Story = {
  args: {
    data: STATES,
    index: 'estado',
    value: 'clientes',
    valueFormatter: undefined,
    centerFormatter: undefined,
    centerLabel: 'Clientes',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const names = () => canvas.getAllByRole('button').map((button) => button.textContent)
    await waitFor(() =>
      expect(names()).toEqual(['Ciudad de México', 'Nuevo León', 'Jalisco', 'Estado de México', 'Puebla', 'Otros']),
    )
    await expect(canvasElement.querySelector('[data-slot="donut-total"]')).toHaveTextContent('1,434')
  },
}
