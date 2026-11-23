'use client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LabelDemo() {
  return (
    <div className="grid w-full max-w-sm gap-2">
      <Label htmlFor="report">Nombre del informe</Label>
      <Input id="report" defaultValue="Ventas 2026" />
    </div>
  );
}
