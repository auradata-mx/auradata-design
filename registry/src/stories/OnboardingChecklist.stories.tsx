import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'

import { OnboardingChecklist, type OnboardingStep } from '@/components/ui/onboarding-checklist'

const STEPS: OnboardingStep[] = [
  { id: 'account', title: 'Crea tu cuenta', done: true },
  {
    id: 'connection',
    title: 'Conecta tu primera base de datos',
    description: 'PostgreSQL, MySQL, SQL Server o un archivo de Excel.',
    action: { label: 'Conectar', onClick: () => {} },
  },
  {
    id: 'report',
    title: 'Crea tu primer informe',
    description: 'Elige un dataset y arma tus gráficas.',
    action: { label: 'Nuevo informe', onClick: () => {} },
  },
  {
    id: 'team',
    title: 'Invita a tu equipo',
    description: 'Comparte tus informes con quien los necesita.',
    action: { label: 'Invitar', href: '#equipo' },
  },
]

const meta = {
  title: 'AuraData/Onboarding checklist',
  component: OnboardingChecklist,
  args: { steps: STEPS, onDismiss: fn() },
  decorators: [(Story) => <div className="w-full max-w-md">{Story()}</div>],
} satisfies Meta<typeof OnboardingChecklist>

export default meta
type Story = StoryObj<typeof meta>

/** The progress reads «1 de 4 pasos»; the next step leads with the primary button. */
export const Default: Story = {
  tags: ['mobile'],
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const progress = canvas.getByRole('progressbar', { name: 'Progreso' })
    await expect(progress).toHaveAttribute('aria-valuetext', '1 de 4 pasos')
    await expect(canvas.getByText('1 de 4 pasos')).toBeVisible()
    // A finished step says so to screen readers, not only with its check.
    await expect(canvas.getByRole('listitem', { name: /Crea tu cuenta/ })).toHaveAccessibleName('Crea tu cuenta (hecho)')
    await expect(canvas.getByRole('button', { name: 'Conectar' })).toHaveAttribute('data-variant', 'default')
    await expect(canvas.getByRole('button', { name: 'Nuevo informe' })).toHaveAttribute('data-variant', 'outline')
    const invite = canvas.getByRole('link', { name: 'Invitar' })
    await expect(invite).toHaveAttribute('href', '#equipo')
    // A link step is an outline button too: its border shows, as on «Nuevo informe».
    await expect(getComputedStyle(invite).borderTopColor).toBe(
      getComputedStyle(canvas.getByRole('button', { name: 'Nuevo informe' })).borderTopColor,
    )
    await userEvent.click(canvas.getByRole('button', { name: 'Ocultar guía' }))
    await expect(args.onDismiss).toHaveBeenCalled()
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}

/** Every step done: a closing message and «Listo», which hides the guide. */
export const Complete: Story = {
  args: { steps: STEPS.map((step) => ({ ...step, done: true })) },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('progressbar', { name: 'Progreso' })).toHaveAttribute('aria-valuetext', '4 de 4 pasos')
    await expect(canvas.getByText('Todo listo. Ya puedes explorar tus datos.')).toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: 'Listo' }))
    await expect(args.onDismiss).toHaveBeenCalled()
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}

/** Without `onDismiss` the guide cannot be hidden; a custom title and description. */
export const NotDismissible: Story = {
  args: {
    onDismiss: undefined,
    title: 'Prepara tu espacio de Finanzas',
    description: 'Tres pasos para tener tu primer informe hoy.',
    steps: STEPS.slice(1),
  },
}
