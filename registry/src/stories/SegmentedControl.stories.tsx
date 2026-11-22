import type { Meta, StoryObj } from '@storybook/react-vite'
import { ChartColumnIcon, TableIcon } from 'lucide-react'
import { expect, fn, userEvent, within } from 'storybook/test'

import { SegmentedControl, SegmentedControlItem } from '@/components/ui/segmented-control'

const meta = {
  title: 'AuraData/Segmented control',
  component: SegmentedControl,
  args: { defaultValue: 'table', 'aria-label': 'Vista', onValueChange: fn() },
  render: (args) => (
    <SegmentedControl {...args}>
      <SegmentedControlItem value="table">
        <TableIcon aria-hidden />
        Tabla
      </SegmentedControlItem>
      <SegmentedControlItem value="chart">
        <ChartColumnIcon aria-hidden />
        Gráfica
      </SegmentedControlItem>
    </SegmentedControl>
  ),
} satisfies Meta<typeof SegmentedControl>

export default meta
type Story = StoryObj<typeof meta>

/** One choice among a few views: a radio group, so arrows move the choice and Tab leaves it. */
export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('radiogroup', { name: 'Vista' })).toBeVisible()
    await expect(canvas.getByRole('radio', { name: 'Tabla' })).toHaveAttribute('aria-checked', 'true')
    await userEvent.click(canvas.getByRole('radio', { name: 'Gráfica' }))
    await expect(args.onValueChange).toHaveBeenLastCalledWith('chart', expect.anything())
    await expect(canvas.getByRole('radio', { name: 'Gráfica' })).toHaveAttribute('aria-checked', 'true')
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}

/** From the keyboard: Tab lands on the chosen view, ArrowRight chooses the next one. */
export const Keyboard: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.tab()
    await expect(document.activeElement).toBe(canvas.getByRole('radio', { name: 'Tabla' }))
    await userEvent.keyboard('{ArrowRight}')
    await expect(canvas.getByRole('radio', { name: 'Gráfica' })).toHaveAttribute('aria-checked', 'true')
    await expect(args.onValueChange).toHaveBeenLastCalledWith('chart', expect.anything())
  },
}

/** Three views in the small size, as in a card's header. */
export const Small: Story = {
  render: (args) => (
    <SegmentedControl {...args} size="sm" defaultValue="month">
      <SegmentedControlItem value="week">Semana</SegmentedControlItem>
      <SegmentedControlItem value="month">Mes</SegmentedControlItem>
      <SegmentedControlItem value="year">Año</SegmentedControlItem>
    </SegmentedControl>
  ),
  args: { 'aria-label': 'Periodo' },
}

/** Icons alone carry their name in `aria-label`; a view that is not ready yet is disabled. */
export const IconsAndDisabled: Story = {
  render: (args) => (
    <SegmentedControl {...args}>
      <SegmentedControlItem value="table" aria-label="Tabla">
        <TableIcon aria-hidden />
      </SegmentedControlItem>
      <SegmentedControlItem value="chart" aria-label="Gráfica">
        <ChartColumnIcon aria-hidden />
      </SegmentedControlItem>
      <SegmentedControlItem value="map" disabled>
        Mapa
      </SegmentedControlItem>
    </SegmentedControl>
  ),
}
