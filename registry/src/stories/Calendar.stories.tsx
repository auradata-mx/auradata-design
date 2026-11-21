import type { Meta, StoryObj } from '@storybook/react-vite'
import { es } from 'date-fns/locale/es'

import { Calendar } from '@/components/ui/calendar'

const meta = {
  title: 'Components/Calendar',
  component: Calendar,
  args: { locale: es, defaultMonth: new Date(2026, 10, 1), className: 'rounded-lg border' },
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
