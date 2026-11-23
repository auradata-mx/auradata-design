import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { Logo } from '@/components/ui/logo';
import { gitConfig, storybookUrl } from './shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          <Logo className="h-6" />
          <span className="sr-only">Design</span>
        </>
      ),
    },
    links: [
      { text: 'Documentación', url: '/docs', active: 'nested-url' },
      { text: 'Storybook', url: storybookUrl, external: true },
    ],
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
