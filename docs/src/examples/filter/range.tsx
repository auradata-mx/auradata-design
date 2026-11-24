'use client';
import { Filter } from '@/components/ui/filter';
import { formatCurrency } from '@/lib/format';

export default function FilterRange() {
  return <Filter type="range" title="Ventas" min={0} max={500_000} step={1_000} format={formatCurrency} />;
}
