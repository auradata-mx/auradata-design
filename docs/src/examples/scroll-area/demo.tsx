'use client';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

const datasets = Array.from({ length: 30 }, (_, index) => `Ventas sucursal ${String(index + 1).padStart(2, '0')}`);

export default function ScrollAreaDemo() {
  return (
    <ScrollArea className="h-64 w-56 rounded-lg border">
      <div className="p-4">
        <h3 className="mb-3 text-sm font-medium">Datasets</h3>
        {datasets.map((dataset, index) => (
          <div key={dataset}>
            {index > 0 && <Separator className="my-2" />}
            <p className="text-sm">{dataset}</p>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
