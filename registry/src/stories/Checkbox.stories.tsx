import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'

import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet, FieldLegend } from '@/components/ui/field'
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

/**
 * Some of the regions picked: the parent box is `indeterminate` (`aria-checked="mixed"`). The stock indicator
 * draws the same check as checked, on an unfilled box, not a dash (L37).
 */
export const Indeterminate: Story = {
  render: () => (
    <FieldSet>
      <FieldLegend variant="label">Regiones del informe</FieldLegend>
      <FieldGroup className="gap-3">
        <Field orientation="horizontal">
          <Checkbox id="all-regions" indeterminate />
          <FieldLabel htmlFor="all-regions">Todas las regiones</FieldLabel>
        </Field>
        {['Norte', 'Centro', 'Sur'].map((region, index) => (
          <Field key={region} orientation="horizontal" className="pl-6">
            <Checkbox id={`region-${region}`} defaultChecked={index < 2} />
            <FieldLabel htmlFor={`region-${region}`}>{region}</FieldLabel>
          </Field>
        ))}
      </FieldGroup>
    </FieldSet>
  ),
  play: async ({ canvasElement }) => {
    const parent = within(canvasElement).getByRole('checkbox', { name: 'Todas las regiones' })
    await expect(parent).toHaveAttribute('aria-checked', 'mixed')
  },
}

/** A required box left unchecked: `aria-invalid` paints the border, the error says what to do. */
export const Invalid: Story = {
  render: () => (
    <Field orientation="horizontal" data-invalid className="max-w-sm flex-wrap">
      <Checkbox id="terms" aria-invalid aria-describedby="terms-error" />
      <FieldLabel htmlFor="terms">Acepto los términos de uso</FieldLabel>
      <FieldError id="terms-error" className="basis-full">Acepta los términos para crear tu cuenta.</FieldError>
    </Field>
  ),
}

/** A click checks it (`aria-checked`) and calls `onCheckedChange(true)`; a second click unchecks it. */
export const Toggle: Story = {
  args: { onCheckedChange: fn() },
  play: async ({ args, canvasElement }) => {
    const control = within(canvasElement).getByRole('checkbox', { name: 'Compartir con el equipo' })
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
