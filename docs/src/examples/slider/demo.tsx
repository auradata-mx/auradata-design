'use client';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { formatCurrency } from '@/lib/format';

export default function SliderDemo() {
  const [value, setValue] = useState(250_000);

  return (
    <div className="grid w-full max-w-sm gap-3">
      <div className="flex items-center justify-between gap-4">
        <Label id="ventas-minimas">Ventas mínimas por sucursal</Label>
        <span className="text-sm text-muted-foreground tabular-nums">{formatCurrency(value)}</span>
      </div>
      <Slider
        aria-labelledby="ventas-minimas"
        value={value}
        onValueChange={(next) => setValue(next as number)}
        min={0}
        max={1_000_000}
        step={50_000}
      />
    </div>
  );
}
