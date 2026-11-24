import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import { UserMenu } from '@/components/blocks/user-menu'

const USER = { name: 'Ana López', email: 'ana@empresa.mx' }

const meta = {
  title: 'Blocks/Parts/User menu',
  component: UserMenu,
  args: {
    user: USER,
    workspaces: {
      workspaces: [
        { id: 'ventas', name: 'Ventas' },
        { id: 'finanzas', name: 'Finanzas' },
      ],
      current: 'ventas',
      onSelect: fn(),
    },
    theme: { theme: 'system', onThemeChange: fn() },
    language: { value: 'es-MX', onValueChange: fn() },
    onAccount: fn(),
    onSettings: fn(),
    onHelp: fn(),
    onShortcuts: fn(),
    onSignOut: fn(),
  },
} satisfies Meta<typeof UserMenu>

export default meta
type Story = StoryObj<typeof meta>

/** The account on top, then the workspace, theme and language, help, and «Cerrar sesión» last. */
export const Open: Story = {
  tags: ['mobile'],
  args: { defaultOpen: true },
  decorators: [(Story) => <div className="flex min-h-[30rem] justify-end">{Story()}</div>],
}

/** In the sidebar's footer: the name and email beside the avatar. */
export const Full: Story = {
  args: { variant: 'full' },
  decorators: [(Story) => <div className="w-64">{Story()}</div>],
}

const TRIGGER = 'Cuenta de Ana López'

async function openMenu(canvasElement: HTMLElement) {
  const body = within(canvasElement.ownerDocument.body)
  await userEvent.click(within(canvasElement).getByRole('button', { name: TRIGGER }))
  const menu = await body.findByRole('menu')
  // waitFor: the menu fades in.
  await waitFor(() => expect(within(menu).getByText('ana@empresa.mx')).toBeVisible())
  return { body, menu }
}

/** Rest state for the screenshot: every menu closed, nothing focused. */
async function settle(canvasElement: HTMLElement) {
  await waitFor(() => expect(within(canvasElement.ownerDocument.body).queryAllByRole('menu')).toHaveLength(0))
  ;(document.activeElement as HTMLElement | null)?.blur()
}

/** The theme from the keyboard: ArrowRight opens «Tema» on «Claro», ArrowDown + Enter choose «Oscuro» and close. */
export const ChooseTheme: Story = {
  play: async ({ args, canvasElement }) => {
    const { body, menu } = await openMenu(canvasElement)
    within(menu).getByRole('menuitem', { name: /Tema/ }).focus()
    await userEvent.keyboard('{ArrowRight}')
    const themes = await body.findByRole('menu', { name: /Tema/ })
    await waitFor(() => expect(within(themes).getByRole('menuitemradio', { name: 'Claro' })).toHaveFocus())
    await userEvent.keyboard('{ArrowDown}')
    await expect(within(themes).getByRole('menuitemradio', { name: 'Oscuro' })).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await waitFor(() => expect(args.theme!.onThemeChange).toHaveBeenCalledWith('dark'))
    await settle(canvasElement)
  },
}

/** Another workspace from its submenu. */
export const ChooseWorkspace: Story = {
  play: async ({ args, canvasElement }) => {
    const { body, menu } = await openMenu(canvasElement)
    await userEvent.click(within(menu).getByRole('menuitem', { name: /Espacio de trabajo/ }))
    await userEvent.click(await body.findByRole('menuitemradio', { name: 'Finanzas' }))
    await expect(args.workspaces!.onSelect).toHaveBeenCalledWith('finanzas')
    await settle(canvasElement)
  },
}

/** «Atajos de teclado» and «Cerrar sesión» call their handlers. */
export const Actions: Story = {
  play: async ({ args, canvasElement }) => {
    const { menu } = await openMenu(canvasElement)
    await userEvent.click(within(menu).getByRole('menuitem', { name: /Atajos de teclado/ }))
    await expect(args.onShortcuts).toHaveBeenCalled()
    await settle(canvasElement)
    const again = await openMenu(canvasElement)
    await userEvent.click(within(again.menu).getByRole('menuitem', { name: 'Cerrar sesión' }))
    await expect(args.onSignOut).toHaveBeenCalled()
    await settle(canvasElement)
  },
}

/** Only what the app passes: here no workspace, theme or language, no help. */
export const Minimal: Story = {
  args: {
    defaultOpen: true,
    workspaces: undefined,
    theme: undefined,
    language: undefined,
    onAccount: undefined,
    onHelp: undefined,
    onShortcuts: undefined,
  },
  decorators: [(Story) => <div className="flex min-h-64 justify-end">{Story()}</div>],
}
