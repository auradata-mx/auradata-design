import type { Decorator, Preview } from '@storybook/react-vite'
import type { ViewportMap } from 'storybook/viewport'
import { useEffect, type ReactNode } from 'react'

import '../src/index.css'
import { auradata } from './theme'

/** Puts the .dark class on the document, as the apps do. */
function ThemeFrame({ dark, padded, children }: { dark: boolean; padded: boolean; children: ReactNode }) {
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])
  return <div className={padded ? 'bg-background p-6 text-foreground' : 'bg-background text-foreground'}>{children}</div>
}

const withTheme: Decorator = (Story, context) => (
  <ThemeFrame dark={context.globals.theme === 'dark'} padded={context.parameters.themeFrame?.padded !== false}>
    <Story />
  </ThemeFrame>
)

/**
 * The toolbar's viewports. `mobile` is the size of the Playwright `mobile` project:
 * stories tagged `mobile` set it as their default (`globals: { viewport: { value: 'mobile' } }`).
 */
const VIEWPORTS: ViewportMap = {
  mobile: { name: 'Mobile', styles: { width: '390px', height: '844px' }, type: 'mobile' },
  tablet: { name: 'Tablet', styles: { width: '768px', height: '1024px' }, type: 'tablet' },
  desktop: { name: 'Desktop', styles: { width: '1280px', height: '800px' }, type: 'desktop' },
}

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
    docs: { theme: auradata },
    viewport: { options: VIEWPORTS },
    // The brand first, then what apps install, then the stock shadcn components.
    options: {
      storySort: {
        order: ['Brand', ['01 Identidad', '02 Logotipo', '03 Tipografía', '04 Color', '05 Voz', 'Tokens'], 'Guides', 'AuraData', 'Blocks', 'Components'],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // Every story must pass axe: a violation fails `npm run test:stories` and CI.
    a11y: { test: 'error' },
  },
}

export default preview
