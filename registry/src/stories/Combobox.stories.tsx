import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from '@/components/ui/combobox'
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { blur, expectBorderReads, expectDestructiveBorder } from './play-helpers'

const DATASETS = [
  'Pedidos 2026',
  'Clientes',
  'Inventario por sucursal',
  'Ventas por región',
  'Nómina',
  'Presupuesto anual',
]

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
export const Open: Story = {
  ...Default,
  args: { ...Default.args, defaultOpen: true },
}

/** A search that matches no dataset. */
export const NoResults: Story = {
  ...Default,
  name: 'No results',
  args: { ...Default.args, defaultOpen: true, defaultInputValue: 'facturas' },
}

export const Selected: Story = {
  ...Default,
  args: { ...Default.args, defaultValue: 'Ventas por región' },
}

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
    const input = within(canvasElement).getByRole('combobox', {
      name: 'Dataset',
    })
    await userEvent.type(input, 'ventas')
    await waitFor(() => expect(body.getAllByRole('option')).toHaveLength(1))
    await userEvent.click(body.getByRole('option', { name: 'Ventas por región' }))
    await expect(args.onValueChange).toHaveBeenCalledWith('Ventas por región', expect.anything())
    await waitFor(() => expect(input).toHaveValue('Ventas por región'))
    await waitFor(() => expect(body.queryByRole('listbox')).toBeNull())
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}

type MultipleProps = {
  id: string
  label?: string
  placeholder?: string
  invalid?: boolean
  disabled?: boolean
  items?: string[]
  defaultValue?: string[]
  defaultOpen?: boolean
  onValueChange?: (value: string[]) => void
}

/**
 * A multiselect: the combobox with `multiple`, its value drawn as chips inside the field. While the list is open,
 * Base UI hides everything outside the field from assistive tech, the label too, so the input and the list name
 * themselves with `aria-labelledby`.
 */
function DatasetsMultiple({
  id,
  label = 'Datasets',
  placeholder = 'Busca un dataset',
  invalid,
  disabled,
  items = DATASETS,
  ...props
}: MultipleProps) {
  const anchor = useComboboxAnchor()
  return (
    <Field className="max-w-sm" data-invalid={invalid || undefined} data-disabled={disabled || undefined}>
      <FieldLabel id={`${id}-label`} htmlFor={id}>
        {label}
      </FieldLabel>
      <Combobox multiple items={items} disabled={disabled} {...props}>
        <ComboboxChips ref={anchor}>
          <ComboboxValue>
            {(values: string[]) => (
              <>
                {values.map((value) => (
                  <ComboboxChip key={value}>{value}</ComboboxChip>
                ))}
                <ComboboxChipsInput
                  id={id}
                  aria-labelledby={`${id}-label`}
                  placeholder={values.length ? undefined : placeholder}
                  aria-invalid={invalid || undefined}
                  disabled={disabled}
                />
              </>
            )}
          </ComboboxValue>
        </ComboboxChips>
        <ComboboxContent anchor={anchor}>
          <ComboboxEmpty>Sin resultados</ComboboxEmpty>
          <ComboboxList aria-labelledby={`${id}-label`}>
            {(dataset: string) => (
              <ComboboxItem key={dataset} value={dataset}>
                {dataset}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      {invalid ? (
        <FieldError>Elige al menos un dataset.</FieldError>
      ) : (
        <FieldDescription>El informe cruza los datasets que elijas.</FieldDescription>
      )}
    </Field>
  )
}

/**
 * Multiselect: `multiple` keeps the list open after a pick, so several datasets go in a row. Each choice is a chip
 * with its own «Quitar» button; the field keeps the 3:1 border of the text controls, light and dark.
 */
export const Multiple: Story = {
  render: () => <DatasetsMultiple id="datasets" defaultValue={['Pedidos 2026', 'Clientes']} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('button', { name: 'Quitar Pedidos 2026' })).toBeInTheDocument()
    const chips = canvasElement.querySelector<HTMLElement>('[data-slot=combobox-chips]')!
    await expectBorderReads(chips)
    // Focused, the field keeps its border: the brand outline alone marks the focus.
    const before = getComputedStyle(chips).borderTopColor
    canvas.getByRole('combobox', { name: 'Datasets' }).focus()
    await expect(getComputedStyle(chips).borderTopColor).toBe(before)
    blur()
  },
}

/** Many choices wrap onto new lines; on a phone the field grows instead of scrolling sideways. */
export const MultipleMany: Story = {
  name: 'Multiple many',
  tags: ['mobile'],
  render: () => (
    <DatasetsMultiple
      id="datasets-many"
      defaultValue={['Pedidos 2026', 'Clientes', 'Inventario por sucursal', 'Ventas por región', 'Nómina']}
    />
  ),
}

/** Open, for the visual tests: the chosen datasets carry the check in the list. */
export const MultipleOpen: Story = {
  name: 'Multiple open',
  render: () => <DatasetsMultiple id="datasets-open" defaultValue={['Clientes']} defaultOpen />,
}

