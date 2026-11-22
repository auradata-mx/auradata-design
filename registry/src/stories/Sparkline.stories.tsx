import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

import { Sparkline } from '@/components/ui/sparkline'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatCurrency, formatPercent } from '@/lib/format'

const UP = [3.2, 3.4, 3.3, 3.6, 3.8, 3.7, 3.9, 4.0, 4.16]
const DOWN = [52, 50, 51, 47, 46, 44, 45, 42, 41]

const meta = {
  title: 'AuraData/Sparkline',
  component: Sparkline,
  args: { values: UP },
} satisfies Meta<typeof Sparkline>

export default meta
type Story = StoryObj<typeof meta>

/** The shape of a trend in 96 × 32 px: no axes, no numbers. Next to the number it belongs to, never alone. */
export const Default: Story = {}

/** The tone says whether the change is good news: the color of the KPI arrow, never the only signal. */
export const Tones: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-6">
      {(
        [
          ['none', 'Sin comparación'],
          ['good', 'Buena noticia'],
          ['bad', 'Mala noticia'],
          ['flat', 'Sin cambio'],
        ] as const
      ).map(([tone, name]) => (
        <div key={tone} className="grid justify-items-center gap-1 text-xs text-muted-foreground">
          <Sparkline values={tone === 'bad' ? DOWN : UP} tone={tone} />
          {name}
        </div>
      ))}
    </div>
  ),
}

/** A wash under the line and a dot on the last value, for a sparkline that stands alone in a tile. */
export const AreaAndEnd: Story = {
  args: { area: true, showEnd: true, className: 'h-12 w-40' },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('[data-slot="sparkline-area"]')).not.toBeNull()
    await expect(canvasElement.querySelector('[data-slot="sparkline-end"]')).not.toBeNull()
    // Decoration by default: the number next to it carries the value.
    await expect(canvasElement.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  },
}

const ROWS = [
  { region: 'Norte', ventas: 1284000, cambio: 0.061, trend: [1.1, 1.15, 1.12, 1.21, 1.18, 1.28] },
  { region: 'Centro', ventas: 2031000, cambio: -0.014, trend: [2.06, 2.0, 1.98, 2.01, 2.04, 2.03] },
  { region: 'Sur', ventas: 846000, cambio: 0.042, trend: [0.79, 0.8, 0.82, 0.83, 0.87, 0.85] },
]

/**
 * In a table: one sparkline per row, with a label when it is the only place the trend is told. A labelled sparkline
 * is an image with its name; the default one is decoration.
 */
export const InTable: Story = {
  tags: ['mobile'],
  render: () => (
    <Table className="max-w-xl">
      <TableHeader>
        <TableRow>
          <TableHead>Región</TableHead>
          <TableHead className="text-right">Ventas</TableHead>
          <TableHead className="text-right">Cambio</TableHead>
          <TableHead>Últimos 6 meses</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ROWS.map((row) => (
          <TableRow key={row.region}>
            <TableCell className="font-medium">{row.region}</TableCell>
            <TableCell className="text-right tabular-nums">{formatCurrency(row.ventas)}</TableCell>
            <TableCell className="text-right tabular-nums">{formatPercent(row.cambio, { signDisplay: 'exceptZero' })}</TableCell>
            <TableCell>
              <Sparkline
                values={row.trend}
                tone={row.cambio > 0 ? 'good' : 'bad'}
                label={`Ventas de ${row.region}, últimos 6 meses: ${row.cambio > 0 ? 'al alza' : 'a la baja'}`}
                className="h-6 w-20"
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
  play: async ({ canvasElement }) => {
    const images = within(canvasElement).getAllByRole('img')
    await expect(images).toHaveLength(3)
    await expect(images[1]).toHaveAccessibleName('Ventas de Centro, últimos 6 meses: a la baja')
  },
}
