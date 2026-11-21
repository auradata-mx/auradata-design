import type { Decorator, Preview } from '@storybook/react-vite'
import { useEffect, type ReactNode } from 'react'

import '../src/index.css'

/** Puts the .dark class on the document, as the apps do. */
function ThemeFrame({ dark, children }: { dark: boolean; children: ReactNode }) {
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])
  return <div className="bg-background p-6 text-foreground">{children}</div>
}

const withTheme: Decorator = (Story, context) => (
  <ThemeFrame dark={context.globals.theme === 'dark'}>
    <Story />
  </ThemeFrame>
)

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Light or dark theme',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'light' },
  decorators: [withTheme],
  parameters: {
    layout: 'fullscreen',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
