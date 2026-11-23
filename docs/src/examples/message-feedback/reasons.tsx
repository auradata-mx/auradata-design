'use client';

import { MessageFeedback } from '@/components/ui/message-feedback';

export default function MessagefeedbackReasons() {
  return (
    <div className="w-full max-w-md space-y-2">
      <p>El informe usa datos del espacio «Ventas».</p>
      <MessageFeedback
        onFeedback={() => {}}
        reasons={['Datos incorrectos', 'No citó el dataset', 'Incompleta', 'Otra']}
      />
    </div>
  );
}
