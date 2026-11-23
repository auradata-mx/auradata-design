'use client';

import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle,
} from '@/components/ui/code-block';

const SQL = `SELECT region, SUM(ventas) AS total
FROM pedidos
GROUP BY region
ORDER BY total DESC;`;

export default function CodeBlockDemo() {
  return (
    <CodeBlock>
      <CodeBlockHeader>
        <CodeBlockTitle>Consulta SQL</CodeBlockTitle>
        <CodeBlockActions>
          <CodeBlockCopyButton value={SQL} />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeBlockContent aria-label="SQL: ventas por región">{SQL}</CodeBlockContent>
    </CodeBlock>
  );
}
