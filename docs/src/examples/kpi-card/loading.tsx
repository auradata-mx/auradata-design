'use client';

import { KpiCard } from '@/components/ui/kpi-card';

export default function KpiCardLoading() {
  return (
    <KpiCard
      className="w-full max-w-md"
      label="Ventas de octubre"
      loading
    />
  );
}
