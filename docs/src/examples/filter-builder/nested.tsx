'use client';

import { FilterBuilder } from '@/components/ui/filter-builder';
import type { FilterField, FilterGroup } from '@/lib/filter-conditions';

const FIELDS: FilterField[] = [
  { id: 'region', label: 'Región', type: 'select', options: [{ value: 'Norte' }, { value: 'Sur' }] },
  { id: 'ventas', label: 'Ventas', type: 'number' },
  { id: 'fecha', label: 'Fecha', type: 'date' },
];

const FILTER: FilterGroup = {
  id: 'root',
  combinator: 'and',
  conditions: [
    { id: 'ventas', field: 'ventas', operator: 'gte', value: 100000 },
    {
      id: 'regiones',
      combinator: 'or',
      conditions: [
        { id: 'norte', field: 'region', operator: 'equals', value: 'Norte' },
        { id: 'sur', field: 'region', operator: 'equals', value: 'Sur' },
      ],
    },
  ],
};

export default function FilterBuilderNested() {
  return <FilterBuilder className="w-full" fields={FIELDS} defaultValue={FILTER} />;
}
