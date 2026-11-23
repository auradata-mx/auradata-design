'use client';
import { DateRangeFilter, presetRange } from '@/components/ui/date-range-filter';

/** A fixed day, so the presets and the page do not move with the calendar. */
const TODAY = new Date(2026, 10, 21);

export default function DateRangeFilterDemo() {
  return <DateRangeFilter today={TODAY} defaultValue={presetRange('this-month', TODAY)} />;
}
