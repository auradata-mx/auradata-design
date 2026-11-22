import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import { RangeFilter } from '@/components/ui/range-filter'
import { formatCurrency } from '@/lib/format'

const meta = {
  title: 'AuraData/Range filter',
  component: RangeFilter,
  args: {
    title: 'Ventas',
    min: 0,
    max: 500000,
    step: 1000,
    format: (value: number) => formatCurrency(value),
    onValueChange: fn(),
  },
} satisfies Meta<typeof RangeFilter>

export default meta
type Story = StoryObj<typeof meta>

/** No range yet: a dashed button with the field's name. */
export const Default: Story = {}

/** A range chosen: the button writes it with the field's format. */
export const Chosen: Story = { args: { defaultValue: [10000, 250000] } }

/** Open: a two-thumb slider over the field's whole span, and the two ends as numbers. */
export const Open: Story = {
  tags: ['mobile'],
  args: { defaultOpen: true, defaultValue: [10000, 250000] },
}

/** Typing an end applies it on Enter or when the field loses focus; «Limpiar» drops the range. */
export const Typing: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const page = within(document.body)
    await userEvent.click(canvas.getByRole('button', { name: 'Ventas' }))
    const dialog = await page.findByRole('dialog', { name: 'Ventas' })
    const min = within(dialog).getByRole('spinbutton', { name: 'Mínimo' })
    await userEvent.clear(min)
    await userEvent.type(min, '20000{Enter}')
    await expect(args.onValueChange).toHaveBeenLastCalledWith([20000, 500000])
    const max = within(dialog).getByRole('spinbutton', { name: 'Máximo' })
    await userEvent.clear(max)
    await userEvent.type(max, '900000')
    await userEvent.tab()
    // An end past the span is held at it.
    await expect(args.onValueChange).toHaveBeenLastCalledWith([20000, 500000])
    await userEvent.clear(max)
    await userEvent.type(max, '120000{Enter}')
    await expect(args.onValueChange).toHaveBeenLastCalledWith([20000, 120000])
    await expect(within(dialog).getAllByRole('slider')[1]).toHaveAttribute('aria-valuenow', '120000')
    await userEvent.click(within(dialog).getByRole('button', { name: 'Limpiar' }))
    await expect(args.onValueChange).toHaveBeenLastCalledWith(undefined)
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(page.queryByRole('dialog')).toBeNull())
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}
