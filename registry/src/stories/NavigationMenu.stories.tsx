import type { Meta, StoryObj } from '@storybook/react-vite'
import { MenuIcon } from 'lucide-react'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/logo'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'

const DOCS = [
  { href: '#primeros-pasos', title: 'Primeros pasos', description: 'Conecta tu primera base de datos y arma un informe.' },
  { href: '#sql-lab', title: 'SQL Lab', description: 'Consulta tus datasets y guarda las consultas.' },
  { href: '#api', title: 'API', description: 'Lleva tus informes a tus propias apps.' },
]

const meta = {
  title: 'Components/Navigation menu',
  component: NavigationMenu,
} satisfies Meta<typeof NavigationMenu>

export default meta
type Story = StoryObj<typeof meta>

/** The auradata.mx header. On a phone the links fold into a menu button. */
export const Default: Story = {
  tags: ['mobile'],
  render: (args) => (
    <header className="flex items-center justify-between gap-6 border-b pb-4">
      <a href="#inicio" aria-label="AuraData, inicio" className="flex">
        <Logo className="h-6" />
      </a>
      <NavigationMenu className="hidden md:flex" aria-label="Principal" {...args}>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink href="#producto" className={navigationMenuTriggerStyle()}>
              Producto
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="#soluciones" className={navigationMenuTriggerStyle()}>
              Soluciones
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="#precios" className={navigationMenuTriggerStyle()}>
              Precios
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem value="docs">
            <NavigationMenuTrigger>Docs</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-80 gap-1">
                {DOCS.map((doc) => (
                  <li key={doc.href}>
                    <NavigationMenuLink href={doc.href} className="grid gap-1">
                      <span className="font-medium">{doc.title}</span>
                      <span className="text-muted-foreground">{doc.description}</span>
                    </NavigationMenuLink>
                  </li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <div className="flex items-center gap-2">
        <Button variant="outline" className="hidden sm:inline-flex">
          Entrar
        </Button>
        <Button>Agenda una demo</Button>
        <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menú">
          <MenuIcon aria-hidden />
        </Button>
      </div>
    </header>
  ),
}

/**
 * «Docs» opens its submenu and Escape closes it. No `Open` story: while a Base UI navigation menu is
 * open it adds focus guards (`aria-hidden` spans with `tabindex=0`) that axe reports as
 * `aria-hidden-focus`, and the axe rules are not relaxed for them.
 */
export const Submenu: Story = {
  ...Default,
  tags: [],
  // The story test's browser is narrow; the links show from `md`.
  globals: { viewport: { value: 'desktop', isRotated: false } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Docs' }))
    const body = within(canvasElement.ownerDocument.body)
    const link = await body.findByRole('link', { name: /SQL Lab/ })
    await waitFor(() => expect(link).toBeVisible())
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(body.queryByRole('link', { name: /SQL Lab/ })).toBeNull())
  },
}
