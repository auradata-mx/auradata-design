'use client';
import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';

/** A fixed day, so the page renders the same on the server and in the browser. */
const TODAY = new Date(2026, 10, 21);

export default function CalendarDemo() {
  const [date, setDate] = useState<Date | undefined>(TODAY);

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      today={TODAY}
      defaultMonth={TODAY}
      className="rounded-lg border"
    />
  );
}
