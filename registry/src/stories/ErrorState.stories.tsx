import type { Meta, StoryObj } from '@storybook/react-vite'

import { ErrorState } from '@/components/ui/error-state'

const meta = {
  title: 'AuraData/Error state',
  component: ErrorState,
  args: { onRetry: () => {} },
} satisfies Meta<typeof ErrorState>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** A chart that failed to load, with the error for support. */
export const WithDetail: Story = {
  args: {
    title: 'No pudimos cargar la gráfica',
    description: 'La consulta a «Ventas por región» tardó demasiado. Reintenta o revisa el dataset.',
    detail: 'QueryTimeoutError: la consulta superó 60 s\n  dataset: ventas_2026 (id 42)\n  solicitud: 7f3c9a1e',
  },
}

/** The detail unfolded, for the visual tests. */
export const DetailOpen: Story = {
  ...WithDetail,
  play: async ({ canvasElement }) => {
    canvasElement.querySelector('details')?.setAttribute('open', '')
  },
}
