import type { StorybookConfig } from '@storybook/react-vite';
import remarkGfm from 'remark-gfm';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    // GitHub-flavored Markdown, for the tables of the brand guide.
    { name: '@storybook/addon-docs', options: { mdxPluginOptions: { mdxCompileOptions: { remarkPlugins: [remarkGfm] } } } },
    '@storybook/addon-a11y',
    '@storybook/addon-vitest',
  ],
  framework: '@storybook/react-vite',
  // The Continua logos of @auradata/tokens, where the logo item installs them in an app.
  staticDirs: [{ from: '../../packages/tokens/assets/continua', to: '/brand/continua' }],
};
export default config;
