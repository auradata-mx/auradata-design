import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { DashboardGrid, DashboardGridItem, type DashboardSpan } from '@/components/ui/dashboard-grid'

const TILES: { span: DashboardSpan; name: string }[] = [
  { span: 'kpi', name: 'KPI' },
  { span: 'kpi', name: 'KPI' },
  { span: 'kpi', name: 'KPI' },
  { span: 'kpi', name: 'KPI' },
  { span: 'two-thirds', name: 'Gráfica principal' },
  { span: 'third', name: 'Gráfica' },
  { span: 'half', name: 'Gráfica' },
  { span: 'half', name: 'Gráfica' },
  { span: 'full', name: 'Tabla' },
]

function Tiles() {
  return (
    <DashboardGrid>
      {TILES.map((tile, index) => (
        <DashboardGridItem key={index} span={tile.span}>
          <div className="grid h-20 place-items-center rounded-xl border border-dashed text-xs text-muted-foreground">
            {tile.name} · {tile.span}
          </div>
        </DashboardGridItem>
      ))}
    </DashboardGrid>
  )
}

const meta = {
  title: 'AuraData/Dashboard grid',
  component: DashboardGrid,
} satisfies Meta<typeof DashboardGrid>

export default meta
type Story = StoryObj<typeof meta>

/**
 * The grid follows the space it gets, not the screen: one column below 36rem, six up to 48rem, twelve from there.
 * Beside a sidebar or in a narrow panel, it lays out for the room it has.
 */
export const Layout: Story = { tags: ['mobile'], render: () => <Tiles /> }

/** Rows per width, side by side: 360 px (one per row), 640 px (two KPIs per row), 880 px (four KPIs, then 2/3 + 1/3). */
export const Widths: Story = {
  render: () => (
    <div className="grid gap-8">
      {[360, 640, 880].map((width) => (
        <div key={width} data-width={width} style={{ width }} className="grid gap-2">
          <span className="text-xs text-muted-foreground">{width} px</span>
          <Tiles />
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    /** How many tiles share each row, top to bottom. */
    const rows = (width: number) => {
      const tiles = [...canvasElement.querySelectorAll<HTMLElement>(`[data-width="${width}"] [data-slot="dashboard-grid-item"]`)]
      const tops = new Map<number, number>()
      for (const tile of tiles) tops.set(tile.offsetTop, (tops.get(tile.offsetTop) ?? 0) + 1)
      return [...tops.values()]
    }
    await expect(rows(360)).toEqual([1, 1, 1, 1, 1, 1, 1, 1, 1])
    await expect(rows(640)).toEqual([2, 2, 1, 1, 1, 1, 1])
    await expect(rows(880)).toEqual([4, 2, 2, 1])
  },
}
