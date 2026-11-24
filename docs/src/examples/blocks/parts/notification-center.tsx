'use client';

import { useState } from 'react';
import { NotificationCenter } from '@/components/blocks/notification-center';

export default function NotificationcenterDemo() {
  const [notifications, setNotifications] = useState([
    { id: 'export', title: 'Tu exportación está lista', time: 'Hace 5 min', read: false },
    { id: 'shared', title: 'Ana compartió «Ventas por región»', time: 'Ayer', read: true },
  ]);

  return (
    <div className="flex w-full max-w-sm justify-end">
      <NotificationCenter
        notifications={notifications}
        onMarkAllRead={() => setNotifications((items) => items.map((item) => ({ ...item, read: true })))}
      />
    </div>
  );
}
