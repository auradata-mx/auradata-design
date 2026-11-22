import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import { Input } from '@/components/ui/input'
import { shortcutLabel } from '@/components/ui/search-command'
import { ShortcutsDialog, type ShortcutGroup } from '@/components/ui/shortcuts-dialog'

const GROUPS: ShortcutGroup[] = [
  {
    heading: 'Navegación',
    shortcuts: [
      { label: 'Buscar', keys: 'mod+k' },
      { label: 'Ir a informes', keys: 'g i' },
      { label: 'Ir a datasets', keys: 'g d' },
    ],
  },
  {
    heading: 'Informes',
    shortcuts: [
      { label: 'Nuevo informe', keys: 'n' },
      { label: 'Guardar cambios', keys: 'mod+s' },
      { label: 'Duplicar la gráfica', keys: 'shift+d' },
    ],
  },
  {
    heading: 'General',
    shortcuts: [
      { label: 'Ver los atajos', keys: '?' },
      { label: 'Cerrar un diálogo', keys: 'esc' },
    ],
  },
]

/** A page with a field: «?» opens the shortcuts anywhere except while typing. */
function Page(props: React.ComponentProps<typeof ShortcutsDialog>) {
  return (
    <div className="grid max-w-sm gap-3">
      <p className="text-sm text-muted-foreground">Pulsa «?» para ver los atajos.</p>
      <Input aria-label="Nombre del informe" defaultValue="Ventas 2026" />
      <ShortcutsDialog {...props} />
    </div>
  )
}

const meta = {
  title: 'AuraData/Shortcuts dialog',
  component: Page,
  args: { groups: GROUPS, onOpenChange: fn() },
} satisfies Meta<typeof Page>

export default meta
type Story = StoryObj<typeof meta>

/** Grouped, with each key in a `Kbd`; ⌘ on Apple, Ctrl elsewhere, as the search. */
export const Open: Story = {
  tags: ['mobile'],
  args: { defaultOpen: true },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const dialog = await body.findByRole('dialog', { name: 'Atajos de teclado' })
    // waitFor: the dialog fades in (slower runners caught it at opacity 0).
    await waitFor(() => expect(within(dialog).getByRole('heading', { name: 'Navegación' })).toBeVisible())
    const search = within(dialog).getByText('Buscar').closest('li')!
    await expect(search).toHaveTextContent(shortcutLabel('k'))
    // A sequence reads «G luego I».
    await expect(within(dialog).getByText('Ir a informes').closest('li')!).toHaveTextContent('GluegoI')
    // «luego» is a word of the sentence, in the text face, not the keys' monospace.
    await expect(getComputedStyle(within(dialog).getAllByText('luego')[0]).fontFamily).toBe(
      getComputedStyle(within(dialog).getByText('Ir a informes')).fontFamily,
    )
    await expect(within(dialog).getByText('Duplicar la gráfica').closest('li')!).toHaveTextContent('ShiftD')
  },
}

/** «?» opens it and Escape closes it; inside a text field «?» is just a character. */
export const Keyboard: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    const field = canvas.getByRole('textbox', { name: 'Nombre del informe' })
    await userEvent.click(field)
    await userEvent.keyboard('?')
    await expect(field).toHaveValue('Ventas 2026?')
    await expect(body.queryByRole('dialog')).toBeNull()
    field.blur()
    await userEvent.keyboard('?')
    const dialog = await body.findByRole('dialog', { name: 'Atajos de teclado' })
    // waitFor: the dialog fades in.
    await waitFor(() => expect(dialog).toBeVisible())
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(true)
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(body.queryByRole('dialog')).toBeNull())
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false)
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}
