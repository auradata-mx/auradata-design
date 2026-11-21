import type { Meta, StoryObj } from '@storybook/react-vite'
import { AreaChartIcon, ChartColumnIcon, ChartLineIcon } from 'lucide-react'

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

const meta = {
  title: 'Components/Toggle group',
  component: ToggleGroup,
  args: { defaultValue: ['barras'], 'aria-label': 'Tipo de gráfica' },
} satisfies Meta<typeof ToggleGroup>

export default meta
type Story = StoryObj<typeof meta>

/** The chart type: icon-only items, each with its accessible name. */
export const Default: Story = {
  render: (args) => (
    <ToggleGroup {...args}>
      <ToggleGroupItem value="barras" aria-label="Barras">
        <ChartColumnIcon aria-hidden />
      </ToggleGroupItem>
      <ToggleGroupItem value="lineas" aria-label="Líneas">
        <ChartLineIcon aria-hidden />
      </ToggleGroupItem>
      <ToggleGroupItem value="area" aria-label="Área">
        <AreaChartIcon aria-hidden />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
}

/** Outline items joined in one bar (`spacing={0}`), with text. */
export const Outline: Story = {
  args: { variant: 'outline', spacing: 0 },
  render: (args) => (
    <ToggleGroup {...args}>
      <ToggleGroupItem value="barras">
        <ChartColumnIcon aria-hidden /> Barras
      </ToggleGroupItem>
      <ToggleGroupItem value="lineas">
        <ChartLineIcon aria-hidden /> Líneas
      </ToggleGroupItem>
      <ToggleGroupItem value="area">
        <AreaChartIcon aria-hidden /> Área
      </ToggleGroupItem>
    </ToggleGroup>
  ),
}

/** Several at once: the regions shown on the chart. */
export const Multiple: Story = {
  args: { multiple: true, defaultValue: ['norte', 'bajio'], variant: 'outline', size: 'sm', 'aria-label': 'Regiones' },
  render: (args) => (
    <ToggleGroup {...args}>
      <ToggleGroupItem value="norte">Norte</ToggleGroupItem>
      <ToggleGroupItem value="bajio">Bajío</ToggleGroupItem>
      <ToggleGroupItem value="occidente">Occidente</ToggleGroupItem>
      <ToggleGroupItem value="sur">Sur</ToggleGroupItem>
    </ToggleGroup>
  ),
}

export const Disabled: Story = { ...Default, args: { ...Default.args, disabled: true } }
