'use client';

import { Delta } from '@/components/ui/delta';

export default function DeltaCosts() {
  return (
    <div className="flex items-center gap-3">
      <span>Costo por consulta</span>
      <Delta change={-0.021} comparison="vs. septiembre" goodDirection="down" />
    </div>
  );
}
