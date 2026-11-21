import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { GradientHeading, GradientText } from '@/components/ui/gradient-heading'

const meta = {
  title: 'AuraData/Gradient heading',
  component: GradientHeading,
  args: { children: 'Claramente imaginado.', highlight: 'Precisamente construido.' },
} satisfies Meta<typeof GradientHeading>

export default meta
type Story = StoryObj<typeof meta>

/** The gradient paints only the highlighted words, and only as wide as they are. */
export const Default: Story = {
  args: { as: 'h1', size: 'hero' },
  play: async ({ canvasElement }) => {
    const heading = canvasElement.querySelector('h1')!
    const highlight = heading.querySelector<HTMLElement>('[data-slot=gradient-text]')!
    await expect(highlight).toHaveTextContent('Precisamente construido.')
    await expect(getComputedStyle(highlight).backgroundImage).toContain('linear-gradient')
    // As wide as the words, not the page: the 100° gradient reaches green at the last letter.
    await expect(highlight.getBoundingClientRect().width).toBeLessThan(heading.getBoundingClientRect().width)
    // The rest of the title keeps the text color.
    await expect(getComputedStyle(heading).backgroundImage).toBe('none')
  },
}

/** The size of a section title (h2), as in the benefits or the FAQ. */
export const Section: Story = {
  args: { children: 'Lo que ganas al', highlight: 'trabajar con datos claros', inline: true },
}

/** A highlight in the middle of the title, on the same line. */
export const Inline: Story = {
  args: { children: undefined, highlight: undefined },
  render: (args) => (
    <GradientHeading {...args}>
      Tus informes, <GradientText>al día</GradientText> sin hojas de cálculo
    </GradientHeading>
  ),
}
