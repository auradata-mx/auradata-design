import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

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
