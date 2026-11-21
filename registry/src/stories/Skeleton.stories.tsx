import type { Meta, StoryObj } from '@storybook/react-vite'

import { Skeleton } from '@/components/ui/skeleton'

const meta = {
  title: 'Components/Skeleton',
  component: Skeleton,
  render: (args) => (
    <div className="grid max-w-sm gap-3">
      <Skeleton className="h-32 w-full" {...args} />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  ),
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
