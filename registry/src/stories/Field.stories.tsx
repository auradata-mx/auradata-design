import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
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
  play: async ({ canvasElement }) => {
    // The label and the error turn red; the value the person typed stays in the text color.
    const probe = document.createElement('span')
    probe.className = 'text-foreground'
    canvasElement.append(probe)
    await expect(getComputedStyle(within(canvasElement).getByRole('textbox')).color).toBe(getComputedStyle(probe).color)
    probe.remove()
  },
}

/** Label and control on one row (`orientation="horizontal"`), as for a switch with its description. */
export const Horizontal: Story = {
  render: () => (
    <Field orientation="horizontal" className="max-w-md">
      <FieldContent>
        <FieldLabel htmlFor="hourly">Actualizar cada hora</FieldLabel>
        <FieldDescription>Vuelve a leer el dataset en punto, de 8:00 a 20:00.</FieldDescription>
      </FieldContent>
      <Switch id="hourly" defaultChecked />
    </Field>
  ),
}

/** A field that cannot change: `data-disabled` dims the label with the control. */
export const Disabled: Story = {
  render: () => (
    <Field className="max-w-sm" data-disabled>
      <FieldLabel htmlFor="workspace">Espacio</FieldLabel>
      <Input id="workspace" defaultValue="Ventas" disabled />
      <FieldDescription>Solo un administrador cambia el espacio de un informe.</FieldDescription>
    </Field>
  ),
}

/** Several problems with one value: `FieldError` lists them. */
export const MultipleErrors: Story = {
  name: 'Multiple errors',
  render: () => (
    <Field className="max-w-sm" data-invalid>
      <FieldLabel htmlFor="password">Contraseña</FieldLabel>
      <Input id="password" type="password" aria-invalid aria-describedby="password-errors" defaultValue="ventas" />
      <FieldError
        id="password-errors"
        errors={[
          { message: 'Usa al menos 12 caracteres.' },
          { message: 'Agrega un número.' },
          { message: 'Agrega una mayúscula.' },
        ]}
      />
    </Field>
  ),
}