export const MultipleInvalid: Story = {
  name: 'Multiple invalid',
  render: () => <DatasetsMultiple id="datasets-invalid" invalid />,
  play: async ({ canvasElement }) => {
    await expectDestructiveBorder(canvasElement.querySelector<HTMLElement>('[data-slot=combobox-chips]')!)
  },
}

export const MultipleDisabled: Story = {
  name: 'Multiple disabled',
  render: () => <DatasetsMultiple id="datasets-disabled" disabled defaultValue={['Pedidos 2026', 'Clientes']} />,
}

/**
 * The keyboard alone: type to search, Enter adds the highlighted dataset, Backspace on an empty search removes the
 * last chip, ArrowLeft moves onto the chips and Delete removes the focused one.
 */
export const MultipleKeyboard: Story = {
  name: 'Multiple keyboard',
  render: (args) => (
    <DatasetsMultiple
      id="datasets-keyboard"
      defaultValue={['Pedidos 2026']}
      onValueChange={args.onValueChange as MultipleProps['onValueChange']}
    />
  ),
  args: { onValueChange: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    const input = canvas.getByRole('combobox', { name: 'Datasets' })
    await userEvent.click(input)
    await userEvent.type(input, 'nóm')
    await waitFor(() => expect(body.getAllByRole('option')).toHaveLength(1))
    await userEvent.keyboard('{ArrowDown}{Enter}')
    await waitFor(() =>
      expect(args.onValueChange).toHaveBeenLastCalledWith(['Pedidos 2026', 'Nómina'], expect.anything())
    )
    await waitFor(() => expect(input).toHaveValue(''))
    await userEvent.keyboard('{Escape}{Backspace}')
    await waitFor(() => expect(args.onValueChange).toHaveBeenLastCalledWith(['Pedidos 2026'], expect.anything()))
    await userEvent.keyboard('{ArrowLeft}')
    await waitFor(() => expect(document.activeElement).toHaveTextContent('Pedidos 2026'))
    await userEvent.keyboard('{Delete}')
    await waitFor(() => expect(args.onValueChange).toHaveBeenLastCalledWith([], expect.anything()))
    await waitFor(() => expect(document.activeElement).toBe(input))
    await waitFor(() => expect(canvas.queryByRole('button', { name: /^Quitar/ })).toBeNull())
    blur()
  },
}

const TAGS = ['finanzas', 'ventas', 'mensual', 'dirección']

/**
 * Tags: the same multiselect, plus a «Crear «…»» option for a word that is not on the list yet. Enter adds it as a
 * new tag; the list keeps the tags already created.
 */
function ReportTags({ defaultValue = ['finanzas'] }: { defaultValue?: string[] }) {
  const anchor = useComboboxAnchor()
  const [tags, setTags] = React.useState(TAGS)
  const [value, setValue] = React.useState(defaultValue)
  const [query, setQuery] = React.useState('')
  const typed = query.trim().toLocaleLowerCase('es-MX')
  const isNew = typed !== '' && !tags.includes(typed)
  const items = isNew ? [...tags, CREATE + typed] : tags
  return (
    <Field className="max-w-sm">
      <FieldLabel id="report-tags-label" htmlFor="report-tags">
        Etiquetas
      </FieldLabel>
      <Combobox
        multiple
        items={items}
        value={value}
        inputValue={query}
        onInputValueChange={setQuery}
        onValueChange={(next: string[]) => {
          const created = next.find((tag) => tag.startsWith(CREATE))
          if (created) {
            const tag = created.slice(CREATE.length)
            setTags((current) => [...current, tag])
            next = next.map((entry) => (entry === created ? tag : entry))
          }
          setValue(next)
          setQuery('')
        }}
      >
        <ComboboxChips ref={anchor}>
          <ComboboxValue>
            {(values: string[]) => (
              <>
                {values.map((tag) => (
                  <ComboboxChip key={tag}>{tag}</ComboboxChip>
                ))}
                <ComboboxChipsInput
                  id="report-tags"
                  aria-labelledby="report-tags-label"
                  placeholder={values.length ? undefined : 'Agrega una etiqueta'}
                />
              </>
            )}
          </ComboboxValue>
        </ComboboxChips>
        <ComboboxContent anchor={anchor}>
          <ComboboxList aria-labelledby="report-tags-label">
            {(tag: string) => (
              <ComboboxItem key={tag} value={tag}>
                {tag.startsWith(CREATE) ? `Crear «${tag.slice(CREATE.length)}»` : tag}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      <FieldDescription>Escribe una etiqueta nueva y presiona Enter para crearla.</FieldDescription>
    </Field>
  )
}

/** Marks the option that creates the typed tag; never shown, never stored. */
const CREATE = '\u0000create:'

export const Tags: Story = {
  render: () => <ReportTags />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    const input = canvas.getByRole('combobox', { name: 'Etiquetas' })
    await userEvent.click(input)
    await userEvent.type(input, 'Trimestral')
    await waitFor(() => expect(body.getByRole('option', { name: 'Crear «trimestral»' })).toBeInTheDocument())
    await userEvent.keyboard('{ArrowDown}{Enter}')
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Quitar trimestral' })).toBeInTheDocument())
    await waitFor(() => expect(input).toHaveValue(''))
    await userEvent.keyboard('{Escape}')
    blur()
  },
}
