import type { Meta, StoryObj } from '@storybook/react-vite'
import { ChevronDownIcon, DownloadIcon, ShareIcon } from 'lucide-react'
import { expect, within } from 'storybook/test'

import { Button } from '@/components/ui/button'
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from '@/components/ui/button-group'
import { Input } from '@/components/ui/input'

const meta = {
  title: 'Components/Button group',
  component: ButtonGroup,
} satisfies Meta<typeof ButtonGroup>

export default meta
type Story = StoryObj<typeof meta>

/** The actions of a report, joined. */
export const Default: Story = {
  render: (args) => (
    <ButtonGroup aria-label="Acciones del informe" {...args}>
      <Button variant="outline">
        <ShareIcon data-icon="inline-start" aria-hidden />
        Compartir
      </Button>
      <Button variant="outline">
        <DownloadIcon data-icon="inline-start" aria-hidden />
        Exportar
      </Button>
      <Button variant="outline" size="icon" aria-label="Más acciones">
        <ChevronDownIcon aria-hidden />
      </Button>
    </ButtonGroup>
  ),
}

export const Vertical: Story = {
  render: () => (
    <ButtonGroup orientation="vertical" aria-label="Zoom de la gráfica">
      <Button variant="outline" size="sm">Acercar</Button>
      <Button variant="outline" size="sm">Alejar</Button>
      <Button variant="outline" size="sm">Restablecer</Button>
    </ButtonGroup>
  ),
}

/** A text prefix, an input and a separator between two solid buttons. */
export const WithInput: Story = {
  name: 'With input',
  render: () => (
    <div className="grid gap-4">
      <ButtonGroup>
        <ButtonGroupText render={<label htmlFor="url-informe" />}>auradata.mx/r/</ButtonGroupText>
        <Input id="url-informe" defaultValue="ventas-2026" className="w-40" />
        <Button variant="outline">Copiar</Button>
      </ButtonGroup>
      <ButtonGroup aria-label="Guardar">
        <Button>Guardar</Button>
        <ButtonGroupSeparator />
        <Button size="icon" aria-label="Más formas de guardar">
          <ChevronDownIcon aria-hidden />
        </Button>
      </ButtonGroup>
    </div>
  ),
  play: async ({ canvasElement }) => {
    // Between two solid buttons the separator is a hairline of the fill, as tall as the buttons: no pale gap.
    const separator = canvasElement.querySelector<HTMLElement>('[data-slot="button-group-separator"]')!
    const save = within(canvasElement).getByRole('button', { name: 'Guardar' })
    await expect(separator.getBoundingClientRect().height).toBe(save.getBoundingClientRect().height)
    const probe = document.createElement('span')
    probe.className = 'bg-input'
    canvasElement.append(probe)
    await expect(getComputedStyle(separator).backgroundColor).not.toBe(getComputedStyle(probe).backgroundColor)
    probe.remove()
  },
}
