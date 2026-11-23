'use client';
import { AreaChartIcon, ChartColumnIcon, ChartLineIcon } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

export default function ToggleGroupOutline() {
  return (
    <ToggleGroup variant="outline" spacing={0} defaultValue={['barras']} aria-label="Tipo de gráfica">
      <ToggleGroupItem value="barras">
        <ChartColumnIcon aria-hidden /> Barras
      </ToggleGroupItem>
      <ToggleGroupItem value="lineas">
        <ChartLineIcon aria-hidden /> Líneas
      </ToggleGroupItem>
      <ToggleGroupItem value="area">
        <AreaChartIcon aria-hidden /> Área
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
