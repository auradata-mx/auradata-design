import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

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
export const Open: Story = {
  ...Default,
  args: { ...Default.args, defaultOpen: true },
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('combobox', { name: 'Periodo' })
    const list = await within(document.body).findByRole('listbox')
    const popup = list.closest<HTMLElement>('[data-slot="select-content"]')!
    // A short list opens below the trigger (no scroll arrow over the selected row), with room around its rows.
    // waitFor: the popup zooms in from 95%.
    await waitFor(() => expect(popup.getBoundingClientRect().top).toBeGreaterThanOrEqual(trigger.getBoundingClientRect().bottom))
    await expect(getComputedStyle(list).paddingTop).toBe('4px')
  },
}

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

/**
 * A selected value longer than the trigger ends in «…» and the chevron stays in place; the list shows the full
 * label, wrapped.
 */
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
  play: async ({ canvasElement }) => {
    const value = canvasElement.querySelector<HTMLElement>('[data-slot="select-value"]')!
    await expect(value).toHaveTextContent(DATASETS[1].label)
    await expect(getComputedStyle(value).textOverflow).toBe('ellipsis')
    await expect(value.scrollWidth).toBeGreaterThan(value.clientWidth)
    const trigger = within(canvasElement).getByRole('combobox', { name: 'Dataset' })
    await expect(value.getBoundingClientRect().right).toBeLessThanOrEqual(trigger.getBoundingClientRect().right)
  },
}

/** The list of a long value, open: the option wraps, so the whole label reads there. */
export const LongValueOpen: Story = {
  ...LongValue,
  name: 'Long value open',
  args: { ...LongValue.args, defaultOpen: true },
  play: async () => {
    const option = await within(document.body).findByRole('option', { name: DATASETS[1].label })
    const popup = option.closest<HTMLElement>('[data-slot="select-content"]')!
    await expect(option.scrollWidth).toBeLessThanOrEqual(option.clientWidth)
    await expect(option.getBoundingClientRect().right).toBeLessThanOrEqual(popup.getBoundingClientRect().right)
  },
}
