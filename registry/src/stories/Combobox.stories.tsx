import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox'
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'

const DATASETS = ['Pedidos 2026', 'Clientes', 'Inventario por sucursal', 'Ventas por región', 'Nómina', 'Presupuesto anual']

const meta = {
  title: 'Components/Combobox',
  component: Combobox,
  args: { items: DATASETS },
} satisfies Meta<typeof Combobox>

export default meta
type Story = StoryObj<typeof meta>

/** Pick a dataset: type to search the list. */
export const Default: Story = {
  render: (args) => (
    <Field className="max-w-xs">
      <FieldLabel htmlFor="dataset">Dataset</FieldLabel>
      <Combobox {...args}>
        <ComboboxInput id="dataset" placeholder="Busca un dataset" />
        <ComboboxContent>
          <ComboboxEmpty>Sin resultados</ComboboxEmpty>
          <ComboboxList>
            {(dataset: string) => (
              <ComboboxItem key={dataset} value={dataset}>
                {dataset}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Field>
  ),
}

/** Open, for the visual tests and to see the overlay. */
export const Open: Story = { ...Default, args: { ...Default.args, defaultOpen: true } }

/** A search that matches no dataset. */
export const NoResults: Story = {
  ...Default,
  name: 'No results',
  args: { ...Default.args, defaultOpen: true, defaultInputValue: 'facturas' },
}

export const Selected: Story = { ...Default, args: { ...Default.args, defaultValue: 'Ventas por región' } }

export const Disabled: Story = {
  render: (args) => (
    <Field className="max-w-xs" data-disabled>
      <FieldLabel htmlFor="dataset-disabled">Dataset</FieldLabel>
      <Combobox {...args} defaultValue="Pedidos 2026" disabled>
        <ComboboxInput id="dataset-disabled" disabled />
        <ComboboxContent>
          <ComboboxList>
            {(dataset: string) => (
              <ComboboxItem key={dataset} value={dataset}>
                {dataset}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      <FieldDescription>El informe ya usa este dataset.</FieldDescription>
    </Field>
  ),
}

export const Invalid: Story = {
  render: (args) => (
    <Field className="max-w-xs" data-invalid>
      <FieldLabel htmlFor="dataset-invalid">Dataset</FieldLabel>
      <Combobox {...args}>
        <ComboboxInput id="dataset-invalid" placeholder="Busca un dataset" aria-invalid />
        <ComboboxContent>
          <ComboboxEmpty>Sin resultados</ComboboxEmpty>
          <ComboboxList>
            {(dataset: string) => (
              <ComboboxItem key={dataset} value={dataset}>
                {dataset}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      <FieldError>Elige el dataset del informe.</FieldError>
    </Field>
  ),
}

/** Typing filters the list; picking an option sets the value and calls `onValueChange`. */
export const Choosing: Story = {
  ...Default,
  args: { ...Default.args, onValueChange: fn() },
  play: async ({ args, canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const input = within(canvasElement).getByRole('combobox', { name: 'Dataset' })
    await userEvent.type(input, 'ventas')
    await waitFor(() => expect(body.getAllByRole('option')).toHaveLength(1))
    await userEvent.click(body.getByRole('option', { name: 'Ventas por región' }))
    await expect(args.onValueChange).toHaveBeenCalledWith('Ventas por región', expect.anything())
    await waitFor(() => expect(input).toHaveValue('Ventas por región'))
    await waitFor(() => expect(body.queryByRole('listbox')).toBeNull())
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}
