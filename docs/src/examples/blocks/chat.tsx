'use client';

import { useState } from 'react';
import { Chat, type ChatMessage } from '@/components/blocks/chat';

export default function ChatExample() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  return (
    <div className="h-svh">
      <Chat
        messages={messages}
        suggestions={['¿Cuánto vendimos este mes?', '¿Cuál fue el ticket promedio?']}
        onSend={(text) => {
          setMessages((previous) => [
            ...previous,
            { id: `question-${previous.length}`, role: 'user', text },
            {
              id: `answer-${previous.length}`,
              role: 'assistant',
              text: 'Respuesta de ejemplo: en noviembre las ventas fueron de $4.16 M, 6.2 % más que en octubre.',
              embeds: [
                {
                  type: 'kpi',
                  label: 'Ventas del mes',
                  value: '$4.16 M',
                  change: 0.062,
                  comparison: 'vs. octubre',
                  trend: [3.2, 3.4, 3.3, 3.6, 3.9, 4.16],
                },
              ],
              sql: 'SELECT SUM(total) AS ventas FROM pedidos;',
            },
          ]);
        }}
        onFeedback={(id, feedback) => {
          setMessages((previous) => previous.map((message) =>
            message.id === id ? { ...message, feedback: feedback ?? undefined } : message,
          ));
        }}
      />
    </div>
  );
}
