import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import { DatePicker, DateTimePicker } from '@/components/ui/date-picker'
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { TimePicker } from '@/components/ui/time-picker'
import { blur, expectSoftFieldBorder } from './play-helpers'

const TODAY = new Date(2026, 10, 21)

const meta = {
  title: 'AuraData/Date picker',
  component: DatePicker,
  args: { today: TODAY, onValueChange: fn() },
  render: (args) => (
    <Field className="max-w-64">
      <FieldLabel htmlFor={args.id}>Fecha de entrega</FieldLabel>
      <DatePicker {...args} />
    </Field>
  ),
} satisfies Meta<typeof DatePicker>

export default meta
type Story = StoryObj<typeof meta>

/** A chosen day, as the voice guide writes it: «28 nov 2026». The field reads 3:1, as the text controls. */
export const Default: Story = {
  args: { id: 'due', defaultValue: new Date(2026, 10, 28) },
  play: async ({ canvasElement }) => {
    const field = within(canvasElement).getByRole('button', { name: 'Fecha de entrega' })
    await expect(field).toHaveTextContent('28 nov 2026')
    await expectSoftFieldBorder(field)
  },
}

export const Empty: Story = { args: { id: 'due-empty' } }

/** Open, for the visual tests: the Spanish calendar, today ringed, the chosen day filled. */
export const Open: Story = { args: { id: 'due-open', defaultValue: new Date(2026, 10, 28), defaultOpen: true } }

/** Only weekdays from today on: past days and weekends cannot be picked. */
export const WeekdaysOnly: Story = {
  name: 'Weekdays only',
  args: { id: 'due-weekdays', defaultOpen: true, disabledDays: [{ before: TODAY }, { dayOfWeek: [0, 6] }] },
}

/** Clicking a day sets it, closes the calendar and gives the focus back to the field. */
export const Choosing: Story = {
  args: { id: 'due-choosing' },
  play: async ({ args, canvasElement }) => {
    const field = within(canvasElement).getByRole('button', { name: 'Fecha de entrega' })
    await userEvent.click(field)
    const dialog = await within(document.body).findByRole('dialog', { name: 'Calendario' })
    await userEvent.click(within(dialog).getByRole('button', { name: /25 de noviembre/ }))
    await waitFor(() => expect(within(document.body).queryByRole('dialog')).toBeNull())
    await expect(field).toHaveTextContent('25 nov 2026')
    await expect(args.onValueChange).toHaveBeenLastCalledWith(new Date(2026, 10, 25))
    await waitFor(() => expect(field).toHaveFocus())
    blur()
  },
}

/** The keyboard alone: Enter opens on today, the arrows move by day and week, Enter picks, Escape would close. */
export const Keyboard: Story = {
  args: { id: 'due-keyboard' },
  play: async ({ args, canvasElement }) => {
    const field = within(canvasElement).getByRole('button', { name: 'Fecha de entrega' })
    field.focus()
    await userEvent.keyboard('{Enter}')
    const dialog = await within(document.body).findByRole('dialog', { name: 'Calendario' })
    await waitFor(() =>
      expect(within(dialog).getByRole('button', { name: /^Hoy, sábado, 21 de noviembre/ })).toHaveFocus()
    )
    await expect(within(dialog).getByRole('button', { name: 'Ir al mes anterior' })).toBeInTheDocument()
    // One key at a time: the calendar moves its focus after each one renders.
    await userEvent.keyboard('{ArrowDown}')
    await waitFor(() => expect(within(dialog).getByRole('button', { name: /28 de noviembre/ })).toHaveFocus())
    await userEvent.keyboard('{ArrowRight}')
    await waitFor(() => expect(within(dialog).getByRole('button', { name: /29 de noviembre/ })).toHaveFocus())
    await userEvent.keyboard('{Enter}')
    await waitFor(() => expect(within(document.body).queryByRole('dialog')).toBeNull())
    await expect(args.onValueChange).toHaveBeenLastCalledWith(new Date(2026, 10, 29))
    await expect(field).toHaveTextContent('29 nov 2026')
    blur()
  },
}

