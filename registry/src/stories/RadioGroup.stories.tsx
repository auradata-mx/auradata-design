import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

import { Field, FieldDescription, FieldError, FieldLabel, FieldLegend, FieldSet } from '@/components/ui/field'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

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

const FREQUENCIES = [
  { value: 'diario', label: 'Diario' },
  { value: 'semanal', label: 'Cada lunes' },
  { value: 'mensual', label: 'El día 1 de cada mes' },
]

const meta = {
  title: 'Components/Radio group',
  component: RadioGroup,
  args: { defaultValue: 'semanal' },
} satisfies Meta<typeof RadioGroup>

export default meta
type Story = StoryObj<typeof meta>

/** How often the report arrives by email. */
export const Default: Story = {
  render: (args) => (
    <FieldSet className="max-w-sm">
      <FieldLegend variant="label">Enviar el informe</FieldLegend>
      <RadioGroup {...args}>
        {FREQUENCIES.map((frequency) => (
          <Field key={frequency.value} orientation="horizontal" data-disabled={args.disabled || undefined}>
            <RadioGroupItem id={`frecuencia-${frequency.value}`} value={frequency.value} />
            <FieldLabel htmlFor={`frecuencia-${frequency.value}`}>{frequency.label}</FieldLabel>
          </Field>
        ))}
      </RadioGroup>
      <FieldDescription>Llega a las 8:00 a todo el equipo.</FieldDescription>
    </FieldSet>
  ),
  play: async ({ canvasElement }) => {
    await expectBorderContrast(canvasElement.querySelector<HTMLElement>('[data-slot="radio-group-item"]:not([data-checked])')!)
  },
}

export const Disabled: Story = {
  ...Default,
  args: { ...Default.args, disabled: true },
  play: async ({ canvasElement }) => {
    // Base UI renders a span with `data-disabled`: the circles dim like the labels.
    for (const radio of within(canvasElement).getAllByRole('radio')) {
      await expect(getComputedStyle(radio).opacity).toBe('0.5')
    }
  },
}

export const Invalid: Story = {
  args: { defaultValue: undefined },
  render: (args) => (
    <FieldSet className="max-w-sm" data-invalid>
      <FieldLegend variant="label">Enviar el informe</FieldLegend>
      <RadioGroup {...args} aria-invalid>
        {FREQUENCIES.map((frequency) => (
          <Field key={frequency.value} orientation="horizontal">
            <RadioGroupItem id={`invalido-${frequency.value}`} value={frequency.value} aria-invalid />
            <FieldLabel htmlFor={`invalido-${frequency.value}`}>{frequency.label}</FieldLabel>
          </Field>
        ))}
      </RadioGroup>
      <FieldError>Elige cada cuánto lo enviamos.</FieldError>
    </FieldSet>
  ),
}
