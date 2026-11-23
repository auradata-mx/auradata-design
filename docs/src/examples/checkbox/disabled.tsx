'use client';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export default function CheckboxDisabled() {
  return (
    <div className="flex items-center gap-2">
      <Checkbox id="share-disabled" defaultChecked disabled />
      <Label htmlFor="share-disabled">Compartir con el equipo</Label>
    </div>
  );
}
