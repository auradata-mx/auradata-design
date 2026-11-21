import type { Meta, StoryObj } from '@storybook/react-vite'

import { Kbd, KbdGroup } from '@/components/ui/kbd'

const meta = {
  title: 'Components/Kbd',
  component: Kbd,
} satisfies Meta<typeof Kbd>

export default meta
type Story = StoryObj<typeof meta>

/** A shortcut inside a hint. */
export const Default: Story = {
  render: () => (
    <p className="text-sm text-muted-foreground">
      Pulsa <Kbd>⌘K</Kbd> para buscar informes y datasets.
    </p>
  ),
}

/** Keys pressed together. */
export const Group: Story = {
  render: () => (
    <p className="text-sm text-muted-foreground">
      Ejecuta la consulta con{' '}
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>Enter</Kbd>
      </KbdGroup>
      .
    </p>
  ),
}
