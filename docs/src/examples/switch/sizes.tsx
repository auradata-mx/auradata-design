'use client';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export default function SwitchSizes() {
  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-3">
        <Switch id="switch-sm" size="sm" />
        <Label htmlFor="switch-sm">Chico</Label>
      </div>
      <div className="flex items-center gap-3">
        <Switch id="switch-default" />
        <Label htmlFor="switch-default">Normal</Label>
      </div>
      <div className="flex items-center gap-3">
        <Switch id="switch-disabled" defaultChecked disabled />
        <Label htmlFor="switch-disabled">Deshabilitado</Label>
      </div>
    </div>
  );
}
