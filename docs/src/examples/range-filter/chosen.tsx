'use client';
import { useState } from 'react';
import { type NumberRange, RangeFilter } from '@/components/ui/range-filter';
import { formatCurrency } from '@/lib/format';

export default function RangeFilterChosen() {
  const [range, setRange] = useState<NumberRange | null>([10_000, 250_000]);

  return (
    <RangeFilter
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
