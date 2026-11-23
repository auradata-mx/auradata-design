'use client';

import { InfoIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function AlertDemo() {
  return (
    <Alert variant="info" className="max-w-lg">
      <InfoIcon aria-hidden />
      <AlertTitle>El informe se actualiza cada hora</AlertTitle>
      <AlertDescription>La última carga de «Ventas por región» terminó a las 9:00.</AlertDescription>
    </Alert>
  );
}
