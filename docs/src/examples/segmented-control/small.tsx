'use client';
import { SegmentedControl, SegmentedControlItem } from '@/components/ui/segmented-control';

export default function SegmentedControlSmall() {
  return (
    <SegmentedControl size="sm" defaultValue="month" aria-label="Periodo">
      <SegmentedControlItem value="week">Semana</SegmentedControlItem>
      <SegmentedControlItem value="month">Mes</SegmentedControlItem>
      <SegmentedControlItem value="year">Año</SegmentedControlItem>
    </SegmentedControl>
  );
}
