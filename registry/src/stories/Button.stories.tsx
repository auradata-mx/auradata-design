import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'

import { Button, buttonVariants } from '@/components/ui/button'

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

/** Reached with the keyboard (Tab): `:focus-visible` shows the focus ring, as in the screenshot. */
export const Focus: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.tab()
    await expect(document.activeElement).toBe(within(canvasElement).getByRole('button', { name: 'Guardar informe' }))
  },
}

/** A link styled as a button (`buttonVariants` on an `<a>`, so it keeps the link role), reached with the keyboard. */
export const LinkFocus: Story = {
  name: 'Link focus',
  render: () => (
    <a href="#informes" className={buttonVariants({ variant: 'link' })}>
      Ver todos los informes
    </a>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.tab()
    await expect(document.activeElement).toBe(within(canvasElement).getByRole('link', { name: 'Ver todos los informes' }))
  },
}
