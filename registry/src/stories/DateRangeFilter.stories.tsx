import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import { DateRangeFilter, presetRange } from '@/components/ui/date-range-filter'

/** A fixed day, so the presets and the screenshots do not move with the calendar. */
const TODAY = new Date(2026, 10, 21)

const meta = {
  title: 'AuraData/Date range filter',
  component: DateRangeFilter,
  args: { today: TODAY, defaultValue: presetRange('this-month', TODAY) },
} satisfies Meta<typeof DateRangeFilter>

export default meta
type Story = StoryObj<typeof meta>

/** «Este mes»: from the 1st to today. */
export const Default: Story = {}

/** No range yet: the button asks for one. */
export const Empty: Story = { args: { defaultValue: undefined } }

/** Open, for the visual tests and to see the presets and the calendar. */
export const Open: Story = { args: { defaultOpen: true } }

/** Another day than the browser's, so the calendar's «today» must come from the `today` prop. */
const OTHER_TODAY = new Date(2026, 10, 18)

/**
 * A preset, then a custom range picked on the calendar: the button's label follows each choice. The
 * calendar marks the `today` it is given, not the browser's clock.
 */
export const Choosing: Story = {
  args: { onValueChange: fn(), today: OTHER_TODAY, defaultValue: presetRange('this-month', OTHER_TODAY) },
  play: async ({ args, canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const trigger = within(canvasElement).getByRole('button')
    await expect(trigger).toHaveTextContent('1 nov 2026 – 18 nov 2026')
    await userEvent.click(trigger)
    const dialog = await body.findByRole('dialog', { name: 'Periodo' })
    await expect(dialog.querySelector('[data-today]')).toHaveAttribute('data-day', '2026-11-18')
    // The pressed preset takes the first focus, not «Hoy» above it.
    await waitFor(() => expect(within(dialog).getByRole('button', { name: 'Este mes' })).toHaveFocus())
    await userEvent.click(within(dialog).getByRole('button', { name: 'Últimos 7 días' }))
    await expect(trigger).toHaveTextContent('12 nov 2026 – 18 nov 2026')
    await userEvent.click(within(dialog).getByRole('button', { name: 'Personalizado' }))
    await userEvent.click(dialog.querySelector<HTMLElement>('[data-day="2026-11-03"] button')!)
    await userEvent.click(dialog.querySelector<HTMLElement>('[data-day="2026-11-10"] button')!)
    await expect(trigger).toHaveTextContent('3 nov 2026 – 10 nov 2026')
    await expect(within(dialog).getByRole('button', { name: 'Personalizado' })).toHaveAttribute('aria-pressed', 'true')
    await expect(args.onValueChange).toHaveBeenCalled()
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(body.queryByRole('dialog')).toBeNull())
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}
