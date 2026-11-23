'use client';

import { FileSpreadsheetIcon, FileTextIcon, XIcon } from 'lucide-react';
import { useState } from 'react';
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from '@/components/ui/attachment';

export default function AttachmentDemo() {
  const [files, setFiles] = useState([
    { name: 'informe.pdf', detail: 'PDF · 1.2 MB', icon: FileTextIcon },
    { name: 'ventas.xlsx', detail: 'Excel · 840 kB', icon: FileSpreadsheetIcon },
  ]);

  return (
    <div className="w-full max-w-lg">
      {files.length === 0 ? (
        <p role="status" className="text-sm">
          No hay archivos adjuntos.
        </p>
      ) : (
        <AttachmentGroup>
          {files.map(({ name, detail, icon: Icon }) => (
            <Attachment key={name}>
              <AttachmentMedia>
                <Icon aria-hidden />
              </AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle>{name}</AttachmentTitle>
                <AttachmentDescription>{detail}</AttachmentDescription>
              </AttachmentContent>
              <AttachmentActions>
                <AttachmentAction
                  aria-label={`Quitar ${name}`}
                  onClick={() => setFiles((current) => current.filter((file) => file.name !== name))}
                >
                  <XIcon aria-hidden />
                </AttachmentAction>
              </AttachmentActions>
            </Attachment>
          ))}
        </AttachmentGroup>
      )}
    </div>
  );
}
