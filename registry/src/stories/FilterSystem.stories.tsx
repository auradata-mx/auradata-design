import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import type { DateRange } from 'react-day-picker'

import { DateRangeFilter, presetRange } from '@/components/ui/date-range-filter'
import { FacetedFilter } from '@/components/ui/faceted-filter'
import { FilterChips, type FilterChip } from '@/components/ui/filter-chips'
import { KpiCard } from '@/components/ui/kpi-card'
import { RangeFilter, type NumberRange } from '@/components/ui/range-filter'
import { formatCompact, formatCurrency, formatDate, formatNumber } from '@/lib/format'

const TODAY = new Date(2026, 10, 21)

type Pedido = { region: string; canal: string; monto: number; fecha: Date }

const REGIONES = ['Norte', 'Centro', 'Bajío', 'Occidente', 'Sur']
const CANALES = ['Tienda', 'En línea', 'Mayoreo']
// 120 orders over the last 120 days, the same on every run.
const PEDIDOS: Pedido[] = Array.from({ length: 120 }, (_, index) => ({
  region: REGIONES[(index * 7) % REGIONES.length],
  canal: CANALES[(index * 5) % CANALES.length],
  monto: 2000 + ((index * 7919) % 48000),
  fecha: new Date(2026, 10, 21 - index),
}))

const countBy = (key: 'region' | 'canal', rows: Pedido[]) =>
  rows.reduce((counts, row) => counts.set(row[key], (counts.get(row[key]) ?? 0) + 1), new Map<string, number>())

/**
 * The filter system outside a table: a sales dashboard filters its KPIs with the period, the values of two fields,
 * an amount range and the chips. Each filter counts what the others leave.
 */
function Dashboard() {
  const [periodo, setPeriodo] = React.useState<DateRange | undefined>(presetRange('this-month', TODAY))
  const [regiones, setRegiones] = React.useState<string[]>([])
  const [canales, setCanales] = React.useState<string[]>([])
  const [monto, setMonto] = React.useState<NumberRange | undefined>()

  const inPeriod = (row: Pedido) => (!periodo?.from || row.fecha >= periodo.from) && (!periodo?.to || row.fecha <= periodo.to)
  const keep = (row: Pedido, skip?: 'region' | 'canal') =>
    inPeriod(row) &&
    (skip === 'region' || !regiones.length || regiones.includes(row.region)) &&
    (skip === 'canal' || !canales.length || canales.includes(row.canal)) &&
    (!monto || (row.monto >= monto[0] && row.monto <= monto[1]))
  const rows = PEDIDOS.filter((row) => keep(row))
  const regionCounts = countBy('region', PEDIDOS.filter((row) => keep(row, 'region')))
  const canalCounts = countBy('canal', PEDIDOS.filter((row) => keep(row, 'canal')))
  const total = rows.reduce((sum, row) => sum + row.monto, 0)

  const chips: FilterChip[] = [
    ...(periodo?.from ? [{ id: 'periodo', label: 'Periodo', value: `${formatDate(periodo.from)} – ${formatDate(periodo.to ?? periodo.from)}` }] : []),
    ...(regiones.length ? [{ id: 'region', label: 'Región', value: regiones.join(', ') }] : []),
    ...(canales.length ? [{ id: 'canal', label: 'Canal', value: canales.join(', ') }] : []),
    ...(monto ? [{ id: 'monto', label: 'Monto', value: `${formatCurrency(monto[0])} – ${formatCurrency(monto[1])}` }] : []),
  ]
  const remove = (id: string) =>
    ({ periodo: () => setPeriodo(undefined), region: () => setRegiones([]), canal: () => setCanales([]), monto: () => setMonto(undefined) })[
      id as 'periodo'
    ]()

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <DateRangeFilter today={TODAY} value={periodo ?? { from: undefined }} onValueChange={setPeriodo} />
        <FacetedFilter
          title="Región"
          options={REGIONES.map((value) => ({ value, count: regionCounts.get(value) ?? 0 }))}
          value={regiones}
          onValueChange={setRegiones}
        />
        <FacetedFilter
          title="Canal"
          options={CANALES.map((value) => ({ value, count: canalCounts.get(value) ?? 0 }))}
          value={canales}
          onValueChange={setCanales}
        />
        <RangeFilter
          title="Monto"
          min={0}
          max={50000}
          step={500}
          format={(value) => formatCurrency(value)}
          value={monto ?? null}
          onValueChange={setMonto}
        />
      </div>
      <FilterChips
        chips={chips}
        onRemove={remove}
        onClearAll={() => {
          setPeriodo(undefined)
          setRegiones([])
          setCanales([])
          setMonto(undefined)
        }}
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard label="Ventas" value={formatCompact(total, { currency: 'MXN' })} />
        <KpiCard label="Pedidos" value={formatNumber(rows.length)} />
        <KpiCard label="Ticket promedio" value={rows.length ? formatCurrency(total / rows.length) : null} />
      </div>
    </div>
  )
}

const meta = {
  title: 'AuraData/Filter system',
  component: Dashboard,
} satisfies Meta<typeof Dashboard>

export default meta
type Story = StoryObj<typeof meta>

/** This month's sales, every region and channel. On a phone the filters wrap and the KPIs stack. */
export const Overview: Story = { tags: ['mobile'] }

/** «Región: Norte» narrows the KPIs and «Canal» recounts among the north's orders; «Limpiar todo» undoes both. */
export const Filtering: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const page = within(document.body)
    const pedidos = () => canvas.getByText('Pedidos').closest('[data-slot="kpi-card"]')!
    await expect(pedidos()).toHaveTextContent('21')
    await userEvent.click(canvas.getByRole('button', { name: 'Región' }))
    let dialog = await page.findByRole('dialog', { name: 'Región' })
    await userEvent.click(within(dialog).getByRole('option', { name: /Norte/ }))
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(page.queryByRole('dialog')).toBeNull())
    await expect(pedidos()).toHaveTextContent('5')
    await userEvent.click(canvas.getByRole('button', { name: 'Canal' }))
    dialog = await page.findByRole('dialog', { name: 'Canal' })
    const counts = within(dialog)
      .getAllByRole('option')
      .map((option) => Number(option.textContent?.replace(/\D/g, '')))
    await expect(counts.reduce((a, b) => a + b, 0)).toBe(5)
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(page.queryByRole('dialog')).toBeNull())
    await userEvent.click(canvas.getByRole('button', { name: 'Limpiar todo' }))
    await expect(pedidos()).toHaveTextContent('120')
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}
