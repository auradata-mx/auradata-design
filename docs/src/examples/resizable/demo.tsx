'use client';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { formatNumber } from '@/lib/format';

const rows = [
  ['Norte', 1_284_500],
  ['Bajío', 986_200],
  ['Occidente', 842_900],
] as const;

export default function ResizableDemo() {
  return (
    <ResizablePanelGroup orientation="vertical" className="min-h-96 w-full max-w-2xl rounded-lg border">
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
              {rows.map(([region, sales]) => (
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
  );
}
