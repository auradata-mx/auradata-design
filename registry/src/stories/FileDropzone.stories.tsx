import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import { CsvPreview } from '@/components/ui/csv-preview'
import { FileDropzone, FileUploadItem, FileUploadList, type DroppedFile } from '@/components/ui/file-dropzone'
import { parseCsv, validateFile } from '@/lib/file-upload'
import { blur } from './play-helpers'

const CSV = `Región,Mes,Ventas,Clientes
Norte,nov 2026,"1,284,500",312
Centro,nov 2026,"2,041,300",488
Sur,nov 2026,"642,900",157
Occidente,nov 2026,"1,118,250",276
Bajío,nov 2026,"905,400",219
Noreste,nov 2026,"1,377,800",301
Sureste,nov 2026,"518,600",133
`
const MAX_SIZE = 10_000_000
const ACCEPT = '.csv,text/csv'

const meta = {
  title: 'AuraData/File dropzone',
  component: FileDropzone,
  args: {
    accept: ACCEPT,
    maxSize: MAX_SIZE,
    description: 'Un archivo CSV de hasta 10 MB, con los nombres de las columnas en la primera fila.',
    onFiles: fn(),
  },
  render: (args) => <FileDropzone {...args} className="max-w-xl" />,
} satisfies Meta<typeof FileDropzone>

export default meta
type Story = StoryObj<typeof meta>

/** Empty: drag a file onto it, or choose it with the button (the keyboard and phones use the button). */
export const Default: Story = {}

/** A file over the zone: a solid primary edge and a tint say it will be taken. */
export const Dragging: Story = {
  play: async ({ canvasElement }) => {
    const zone = canvasElement.querySelector<HTMLElement>('[data-slot=file-dropzone]')!
    zone.dispatchEvent(
      new DragEvent('dragenter', { bubbles: true, cancelable: true, dataTransfer: new DataTransfer() })
    )
    await waitFor(() => expect(zone).toHaveAttribute('data-dragging', 'true'))
  },
}

export const Disabled: Story = { args: { disabled: true } }

type Upload = {
  id: string
  name: string
  size: number
  progress?: number
  error?: string
  rows?: string[][]
  totalRows?: number
}

/** The import screen: the zone, the list of files with their state, and the first rows of the CSV that is ready. */
function CsvImport({ initial = [], onFiles }: { initial?: Upload[]; onFiles?: (files: DroppedFile[]) => void }) {
  const [uploads, setUploads] = React.useState(initial)
  const ready = [...uploads].reverse().find((upload) => upload.rows)

  const add = async (files: DroppedFile[]) => {
    onFiles?.(files)
    const added = await Promise.all(
      files.map(async ({ file, problem }) => {
        const upload: Upload = { id: `${file.name}-${file.lastModified}`, name: file.name, size: file.size }
        if (problem) return { ...upload, error: problem.reason }
        const text = await file.text()
        const rows = parseCsv(text, { maxRows: 6 })
        return { ...upload, rows, totalRows: parseCsv(text).length - 1 }
      })
    )
    setUploads((current) => [...current, ...added])
  }

  return (
    <div className="flex max-w-xl flex-col gap-4">
      <FileDropzone
        multiple
        accept={ACCEPT}
        maxSize={MAX_SIZE}
        description="Archivos CSV de hasta 10 MB, con los nombres de las columnas en la primera fila."
        onFiles={add}
      />
      {uploads.length > 0 && (
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
      )}
      {ready?.rows && <CsvPreview rows={ready.rows} totalRows={ready.totalRows} />}
    </div>
  )
}

const PREVIEW = parseCsv(CSV, { maxRows: 6 })
const problemOf = (name: string, type: string, size: number) =>
  validateFile({ name, type, size }, { accept: ACCEPT, maxSize: MAX_SIZE })?.reason

