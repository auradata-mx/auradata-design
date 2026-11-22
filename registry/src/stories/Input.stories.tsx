import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { Input } from '@/components/ui/input'

/** The sRGB of any CSS color (oklab, color-mix, alpha…) painted over a background, read back from a canvas. */
function paint(color: string, background: string) {
  const context = document.createElement('canvas').getContext('2d', { willReadFrequently: true })!
  context.fillStyle = background
  context.fillRect(0, 0, 1, 1)
  context.fillStyle = color
  context.fillRect(0, 0, 1, 1)
  return [...context.getImageData(0, 0, 1, 1).data.slice(0, 3)]
}

const luminance = (rgb: number[]) => {
  const [r, g, b] = rgb.map((value) => {
    const c = value / 255
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

const contrast = (a: number[], b: number[]) => {
  const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (high + 0.05) / (low + 0.05)
}

const meta = {
  title: 'Components/Input',
  component: Input,
  args: { placeholder: 'Buscar informes…' },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

/** WCAG 1.4.11: the border is the edge of the field; 3:1 against the page, light and dark. */
export const Default: Story = {
  args: { 'aria-label': 'Buscar informes' },
  play: async ({ canvasElement }) => {
    const control = within(canvasElement).getByRole('textbox')
    const root = document.documentElement
    const wasDark = root.classList.contains('dark')
    // transition-colors would report the color halfway to the new theme.
    control.style.transition = 'none'
    for (const dark of [false, true]) {
      root.classList.toggle('dark', dark)
      const background = paint(getComputedStyle(document.body).getPropertyValue('--background'), '#fff')
      const border = paint(getComputedStyle(control).borderTopColor, `rgb(${background.join(' ')})`)
      await expect(contrast(border, background), dark ? 'dark' : 'light').toBeGreaterThanOrEqual(3)
    }
    root.classList.toggle('dark', wasDark)
    control.style.transition = ''
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
