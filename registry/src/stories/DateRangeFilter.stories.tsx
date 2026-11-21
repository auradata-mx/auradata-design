import type { Meta, StoryObj } from '@storybook/react-vite'

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
