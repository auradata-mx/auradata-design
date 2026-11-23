'use client';

import { NotificationCenter } from '@/components/ui/notification-center';

export default function NotificationcenterEmpty() {
  return (
    <div className="flex w-full max-w-sm justify-end">
      <NotificationCenter notifications={[]} />
    </div>
  );
}
