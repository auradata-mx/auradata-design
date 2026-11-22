import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

import { Button } from '@/components/ui/button'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { EmptyIllustration, type EmptyIllustrationName } from '@/components/ui/empty-illustration'

const STATES: { name: EmptyIllustrationName; title: string; description: string; action: string; outline?: boolean }[] = [
  { name: 'reports', title: 'Aún no hay informes', description: 'Crea el primero desde un dataset.', action: 'Nuevo informe' },
  {
    name: 'data',
    title: 'Este dataset no tiene datos',
    description: 'Revisa el filtro de la consulta o carga un archivo.',
    action: 'Cargar archivo',
  },
  {
    name: 'results',
    title: 'Sin resultados para «nómina»',
    description: 'Prueba con otra palabra o quita los filtros.',
    action: 'Quitar filtros',
    outline: true,
  },
  {
    name: 'offline',
    title: 'Sin conexión',
    description: 'Revisa tu internet. Lo intentamos de nuevo en cuanto vuelva.',
    action: 'Reintentar',
    outline: true,
  },
]

function State({ name }: { name: EmptyIllustrationName }) {
  const state = STATES.find((entry) => entry.name === name)!
  return (
    <Empty className="border">
      <EmptyHeader>
        <EmptyMedia>
          <EmptyIllustration name={state.name} />
        </EmptyMedia>
        <EmptyTitle>{state.title}</EmptyTitle>
        <EmptyDescription>{state.description}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant={state.outline ? 'outline' : 'default'}>{state.action}</Button>
      </EmptyContent>
    </Empty>
  )
}

const meta = {
  title: 'AuraData/Empty illustrations',
  component: State,
  args: { name: 'reports' },
  argTypes: { name: { control: 'inline-radio', options: STATES.map((state) => state.name) } },
} satisfies Meta<typeof State>

export default meta
type Story = StoryObj<typeof meta>

/** «Sin informes» inside an `Empty`: the illustration takes the media slot. */
export const Reports: Story = {
  play: async ({ canvasElement }) => {
    // Decorative: the title says what is missing.
    const art = canvasElement.querySelector('[data-slot=empty-illustration]')!
    await expect(art).toHaveAttribute('aria-hidden', 'true')
    await expect(art).toHaveAttribute('data-name', 'reports')
    await expect(within(canvasElement).getByText('Aún no hay informes')).toBeVisible()
  },
}

/** The four, side by side: sin informes, sin datos, sin resultados, sin conexión. */
export const All: Story = {
  tags: ['mobile'],
  render: () => (
    <div className="grid w-full max-w-4xl gap-4 md:grid-cols-2">
      {STATES.map((state) => (
        <State key={state.name} name={state.name} />
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const names = [...canvasElement.querySelectorAll('[data-slot=empty-illustration]')].map((art) => art.getAttribute('data-name'))
    await expect(names).toEqual(['reports', 'data', 'results', 'offline'])
  },
}

/** A smaller size for a card or a panel. */
export const Small: Story = {
  render: () => (
    <Empty className="max-w-xs border">
      <EmptyHeader>
        <EmptyMedia>
          <EmptyIllustration name="data" size="sm" />
        </EmptyMedia>
        <EmptyTitle>Sin datos en este periodo</EmptyTitle>
        <EmptyDescription>Elige otro rango de fechas.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  ),
}
