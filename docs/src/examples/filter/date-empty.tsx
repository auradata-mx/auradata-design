'use client';
import { Filter } from '@/components/ui/filter';

const TODAY = new Date(2026, 10, 21);

export default function FilterDateEmpty() {
  return <Filter type="date" today={TODAY} />;
}
