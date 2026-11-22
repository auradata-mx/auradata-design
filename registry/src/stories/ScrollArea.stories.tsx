import type { Meta, StoryObj } from '@storybook/react-vite'

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

const DATASETS = Array.from({ length: 30 }, (_, index) => `Ventas sucursal ${String(index + 1).padStart(2, '0')}`)
const REGIONS = ['Norte', 'Noreste', 'Bajío', 'Occidente', 'Centro', 'Golfo', 'Sureste', 'Península', 'Pacífico']

const meta = {
  title: 'Components/Scroll area',
  component: ScrollArea,
} satisfies Meta<typeof ScrollArea>

export default meta
type Story = StoryObj<typeof meta>

/** A long list of datasets inside a fixed height. */
export const Default: Story = {
  render: (args) => (
    <ScrollArea className="h-64 w-56 rounded-lg border" {...args}>
      <div className="p-4">
        <h3 className="mb-3 text-sm font-medium">Datasets</h3>
        {DATASETS.map((dataset, index) => (
          <div key={dataset}>
            {index > 0 && <Separator className="my-2" />}
            <p className="text-sm">{dataset}</p>
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
}

/** Sideways: region cards wider than the box. */
export const Horizontal: Story = {
  render: () => (
    <ScrollArea className="w-full max-w-96 rounded-lg border whitespace-nowrap">
      <div className="flex w-max gap-3 p-4">
        {REGIONS.map((region) => (
          <div key={region} className="flex h-20 w-32 shrink-0 items-center justify-center rounded-md bg-muted text-sm">
            {region}
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  ),
}
