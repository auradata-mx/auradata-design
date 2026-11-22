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
/** The border is the full destructive color in both themes (dark mode had it at 50%, a muddy maroon band). */
export const Invalid: Story = {
  args: { 'aria-invalid': true, defaultValue: 'correo@', 'aria-label': 'Correo' },
  play: async ({ canvasElement }) => {
    const control = within(canvasElement).getByRole('textbox')
    const root = document.documentElement
    const wasDark = root.classList.contains('dark')
    control.style.transition = 'none'
    for (const dark of [false, true]) {
      root.classList.toggle('dark', dark)
      const destructive = getComputedStyle(root).getPropertyValue('--destructive').trim()
      const probe = document.createElement('span')
      probe.style.color = destructive
      document.body.append(probe)
      await expect(getComputedStyle(control).borderTopColor, dark ? 'dark' : 'light').toBe(getComputedStyle(probe).color)
      probe.remove()
    }
    root.classList.toggle('dark', wasDark)
    control.style.transition = ''
  },
}

/** Reached with the keyboard (Tab): `:focus-visible` shows the focus ring, as in the screenshot. */
export const Focus: Story = {
  args: { 'aria-label': 'Buscar informes' },
  play: async ({ canvasElement }) => {
    // Start from the page, so the second Tab lands on the input again.
    ;(document.activeElement as HTMLElement | null)?.blur()
    await userEvent.tab()
    const control = within(canvasElement).getByRole('textbox')
    await expect(document.activeElement).toBe(control)
    // The brand outline is the only focus indicator: the border keeps its color inside it.
    control.style.transition = 'none'
    const focused = getComputedStyle(control).borderTopColor
    control.blur()
    await expect(getComputedStyle(control).borderTopColor).toBe(focused)
    await userEvent.tab()
    // The brand focus ring of the AuraData theme: 2px of --ring, 2px away, no stock box-shadow ring.
    await waitFor(() => {
      const style = getComputedStyle(control)
      expect([style.outlineStyle, style.outlineWidth, style.outlineOffset]).toEqual(['solid', '2px', '2px'])
      expect(style.boxShadow).not.toMatch(/ 3px(,|$)/)
    })
  },
}
