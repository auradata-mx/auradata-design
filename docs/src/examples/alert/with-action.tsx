'use client';

import { TriangleAlertIcon } from 'lucide-react';
import { useState } from 'react';
import { Alert, AlertAction, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

export default function AlertWithAction() {
  const [showPlans, setShowPlans] = useState(false);

  return (
    <div className="w-full max-w-80">
      <Alert variant="warning">
        <TriangleAlertIcon aria-hidden />
        <AlertTitle>Tu prueba termina en 3 días</AlertTitle>
        <AlertDescription>Elige un plan para conservar tus informes.</AlertDescription>
        <AlertAction>
          <Button size="sm" variant="outline" onClick={() => setShowPlans(true)}>
            Ver planes
          </Button>
        </AlertAction>
      </Alert>
      <p role="status" className="mt-2 text-sm">
        {showPlans ? 'Planes disponibles: Mensual y Anual.' : ''}
      </p>
    </div>
  );
}
