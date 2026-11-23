'use client';

import { FacetedFilter } from '@/components/ui/faceted-filter';

const REGIONS = [
  { value: 'norte', label: 'Norte', count: 128 },
  { value: 'centro', label: 'Centro', count: 2340 },
  { value: 'sur', label: 'Sur', count: 87 },
  { value: 'bajio', label: 'Bajío', count: 412 },
];

export default function FacetedFilterDemo() {
  return <FacetedFilter title="Región" options={REGIONS} />;
}
