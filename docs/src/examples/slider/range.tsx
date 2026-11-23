'use client';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

export default function SliderRange() {
  const [range, setRange] = useState([15, 40]);

  return (
    <div className="grid w-full max-w-sm gap-3">
      <div className="flex items-center justify-between gap-4">
        <Label id="margen">Margen bruto</Label>
        <span className="text-sm text-muted-foreground tabular-nums">
          {range[0]} % – {range[1]} %
        </span>
      </div>
      <Slider
        aria-labelledby="margen"
        value={range}
        onValueChange={(next) => setRange(next as number[])}
        min={0}
        max={100}
      />
    </div>
  );
}
