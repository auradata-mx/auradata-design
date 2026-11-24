'use client';

import { CodeBlockCopyButton } from '@/components/ui/code-block';

export function CopyQueryButton({ value }: { value: string }) {
  return <CodeBlockCopyButton value={value} />;
}
