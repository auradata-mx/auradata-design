import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '@/components/ui/button'

const meta = {
  title: 'Components/Button',
  component: Button,
  args: { children: 'Guardar informe' },
  argTypes: {
    variant: { control: 'select', options: ['default', 'outline', 'secondary', 'ghost', 'destructive', 'link'] },
    size: { control: 'select', options: ['xs', 'sm', 'default', 'lg'] },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {}

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-3">
      <Button {...args}>Default</Button>
      <Button {...args} variant="outline">Outline</Button>
      <Button {...args} variant="secondary">Secondary</Button>
      <Button {...args} variant="ghost">Ghost</Button>
      <Button {...args} variant="destructive">Destructive</Button>
      <Button {...args} variant="link">Link</Button>
    </div>
  ),
}

export const Disabled: Story = { args: { disabled: true } }
