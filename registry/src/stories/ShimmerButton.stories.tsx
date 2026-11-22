import type { Meta, StoryObj } from '@storybook/react-vite'
import { ArrowRightIcon } from 'lucide-react'
import { expect } from 'storybook/test'

import { ShimmerButton } from '@/components/ui/shimmer-button'

const meta = {
  title: 'AuraData/Shimmer button',
  component: ShimmerButton,
  args: { size: 'lg', children: 'Iniciar proyecto' },
} satisfies Meta<typeof ShimmerButton>

export default meta
type Story = StoryObj<typeof meta>

/**
 * The main call to action of a marketing page: a sheen crosses it every few seconds. One per page;
 * reduced motion hides the sheen.
 */
export const Default: Story = {
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: 'Iniciar proyecto' })
    const sheen = button.querySelector('[data-slot=shimmer]')!
    await expect(sheen).toHaveAttribute('aria-hidden', 'true')
    await expect(getComputedStyle(sheen).animationName).toBe('shimmer-sweep')
    await expect(getComputedStyle(sheen).pointerEvents).toBe('none')
  },
}

/** With a trailing icon, as a link. */
export const AsLink: Story = {
  args: {
    render: <a href="#contacto" />,
    nativeButton: false,
    children: (
      <>
        Agenda una demo
        <ArrowRightIcon data-icon="inline-end" />
      </>
    ),
  },
}

/** Busy: the spinner shows and the sheen stops, so nothing competes with it. */
export const Loading: Story = {
  args: { loading: true, children: 'Enviando…' },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: 'Enviando…' })
    await expect(button).toHaveAttribute('aria-busy', 'true')
    await expect(button.querySelector('[data-slot=shimmer]')).toBeNull()
  },
}
