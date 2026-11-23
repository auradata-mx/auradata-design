'use client';
import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';

const TODAY = new Date(2026, 10, 21);

export default function CalendarDisabledDays() {
  const [date, setDate] = useState<Date | undefined>(new Date(2026, 10, 18));

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      disabled={[{ dayOfWeek: [0, 6] }, { after: TODAY }]}
      today={TODAY}
      defaultMonth={TODAY}
      className="rounded-lg border"
    />
  );
}
