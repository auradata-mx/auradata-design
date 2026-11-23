import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'

import { Input } from '@/components/ui/input'

import { expectSoftFieldBorder } from './play-helpers'

const meta = {
  title: 'Components/Input',
  component: Input,
  args: { placeholder: 'Buscar informes…' },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

/** The soft field border, light and dark: visible against the page, quiet next to the content. */
export const Default: Story = {
  args: { 'aria-label': 'Buscar informes' },
  play: async ({ canvasElement }) => {
    await expectSoftFieldBorder(within(canvasElement).getByRole('textbox'))
  },
}
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
    // On focus the soft border turns Azul Aura and a 3px glow goes around it, with no second edge.
    control.style.transition = 'none'
    const focused = getComputedStyle(control)
    await expect(focused.borderTopColor).toBe('rgb(37, 99, 235)')
    await expect(focused.boxShadow).toMatch(/0px 0px 0px 3px/)
    await expect(focused.boxShadow).not.toMatch(/0px 0px 0px 1px/)
    control.blur()
    // At rest, the soft field border.
    await expect(getComputedStyle(control).borderTopColor).toBe('rgb(196, 196, 204)')
  },
}