export const Invalid: Story = {
  args: { id: 'due-invalid', 'aria-invalid': true },
  render: (args) => (
    <Field className="max-w-64" data-invalid>
      <FieldLabel htmlFor={args.id}>Fecha de entrega</FieldLabel>
      <DatePicker {...args} />
      <FieldError>Elige el día en que se envía el informe.</FieldError>
    </Field>
  ),
}

export const Disabled: Story = {
  args: { id: 'due-disabled', defaultValue: new Date(2026, 10, 28), disabled: true },
  render: (args) => (
    <Field className="max-w-64" data-disabled>
      <FieldLabel htmlFor={args.id}>Fecha de entrega</FieldLabel>
      <DatePicker {...args} />
    </Field>
  ),
}

/** A time alone: 24-hour, every 30 minutes; typing «14» jumps to 14:00. */
export const Time: Story = {
  render: () => (
    <Field className="max-w-40">
      <FieldLabel htmlFor="send-time">Hora de envío</FieldLabel>
      <TimePicker id="send-time" defaultValue="09:00" />
    </Field>
  ),
}

/** Working hours in 15-minute steps, chosen with the keyboard: Enter opens, typing jumps, Enter picks. */
export const TimeKeyboard: Story = {
  name: 'Time keyboard',
  render: (args) => (
    <Field className="max-w-40">
      <FieldLabel htmlFor="send-time-keyboard">Hora de envío</FieldLabel>
      <TimePicker
        id="send-time-keyboard"
        step={15}
        min="08:00"
        max="18:00"
        onValueChange={args.onValueChange as (time: string | null) => void}
      />
      <FieldDescription>De 8:00 a 18:00.</FieldDescription>
    </Field>
  ),
  play: async ({ args, canvasElement }) => {
    const trigger = within(canvasElement).getByRole('combobox', { name: 'Hora de envío' })
    await expect(trigger).toHaveTextContent('Hora')
    trigger.focus()
    await userEvent.keyboard('{Enter}')
    await within(document.body).findByRole('listbox')
    await userEvent.keyboard('14')
    await waitFor(() => expect(within(document.body).getByRole('option', { name: '14:00' })).toHaveFocus())
    await userEvent.keyboard('{ArrowDown}{Enter}')
    await waitFor(() => expect(trigger).toHaveTextContent('14:15'))
    await expect(args.onValueChange).toHaveBeenLastCalledWith('14:15')
    // The list animates out before it unmounts; axe runs after the play.
    await waitFor(() => expect(within(document.body).queryByRole('listbox')).toBeNull())
    blur()
  },
}

/** A day and a time in one value: picking the day keeps the time, picking the time keeps the day. */
export const DateAndTime: Story = {
  name: 'Date and time',
  tags: ['mobile'],
  render: (args) => (
    <Field className="max-w-sm">
      <FieldLabel htmlFor="send-at">Enviar el</FieldLabel>
      <DateTimePicker
        id="send-at"
        today={TODAY}
        defaultValue={new Date(2026, 10, 24, 9, 0)}
        onValueChange={args.onValueChange}
      />
      <FieldDescription>Hora de la Ciudad de México.</FieldDescription>
    </Field>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('button', { name: 'Enviar el' })).toHaveTextContent('24 nov 2026')
    await expect(canvas.getByRole('combobox', { name: 'Hora' })).toHaveTextContent('09:00')
    await userEvent.click(canvas.getByRole('combobox', { name: 'Hora' }))
    await userEvent.click(await within(document.body).findByRole('option', { name: '16:30' }))
    await waitFor(() => expect(args.onValueChange).toHaveBeenLastCalledWith(new Date(2026, 10, 24, 16, 30)))
    await userEvent.click(canvas.getByRole('button', { name: 'Enviar el' }))
    const dialog = await within(document.body).findByRole('dialog', { name: 'Calendario' })
    await userEvent.click(within(dialog).getByRole('button', { name: /26 de noviembre/ }))
    await waitFor(() => expect(args.onValueChange).toHaveBeenLastCalledWith(new Date(2026, 10, 26, 16, 30)))
    await waitFor(() => expect(within(document.body).queryByRole('dialog')).toBeNull())
    blur()
  },
}
