'use client';
import { useState } from 'react';
import { type DroppedFile, FileDropzone, FileUploadItem, FileUploadList } from '@/components/ui/file-dropzone';

type Upload = { id: string; name: string; size: number; progress?: number; error?: string };

export default function FileDropzoneImport() {
  const [uploads, setUploads] = useState<Upload[]>([
    { id: '1', name: 'ventas-octubre.csv', size: 3_420_000, progress: 45 },
    { id: '2', name: 'ventas-noviembre.csv', size: 1_284_000 },
  ]);

  const add = (files: DroppedFile[]) =>
    setUploads((current) => [
      ...current,
      ...files.map(({ file, problem }) => ({
        id: `${file.name}-${file.lastModified}`,
        name: file.name,
        size: file.size,
        error: problem?.reason,
      })),
    ]);

  return (
    <div className="flex w-full max-w-xl flex-col gap-4">
      <FileDropzone
        multiple
        accept=".csv,text/csv"
        maxSize={10_000_000}
        description="Archivos CSV de hasta 10 MB, con los nombres de las columnas en la primera fila."
        onFiles={add}
      />
      <FileUploadList aria-label="Archivos">
        {uploads.map((upload) => (
          <FileUploadItem
            key={upload.id}
            name={upload.name}
            size={upload.size}
            progress={upload.progress}
            error={upload.error}
            onRemove={() => setUploads((current) => current.filter((entry) => entry.id !== upload.id))}
          />
        ))}
      </FileUploadList>
    </div>
  );
}
