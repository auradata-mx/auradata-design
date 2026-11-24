'use client';
import { useState } from 'react';
import { Filter, type NumberRange } from '@/components/ui/filter';
import { formatCurrency } from '@/lib/format';

export default function FilterRangeChosen() {
  const [range, setRange] = useState<NumberRange | null>([10_000, 250_000]);

  return (
    <Filter
      type="range"
      title="Ventas"
      min={0}
      max={500_000}
      step={1_000}
      format={formatCurrency}
      value={range}
      onValueChange={(next) => setRange(next ?? null)}
    />
  );
}
