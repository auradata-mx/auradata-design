import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'

import { InsightCard } from '@/components/ui/insight-card'

const meta = {
  title: 'AuraData/Insight card',
  component: InsightCard,
  args: {
    title: 'El Norte creció más que ninguna región',
    value: '$1.39 M',
    change: 0.094,
    comparison: 'vs. octubre',
    description: 'Lo impulsaron las ventas en línea de Monterrey, que se duplicaron.',
    action: { onClick: fn() },
  },
  decorators: [(Story) => <div className="w-full max-w-md">{Story()}</div>],
} satisfies Meta<typeof InsightCard>

export default meta
type Story = StoryObj<typeof meta>

/** A finding, its metric and «Ver detalle», which calls the app. */
export const Default: Story = {
  tags: ['mobile'],
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const card = canvas.getByRole('article', { name: 'El Norte creció más que ninguna región' })
    await expect(within(card).getByText('Hallazgo')).toBeVisible()
    const change = card.querySelector('[data-tone]')!
    await expect(change).toHaveTextContent(/^\+9\.4\s%\s*vs\. octubre$/)
    await expect(change).toHaveAttribute('data-tone', 'good')
    await userEvent.click(within(card).getByRole('button', { name: 'Ver detalle' }))
    await expect(args.action!.onClick).toHaveBeenCalled()
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}

/** A cost that went up is bad news: `goodDirection="down"`; the action is a link here. */
export const BadNews: Story = {
  args: {
    title: 'El costo de envío subió en el Sur',
    value: '$182,400',
    change: 0.12,
    goodDirection: 'down',
    comparison: 'vs. octubre',
    description: 'Dos rutas nuevas sin consolidar pedidos.',
    action: { label: 'Ver rutas', href: '#rutas' },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvasElement.querySelector('[data-tone]')).toHaveAttribute('data-tone', 'bad')
    await expect(canvas.getByRole('link', { name: 'Ver rutas' })).toHaveAttribute('href', '#rutas')
  },
}

/** Without a change or a description: the finding and its number alone. */
export const Minimal: Story = {
  args: { change: undefined, description: undefined, comparison: undefined, title: 'Tu mejor día fue el 15 de noviembre', value: '$214,800' },
}
