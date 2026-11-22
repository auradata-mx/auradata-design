import type { Meta, StoryObj } from '@storybook/react-vite'

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { formatNumber } from '@/lib/format'

const meta = {
  title: 'Components/Resizable',
  component: ResizablePanelGroup,
} satisfies Meta<typeof ResizablePanelGroup>

export default meta
type Story = StoryObj<typeof meta>

const ROWS = [
  ['Norte', 1_284_500],
  ['Bajío', 986_200],
  ['Occidente', 842_900],
] as const

/** SQL Lab: the editor above, the results below; drag the handle or use the arrow keys. */
export const Default: Story = {
  render: () => (
    <ResizablePanelGroup orientation="vertical" className="min-h-96 max-w-2xl rounded-lg border">
      <ResizablePanel defaultSize="45%" minSize="20%">
        <div className="flex h-full flex-col gap-2 p-4">
          <span className="text-xs font-medium text-muted-foreground">Editor</span>
          <pre className="font-mono text-sm">
            {'SELECT region, SUM(total) AS ventas\nFROM pedidos_2026\nGROUP BY region\nORDER BY ventas DESC;'}
          </pre>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle aria-label="Cambiar el tamaño del editor" />
      <ResizablePanel defaultSize="55%" minSize="20%">
        <div className="flex h-full flex-col gap-2 p-4">
          <span className="text-xs font-medium text-muted-foreground">Resultados · 3 filas</span>
          <table className="text-sm">
            <thead>
              <tr className="text-left text-muted-foreground">
                <th className="py-1 font-medium">region</th>
                <th className="py-1 text-right font-medium">ventas</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map(([region, sales]) => (
                <tr key={region} className="border-t">
                  <td className="py-1">{region}</td>
                  <td className="py-1 text-right tabular-nums">{formatNumber(sales)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
}

/** Side by side: the list of saved queries and the editor. */
export const Horizontal: Story = {
  render: () => (
    <ResizablePanelGroup orientation="horizontal" className="min-h-64 max-w-2xl rounded-lg border">
      <ResizablePanel defaultSize="30%" minSize="20%">
        <div className="p-4 text-sm">Consultas guardadas</div>
      </ResizablePanel>
      <ResizableHandle aria-label="Cambiar el tamaño de la lista" />
      <ResizablePanel defaultSize="70%">
        <div className="p-4 font-mono text-sm">SELECT * FROM clientes;</div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
}
