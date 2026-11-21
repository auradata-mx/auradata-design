import type { Meta, StoryObj } from '@storybook/react-vite'

import { Eyebrow } from '@/components/ui/eyebrow'

const meta = {
  title: 'AuraData/Eyebrow',
  component: Eyebrow,
  args: { children: 'Software a la medida · Hecho en México' },
} satisfies Meta<typeof Eyebrow>

export default meta
type Story = StoryObj<typeof meta>

/** The label above a section title: a mono pill with the brand dot. */
export const Default: Story = {}

export const Short: Story = { args: { children: 'Hablemos' } }
