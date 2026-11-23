// registry: auradata (a drop zone for imports with a real button, type and size checks in Spanish, and a file list on shadcn's attachment with progress and per-file errors)
"use client"

import * as React from "react"
import { cn } from "cn"
import {
  FileIcon,
  FileSpreadsheetIcon,
  FileWarningIcon,
  UploadIcon,
  XIcon,
} from "lucide-react"

import { formatPercent } from "@/lib/format"
import {
  formatFileSize,
  validateFile,
  type FileProblem,
} from "@/lib/file-upload"
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

type DroppedFile = { file: File; problem: FileProblem | null }

type FileDropzoneProps = Omit<
  React.ComponentProps<"div">,
  "onDrop" | "title"
> & {
  /** As the input's `accept`: `".csv,text/csv"`. Files of another type come back with a `problem`. */
  accept?: string
  /** Bytes. Larger files come back with a `problem`. */
  maxSize?: number
  multiple?: boolean
  disabled?: boolean
  /** Every file dropped or chosen, each with its `problem` (`null` when it can go). */
  onFiles: (files: DroppedFile[]) => void
  title?: React.ReactNode
  /** What it takes, under the title: «CSV de hasta 10 MB». */
  description?: React.ReactNode
  buttonLabel?: string
  /** The id of the file input, for a `FieldLabel`. */
  inputId?: string
}

/**
 * Drop files or choose them with the button (the keyboard and phones use the button). It checks type and size
 * and hands every file back with its problem, so the list can say what went wrong with each one.
 */
function FileDropzone({
  accept,
  maxSize,
  multiple = false,
  disabled = false,
  onFiles,
  title,
  description,
  buttonLabel,
  inputId,
  className,
  ...props
}: FileDropzoneProps) {
  const input = React.useRef<HTMLInputElement>(null)
  const depth = React.useRef(0)
  const [dragging, setDragging] = React.useState(false)

  const take = (list: FileList | null) => {
    const files = [...(list ?? [])].slice(0, multiple ? undefined : 1)
    if (files.length) {
      onFiles(
        files.map((file) => ({
          file,
          problem: validateFile(file, { accept, maxSize }),
        }))
      )
    }
  }

  const stop = (event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
  }

  return (
    <div
      data-slot="file-dropzone"
      data-dragging={dragging || undefined}
      data-disabled={disabled || undefined}
      aria-disabled={disabled || undefined}
      onDragEnter={(event) => {
        stop(event)
        if (disabled) return
        depth.current++
        setDragging(true)
      }}
      onDragOver={(event) => {
        stop(event)
        event.dataTransfer.dropEffect = disabled ? "none" : "copy"
      }}
      onDragLeave={(event) => {
        stop(event)
        depth.current = Math.max(0, depth.current - 1)
        if (depth.current === 0) setDragging(false)
      }}
      onDrop={(event) => {
        stop(event)
        depth.current = 0
        setDragging(false)
        if (!disabled) take(event.dataTransfer.files)
      }}
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-[color:var(--field-border,var(--input))] bg-muted/40 px-6 py-8 text-center transition-colors data-dragging:border-solid data-dragging:border-primary data-dragging:bg-primary/5 dark:bg-input/20 data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      <div className="flex size-10 items-center justify-center rounded-lg bg-background text-foreground shadow-xs ring-1 ring-foreground/10 [&_svg]:size-5">
        <UploadIcon aria-hidden />
      </div>
      <div className="flex max-w-sm flex-col gap-1">
        <p className="text-sm font-medium text-balance">
          {title ?? (
            <>
              <span className="pointer-coarse:hidden">
                {multiple
                  ? "Arrastra tus archivos aquí"
                  : "Arrastra tu archivo aquí"}
              </span>
              <span className="hidden pointer-coarse:inline">
                {multiple ? "Sube tus archivos" : "Sube tu archivo"}
              </span>
            </>
          )}
        </p>
        {description && (
          <p className="text-sm text-pretty text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled}
        onClick={() => input.current?.click()}
      >
        {buttonLabel ?? (multiple ? "Elegir archivos" : "Elegir archivo")}
      </Button>
      <input
        ref={input}
        id={inputId}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        hidden
        onChange={(event) => {
          take(event.currentTarget.files)
          // The same file can be chosen again after removing it.
          event.currentTarget.value = ""
        }}
      />
    </div>
  )
}

function FileUploadList({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="file-upload-list"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
}

type FileUploadItemProps = Omit<React.ComponentProps<"li">, "children"> & {
  name: string
  /** Bytes. */
  size: number
  /** 0 to 100 while it uploads; leave it out, or 100, when it is done. */
  progress?: number
  /** Why it failed, in a sentence: shown instead of the size. */
  error?: string
  onRemove?: () => void
  removeLabel?: string
}

/** One file of the list: its name, its size, a bar while it uploads, the reason when it fails. */
function FileUploadItem({
  name,
  size,
  progress,
  error,
  onRemove,
  removeLabel,
  className,
  ...props
}: FileUploadItemProps) {
  const uploading = !error && progress !== undefined && progress < 100
  const state = error ? "error" : uploading ? "uploading" : "done"
  const Icon = error
    ? FileWarningIcon
    : /\.(csv|tsv|xlsx?)$/i.test(name)
      ? FileSpreadsheetIcon
      : FileIcon
  return (
    <li
      data-slot="file-upload-item"
      className={cn("min-w-0", className)}
      {...props}
    >
      <Attachment state={state} className="w-full items-center">
        <AttachmentMedia>
          <Icon aria-hidden />
        </AttachmentMedia>
        <AttachmentContent className="min-w-0 flex-1">
          <AttachmentTitle>{name}</AttachmentTitle>
          {error ? (
            <AttachmentDescription
              role="alert"
              className="text-pretty whitespace-normal"
            >
              {error}
            </AttachmentDescription>
          ) : (
            <AttachmentDescription>
              {formatFileSize(size)} ·{" "}
              {uploading
                ? `Subiendo… ${formatPercent((progress ?? 0) / 100, { maximumFractionDigits: 0 })}`
                : "Listo"}
            </AttachmentDescription>
          )}
          {uploading && (
            <Progress
              value={progress ?? 0}
              aria-label={`Subiendo ${name}`}
              className="mt-2"
            />
          )}
        </AttachmentContent>
        {onRemove && (
          <AttachmentActions>
            <AttachmentAction
              aria-label={removeLabel ?? `Quitar ${name}`}
              onClick={onRemove}
            >
              <XIcon aria-hidden />
            </AttachmentAction>
          </AttachmentActions>
        )}
      </Attachment>
    </li>
  )
}

export { FileDropzone, FileUploadItem, FileUploadList }
export type { DroppedFile, FileDropzoneProps, FileUploadItemProps }
