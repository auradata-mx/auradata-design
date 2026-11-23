'use client';
import { RangeFilter } from '@/components/ui/range-filter';
import { formatCurrency } from '@/lib/format';

export default function RangeFilterDemo() {
  return <RangeFilter title="Ventas" min={0} max={500_000} step={1_000} format={formatCurrency} />;
}
