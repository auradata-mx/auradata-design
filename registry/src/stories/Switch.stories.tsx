import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'

import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

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
  title: 'Components/Switch',
  component: Switch,
  argTypes: { size: { control: 'select', options: ['sm', 'default'] } },
  render: (args) => (
    <div className="flex items-center gap-2">
      <Switch id="refresh" {...args} />
      <Label htmlFor="refresh">Actualizar cada hora</Label>
    </div>
  ),
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

/** The unchecked track is the only sign of the control: it needs 3:1 against the page (WCAG 1.4.11). */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const track = canvasElement.querySelector<HTMLElement>('[data-slot="switch"]')!
    const root = document.documentElement
    const wasDark = root.classList.contains('dark')
    // transition-all would report the color halfway to the new theme.
    track.style.transition = 'none'
    // Both themes: the story test runs light only, and the dark track was the faint one.
    for (const dark of [false, true]) {
      root.classList.toggle('dark', dark)
      const page = getComputedStyle(document.body).getPropertyValue('--background')
      const background = paint(page, '#fff')
      const fill = paint(getComputedStyle(track).backgroundColor, `rgb(${background.join(' ')})`)
      await expect(contrast(fill, background), dark ? 'dark' : 'light').toBeGreaterThanOrEqual(3)
    }
    root.classList.toggle('dark', wasDark)
    track.style.transition = ''
  },
}
/** Checked: in dark the thumb is white on the blue track (the near-black thumb read as a hole). */
export const Checked: Story = {
  args: { defaultChecked: true },
  play: async ({ canvasElement }) => {
    const thumb = canvasElement.querySelector<HTMLElement>('[data-slot="switch-thumb"]')!
    const root = document.documentElement
    const wasDark = root.classList.contains('dark')
    thumb.style.transition = 'none'
    root.classList.add('dark')
    await expect(getComputedStyle(thumb).backgroundColor).toBe('rgb(255, 255, 255)')
    root.classList.toggle('dark', wasDark)
    thumb.style.transition = ''
  },
}
export const Disabled: Story = { args: { disabled: true } }

/** Reached with the keyboard (Tab): `:focus-visible` shows the focus ring, as in the screenshot. */
export const Focus: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.tab()
    await expect(document.activeElement).toBe(within(canvasElement).getByRole('switch', { name: 'Actualizar cada hora' }))
  },
}

/** A click checks it (`aria-checked`) and calls `onCheckedChange(true)`; a second click unchecks it. */
export const Toggle: Story = {
  args: { onCheckedChange: fn() },
  play: async ({ args, canvasElement }) => {
    const control = within(canvasElement).getByRole('switch', { name: 'Actualizar cada hora' })
    await expect(control).toHaveAttribute('aria-checked', 'false')
    await userEvent.click(control)
    await expect(control).toHaveAttribute('aria-checked', 'true')
    await expect(args.onCheckedChange).toHaveBeenLastCalledWith(true, expect.anything())
    await userEvent.click(control)
    await expect(control).toHaveAttribute('aria-checked', 'false')
    await expect(args.onCheckedChange).toHaveBeenLastCalledWith(false, expect.anything())
    await userEvent.click(control)
    // Checked, unfocused: the screenshot shows the checked control without a ring.
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}
