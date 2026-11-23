'use client';

import { useState } from 'react';
import { OnboardingChecklist } from '@/components/ui/onboarding-checklist';

export default function OnboardingchecklistComplete() {
  const [dismissed, setDismissed] = useState(false);

  return dismissed ? (
    <p role="status">Guía oculta.</p>
  ) : (
    <OnboardingChecklist
      className="w-full max-w-lg"
      onDismiss={() => setDismissed(true)}
      steps={[
        { id: 'connect', title: 'Conecta tu primera base de datos', done: true },
        { id: 'report', title: 'Crea tu primer informe', done: true },
      ]}
    />
  );
}
