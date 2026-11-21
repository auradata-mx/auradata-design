import type { Meta, StoryObj } from '@storybook/react-vite'

import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const meta = {
  title: 'Components/Field',
  component: Field,
} satisfies Meta<typeof Field>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <FieldSet className="max-w-sm">
      <FieldLegend>Nuevo informe</FieldLegend>
      <FieldGroup>
        <Field {...args}>
          <FieldLabel htmlFor="name">Nombre</FieldLabel>
          <Input id="name" placeholder="Ventas 2026" />
          <FieldDescription>Así lo verá tu equipo.</FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="notes">Notas</FieldLabel>
          <Textarea id="notes" />
        </Field>
      </FieldGroup>
    </FieldSet>
  ),
}

export const Invalid: Story = {
  render: (args) => (
    <Field className="max-w-sm" data-invalid {...args}>
      <FieldLabel htmlFor="email">Correo</FieldLabel>
      <Input id="email" aria-invalid defaultValue="ana@" />
      <FieldError>Escribe un correo completo, como ana@empresa.mx.</FieldError>
    </Field>
  ),
}
