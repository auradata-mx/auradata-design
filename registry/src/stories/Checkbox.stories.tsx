import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'

import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

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

/** WCAG 1.4.11: the unchecked border is the only edge of the control; 3:1 against the page, light and dark. */
async function expectBorderContrast(control: HTMLElement) {
  const root = document.documentElement
  const wasDark = root.classList.contains('dark')
  // transition-all would report the color halfway to the new theme.
  control.style.transition = 'none'
  for (const dark of [false, true]) {
    root.classList.toggle('dark', dark)
    const background = paint(getComputedStyle(document.body).getPropertyValue('--background'), '#fff')
    const border = paint(getComputedStyle(control).borderTopColor, `rgb(${background.join(' ')})`)
    await expect(contrast(border, background), dark ? 'dark' : 'light').toBeGreaterThanOrEqual(3)
  }
  root.classList.toggle('dark', wasDark)
  control.style.transition = ''
}

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  render: (args) => (
    <div className="flex items-center gap-2">
      <Checkbox id="share" {...args} />
      <Label htmlFor="share">Compartir con el equipo</Label>
    </div>
  ),
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expectBorderContrast(canvasElement.querySelector<HTMLElement>('[data-slot="checkbox"]')!)
  },
}
export const Checked: Story = { args: { defaultChecked: true } }
export const Disabled: Story = { args: { disabled: true } }

/** Reached with the keyboard (Tab): `:focus-visible` shows the focus ring, as in the screenshot. */
export const Focus: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.tab()
    await expect(document.activeElement).toBe(within(canvasElement).getByRole('checkbox', { name: 'Compartir con el equipo' }))
  },
}
