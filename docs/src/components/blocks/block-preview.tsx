import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { ComponentType } from 'react';
import { ServerCodeBlock } from 'fumadocs-ui/components/codeblock.rsc';
import { readExampleSource } from '@docs/lib/component-docs';
import { blocks, type BlockName } from './block-catalog';
import { BlockViewport } from './block-viewport';

export async function BlockPreview({ name }: { name: BlockName }) {
  const block = blocks.find((candidate) => candidate.name === name);
  if (!block) throw new Error(`Unknown block: ${name}`);

  const registryPath = `registry/src/components/blocks/${name}.tsx`;
  const [{ default: Example }, source, example] = await Promise.all([
    import(`../../examples/blocks/${name}.tsx`) as Promise<{ default: ComponentType }>,
    readFile(path.resolve(process.cwd(), '..', registryPath), 'utf8'),
    readExampleSource(`blocks/${name}`),
  ]);

  return (
    <BlockViewport
      name={name}
      title={block.title}
      code={
        <div className="grid gap-4 p-4">
          <ServerCodeBlock code={source} lang="tsx" codeblock={{ title: `Bloque · ${name}.tsx` }} />
          <ServerCodeBlock code={example} lang="tsx" codeblock={{ title: `Ejemplo · ${name}.tsx` }} />
        </div>
      }
    >
      <Example />
    </BlockViewport>
  );
}
