import type { Meta, StoryObj } from '@storybook/react-vite'
import { DownloadIcon, PlusIcon, RefreshCwIcon } from 'lucide-react'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { Button, buttonVariants } from '@/components/ui/button'

const meta = {
  title: 'Components/Button',
  component: Button,
  args: { children: 'Guardar informe' },
  argTypes: {
    variant: { control: 'select', options: ['default', 'outline', 'secondary', 'ghost', 'destructive', 'link'] },
    size: { control: 'select', options: ['xs', 'sm', 'default', 'lg'] },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {}

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-3">
      <Button {...args}>Principal</Button>
      <Button {...args} variant="outline">Contorno</Button>
      <Button {...args} variant="secondary">Secundario</Button>
      <Button {...args} variant="ghost">Fantasma</Button>
      <Button {...args} variant="destructive">Destructivo</Button>
      <Button {...args} variant="link">Enlace</Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // A fill that stopped inside the transparent border painted 2px shorter than the outline button beside it.
    for (const name of ['Principal', 'Secundario', 'Destructivo']) {
      await expect(getComputedStyle(canvas.getByRole('button', { name })).backgroundClip, name).toBe('border-box')
    }
  },
}

export const Disabled: Story = { args: { disabled: true } }

/** The text sizes, from the smallest to the largest. */
export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button {...args} size="xs">Extra chico</Button>
      <Button {...args} size="sm">Chico</Button>
      <Button {...args} size="default">Normal</Button>
      <Button {...args} size="lg">Grande</Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const large = getComputedStyle(within(canvasElement).getByRole('button', { name: 'Grande' }))
    // Taller and roomier than the default (h-8 px-2.5), not just 4px taller.
    await expect([large.height, large.paddingLeft]).toEqual(['40px', '16px'])
  },
}

/** Icon-only sizes: each one has an accessible name, the icon is hidden from assistive tech. */
export const IconSizes: Story = {
  name: 'Icon sizes',
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button {...args} size="icon-xs" variant="outline" aria-label="Actualizar">
        <RefreshCwIcon aria-hidden />
      </Button>
      <Button {...args} size="icon-sm" variant="outline" aria-label="Descargar">
        <DownloadIcon aria-hidden />
      </Button>
      <Button {...args} size="icon" variant="outline" aria-label="Nuevo informe">
        <PlusIcon aria-hidden />
      </Button>
      <Button {...args} size="icon-lg" variant="outline" aria-label="Actualizar datos">
        <RefreshCwIcon aria-hidden />
      </Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    for (const name of ['Actualizar', 'Descargar', 'Nuevo informe', 'Actualizar datos']) {
      await expect(canvas.getByRole('button', { name })).toBeVisible()
    }
  },
}

/** A leading icon before the label, in every text size. */
export const WithIcon: Story = {
  name: 'With icon',
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button {...args} size="sm">
        <DownloadIcon data-icon="inline-start" aria-hidden />
        Descargar
      </Button>
      <Button {...args}>
        <PlusIcon data-icon="inline-start" aria-hidden />
        Nuevo informe
      </Button>
      <Button {...args} size="lg" variant="outline">
        <RefreshCwIcon data-icon="inline-start" aria-hidden />
        Actualizar datos
      </Button>
    </div>
  ),
}

/** Reached with the keyboard (Tab): `:focus-visible` shows the focus ring, as in the screenshot. */
export const Focus: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.tab()
    const control = within(canvasElement).getByRole('button', { name: 'Guardar informe' })
    await expect(document.activeElement).toBe(control)
    // The brand focus ring of the AuraData theme: 2px of --ring, 2px away, no stock box-shadow ring.
    await waitFor(() => {
      const style = getComputedStyle(control)
      expect([style.outlineStyle, style.outlineWidth, style.outlineOffset]).toEqual(['solid', '2px', '2px'])
      expect(style.boxShadow).not.toMatch(/ 3px(,|$)/)
    })
  },
}

/** A link styled as a button (`buttonVariants` on an `<a>`, so it keeps the link role), reached with the keyboard. */
export const LinkFocus: Story = {
  name: 'Link focus',
  render: () => (
    <a href="#informes" className={buttonVariants({ variant: 'link' })}>
      Ver todos los informes
    </a>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.tab()
    await expect(document.activeElement).toBe(within(canvasElement).getByRole('link', { name: 'Ver todos los informes' }))
  },
}

/** While its action runs: the spinner sits before the label, the button is disabled and `aria-busy`, so it is not sent twice. */
export const Loading: Story = {
  args: { loading: true, children: 'Guardando…' },
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: 'Guardando…' })
    await expect(button).toBeDisabled()
    await expect(button).toHaveAttribute('aria-busy', 'true')
    await expect(button.querySelector('[data-slot=spinner]')).not.toBeNull()
    // Busy is not disabled: the label stays at full strength, so «Guardando…» reads.
    await expect(getComputedStyle(button).opacity).toBe('1')
  },
}

/** An icon button while loading: the spinner takes the icon's place, the name stays. */
export const LoadingIcon: Story = {
  name: 'Loading icon',
  args: { loading: true, size: 'icon', 'aria-label': 'Actualizar', children: <RefreshCwIcon aria-hidden /> },
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: 'Actualizar' })
    await expect(button).toBeDisabled()
    await expect(button).toHaveAttribute('aria-busy', 'true')
    await expect(button.querySelector('[data-slot=spinner]')).not.toBeNull()
    await expect(button.querySelector('.lucide-refresh-cw')).toBeNull()
  },
}
