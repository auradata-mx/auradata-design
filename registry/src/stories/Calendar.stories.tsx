import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

import { Calendar } from '@/components/ui/calendar'

const meta = {
  title: 'Components/Calendar',
  component: Calendar,
  // `today` is fixed so the marker does not move with the clock. Spanish is the calendar's default.
  args: { today: new Date(2026, 10, 21), defaultMonth: new Date(2026, 10, 1), className: 'rounded-lg border' },
} satisfies Meta<typeof Calendar>

export default meta
type Story = StoryObj<typeof meta>

/** Spanish for screen readers too: the buttons and days are named in Spanish, not only the caption. */
export const Default: Story = {
  args: { mode: 'single', selected: new Date(2026, 10, 21) },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('button', { name: 'Ir al mes anterior' })).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Ir al mes siguiente' })).toBeInTheDocument()
    await expect(
      canvas.getByRole('button', { name: /^Hoy, sábado, 21 de noviembre de 2026, seleccionado$/ })
    ).toBeInTheDocument()
  },
}

/** A range over two months, as the date range filter shows it. */
export const Range: Story = {
  args: {
    mode: 'range',
    numberOfMonths: 2,
    defaultMonth: new Date(2026, 9, 1),
    selected: { from: new Date(2026, 9, 25), to: new Date(2026, 10, 7) },
  },
  play: async ({ canvasElement }) => {
    // Today (21 nov, outside the range) has its own marker, never the range's fill: it must not look picked.
    const today = canvasElement.querySelector<HTMLElement>('[data-today]')!
    const middle = canvasElement.querySelector<HTMLElement>('[data-range-middle=true]')!
    const fill = getComputedStyle(middle).backgroundColor
    await expect(getComputedStyle(today).backgroundColor).not.toBe(fill)
    await expect(getComputedStyle(today.querySelector('button')!).backgroundColor).not.toBe(fill)
    await expect(getComputedStyle(today).boxShadow).not.toBe('none')
  },
}

/** Days that cannot be picked: weekends and anything after today (21 nov) are dimmed and skipped. */
export const DisabledDays: Story = {
  name: 'Disabled days',
  args: {
    mode: 'single',
    selected: new Date(2026, 10, 18),
    disabled: [{ dayOfWeek: [0, 6] }, { after: new Date(2026, 10, 21) }],
  },
}
