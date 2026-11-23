import { storyUrlFor } from './storybook-id.mjs';

export const appName = 'AuraData Design';
export const siteDescription =
  'El sistema de diseño de AuraData: la marca, los tokens y los componentes de React para construir sus productos.';
export const docsRoute = '/docs';

/** The public registry: every item installs with `npx shadcn add <registryUrl>/<item>.json`. */
export const registryUrl = 'https://design.auradata.mx/r';
/**
 * The Storybook workbench, where every component state is tested. The one base every Storybook link uses (the
 * nav and each component page's «Ver en Storybook»). The same nginx serves it beside the docs, under `/storybook/`.
 */
export const storybookUrl = '/storybook/';

/** The URL of one story, `components-button--primary`, under `storybookUrl`. */
export function storybookStoryUrl(storyId: string): string {
  return storyUrlFor(storybookUrl, storyId);
}

export const gitConfig = {
  user: 'cristianruben-dev',
  repo: 'auradata-design',
  branch: 'main',
};
