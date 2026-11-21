import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'

import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'

const PERIODS = [
  { value: 'week', label: 'Esta semana' },
  { value: 'month', label: 'Este mes' },
  { value: 'quarter', label: 'Este trimestre' },
  { value: 'year', label: 'Este año' },
]

const meta = {
  title: 'Components/Select',
  component: Select,
  args: { items: PERIODS, defaultValue: 'month' },
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Select {...args}>
      <SelectTrigger className="w-48" aria-label="Periodo">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Periodo</SelectLabel>
          {PERIODS.map((period) => (
            <SelectItem key={period.value} value={period.value}>
              {period.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
}

/** Open, for the visual tests and to see the overlay. */
export const Open: Story = { ...Default, args: { ...Default.args, defaultOpen: true } }

/** Reached with the keyboard (Tab): `:focus-visible` shows the focus ring, as in the screenshot. */
export const Focus: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    await userEvent.tab()
    await expect(document.activeElement).toBe(within(canvasElement).getByRole('combobox', { name: 'Periodo' }))
  },
}

/** The small trigger, as the data table's page size uses it. */
export const Small: Story = {
  render: (args) => (
    <Select {...args}>
      <SelectTrigger size="sm" className="w-40" aria-label="Periodo">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {PERIODS.map((period) => (
          <SelectItem key={period.value} value={period.value}>
            {period.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ),
}

/** No value yet: the trigger shows the placeholder in the muted color. */
export const Placeholder: Story = {
  args: { defaultValue: null },
  render: (args) => (
    <Field className="max-w-xs">
      <FieldLabel htmlFor="period-empty">Periodo</FieldLabel>
      <Select {...args}>
        <SelectTrigger id="period-empty" className="w-48">
          <SelectValue placeholder="Elige un periodo" />
        </SelectTrigger>
        <SelectContent>
          {PERIODS.map((period) => (
            <SelectItem key={period.value} value={period.value}>
              {period.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  ),
}

export const Disabled: Story = {
  render: (args) => (
    <Field className="max-w-xs" data-disabled>
      <FieldLabel htmlFor="period-disabled">Periodo</FieldLabel>
      <Select {...args} disabled>
        <SelectTrigger id="period-disabled" className="w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {PERIODS.map((period) => (
            <SelectItem key={period.value} value={period.value}>
              {period.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FieldDescription>El periodo lo fija el informe.</FieldDescription>
    </Field>
  ),
}

export const Invalid: Story = {
  args: { defaultValue: null },
  render: (args) => (
    <Field className="max-w-xs" data-invalid>
      <FieldLabel htmlFor="period-invalid">Periodo</FieldLabel>
      <Select {...args}>
        <SelectTrigger id="period-invalid" className="w-48" aria-invalid>
          <SelectValue placeholder="Elige un periodo" />
        </SelectTrigger>
        <SelectContent>
          {PERIODS.map((period) => (
            <SelectItem key={period.value} value={period.value}>
              {period.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FieldError>Elige el periodo del informe.</FieldError>
    </Field>
  ),
}

const DATASETS = [
  { value: 'pedidos', label: 'Pedidos 2026' },
  { value: 'rentabilidad', label: 'Rentabilidad por sucursal y línea de producto, Bajío y Occidente' },
]

/** A selected value longer than the trigger: it is cut at the edge (no ellipsis, L37), the chevron stays in place. */
export const LongValue: Story = {
  name: 'Long value',
  args: { items: DATASETS, defaultValue: 'rentabilidad' },
  render: (args) => (
    <Select {...args}>
      <SelectTrigger className="w-56" aria-label="Dataset">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {DATASETS.map((dataset) => (
          <SelectItem key={dataset.value} value={dataset.value}>
            {dataset.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ),
}
