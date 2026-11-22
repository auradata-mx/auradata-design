import type { Meta, StoryObj } from '@storybook/react-vite'
import { PlusIcon, SearchIcon, Share2Icon } from 'lucide-react'
import { useState } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import { Button } from '@/components/ui/button'
import { Tour, type TourStep } from '@/components/ui/tour'

const STEPS: TourStep[] = [
  {
    target: '#tour-new',
    title: 'Crea un informe',
    description: 'Empieza desde un dataset o desde una plantilla.',
  },
  {
    target: '#tour-search',
    title: 'Busca lo que sea',
    description: 'Informes, datasets y acciones, también con ⌘K.',
  },
  {
    target: '#tour-share',
    title: 'Comparte con tu equipo',
    description: 'Invita por correo o copia un enlace de solo lectura.',
    side: 'left',
  },
]

type DemoProps = Omit<React.ComponentProps<typeof Tour>, 'open' | 'onOpenChange' | 'steps'>

/** A top bar with the three places the tour points at; «Ver el tour» opens it again. */
function Demo(props: DemoProps) {
  const [open, setOpen] = useState(true)
  return (
    <div className="grid min-h-svh content-start gap-6 p-6">
      <div className="flex flex-wrap items-center gap-2 rounded-xl border p-3">
        <Button id="tour-new">
          <PlusIcon data-icon="inline-start" aria-hidden />
          Nuevo informe
        </Button>
        <Button id="tour-search" variant="outline">
          <SearchIcon data-icon="inline-start" aria-hidden />
          Buscar…
        </Button>
        <Button id="tour-share" variant="outline" className="ml-auto">
          <Share2Icon data-icon="inline-start" aria-hidden />
          Compartir
        </Button>
      </div>
      <Button variant="link" className="w-fit justify-self-end px-0" onClick={() => setOpen(true)}>
        Ver el tour
      </Button>
      <Tour steps={STEPS} open={open} onOpenChange={setOpen} {...props} />
    </div>
  )
}

const meta = {
  title: 'AuraData/Tour',
  component: Demo,
  parameters: { layout: 'fullscreen', themeFrame: { padded: false } },
  args: { onSkip: fn(), onComplete: fn(), onStepChange: fn() },
} satisfies Meta<typeof Demo>

export default meta
type Story = StoryObj<typeof meta>

const ON_PHONE = { viewport: { value: 'mobile', isRotated: false } }

/** The first step points at «Nuevo informe»; the focus waits on «Siguiente», so Enter moves on. */
export const Default: Story = {
  tags: ['mobile'],
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const dialog = await body.findByRole('dialog', { name: 'Crea un informe' })
    await expect(dialog).toHaveAccessibleDescription(/Empieza desde un dataset/)
    // waitFor: the card fades in.
    await waitFor(() => expect(within(dialog).getByText('Paso 1 de 3')).toBeVisible())
    await waitFor(() => expect(within(dialog).getByRole('button', { name: 'Siguiente' })).toHaveFocus())
    // Nothing to go back to on the first step.
    await expect(within(dialog).queryByRole('button', { name: 'Anterior' })).toBeNull()
    // The target is outlined in the brand color, apart from the dimming around it.
    const highlight = canvasElement.ownerDocument.querySelector<HTMLElement>('[data-slot=tour-highlight]')!
    await expect(getComputedStyle(highlight).outlineStyle).toBe('solid')
    await expect(getComputedStyle(highlight).outlineColor).toBe(getComputedStyle(body.getByRole('button', { name: 'Siguiente' })).backgroundColor)
  },
}

/** The keyboard walks the tour: Enter on «Siguiente», then «Anterior» goes back. */
export const Keyboard: Story = {
  play: async ({ args, canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    await body.findByRole('dialog', { name: 'Crea un informe' })
    await waitFor(() => expect(body.getByRole('button', { name: 'Siguiente' })).toHaveFocus())
    await userEvent.keyboard('{Enter}')
    const second = await body.findByRole('dialog', { name: 'Busca lo que sea' })
    // waitFor: the card moves to its new element first.
    await waitFor(() => expect(within(second).getByText('Paso 2 de 3')).toBeVisible())
    await expect(args.onStepChange).toHaveBeenLastCalledWith(1)
    await userEvent.click(within(second).getByRole('button', { name: 'Anterior' }))
    const first = await body.findByRole('dialog', { name: 'Crea un informe' })
    await waitFor(() => expect(first).toBeVisible())
    await expect(args.onStepChange).toHaveBeenLastCalledWith(0)
  },
}

/** Escape or «Saltar tour» closes it at any step and reports where it was left. */
export const Skip: Story = {
  play: async ({ args, canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    await body.findByRole('dialog', { name: 'Crea un informe' })
    await userEvent.click(body.getByRole('button', { name: 'Siguiente' }))
    await body.findByRole('dialog', { name: 'Busca lo que sea' })
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(body.queryByRole('dialog')).toBeNull())
    await expect(args.onSkip).toHaveBeenCalledWith(1)
    await userEvent.click(body.getByRole('button', { name: 'Ver el tour' }))
    await userEvent.click(await body.findByRole('button', { name: 'Saltar tour' }))
    await waitFor(() => expect(body.queryByRole('dialog')).toBeNull())
    await expect(args.onSkip).toHaveBeenCalledTimes(2)
    await expect(args.onComplete).not.toHaveBeenCalled()
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}

/** A click outside does not end the tour: only its buttons and Escape do. «Terminar» completes it. */
export const Complete: Story = {
  play: async ({ args, canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    await body.findByRole('dialog', { name: 'Crea un informe' })
    await userEvent.click(body.getByRole('button', { name: 'Ver el tour' }))
    // Still open (waitFor: the card may still be fading in).
    const still = body.getByRole('dialog', { name: 'Crea un informe' })
    await waitFor(() => expect(still).toBeVisible())
    await userEvent.click(body.getByRole('button', { name: 'Siguiente' }))
    await userEvent.click(await body.findByRole('button', { name: 'Siguiente' }))
    const last = await body.findByRole('dialog', { name: 'Comparte con tu equipo' })
    await userEvent.click(within(last).getByRole('button', { name: 'Terminar' }))
    await waitFor(() => expect(body.queryByRole('dialog')).toBeNull())
    await expect(args.onComplete).toHaveBeenCalled()
    await expect(args.onSkip).not.toHaveBeenCalled()
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}

/** The last step on a phone: the card stays inside the screen. */
export const LastStepPhone: Story = {
  tags: ['mobile'],
  globals: ON_PHONE,
  args: { defaultStep: 2 },
}
