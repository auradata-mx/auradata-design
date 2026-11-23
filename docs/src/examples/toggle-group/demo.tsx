'use client';
import { AreaChartIcon, ChartColumnIcon, ChartLineIcon } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

export default function ToggleGroupDemo() {
  return (
    <ToggleGroup defaultValue={['barras']} aria-label="Tipo de gráfica">
      <ToggleGroupItem value="barras" aria-label="Barras">
        <ChartColumnIcon aria-hidden />
      </ToggleGroupItem>
      <ToggleGroupItem value="lineas" aria-label="Líneas">
        <ChartLineIcon aria-hidden />
      </ToggleGroupItem>
      <ToggleGroupItem value="area" aria-label="Área">
        <AreaChartIcon aria-hidden />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
