'use client';
import { ChartColumnIcon, TableIcon } from 'lucide-react';
import { SegmentedControl, SegmentedControlItem } from '@/components/ui/segmented-control';

export default function SegmentedControlIcons() {
  return (
    <SegmentedControl defaultValue="table" aria-label="Vista">
      <SegmentedControlItem value="table" aria-label="Tabla">
        <TableIcon aria-hidden />
      </SegmentedControlItem>
      <SegmentedControlItem value="chart" aria-label="Gráfica">
        <ChartColumnIcon aria-hidden />
      </SegmentedControlItem>
      <SegmentedControlItem value="map" disabled>
        Mapa
      </SegmentedControlItem>
    </SegmentedControl>
  );
}
