import type { Meta, StoryObj } from '@storybook/react-vite'

import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

const meta = {
  title: 'Components/Switch',
  component: Switch,
  argTypes: { size: { control: 'select', options: ['sm', 'default'] } },
  render: (args) => (
    <div className="flex items-center gap-2">
      <Switch id="refresh" {...args} />
      <Label htmlFor="refresh">Actualizar cada hora</Label>
    </div>
  ),
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Checked: Story = { args: { defaultChecked: true } }
export const Disabled: Story = { args: { disabled: true } }
