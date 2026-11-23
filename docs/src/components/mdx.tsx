import defaultMdxComponents from 'fumadocs-ui/mdx';
import { Step, Steps } from 'fumadocs-ui/components/steps';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import type { MDXComponents } from 'mdx/types';
import { ComponentInstall, ComponentPreview, ComponentProps, StorybookLink } from '@docs/components/component-docs';

/**
 * The components every MDX page can use without importing them: the Fumadocs defaults (Callout, Card, Cards,
 * code blocks with copy, headings with anchors), Steps and Tabs, and the component page kit (component-docs.tsx).
 */
export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    Step,
    Steps,
    Tab,
    Tabs,
    ComponentInstall,
    ComponentPreview,
    ComponentProps,
    StorybookLink,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
