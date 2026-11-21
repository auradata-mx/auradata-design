import type { Meta, StoryObj } from '@storybook/react-vite'

import { Field, FieldDescription, FieldError, FieldLabel, FieldLegend, FieldSet } from '@/components/ui/field'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

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
}

export const Disabled: Story = { ...Default, args: { ...Default.args, disabled: true } }

export const Invalid: Story = {
  args: { defaultValue: undefined },
  render: (args) => (
    <FieldSet className="max-w-sm" data-invalid>
      <FieldLegend variant="label">Enviar el informe</FieldLegend>
      <RadioGroup {...args} aria-invalid>
        {FREQUENCIES.map((frequency) => (
          <Field key={frequency.value} orientation="horizontal" data-invalid>
            <RadioGroupItem id={`invalido-${frequency.value}`} value={frequency.value} aria-invalid />
            <FieldLabel htmlFor={`invalido-${frequency.value}`}>{frequency.label}</FieldLabel>
          </Field>
        ))}
      </RadioGroup>
      <FieldError>Elige cada cuánto lo enviamos.</FieldError>
    </FieldSet>
  ),
}
