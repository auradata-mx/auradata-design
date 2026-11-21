import type { Meta, StoryObj } from '@storybook/react-vite'
import { ChevronsUpDownIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

const meta = {
  title: 'Components/Collapsible',
  component: Collapsible,
} satisfies Meta<typeof Collapsible>

export default meta
type Story = StoryObj<typeof meta>

const FILTERS = ['Región: Bajío', 'Periodo: Este trimestre', 'Canal: En línea']

/** The active filters of a report: the first shows, the rest fold away. */
export const Default: Story = {
  render: (args) => (
    <Collapsible className="grid max-w-sm gap-2" {...args}>
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-sm font-medium">3 filtros activos</h3>
        <CollapsibleTrigger render={<Button variant="ghost" size="icon-sm" aria-label="Ver todos los filtros" />}>
          <ChevronsUpDownIcon aria-hidden />
        </CollapsibleTrigger>
      </div>
      <div className="rounded-md border px-3 py-2 text-sm">{FILTERS[0]}</div>
      <CollapsibleContent className="grid gap-2">
        {FILTERS.slice(1).map((filter) => (
          <div key={filter} className="rounded-md border px-3 py-2 text-sm">
            {filter}
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  ),
}

export const Open: Story = { ...Default, args: { ...Default.args, defaultOpen: true } }
