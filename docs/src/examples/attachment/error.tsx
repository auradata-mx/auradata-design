'use client';

import { FileSpreadsheetIcon } from 'lucide-react';
import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from '@/components/ui/attachment';

export default function AttachmentError() {
  return (
    <Attachment state="error">
      <AttachmentMedia>
        <FileSpreadsheetIcon aria-hidden />
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>ventas.xlsx</AttachmentTitle>
        <AttachmentDescription>No se pudo cargar. Vuelve a adjuntar el archivo.</AttachmentDescription>
      </AttachmentContent>
    </Attachment>
  );
}
