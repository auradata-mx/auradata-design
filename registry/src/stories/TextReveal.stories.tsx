import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, waitFor } from 'storybook/test'

import { TextReveal } from '@/components/ui/text-reveal'

const meta = {
  title: 'AuraData/Text reveal',
  component: TextReveal,
  parameters: { themeFrame: { padded: false } },
} satisfies Meta<typeof TextReveal>

export default meta
type Story = StoryObj<typeof meta>

const STATEMENT =
  'Dejamos de adivinar. Hoy cada área ve los mismos números, a la misma hora, y las juntas empiezan por la decisión, no por la hoja de cálculo.'

/**
 * Each word rises and lights up from the muted text color as it scrolls into view, one after the
 * other: readable (AA) at every step. It is CSS alone (a scroll-driven animation): without support,
 * or with reduced motion, the text is simply there.
 */
export const Default: Story = {
  args: { children: STATEMENT },
  render: (args) => (
    <div className="px-6">
      {/* Taller than any viewport: at rest the whole sentence waits below the fold, however many lines. */}
      <p className="flex h-[110vh] items-end pb-6 text-sm text-muted-foreground">Desplázate para leer</p>
      <TextReveal {...args} className="max-w-2xl font-heading text-3xl font-semibold tracking-tight sm:text-4xl" />
      <div className="h-[60vh]" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const reveal = canvasElement.querySelector('[data-slot=text-reveal]')!
    // Screen readers and search read one plain sentence.
    await expect(reveal).toHaveTextContent(STATEMENT)
    const words = reveal.querySelectorAll<HTMLElement>('[data-slot=text-reveal-word]')
    await expect(words).toHaveLength(STATEMENT.split(' ').length)
    const last = words[words.length - 1]
    await expect(getComputedStyle(last).animationName).toBe('text-reveal')

    // Below the fold the words wait in the muted color, never transparent; scrolled into view they
    // take the paragraph's color.
    const final = getComputedStyle(reveal).color
    for (const word of [words[0], last]) {
      await expect(getComputedStyle(word).color).not.toBe(final)
      await expect(getComputedStyle(word).opacity).toBe('1')
    }
    window.scrollTo(0, document.documentElement.scrollHeight)
    await waitFor(() => expect(getComputedStyle(last).color).toBe(final))
    window.scrollTo(0, 0)
  },
}

/** Any element: a heading here. Children that are not plain text reveal as one block. */
export const Heading: Story = {
  args: { as: 'h2', children: 'Tus datos, con claridad.' },
  render: (args) => (
    <div className="p-6">
      <TextReveal {...args} className="font-heading text-4xl font-semibold tracking-tight" />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { level: 2, name: 'Tus datos, con claridad.' })).toBeVisible()
  },
}
