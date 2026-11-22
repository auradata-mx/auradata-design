import type { Meta, StoryObj } from '@storybook/react-vite'
import { DatabaseIcon } from 'lucide-react'

import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'

const meta = {
  title: 'Components/Hover card',
  component: HoverCard,
} satisfies Meta<typeof HoverCard>

export default meta
type Story = StoryObj<typeof meta>

/** A dataset link previews its source, rows and last refresh. */
export const Default: Story = {
  render: (args) => (
    <p className="text-sm">
      Este informe lee{' '}
      <HoverCard {...args}>
        <HoverCardTrigger href="#pedidos-2026" className="font-medium text-primary underline underline-offset-4">
          Pedidos 2026
        </HoverCardTrigger>
        <HoverCardContent className="w-72">
          <div className="flex gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted">
              <DatabaseIcon aria-hidden className="size-4" />
            </span>
            <div className="grid gap-1">
              <p className="font-medium">Pedidos 2026</p>
              <p className="text-muted-foreground">PostgreSQL · ventas.pedidos · 1.2&nbsp;M filas</p>
              <p className="text-xs text-muted-foreground">Se actualizó hoy a las 9:00</p>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
      .
    </p>
  ),
}

/** Open, for the visual tests and to see the overlay. */
export const Open: Story = { ...Default, args: { ...Default.args, defaultOpen: true } }
