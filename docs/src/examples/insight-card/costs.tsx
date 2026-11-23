'use client';

import { InsightCard } from '@/components/ui/insight-card';
import { formatCurrency } from '@/lib/format';

export default function InsightCardCosts() {
  return (
    <InsightCard
      title="Subió el costo por consulta"
      value={formatCurrency(4.27)}
      change={0.082}
      goodDirection="down"
      comparison="vs. octubre"
      description="Las consultas fuera de horario costaron más en noviembre."
    />
  );
}
