import type { Meta, StoryObj } from '@storybook/react-vite'

import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { NativeSelect, NativeSelectOptGroup, NativeSelectOption } from '@/components/ui/native-select'

const meta = {
  title: 'Components/Native select',
  component: NativeSelect,
} satisfies Meta<typeof NativeSelect>

export default meta
type Story = StoryObj<typeof meta>

function Regions(props: React.ComponentProps<typeof NativeSelect>) {
  return (
    <NativeSelect {...props}>
      <NativeSelectOption value="">Todas las regiones</NativeSelectOption>
      <NativeSelectOptGroup label="Norte">
        <NativeSelectOption value="noreste">Noreste</NativeSelectOption>
        <NativeSelectOption value="noroeste">Noroeste</NativeSelectOption>
      </NativeSelectOptGroup>
      <NativeSelectOptGroup label="Centro">
        <NativeSelectOption value="bajio">Bajío</NativeSelectOption>
        <NativeSelectOption value="occidente">Occidente</NativeSelectOption>
      </NativeSelectOptGroup>
    </NativeSelect>
  )
}

/** The browser's own select: the best on phones. */
export const Default: Story = {
  render: () => (
    <Field className="sm:max-w-xs">
      <FieldLabel htmlFor="region">Región</FieldLabel>
      <Regions id="region" defaultValue="bajio" />
    </Field>
  ),
}

export const Small: Story = {
  render: () => (
    <Field className="sm:max-w-xs">
      <FieldLabel htmlFor="region-sm">Región</FieldLabel>
      <Regions id="region-sm" size="sm" />
    </Field>
  ),
}

export const Disabled: Story = {
  render: () => (
    <Field className="sm:max-w-xs" data-disabled>
      <FieldLabel htmlFor="region-disabled">Región</FieldLabel>
      <Regions id="region-disabled" disabled />
    </Field>
  ),
}

export const Invalid: Story = {
  render: () => (
    <Field className="sm:max-w-xs" data-invalid>
      <FieldLabel htmlFor="region-invalid">Región</FieldLabel>
      <Regions id="region-invalid" aria-invalid />
      <FieldError>Elige la región del informe.</FieldError>
    </Field>
  ),
}
