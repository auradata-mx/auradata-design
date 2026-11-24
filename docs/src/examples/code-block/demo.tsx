import { highlight } from 'fumadocs-core/highlight';
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from '@/components/ui/code-block';
import { CopyQueryButton } from './copy-query-button';

const SQL = `SELECT region, SUM(ventas) AS total
FROM pedidos
GROUP BY region
ORDER BY total DESC;`;

export async function SalesQuery({ numbered = false }: { numbered?: boolean }) {
  const code = await highlight(SQL, {
    lang: 'sql',
    defaultColor: false,
    components: {
      pre: ({ children }) => (
        <CodeBlockContent
          aria-label="SQL: ventas por región"
          className="shiki"
          lineNumbers={numbered}
          startLine={numbered ? 12 : undefined}
        >
          {children}
        </CodeBlockContent>
      ),
      code: ({ children }) => <>{children}</>,
      span: ({ className, ...props }) => className === 'line'
        ? <CodeBlockLine>{props.children}</CodeBlockLine>
        : <span className={className} {...props} />,
    },
  });

  return (
    <CodeBlock size={numbered ? 'sm' : 'default'}>
      <CodeBlockHeader>
        <CodeBlockTitle>Consulta SQL</CodeBlockTitle>
        <CodeBlockActions>
          <CopyQueryButton value={SQL} />
        </CodeBlockActions>
      </CodeBlockHeader>
      {code}
    </CodeBlock>
  );
}

export default function CodeBlockDemo() {
  return <SalesQuery />;
}
