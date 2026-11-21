import type { Meta, StoryObj } from '@storybook/react-vite'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const meta = {
  title: 'Components/Label',
  component: Label,
  args: { children: 'Nombre del informe' },
  render: (args) => (
    <div className="grid max-w-sm gap-2">
      <Label htmlFor="report" {...args} />
      <Input id="report" />
    </div>
  ),
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
