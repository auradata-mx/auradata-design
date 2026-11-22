import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Stepper } from '@/components/ui/stepper'
import { blur } from './play-helpers'

const STEPS = [
  { title: 'Base de datos', description: 'PostgreSQL, MySQL o BigQuery' },
  { title: 'Credenciales', description: 'Servidor, usuario y contraseña' },
  { title: 'Probar conexión', description: 'Revisamos que AuraData BI llegue' },
]

const meta = {
  title: 'AuraData/Stepper',
  component: Stepper,
  args: { steps: STEPS, current: 1 },
} satisfies Meta<typeof Stepper>

export default meta
type Story = StoryObj<typeof meta>

const items = (canvasElement: HTMLElement) => within(canvasElement).getAllByRole('listitem')

/**
 * Horizontal, for the top of a wizard: done, current and to come. On a phone only the current step keeps its
 * title; the others keep their number, and screen readers still hear all of them.
 */
export const Horizontal: Story = {
  tags: ['mobile'],
  play: async ({ canvasElement }) => {
    const nav = within(canvasElement).getByRole('navigation', { name: 'Pasos' })
    await expect(nav).toBeInTheDocument()
    const [first, second, third] = items(canvasElement)
    await expect(first).toHaveAttribute('data-status', 'complete')
    await expect(second).toHaveAttribute('aria-current', 'step')
    await expect(third).toHaveAttribute('data-status', 'upcoming')
    await expect(within(first).getByText('Base de datos')).toHaveTextContent('Base de datos (completado)')
  },
}

/** Vertical, for a side column: four steps in every state, the second with something to fix. */
export const Vertical: Story = {
  args: {
    orientation: 'vertical',
    current: 2,
    errors: [1],
    steps: [...STEPS.slice(0, 2), STEPS[2], { title: 'Compartir', description: 'Quién del equipo la puede usar' }],
  },
  render: (args) => <Stepper {...args} className="max-w-xs" />,
  play: async ({ canvasElement }) => {
    await expect(items(canvasElement).map((item) => item.dataset.status)).toEqual([
      'complete',
      'error',
      'current',
      'upcoming',
    ])
    await expect(within(canvasElement).getByText('Credenciales')).toHaveTextContent('Credenciales (con errores)')
  },
}

/** A step with errors in the horizontal stepper: the test failed and the credentials need a look. */
export const WithError: Story = { name: 'With error', args: { current: 2, errors: [1] } }

/** The last step: every step before it done. */
export const LastStep: Story = { name: 'Last step', args: { current: 2 } }

/** «Nueva conexión»: Siguiente moves forward, a done step opens again with a click. */
function NewConnectionWizard({ onFinish }: { onFinish?: () => void }) {
  const [current, setCurrent] = React.useState(0)
  const last = current === STEPS.length - 1
  return (
    <div className="flex max-w-xl flex-col gap-6 rounded-xl border bg-card p-4 sm:p-6">
      <Stepper steps={STEPS} current={current} onStepClick={setCurrent} />
      <section aria-labelledby="wizard-step" className="flex flex-col gap-4">
        <h2 id="wizard-step" className="text-base font-semibold">
          {STEPS[current].title}
        </h2>
        {current === 0 && (
          <Field>
            <FieldLabel htmlFor="wizard-engine">Motor</FieldLabel>
            <Input id="wizard-engine" defaultValue="PostgreSQL" />
          </Field>
        )}
        {current === 1 && (
          <Field>
            <FieldLabel htmlFor="wizard-host">Servidor</FieldLabel>
            <Input id="wizard-host" defaultValue="db.auradata.mx" />
            <FieldDescription>El nombre o la IP del servidor.</FieldDescription>
          </Field>
        )}
        {current === 2 && (
          <p className="text-sm text-muted-foreground">Todo listo. Prueba la conexión antes de guardarla.</p>
        )}
      </section>
      <div className="flex justify-between gap-2">
        <Button variant="outline" disabled={current === 0} onClick={() => setCurrent((step) => step - 1)}>
          Anterior
        </Button>
        <Button onClick={() => (last ? onFinish?.() : setCurrent((step) => step + 1))}>
          {last ? 'Probar y guardar' : 'Siguiente'}
        </Button>
      </div>
    </div>
  )
}

export const Wizard: Story = {
  tags: ['mobile'],
  args: { onStepClick: fn() },
  render: (args) => <NewConnectionWizard onFinish={args.onStepClick as () => void} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const current = () => items(canvasElement).findIndex((item) => item.getAttribute('aria-current') === 'step')
    await expect(current()).toBe(0)
    await userEvent.click(canvas.getByRole('button', { name: 'Siguiente' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Siguiente' }))
    await waitFor(() => expect(current()).toBe(2))
    await expect(canvas.getByRole('heading', { name: 'Probar conexión' })).toBeInTheDocument()
    // A done step is a button that opens it again; the step to come is not.
    await userEvent.click(canvas.getByRole('button', { name: /^Credenciales \(completado\)/ }))
    await waitFor(() => expect(current()).toBe(1))
    await expect(canvas.queryByRole('button', { name: /Probar conexión/ })).toBeNull()
    await expect(canvas.getByLabelText('Servidor')).toHaveValue('db.auradata.mx')
    await userEvent.click(canvas.getByRole('button', { name: 'Siguiente' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Probar y guardar' }))
    await expect(args.onStepClick).toHaveBeenCalled()
    blur()
  },
}
