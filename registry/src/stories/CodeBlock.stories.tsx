import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from '@/components/ui/code-block'

const meta = {
  title: 'Components/Code block',
  component: CodeBlock,
} satisfies Meta<typeof CodeBlock>

export default meta
type Story = StoryObj<typeof meta>

const query = [
  ['SELECT', ' region, ', 'SUM', '(ventas) ', 'AS', ' total'],
  ['FROM', ' pedidos'],
  ['GROUP BY', ' region'],
  ['ORDER BY', ' total ', 'DESC', ';'],
]
const sql = query.map((line) => line.join('')).join('\n')

export const HighlightedSql: Story = {
  render: () => (
    <CodeBlock size="sm" className="max-w-xl">
      <CodeBlockHeader>
        <CodeBlockTitle>Consulta SQL</CodeBlockTitle>
        <CodeBlockActions>
          <CodeBlockCopyButton value={sql} />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeBlockContent aria-label="SQL: ventas por región" lineNumbers startLine={12}>
        {query.map((line) => (
          <CodeBlockLine key={line[0]}>
            {line.map((token, index) => index % 2 === 0 ? (
              <span key={index} className={token === 'SUM' ? 'text-blue-700 dark:text-blue-300' : 'text-red-700 dark:text-red-300'}>
                {token}
              </span>
            ) : token)}
          </CodeBlockLine>
        ))}
      </CodeBlockContent>
    </CodeBlock>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const code = canvas.getByLabelText('SQL: ventas por región')
    const keyword = canvas.getByText('SELECT')
    const fn = canvas.getByText('SUM')

    await expect(getComputedStyle(keyword).color).not.toBe(getComputedStyle(code).color)
    await expect(getComputedStyle(fn).color).not.toBe(getComputedStyle(keyword).color)
    await expect(code.querySelectorAll('[data-slot="code-block-line"]')).toHaveLength(query.length)
    await expect(code).toHaveStyle({ counterReset: 'line 11' })
  },
}
