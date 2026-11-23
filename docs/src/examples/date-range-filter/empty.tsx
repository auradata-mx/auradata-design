'use client';
import { DateRangeFilter } from '@/components/ui/date-range-filter';

const TODAY = new Date(2026, 10, 21);

export default function DateRangeFilterEmpty() {
  return <DateRangeFilter today={TODAY} />;
}
