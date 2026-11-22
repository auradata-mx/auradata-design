import type { Meta, StoryObj } from '@storybook/react-vite'
import { LayoutDashboardIcon } from 'lucide-react'
import { useState } from 'react'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import {
  MasterDetail,
  MasterDetailBack,
  MasterDetailItem,
  MasterDetailList,
  MasterDetailPane,
} from '@/components/ui/master-detail'

const REPORTS = [
  { id: 'ventas', name: 'Ventas 2026', owner: 'Ana López', updated: 'Hace 5 minutos', pages: 4 },
  { id: 'cobranza', name: 'Cobranza por región', owner: 'Luis Ortega', updated: 'Ayer', pages: 2 },
  { id: 'inventario', name: 'Inventario y rotación de producto en el Bajío y Occidente', owner: 'Marta Ruiz', updated: '18 nov 2026', pages: 6 },
  { id: 'clientes', name: 'Clientes activos', owner: 'Ana López', updated: '12 nov 2026', pages: 3 },
]

function Reports({ initial = null }: { initial?: string | null }) {
  const [selected, setSelected] = useState<string | null>(initial)
  const report = REPORTS.find((entry) => entry.id === selected)
  return (
    <MasterDetail showDetail={selected !== null} className="h-svh sm:h-[480px] sm:rounded-xl sm:border">
      <MasterDetailList aria-label="Informes">
        {REPORTS.map((entry) => (
          <MasterDetailItem key={entry.id} active={entry.id === selected} onClick={() => setSelected(entry.id)}>
            <span className="truncate font-medium">{entry.name}</span>
            <span className="text-xs text-muted-foreground">
              {entry.owner} · {entry.updated}
            </span>
          </MasterDetailItem>
        ))}
      </MasterDetailList>
      <MasterDetailPane aria-label={report ? report.name : 'Detalle'}>
        {report ? (
          <div className="grid gap-6 p-6">
            <MasterDetailBack onClick={() => setSelected(null)}>Informes</MasterDetailBack>
            <div className="grid gap-1">
              <h2 className="font-heading text-xl font-semibold text-balance">{report.name}</h2>
              <p className="text-sm text-muted-foreground">Actualizado: {report.updated}</p>
            </div>
            <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
              <dt className="text-muted-foreground">Propietario</dt>
              <dd>{report.owner}</dd>
              <dt className="text-muted-foreground">Páginas</dt>
              <dd>{report.pages}</dd>
            </dl>
          </div>
        ) : (
          <Empty className="h-full">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <LayoutDashboardIcon aria-hidden />
              </EmptyMedia>
              <EmptyTitle>Elige un informe</EmptyTitle>
              <EmptyDescription>Su detalle aparece aquí.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </MasterDetailPane>
    </MasterDetail>
  )
}

const meta = {
  title: 'AuraData/Master detail',
  component: Reports,
  parameters: { layout: 'fullscreen', themeFrame: { padded: false } },
} satisfies Meta<typeof Reports>

export default meta
type Story = StoryObj<typeof meta>

const ON_PHONE = { viewport: { value: 'mobile', isRotated: false } }

/** The list on the left, the chosen report on the right; the chosen row is `aria-current`. */
export const Default: Story = {
  args: { initial: 'ventas' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const list = canvas.getByRole('region', { name: 'Informes' })
    await userEvent.click(within(list).getByRole('button', { name: /Cobranza por región/ }))
    await expect(within(list).getByRole('button', { name: /Cobranza por región/ })).toHaveAttribute('aria-current', 'true')
    await expect(canvas.getByRole('heading', { name: 'Cobranza por región' })).toBeVisible()
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}

/** Nothing chosen yet: the detail says what to do. */
export const NothingSelected: Story = {}

/** On a phone, the list first; a report replaces it, and «Informes» goes back with the focus on that row. */
export const Phone: Story = {
  tags: ['mobile'],
  globals: ON_PHONE,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const row = canvas.getByRole('button', { name: /Cobranza por región/ })
    await userEvent.click(row)
    const pane = canvas.getByRole('region', { name: 'Cobranza por región' })
    await waitFor(() => expect(pane).toHaveFocus())
    // The list is out of the page (and of the accessibility tree) while the detail shows.
    await expect(canvas.queryByRole('region', { name: 'Informes' })).toBeNull()
    await userEvent.click(canvas.getByRole('button', { name: 'Informes' }))
    await expect(canvas.getByRole('region', { name: 'Informes' })).toBeVisible()
    await waitFor(() => expect(canvas.getByRole('button', { name: /Cobranza por región/ })).toHaveFocus())
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}

/** On a phone with a report open: only the detail, under its back button. */
export const PhoneDetail: Story = {
  tags: ['mobile'],
  globals: ON_PHONE,
  args: { initial: 'inventario' },
}
