import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { CopyButton } from '@/components/ui/copy-button'

const meta = {
  title: 'AuraData/Copy button',
  component: CopyButton,
  args: { value: 'https://bi.auradata.mx/informes/ventas-2026' },
} satisfies Meta<typeof CopyButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** With a visible label alongside the morphing icon. */
export const WithLabel: Story = {
  name: 'With label',
  args: { variant: 'outline', size: 'sm', children: 'Copiar enlace' },
}

/** Clicking copies the text and morphs the icon into a check mark. */
export const Copied: Story = {
  args: { variant: 'outline', size: 'icon-sm', timeout: 60_000 },
  play: async ({ canvasElement }) => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: async () => {} },
    })
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: 'Copiar' })
    await userEvent.click(button)
    await waitFor(() => expect(button).toHaveAttribute('data-copied', 'true'))
    await expect(button).toHaveAccessibleName('Copiado')
    button.blur()
  },
}
