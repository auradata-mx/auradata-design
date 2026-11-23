'use client';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export default function LabelControl() {
  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-2">
        <Checkbox id="label-share" disabled />
        <Label htmlFor="label-share">Compartir con el equipo</Label>
      </div>
      <div className="flex items-center gap-3">
        <Switch id="label-refresh" disabled />
        <Label htmlFor="label-refresh">Actualizar cada hora</Label>
      </div>
    </div>
  );
}
