import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-docs"
  ],
  "framework": "@storybook/react-vite",
  // The Continua logos of @auradata/tokens, where the logo item installs them in an app.
  "staticDirs": [{ "from": "../../packages/tokens/assets/continua", "to": "/brand/continua" }]
};
export default config;