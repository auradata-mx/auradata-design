import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'

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

/** Reached with the keyboard (Tab): `:focus-visible` shows the focus ring, as in the screenshot. */
export const Focus: Story = {
  args: { 'aria-label': 'Descripción del informe' },
  play: async ({ canvasElement }) => {
    await userEvent.tab()
    await expect(document.activeElement).toBe(within(canvasElement).getByRole('textbox'))
  },
}
