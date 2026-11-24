'use client';
import { Filter, presetRange } from '@/components/ui/filter';

/** A fixed day, so the presets and the page do not move with the calendar. */
const TODAY = new Date(2026, 10, 21);

export default function FilterDate() {
  return <Filter type="date" today={TODAY} defaultValue={presetRange('this-month', TODAY)} />;
}
