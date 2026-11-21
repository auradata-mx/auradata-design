import type { Meta, StoryObj } from '@storybook/react-vite'

import { Textarea } from '@/components/ui/textarea'

const meta = {
  title: 'Components/Textarea',
  component: Textarea,
  args: { placeholder: 'Describe qué muestra el informe', className: 'max-w-sm' },
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Disabled: Story = { args: { disabled: true } }
