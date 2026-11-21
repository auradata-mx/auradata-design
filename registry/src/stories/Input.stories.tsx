import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { Input } from '@/components/ui/input'

const meta = {
  title: 'Components/Input',
  component: Input,
  args: { placeholder: 'Buscar informes…' },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Disabled: Story = { args: { disabled: true } }
export const Invalid: Story = { args: { 'aria-invalid': true, defaultValue: 'correo@' } }

/** Reached with the keyboard (Tab): `:focus-visible` shows the focus ring, as in the screenshot. */
export const Focus: Story = {
  args: { 'aria-label': 'Buscar informes' },
  play: async ({ canvasElement }) => {
    await userEvent.tab()
    const control = within(canvasElement).getByRole('textbox')
    await expect(document.activeElement).toBe(control)
    // The brand focus ring of the AuraData theme: 2px of --ring, 2px away, no stock box-shadow ring.
    await waitFor(() => {
      const style = getComputedStyle(control)
      expect([style.outlineStyle, style.outlineWidth, style.outlineOffset]).toEqual(['solid', '2px', '2px'])
      expect(style.boxShadow).not.toMatch(/ 3px(,|$)/)
    })
  },
}
