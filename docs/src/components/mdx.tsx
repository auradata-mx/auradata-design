import defaultMdxComponents from 'fumadocs-ui/mdx';
import { Step, Steps } from 'fumadocs-ui/components/steps';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import type { ComponentPropsWithoutRef } from 'react';
import type { MDXComponents } from 'mdx/types';
import { storybookUrl } from '@docs/lib/shared';
import { ComponentInstall, ComponentPreview, ComponentProps, StorybookLink } from '@docs/components/component-docs';

/**
 * Markdown links: a link to Storybook (served beside the site under /storybook/, not a Next.js route) is a plain
 * `<a>`, so the browser loads it; every other link keeps the Fumadocs link.
 */
function MdxLink(props: ComponentPropsWithoutRef<'a'>) {
  if (props.href?.startsWith(storybookUrl)) return <a {...props} />;
  const DefaultLink = defaultMdxComponents.a;
  return <DefaultLink {...props} />;
}

/**
 * The components every MDX page can use without importing them: the Fumadocs defaults (Callout, Card, Cards,
 * code blocks with copy, headings with anchors), Steps and Tabs, and the component page kit (component-docs.tsx).
 */
export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    a: MdxLink,
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
