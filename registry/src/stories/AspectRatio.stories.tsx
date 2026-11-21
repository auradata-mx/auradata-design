import type { Meta, StoryObj } from '@storybook/react-vite'

import { AspectRatio } from '@/components/ui/aspect-ratio'

const BARS = [42, 58, 51, 66, 73, 69, 84, 90]

const meta = {
  title: 'Components/Aspect ratio',
  component: AspectRatio,
  args: { ratio: 16 / 9 },
} satisfies Meta<typeof AspectRatio>

export default meta
type Story = StoryObj<typeof meta>

/** A 16:9 chart preview: it keeps its shape at any width, as a report page does. */
export const Default: Story = {
  render: (args) => (
    <figure className="grid max-w-lg gap-2">
      <AspectRatio {...args} className="overflow-hidden rounded-xl border bg-card">
        <div aria-hidden className="absolute inset-4 flex items-end gap-2">
          {BARS.map((height, index) => (
            <span key={index} className="flex-1 rounded-t-sm bg-chart-1" style={{ height: `${height}%` }} />
          ))}
        </div>
      </AspectRatio>
      <figcaption className="text-sm text-muted-foreground">Vista previa de «Ventas por mes», 16:9</figcaption>
    </figure>
  ),
}

/** A square thumbnail, 1:1. */
export const Square: Story = {
  render: (args) => (
    <AspectRatio {...args} ratio={1} className="flex w-40 items-center justify-center rounded-xl border bg-muted text-sm text-muted-foreground">
      1:1
    </AspectRatio>
  ),
}
