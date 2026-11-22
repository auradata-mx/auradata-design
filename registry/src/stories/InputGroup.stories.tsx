import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { CopyIcon, SearchIcon, SendIcon } from 'lucide-react'

import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from '@/components/ui/input-group'

const meta = {
  title: 'Components/Input group',
  component: InputGroup,
  args: { className: 'sm:max-w-xs' },
} satisfies Meta<typeof InputGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <div className="grid gap-3">
      <InputGroup {...args}>
        <InputGroupInput placeholder="Buscar informes…" aria-label="Buscar informes" />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup {...args}>
        <InputGroupAddon>
          <InputGroupText>$</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput defaultValue="1,284,500" aria-label="Meta de ventas" />
        <InputGroupAddon align="inline-end">
          <InputGroupText>MXN</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
}

/** A button inside the group, at its end. */
export const WithButton: Story = {
  name: 'With button',
  render: (args) => (
    <InputGroup {...args}>
      <InputGroupInput readOnly defaultValue="https://bi.auradata.mx/r/7f3c9a" aria-label="Enlace del informe" />
      <InputGroupAddon align="inline-end">
        <InputGroupButton size="icon-xs" aria-label="Copiar enlace">
          <CopyIcon aria-hidden />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  ),
}

/** Addons above and below the field (`block-start`, `block-end`), around a textarea. */
export const WithTextarea: Story = {
  name: 'With textarea',
  args: { className: 'max-w-md' },
  render: (args) => (
    <InputGroup {...args}>
      <InputGroupAddon align="block-start">
        <InputGroupText>Pregunta a tus datos</InputGroupText>
      </InputGroupAddon>
      <InputGroupTextarea placeholder="¿Qué región vendió más en octubre?" aria-label="Pregunta" />
      <InputGroupAddon align="block-end">
        <InputGroupText className="text-xs">Usa el dataset «Pedidos 2026»</InputGroupText>
        <InputGroupButton variant="default" size="sm" className="ml-auto">
          <SendIcon data-icon="inline-start" aria-hidden />
          Enviar
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  ),
}

export const Invalid: Story = {
  render: (args) => (
    <Field className="sm:max-w-xs" data-invalid>
      <FieldLabel htmlFor="goal">Meta de ventas</FieldLabel>
      <InputGroup {...args}>
        <InputGroupAddon>
          <InputGroupText>$</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput id="goal" defaultValue="-500" aria-invalid />
        <InputGroupAddon align="inline-end">
          <InputGroupText>MXN</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      <FieldError>La meta debe ser mayor que cero.</FieldError>
    </Field>
  ),
}

/**
 * Disabled: `disabled` on the group disables its input and marks the group `aria-disabled`, so the dimmed text
 * addons («$», «MXN») are disabled content too (WCAG exempts it from contrast, and axe knows).
 */
export const Disabled: Story = {
  render: (args) => (
    <InputGroup {...args} disabled>
      <InputGroupAddon>
        <InputGroupText>$</InputGroupText>
      </InputGroupAddon>
      <InputGroupInput defaultValue="1,284,500" aria-label="Meta de ventas" />
      <InputGroupAddon align="inline-end">
        <InputGroupText>MXN</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('textbox', { name: 'Meta de ventas' })).toBeDisabled()
    await expect(canvasElement.querySelector('[data-slot="input-group"]')).toHaveAttribute('aria-disabled', 'true')
  },
}
