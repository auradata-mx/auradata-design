import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, waitFor, within } from 'storybook/test'

import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from '@/components/ui/avatar'

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarFallback>AL</AvatarFallback>
    </Avatar>
  ),
}

export const Group: Story = {
  render: () => (
    <AvatarGroup>
      {['AL', 'MW', 'RG'].map((initials) => (
        <Avatar key={initials}>
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      ))}
    </AvatarGroup>
  ),
  play: async ({ canvasElement }) => {
    const avatars = [...canvasElement.querySelectorAll('[data-slot="avatar"]')]
    for (const [index, avatar] of avatars.slice(0, -1).entries()) {
      const range = document.createRange()
      range.selectNodeContents(avatar.querySelector('[data-slot="avatar-fallback"]')!)
      const initials = range.getBoundingClientRect()
      const next = avatars[index + 1].getBoundingClientRect()
      // The next avatar paints a 2 px ring of the page color around itself; 1 px is the glyphs' side bearing.
      await expect(next.left - 2 + 1, `${avatar.textContent} is covered`).toBeGreaterThanOrEqual(initials.right)
    }
  },
}

/** The three sizes: `sm`, `default` and `lg`. */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      {(['sm', 'default', 'lg'] as const).map((size) => (
        <Avatar key={size} size={size}>
          <AvatarFallback>AL</AvatarFallback>
        </Avatar>
      ))}
    </div>
  ),
}

/**
 * An image that loads (the Continua isotipo, served by Storybook) next to one that fails: the second shows
 * its initials instead.
 */
export const Image: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Avatar size="lg">
        <AvatarImage src="/brand/continua/isotipo-color.svg" alt="Continua" className="bg-muted object-contain p-1" />
        <AvatarFallback>CO</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarImage src="/brand/continua/no-existe.png" alt="Ana López" />
        <AvatarFallback>AL</AvatarFallback>
      </Avatar>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await waitFor(() => expect(canvas.getByRole('img', { name: 'Continua' })).toBeVisible())
    await waitFor(() => expect(canvas.getByText('AL')).toBeVisible())
  },
}
