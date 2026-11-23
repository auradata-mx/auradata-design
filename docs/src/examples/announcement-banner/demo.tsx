'use client';

import { AnnouncementBanner } from '@/components/ui/announcement-banner';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function AnnouncementbannerDemo() {
  const [dismissed, setDismissed] = useState(false);

  return (
    <div className="w-full max-w-xl">
      <AnnouncementBanner
        title="Nueva versión disponible"
        description="Recarga la página para usar las novedades de AuraData BI."
        action={
          <Button size="sm" onClick={() => window.location.reload()}>
            Recargar
          </Button>
        }
        onDismiss={() => setDismissed(true)}
      />
      <p role="status" className="text-sm">
        {dismissed ? 'Aviso cerrado.' : ''}
      </p>
    </div>
  );
}
