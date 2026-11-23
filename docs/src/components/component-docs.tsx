/**
 * The kit of a component page: every MDX page under content/docs/components uses these (registered in mdx.tsx),
 * so all ~50 pages read the same. How to write a page: content/docs/components/_template.md.
 *
 * They are React Server Components: they read the real files (examples, registry.json, stories, types) while the
 * site builds, so a preview never drifts from its code and a typo fails the build instead of shipping a dead link.
 */
import type { ComponentType } from 'react';
import { ExternalLink } from 'lucide-react';
import { ServerCodeBlock } from 'fumadocs-ui/components/codeblock.rsc';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import { AutoTypeTable } from 'fumadocs-typescript/ui';
import { buttonVariants } from '@/components/ui/button';
import { InstallCommand } from '@docs/components/install-command';
import {
  getRegistryItem,
  getStoryUrl,
  readExampleSource,
  typeGenerator,
  typeTableOptions,
} from '@docs/lib/component-docs';
import { registryUrl } from '@docs/lib/shared';

/**
 * A live example and its code. `name` is the example file without extension under src/examples
 * (`button/variants` -> src/examples/button/variants.tsx, whose default export is the example). The Preview tab
 * renders that component, the real registry components; the Code tab shows that same file.
 */
export async function ComponentPreview({
  name,
  align = 'center',
}: {
  name: string;
  /** Where the example sits in the preview box: centered (default), or from the top for tall ones (a table). */
  align?: 'center' | 'start';
}) {
  const [{ default: Example }, code] = await Promise.all([
    import(`../examples/${name}.tsx`) as Promise<{ default: ComponentType }>,
    readExampleSource(name),
  ]);

  return (
    <Tabs items={['Vista previa', 'Código']} className="not-prose">
      <Tab value="Vista previa" className="p-0">
        <div
          data-align={align}
          className="flex min-h-56 w-full flex-wrap gap-4 bg-background p-6 text-foreground data-[align=center]:items-center data-[align=center]:justify-center data-[align=start]:items-start sm:p-10"
        >
          <Example />
        </div>
      </Tab>
      <Tab value="Código" className="p-0">
        <ServerCodeBlock code={code} lang="tsx" codeblock={{ className: 'rounded-none border-0' }} />
      </Tab>
    </Tabs>
  );
}

/** The `npx shadcn add` command of a registry item, ready to copy. `item` is its `name` in registry.json. */
export async function ComponentInstall({ item }: { item: string }) {
  const { name } = await getRegistryItem(item);
  return (
    <div className="not-prose my-4">
      <InstallCommand command={`npx shadcn add ${registryUrl}/${name}.json`} />
    </div>
  );
}

/**
 * The props table of a component, from its TypeScript types. `file` is the component file under
 * registry/src/components/ui without extension. Give either `name`, an exported type, or `type`, a type expression
 * that file can resolve (`Pick<React.ComponentProps<typeof Button>, 'variant' | 'size' | 'loading'>`).
 *
 * When most props come from Base UI, list only the AuraData ones in `type` and pass `baseUi` (the Base UI page, like
 * `button`), so the table stays readable and links to the rest.
 */
export function ComponentProps({
  file,
  name,
  type,
  baseUi,
}: {
  file: string;
  name?: string;
  type?: string;
  baseUi?: string;
}) {
  return (
    <>
      <AutoTypeTable
        generator={typeGenerator}
        path={`${file}.tsx`}
        name={name}
        type={type}
        options={typeTableOptions}
      />
      {baseUi && (
        <p>
          Acepta además todas las props de{' '}
          <a href={`https://base-ui.com/react/components/${baseUi}`} target="_blank" rel="noreferrer">
            Base UI
          </a>
          .
        </p>
      )}
    </>
  );
}

/**
 * «Ver en Storybook»: the story where the component's states are tested. `stories` is the stories file under
 * registry/src/stories without `.stories.tsx` (`DataTable`), `story` its export (`Default`).
 */
export async function StorybookLink({ stories, story = 'Default' }: { stories: string; story?: string }) {
  const href = await getStoryUrl(stories, story);
  return (
    <div className="not-prose my-4">
      {/* A plain link: Storybook is served beside the site (/storybook/), not a Next.js route. */}
      <a href={href} target="_blank" rel="noreferrer" className={buttonVariants({ variant: 'outline' })}>
        Ver en Storybook
        <ExternalLink data-icon="inline-end" aria-hidden />
      </a>
    </div>
  );
}
