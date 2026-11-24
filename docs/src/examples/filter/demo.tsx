'use client';
import { Filter, presetRange } from '@/components/ui/filter';
import { formatCurrency } from '@/lib/format';

/** A fixed day, so the presets and the page do not move with the calendar. */
const TODAY = new Date(2026, 10, 21);

const REGIONS = [
  { value: 'norte', label: 'Norte', count: 128 },
  { value: 'centro', label: 'Centro', count: 2340 },
  { value: 'sur', label: 'Sur', count: 87 },
  { value: 'bajio', label: 'Bajío', count: 412 },
];

export default function FilterDemo() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Filter type="date" today={TODAY} defaultValue={presetRange('this-month', TODAY)} />
      <Filter type="select" title="Región" options={REGIONS} />
      <Filter type="range" title="Ventas" min={0} max={500_000} step={1_000} format={formatCurrency} />
    </div>
  );
}
