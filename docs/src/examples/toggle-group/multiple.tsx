'use client';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

export default function ToggleGroupMultiple() {
  return (
    <ToggleGroup multiple defaultValue={['norte', 'bajio']} variant="outline" size="sm" aria-label="Regiones">
      <ToggleGroupItem value="norte">Norte</ToggleGroupItem>
      <ToggleGroupItem value="bajio">Bajío</ToggleGroupItem>
      <ToggleGroupItem value="occidente">Occidente</ToggleGroupItem>
      <ToggleGroupItem value="sur">Sur</ToggleGroupItem>
    </ToggleGroup>
  );
}
