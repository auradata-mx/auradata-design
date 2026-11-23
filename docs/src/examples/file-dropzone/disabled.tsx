'use client';
import { FileDropzone } from '@/components/ui/file-dropzone';

export default function FileDropzoneDisabled() {
  return (
    <FileDropzone
      className="w-full max-w-xl"
      accept=".csv,text/csv"
      description="Un archivo CSV de hasta 10 MB."
      disabled
      onFiles={() => {}}
    />
  );
}
