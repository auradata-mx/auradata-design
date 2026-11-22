import type { Meta, StoryObj } from '@storybook/react-vite'
import { ChartColumnIcon, DatabaseIcon, SparklesIcon } from 'lucide-react'
import { expect, fireEvent } from 'storybook/test'

import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SpotlightCard } from '@/components/ui/spotlight-card'

const meta = {
  title: 'AuraData/Spotlight card',
  component: SpotlightCard,
} satisfies Meta<typeof SpotlightCard>

export default meta
type Story = StoryObj<typeof meta>

const FEATURES = [
  { icon: ChartColumnIcon, title: 'Informes al instante', description: 'Arrastra tus datos y obtén un tablero en minutos.' },
  { icon: DatabaseIcon, title: 'Tus fuentes, conectadas', description: 'Excel, bases de datos y sistemas contables en un solo lugar.' },
  { icon: SparklesIcon, title: 'Pregúntale a tus datos', description: 'Escribe la pregunta y recibe la respuesta con su gráfica.' },
]

/** A glow follows the mouse over the card and lights its edge. It shows only with a mouse or pen. */
export const Default: Story = {
  render: () => (
    <div className="grid gap-4 md:grid-cols-3">
      {FEATURES.map(({ icon: Icon, title, description }) => (
        <SpotlightCard key={title}>
          <CardHeader className="gap-3">
            <Icon aria-hidden className="size-5 text-primary" />
            <CardTitle className="text-base">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
        </SpotlightCard>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const card = canvasElement.querySelector<HTMLElement>('[data-slot=card]')!
    const layers = card.querySelectorAll('[data-slot^=spotlight]')
    await expect(layers).toHaveLength(2)
    for (const layer of layers) await expect(layer).toHaveAttribute('aria-hidden', 'true')

    // The glow centers where the mouse is, in the card's own coordinates.
    const box = card.getBoundingClientRect()
    fireEvent.pointerMove(card, { clientX: box.left + 40, clientY: box.top + 30, pointerType: 'mouse' })
    await expect(card.style.getPropertyValue('--spotlight-x')).toBe('40px')
    await expect(card.style.getPropertyValue('--spotlight-y')).toBe('30px')
    // A finger does not move it.
    fireEvent.pointerMove(card, { clientX: box.left + 90, clientY: box.top + 90, pointerType: 'touch' })
    await expect(card.style.getPropertyValue('--spotlight-x')).toBe('40px')
  },
}
