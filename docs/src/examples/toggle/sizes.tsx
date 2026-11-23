'use client';
import { BoldIcon } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';

export default function ToggleSizes() {
  return (
    <div className="flex items-center gap-2">
      <Toggle size="sm" variant="outline">
        Pequeño
      </Toggle>
      <Toggle variant="outline">Normal</Toggle>
      <Toggle size="lg" variant="outline">
        Grande
      </Toggle>
      <Toggle variant="outline" aria-label="Negritas">
        <BoldIcon aria-hidden />
      </Toggle>
    </div>
  );
}
