'use client';
import { ChartColumnIcon, TableIcon } from 'lucide-react';
import { SegmentedControl, SegmentedControlItem } from '@/components/ui/segmented-control';

export default function SegmentedControlDemo() {
  return (
    <SegmentedControl defaultValue="table" aria-label="Vista">
      <SegmentedControlItem value="table">
        <TableIcon aria-hidden />
        Tabla
      </SegmentedControlItem>
      <SegmentedControlItem value="chart">
        <ChartColumnIcon aria-hidden />
        Gráfica
      </SegmentedControlItem>
    </SegmentedControl>
  );
}
