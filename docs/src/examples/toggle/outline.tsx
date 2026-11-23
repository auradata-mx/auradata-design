'use client';
import { StarIcon } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';

export default function ToggleOutline() {
  return (
    <div className="flex items-center gap-2">
      <Toggle variant="outline">
        <StarIcon aria-hidden /> Favorito
      </Toggle>
      <Toggle variant="outline" defaultPressed>
        <StarIcon aria-hidden /> Favorito
      </Toggle>
      <Toggle variant="outline" disabled>
        <StarIcon aria-hidden /> Favorito
      </Toggle>
    </div>
  );
}
