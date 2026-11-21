import type { Meta, StoryObj } from '@storybook/react-vite'
import { FileSpreadsheetIcon, FileTextIcon, XIcon } from 'lucide-react'
import { expect, fn, userEvent, within } from 'storybook/test'

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from '@/components/ui/attachment'

const FILES = [
  { name: 'informe.pdf', detail: 'PDF · 1.2 MB', icon: FileTextIcon },
  { name: 'ventas.xlsx', detail: 'Excel · 840 KB', icon: FileSpreadsheetIcon },
]

/** The files attached to a question, each with a remove button named after its file. */
function FileList({ onRemove }: { onRemove: (name: string) => void }) {
  return (
    <AttachmentGroup className="max-w-lg">
      {FILES.map((file) => (
        <Attachment key={file.name}>
          <AttachmentMedia>
            <file.icon aria-hidden />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>{file.name}</AttachmentTitle>
            <AttachmentDescription>{file.detail}</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label={`Quitar ${file.name}`} onClick={() => onRemove(file.name)}>
              <XIcon aria-hidden />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
      ))}
    </AttachmentGroup>
  )
}

const meta = {
  title: 'Components/Attachment',
  component: FileList,
  args: { onRemove: fn() },
} satisfies Meta<typeof FileList>

export default meta
type Story = StoryObj<typeof meta>

/** «Quitar ventas.xlsx» calls `onRemove` with the file's name. */
export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Quitar ventas.xlsx' }))
    await expect(args.onRemove).toHaveBeenCalledWith('ventas.xlsx')
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}
