'use client';

import { FilterBuilder } from '@/components/ui/filter-builder';
import type { FilterField } from '@/lib/filter-conditions';

const FIELDS: FilterField[] = [
  { id: 'region', label: 'Región', type: 'select', options: [{ value: 'Norte' }, { value: 'Sur' }] },
  { id: 'ventas', label: 'Ventas', type: 'number' },
  { id: 'fecha', label: 'Fecha', type: 'date' },
];

export default function FilterBuilderDemo() {
  return <FilterBuilder className="w-full" fields={FIELDS} />;
}
