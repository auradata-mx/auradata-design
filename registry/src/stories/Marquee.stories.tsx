import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor } from 'storybook/test'

import { Marquee } from '@/components/ui/marquee'
import { CLIENTS, ClientMark } from './marketing-data'

const meta = {
  title: 'AuraData/Marquee',
  component: Marquee,
  args: {
    label: 'Clientes',
    items: CLIENTS.map((client) => <ClientMark key={client.name} {...client} />),
  },
} satisfies Meta<typeof Marquee>

export default meta
type Story = StoryObj<typeof meta>

const playState = (track: Element) => getComputedStyle(track).animationPlayState

/**
 * Client logos in an endless row. It stops while the pointer is over it or focus is inside it; the
 * copies that close the loop are hidden from screen readers and from the keyboard.
 */
export const Default: Story = {
  tags: ['mobile'],
  play: async ({ canvasElement, canvas }) => {
    const root = canvasElement.querySelector('[data-slot=marquee]')!
    const [track, ...copies] = root.querySelectorAll('[data-slot=marquee-track]')
    await expect(canvas.getByRole('list', { name: 'Clientes' })).toBe(track)
    await expect(copies.length).toBeGreaterThan(0)
    for (const copy of copies) {
      await expect(copy).toHaveAttribute('aria-hidden', 'true')
      await expect(copy).toHaveAttribute('inert')
    }
    await expect(playState(track)).toBe('running')
    // No jump at the loop: each copy starts exactly one track (items and the trailing gap) after the last.
    const width = track.getBoundingClientRect().width
    const shift = copies[0].getBoundingClientRect().left - track.getBoundingClientRect().left
    await expect(Math.abs(shift - width)).toBeLessThan(0.5)

    // Hover pauses it, leaving resumes it.
    await userEvent.hover(track)
    await waitFor(() => expect(playState(track)).toBe('paused'))
    await userEvent.unhover(track)
    await waitFor(() => expect(playState(track)).toBe('running'))
  },
}

/** A keyboard reaches the pause button first: focus alone stops the row, the button keeps it stopped. */
export const KeyboardPause: Story = {
  play: async ({ canvasElement, canvas }) => {
    const track = canvasElement.querySelector('[data-slot=marquee-track]')!
    await userEvent.tab()
    const button = canvas.getByRole('button', { name: 'Pausar' })
    await expect(button).toHaveFocus()
    await waitFor(() => expect(playState(track)).toBe('paused'))
    await userEvent.keyboard('{Enter}')
    await expect(canvas.getByRole('button', { name: 'Reanudar' })).toHaveAttribute('aria-pressed', 'true')
    button.blur()
    await expect(playState(track)).toBe('paused')
    // Leave it running for the screenshot.
    const resume = canvas.getByRole('button', { name: 'Reanudar' })
    await userEvent.click(resume)
    await userEvent.unhover(resume)
    ;(document.activeElement as HTMLElement | null)?.blur()
    await waitFor(() => expect(playState(track)).toBe('running'))
  },
}

/** Slower and the other way, for a second row under the first. */
export const Reverse: Story = { args: { reverse: true, duration: 60 } }
