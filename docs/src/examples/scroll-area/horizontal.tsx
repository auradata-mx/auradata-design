'use client';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const regions = ['Norte', 'Noreste', 'Bajío', 'Occidente', 'Centro', 'Golfo', 'Sureste', 'Península', 'Pacífico'];

export default function ScrollAreaHorizontal() {
  return (
    <ScrollArea className="w-full max-w-96 rounded-lg border whitespace-nowrap">
      <div className="flex w-max gap-3 p-4">
        {regions.map((region) => (
          <div key={region} className="flex h-20 w-32 shrink-0 items-center justify-center rounded-md bg-muted text-sm">
            {region}
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
