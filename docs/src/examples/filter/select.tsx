'use client';

import { Filter } from '@/components/ui/filter';

const REGIONS = [
  { value: 'norte', label: 'Norte', count: 128 },
  { value: 'centro', label: 'Centro', count: 2340 },
  { value: 'sur', label: 'Sur', count: 87 },
  { value: 'bajio', label: 'Bajío', count: 412 },
];

export default function FilterSelect() {
  return <Filter type="select" title="Región" options={REGIONS} />;
}