/** Every state at once: uploading, ready, a file of another type and one too large, and the preview. */
export const ImportStates: Story = {
  name: 'Import states',
  tags: ['mobile'],
  render: () => (
    <CsvImport
      initial={[
        { id: '1', name: 'ventas-octubre.csv', size: 3_420_000, progress: 45 },
        { id: '2', name: 'ventas-noviembre.csv', size: 1_284_000, rows: PREVIEW, totalRows: 1284 },
        {
          id: '3',
          name: 'informe-anual.pdf',
          size: 880_000,
          error: problemOf('informe-anual.pdf', 'application/pdf', 880_000),
        },
        {
          id: '4',
          name: 'pedidos-2026.csv',
          size: 12_400_000,
          error: problemOf('pedidos-2026.csv', 'text/csv', 12_400_000),
        },
      ]}
    />
  ),
}

/**
 * Dropping three files: the CSV is read and previewed, the PDF and the 10.5 MB CSV stay in the list with the reason
 * each one cannot go; removing a file takes it out.
 */
export const Dropping: Story = {
  render: (args) => <CsvImport onFiles={args.onFiles} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const transfer = new DataTransfer()
    transfer.items.add(new File([CSV], 'ventas-noviembre.csv', { type: 'text/csv' }))
    transfer.items.add(new File(['%PDF'], 'informe-anual.pdf', { type: 'application/pdf' }))
    transfer.items.add(new File([new Uint8Array(10_500_000)], 'pedidos-2026.csv', { type: 'text/csv' }))
    const zone = canvasElement.querySelector<HTMLElement>('[data-slot=file-dropzone]')!
    // Native events: fireEvent rebuilds the DataTransfer from its own properties and loses the files.
    zone.dispatchEvent(new DragEvent('dragenter', { bubbles: true, cancelable: true, dataTransfer: transfer }))
    zone.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer: transfer }))
    await expect(zone).not.toHaveAttribute('data-dragging')
    await expect(args.onFiles).toHaveBeenCalledWith([
      expect.objectContaining({ problem: null }),
      expect.objectContaining({ problem: expect.objectContaining({ code: 'type' }) }),
      expect.objectContaining({ problem: expect.objectContaining({ code: 'size' }) }),
    ])
    const list = await canvas.findByRole('list', { name: 'Archivos' })
    await expect(within(list).getAllByRole('listitem')).toHaveLength(3)
    await expect(within(list).getByText('No es un archivo .csv.')).toHaveAttribute('role', 'alert')
    // Testing Library reads the no-break spaces of the sizes as plain spaces.
    await expect(within(list).getByText('Pesa 10.5 MB; el máximo es 10 MB.')).toBeVisible()
    const preview = canvas.getByRole('table', { name: 'Primeras 5 filas de 7' })
    await expect(
      within(preview)
        .getAllByRole('columnheader')
        .map((cell) => cell.textContent)
    ).toEqual(['Región', 'Mes', 'Ventas', 'Clientes'])
    await expect(within(preview).getAllByRole('row')).toHaveLength(6)
    // Numbers align right, text left.
    await expect(getComputedStyle(within(preview).getByRole('columnheader', { name: 'Ventas' })).textAlign).toBe(
      'right'
    )
    await expect(getComputedStyle(within(preview).getByRole('columnheader', { name: 'Región' })).textAlign).toBe('left')
    await userEvent.click(canvas.getByRole('button', { name: 'Quitar informe-anual.pdf' }))
    await waitFor(() => expect(within(list).getAllByRole('listitem')).toHaveLength(2))
    blur()
  },
}

/** Without a mouse: Tab reaches «Elegir archivos», which opens the file chooser; the chosen file joins the list. */
export const Keyboard: Story = {
  render: () => <CsvImport />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.tab()
    const button = canvas.getByRole('button', { name: 'Elegir archivos' })
    await expect(button).toHaveFocus()
    const input = canvasElement.querySelector<HTMLInputElement>('input[type=file]')!
    await expect(input).toHaveAttribute('accept', ACCEPT)
    await userEvent.upload(input, new File([CSV], 'ventas-noviembre.csv', { type: 'text/csv' }))
    await expect(await canvas.findByText('ventas-noviembre.csv')).toBeVisible()
    blur()
  },
}
