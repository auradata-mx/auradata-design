import type { Meta, StoryObj } from '@storybook/react-vite'

import { SectionHeader } from '@/components/ui/section-header'

const meta = {
  title: 'AuraData/Section header',
  component: SectionHeader,
  args: {
    eyebrow: 'Por qué AuraData',
    title: 'Lo que ganas al',
    highlight: 'trabajar con nosotros',
    description: 'Software con claridad, propósito y precisión para impulsar tu negocio.',
  },
} satisfies Meta<typeof SectionHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Centered: Story = { args: { align: 'center' } }

/** Without the eyebrow or the description. */
export const TitleOnly: Story = { args: { eyebrow: undefined, description: undefined } }
