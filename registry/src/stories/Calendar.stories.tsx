import type { Meta, StoryObj } from '@storybook/react-vite'
import { es } from 'date-fns/locale/es'

import { Calendar } from '@/components/ui/calendar'

const meta = {
  title: 'Components/Calendar',
  component: Calendar,
  // `today` is fixed so the marker does not move with the clock.
  args: { locale: es, today: new Date(2026, 10, 21), defaultMonth: new Date(2026, 10, 1), className: 'rounded-lg border' },
} satisfies Meta<typeof Calendar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { mode: 'single', selected: new Date(2026, 10, 21) },
}

/** A range over two months, as the date range filter shows it. */
export const Range: Story = {
  args: {
    mode: 'range',
    numberOfMonths: 2,
    defaultMonth: new Date(2026, 9, 1),
    selected: { from: new Date(2026, 9, 25), to: new Date(2026, 10, 7) },
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
