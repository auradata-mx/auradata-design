import type { Meta, StoryObj } from '@storybook/react-vite'

import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const ROWS = [
  { region: 'Norte', sales: 1_284_500, change: '+12 %' },
  { region: 'Centro', sales: 2_031_900, change: '+4 %' },
  { region: 'Sur', sales: 846_200, change: '−3 %' },
]

const money = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 })

const meta = {
  title: 'Components/Table',
  component: Table,
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Table {...args}>
      <TableCaption>Ventas por región, octubre de 2026</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Región</TableHead>
          <TableHead className="text-right">Ventas</TableHead>
          <TableHead className="text-right">Cambio</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ROWS.map((row) => (
          <TableRow key={row.region}>
            <TableCell>{row.region}</TableCell>
            <TableCell className="text-right font-mono">{money.format(row.sales)}</TableCell>
            <TableCell className="text-right font-mono">{row.change}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>Total</TableCell>
          <TableCell className="text-right font-mono">{money.format(ROWS.reduce((sum, row) => sum + row.sales, 0))}</TableCell>
          <TableCell />
        </TableRow>
      </TableFooter>
    </Table>
  ),
}
