'use client';

import { ChartCard } from '@/components/ui/chart-card';

export default function ChartCardLoading() {
  return (
    <ChartCard title="Consultas por mes" description="Consultas, agosto a octubre" loading className="w-full" />
  );
}
