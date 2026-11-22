import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { CalendarHeatmap, Heatmap } from '@/components/ui/heatmap'
import { formatPercent } from '@/lib/format'

const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
const HOURS = ['8:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00']
/** Queries to the dashboards by weekday and hour. */
const QUERIES = [
  [42, 96, 118, 87, 104, 61, 18],
  [48, 102, 128, 91, 110, 66, 20],
  [45, 99, 121, 89, 107, 63, 22],
  [44, 97, 119, 93, 112, 70, 25],
  [38, 84, 101, 76, 81, 40, 12],
  [6, 14, 20, 15, 9, 5, null],
  [3, 8, 11, 9, 7, 4, 2],
]

const meta = {
  title: 'AuraData/Heatmap',
  component: Heatmap,
  args: { rows: DAYS, columns: HOURS, values: QUERIES, caption: 'Consultas por día y hora' },
} satisfies Meta<typeof Heatmap>

export default meta
type Story = StoryObj<typeof meta>

/**
 * How much, across two dimensions: the sequential palette from near zero to the most, each value written in its
 * cell with a label color that reads AA on it. A cell without data is a dash, not a zero.
 */
export const Sequential: Story = {
  tags: ['mobile'],
  play: async ({ canvasElement }) => {
    const table = within(canvasElement).getByRole('table', { name: 'Consultas por día y hora' })
    await expect(within(table).getAllByRole('columnheader')).toHaveLength(7)
    await expect(within(table).getAllByRole('rowheader').map((cell) => cell.textContent)).toEqual(DAYS)
    const most = within(table).getByRole('cell', { name: '128' })
    await expect(most.style.backgroundColor).toBe('var(--sequential-9)')
    await expect(most.style.color).toBe('var(--background)')
    const least = within(table).getByRole('cell', { name: '2' })
    await expect(least.style.backgroundColor).toBe('var(--sequential-1)')
    await expect(least.style.color).toBe('var(--foreground)')
    await expect(within(table).getByRole('cell', { name: 'Sin datos' })).toHaveTextContent('—')
    await expect(canvasElement.querySelector('[data-slot="heatmap-legend"]')).toHaveTextContent('0')
  },
}

const REGIONS = ['Norte', 'Centro', 'Sur', 'Occidente', 'Sureste']
const MONTHS = ['Jun', 'Jul', 'Ago', 'Sep', 'Oct']
/** Sales against the target, as a fraction: below in red, on target in gray, above in blue. */
const VS_TARGET = [
  [0.04, 0.08, 0.11, 0.06, 0.12],
  [-0.02, 0.01, 0.03, 0.05, 0.02],
  [-0.12, -0.08, -0.05, 0.0, 0.03],
  [0.15, 0.18, 0.22, 0.2, 0.24],
  [-0.2, -0.16, -0.11, -0.09, -0.04],
]
const change = (value: number) => formatPercent(value, { signDisplay: 'exceptZero' })
/** Text matchers read the no-break space before % as a plain one. */
const plain = (text: string) => text.replace(/\u00a0/g, ' ')

/** Which side of a center: the diverging palette, red below the target, neutral on it, blue above. */
export const Diverging: Story = {
  args: {
    rows: REGIONS,
    columns: MONTHS,
    values: VS_TARGET,
    scale: 'diverging',
    limit: 0.2,
    valueFormatter: change,
    caption: 'Ventas contra la meta, por región',
  },
  play: async ({ canvasElement }) => {
    const table = within(canvasElement).getByRole('table', { name: 'Ventas contra la meta, por región' })
    await expect(within(table).getByRole('cell', { name: change(0) }).style.backgroundColor).toBe('var(--diverging-5)')
    await expect(within(table).getByRole('cell', { name: change(-0.2) }).style.backgroundColor).toBe('var(--diverging-1)')
    await expect(within(table).getByRole('cell', { name: change(0.24) }).style.backgroundColor).toBe('var(--diverging-9)')
    const legend = canvasElement.querySelector('[data-slot="heatmap-legend"]')
    await expect(legend).toHaveTextContent(plain(change(-0.2)))
    await expect(legend).toHaveTextContent(plain(change(0.2)))
  },
}

/** A seeded day-by-day series, so the screenshot never changes: busier on weekdays, growing through the year. */
function dailyQueries() {
  let seed = 7
  const random = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646
  const days: { date: string; value: number }[] = []
  for (let day = new Date(2026, 0, 1); day <= new Date(2026, 10, 21); day.setDate(day.getDate() + 1)) {
    const weekend = day.getDay() === 0 || day.getDay() === 6
    const growth = 1 + day.getMonth() / 11
    const value = Math.round((weekend ? 8 : 40) * growth * (0.5 + random()))
    const date = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`
    days.push({ date, value })
  }
  return days
}
const DAILY = dailyQueries()

/**
 * A year day by day: weeks as columns, Monday on top, months above. Hover a day for its date and value; the whole
 * grid is one image with a summary, and on a phone it opens scrolled to the latest weeks.
 */
export const Calendar: StoryObj<typeof CalendarHeatmap> = {
  tags: ['mobile'],
  render: () => <CalendarHeatmap data={DAILY} label="Consultas por día en 2026" unit="consultas" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const image = canvas.getByRole('img', { name: /^Consultas por día en 2026/ })
    await expect(image.getAttribute('aria-label')).toMatch(/1 ene 2026 – 21 nov 2026/)
    await expect(canvasElement.querySelectorAll('[data-slot="calendar-heatmap-day"]')).toHaveLength(DAILY.length)
    const day = canvasElement.querySelector<HTMLElement>('[data-date="2026-11-03"]')!
    await userEvent.hover(day)
    const tooltip = await waitFor(() => {
      const element = canvasElement.querySelector<HTMLElement>('[data-slot="calendar-heatmap-tooltip"]')
      if (!element) throw new Error('no tooltip yet')
      return element
    })
    const value = DAILY.find((entry) => entry.date === '2026-11-03')!.value
    await expect(tooltip).toHaveTextContent(`${value} consultas`)
    await expect(tooltip).toHaveTextContent('mar 3 nov 2026')
    await userEvent.unhover(day)
    await waitFor(() => expect(canvasElement.querySelector('[data-slot="calendar-heatmap-tooltip"]')).toBeNull())
  },
}
