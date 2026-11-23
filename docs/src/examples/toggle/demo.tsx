'use client';
import { StarIcon } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';

export default function ToggleDemo() {
  return (
    <Toggle>
      <StarIcon aria-hidden /> Favorito
    </Toggle>
  );
}
