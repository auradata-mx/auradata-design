'use client';

import { useState } from 'react';
import { OnboardingChecklist } from '@/components/ui/onboarding-checklist';

export default function OnboardingchecklistDemo() {
  const [done, setDone] = useState<string[]>([]);
  const steps = [
    {
      id: 'connect',
      title: 'Conecta tu primera base de datos',
      description: 'Elige una base de datos.',
      label: 'Conectar',
    },
    {
      id: 'report',
      title: 'Crea tu primer informe',
      description: 'Elige un dataset y arma tus gráficas.',
      label: 'Crear informe',
    },
  ];

  return (
    <OnboardingChecklist
      className="w-full max-w-lg motion-reduce:[&_[data-slot=progress-indicator]]:transition-none"
      steps={steps.map(({ id, title, description, label }) => ({
        id,
        title,
        description,
        done: done.includes(id),
        action: { label, onClick: () => setDone((current) => [...current, id]) },
      }))}
    />
  );
}
