'use client';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { Calendar } from '@/components/ui/calendar';

const TODAY = new Date(2026, 10, 21);

export default function CalendarRange() {
  const [range, setRange] = useState<DateRange | undefined>({
    from: new Date(2026, 9, 25),
    to: new Date(2026, 10, 7),
  });

  return (
    <Calendar
      mode="range"
      numberOfMonths={2}
      selected={range}
      onSelect={setRange}
      today={TODAY}
      defaultMonth={new Date(2026, 9, 1)}
      className="rounded-lg border"
    />
  );
}
