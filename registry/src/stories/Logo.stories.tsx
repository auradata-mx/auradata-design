import type { Meta, StoryObj } from '@storybook/react-vite'

import { Logo, ProductTag } from '@/components/ui/logo'

const meta = {
  title: 'AuraData/Logo',
  component: Logo,
  argTypes: {
    layout: { control: 'select', options: ['horizontal', 'vertical', 'mark'] },
    variant: { control: 'select', options: ['auto', 'color', 'negro', 'blanco', 'texto-degradado'] },
  },
} satisfies Meta<typeof Logo>

export default meta
type Story = StoryObj<typeof meta>

/** Color in light, white in dark: switch the theme in the toolbar. */
export const Auto: Story = {}

export const Layouts: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-end gap-8">
      <Logo {...args} layout="horizontal" className="h-10" />
      <Logo {...args} layout="vertical" className="h-28" />
      <Logo {...args} layout="mark" className="h-12" />
    </div>
  ),
}

export const WithProductTag: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <Logo {...args} className="h-7" />
      <ProductTag>BI</ProductTag>
    </div>
  ),
}
