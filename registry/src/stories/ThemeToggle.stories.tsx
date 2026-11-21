import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import { ThemeToggle, type Theme } from '@/components/ui/theme-toggle'

/** Wires the toggle to the `.dark` class of the document, as an app does. */
function Wired({ defaultOpen }: { defaultOpen?: boolean }) {
  const [theme, setTheme] = useState<Theme>('system')
  const change = (next: Theme) => {
    setTheme(next)
    const dark = next === 'dark' || (next === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    document.documentElement.classList.toggle('dark', dark)
  }
  return (
    <div className="flex justify-end">
      <ThemeToggle theme={theme} onThemeChange={change} defaultOpen={defaultOpen} />
    </div>
  )
}

const meta = {
  title: 'AuraData/Theme toggle',
  component: ThemeToggle,
  args: { theme: 'system', onThemeChange: () => {} },
} satisfies Meta<typeof ThemeToggle>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { render: () => <Wired /> }

/** Open, for the visual tests and to see the overlay. */
export const Open: Story = {
  render: () => (
    <div className="min-h-48">
      <Wired defaultOpen />
    </div>
  ),
}

/** Choosing «Oscuro» calls `onThemeChange('dark')`; the menu stays open until Escape. */
export const ChooseDark: Story = {
  name: 'Choose dark',
  args: { onThemeChange: fn() },
  render: (args) => (
    <div className="flex justify-end">
      <ThemeToggle {...args} />
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Cambiar tema' }))
    await userEvent.click(await body.findByRole('menuitemradio', { name: 'Oscuro' }))
    await expect(args.onThemeChange).toHaveBeenCalledWith('dark')
    // A radio item keeps the menu open; Escape closes it.
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(body.queryByRole('menu')).toBeNull())
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}
