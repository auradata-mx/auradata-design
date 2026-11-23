'use client';

import { MessageFeedback } from '@/components/ui/message-feedback';

export default function MessagefeedbackDemo() {
  return (
    <div className="w-full max-w-md space-y-2">
      <p>Las ventas subieron 12.4 % frente al mes anterior.</p>
      <MessageFeedback
        onFeedback={(value, details) => {
          // Save the feedback here, associated with this answer.
          void value;
          void details;
        }}
      />
    </div>
  );
}
