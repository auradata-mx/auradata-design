'use client';

import { CalendarHeatmap } from '@/components/ui/heatmap';

const DATA = [
  { date: '2026-11-02', value: 42 },
  { date: '2026-11-03', value: 61 },
  { date: '2026-11-05', value: 24 },
  { date: '2026-11-09', value: 38 },
  { date: '2026-11-13', value: 79 },
  { date: '2026-11-19', value: 56 },
  { date: '2026-11-27', value: 70 },
];

export default function HeatmapCalendar() {
  return (
    <CalendarHeatmap
      data={DATA}
      label="Actividad de noviembre"
      unit="consultas"
      from="2026-11-01"
      to="2026-11-30"
      className="w-full"
    />
  );
}
