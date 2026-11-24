import type { Meta, StoryObj } from '@storybook/react-vite'
import { LayoutDashboardIcon } from 'lucide-react'
import { expect, fn, userEvent, within } from 'storybook/test'

import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyError,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

const meta = {
  title: 'AuraData/Empty state',
  component: Empty,
} satisfies Meta<typeof Empty>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Empty className="border" {...args}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <LayoutDashboardIcon />
        </EmptyMedia>
        <EmptyTitle>Aún no hay informes</EmptyTitle>
        <EmptyDescription>Crea el primero desde un dataset o importa uno de Power BI.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button>Nuevo informe</Button>
      </EmptyContent>
    </Empty>
  ),
}

/** `EmptyMedia` in its default variant: the content as is, here the Continua isotipo, no tile behind it. */
export const DefaultMedia: Story = {
  name: 'Default media',
  render: () => (
    <Empty className="border">
      <EmptyHeader>
        <EmptyMedia>
          <img src="/brand/continua/isotipo-color.svg" alt="" className="size-12" />
        </EmptyMedia>
        <EmptyTitle>Conecta tu primera fuente de datos</EmptyTitle>
        <EmptyDescription>Con una conexión puedes crear datasets e informes.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button>Conectar</Button>
      </EmptyContent>
    </Empty>
  ),
}

/** A long title and description wrap inside the empty state's narrow column. */
export const LongText: Story = {
  name: 'Long text',
  render: () => (
    <Empty className="border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <LayoutDashboardIcon />
        </EmptyMedia>
        <EmptyTitle>Ningún informe del espacio Operaciones Norte coincide con los filtros de región, periodo y dueño</EmptyTitle>
        <EmptyDescription>
          Quita alguno de los filtros o cambia el periodo. Los informes archivados no aparecen aquí: búscalos en el
          historial del espacio, donde se guardan 12 meses.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline">Quitar filtros</Button>
      </EmptyContent>
    </Empty>
  ),
}

type ErrorStory = StoryObj<typeof EmptyError>

const renderError: ErrorStory['render'] = (args) => <EmptyError {...args} />

/** `EmptyError`: something failed where content should be, with «Reintentar». */
export const ErrorDefault: ErrorStory = { args: { onRetry: () => {} }, render: renderError }

/** A chart that failed to load, with the error for support. */
export const ErrorWithDetail: ErrorStory = {
  args: {
    onRetry: () => {},
    title: 'No pudimos cargar la gráfica',
    description: 'La consulta a «Ventas por región» tardó demasiado. Reintenta o revisa el dataset.',
    detail: 'QueryTimeoutError: la consulta superó 60 s\n  dataset: ventas_2026 (id 42)\n  solicitud: 7f3c9a1e',
  },
  render: renderError,
}

/** The detail unfolded, for the visual tests. */
export const ErrorDetailOpen: ErrorStory = {
  ...ErrorWithDetail,
  play: async ({ canvasElement }) => {
    canvasElement.querySelector('details')?.setAttribute('open', '')
  },
}

/** «Reintentar» calls `onRetry`. */
export const ErrorRetry: ErrorStory = {
  args: { onRetry: fn() },
  render: renderError,
  play: async ({ args, canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Reintentar' }))
    await expect(args.onRetry).toHaveBeenCalledOnce()
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}
