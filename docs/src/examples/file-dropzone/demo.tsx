'use client';
import { FileDropzone } from '@/components/ui/file-dropzone';

export default function FileDropzoneDemo() {
  return (
    <FileDropzone
      className="w-full max-w-xl"
      accept=".csv,text/csv"
      maxSize={10_000_000}
      description="Un archivo CSV de hasta 10 MB, con los nombres de las columnas en la primera fila."
      onFiles={() => {}}
    />
  );
}
