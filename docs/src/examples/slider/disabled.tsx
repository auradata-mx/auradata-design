'use client';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

export default function SliderDisabled() {
  return (
    <div role="group" aria-labelledby="descuento" aria-disabled className="grid w-full max-w-sm gap-3">
      <div className="flex items-center justify-between gap-4 opacity-50">
        <Label id="descuento">Descuento máximo</Label>
        <span className="text-sm text-muted-foreground tabular-nums">10 %</span>
      </div>
      <Slider aria-labelledby="descuento" defaultValue={10} min={0} max={30} disabled />
    </div>
  );
}
