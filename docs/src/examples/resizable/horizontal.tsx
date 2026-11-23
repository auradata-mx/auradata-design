'use client';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';

export default function ResizableHorizontal() {
  return (
    <ResizablePanelGroup orientation="horizontal" className="min-h-64 w-full max-w-2xl rounded-lg border">
      <ResizablePanel defaultSize="30%" minSize="20%">
        <div className="p-4 text-sm">Consultas guardadas</div>
      </ResizablePanel>
      <ResizableHandle withHandle aria-label="Cambiar el tamaño de la lista" />
      <ResizablePanel defaultSize="70%">
        <div className="p-4 font-mono text-sm">SELECT * FROM clientes;</div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
