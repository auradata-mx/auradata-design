'use client';

import { AnnouncementBanner } from '@/components/ui/announcement-banner';

export default function AnnouncementbannerInFlow() {
  return (
    <AnnouncementBanner
      variant="warning"
      title="Mantenimiento programado"
      description="Las exportaciones estarán en pausa el domingo de 1:00 a 3:00."
      sticky={false}
    />
  );
}
