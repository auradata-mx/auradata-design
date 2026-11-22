import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, userEvent, waitFor } from 'storybook/test'

import { Button } from '@/components/ui/button'
import { NumberTicker } from '@/components/ui/number-ticker'
import { formatCompact, formatCurrency, formatPercent } from '@/lib/format'

const meta = {
  title: 'AuraData/Number ticker',
  component: NumberTicker,
} satisfies Meta<typeof NumberTicker>

export default meta
type Story = StoryObj<typeof meta>

/** The visible digits, which count; screen readers get the final value at once. */
const shown = (ticker: Element) => ticker.querySelector('[data-slot=number-ticker-value]')!

const STATS = [
  { label: 'Ingresos del trimestre', value: 1284500, format: (value: number) => formatCurrency(value) },
  { label: 'Crecimiento anual', value: 0.124, format: (value: number) => formatPercent(value) },
  { label: 'Informes consultados', value: 4180, format: (value: number) => formatCompact(value) },
]

/** Numbers that count up once, the first time they come into view, formatted with `lib/format`. */
export const Default: Story = {
  args: { value: 0 },
  render: () => (
    <dl className="grid gap-8 sm:grid-cols-3">
      {STATS.map((stat) => (
        <div key={stat.label} className="flex flex-col gap-1">
          <dt className="text-sm text-muted-foreground">{stat.label}</dt>
          <dd className="font-heading text-4xl font-semibold tracking-tight">
            <NumberTicker value={stat.value} format={stat.format} />
          </dd>
        </div>
      ))}
    </dl>
  ),
  play: async ({ canvasElement, canvas }) => {
    const tickers = canvasElement.querySelectorAll('[data-slot=number-ticker]')
    await expect(tickers).toHaveLength(3)
    // Screen readers read the final value from the start, never the counting digits.
    await expect(canvas.getByText('$1,284,500', { selector: '.sr-only' })).toBeInTheDocument()
    for (const ticker of tickers) await expect(shown(ticker)).toHaveAttribute('aria-hidden', 'true')
    await waitFor(() => expect(shown(tickers[0])).toHaveTextContent('$1,284,500'), { timeout: 3000 })
    await waitFor(() => expect(shown(tickers[1])).toHaveTextContent('12.4 %'), { timeout: 3000 })
    await waitFor(() => expect(shown(tickers[2])).toHaveTextContent('4.18 K'), { timeout: 3000 })
  },
}

/** A new value counts from the one on screen. The width never changes while it counts. */
export const ValueChange: Story = {
  args: { value: 0 },
  render: function Render() {
    const [value, setValue] = useState(18250)
    return (
      <div className="flex flex-col items-start gap-4">
        <p className="font-heading text-4xl font-semibold tracking-tight">
          <NumberTicker value={value} format={(number) => formatCurrency(number)} />
        </p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setValue(18250)}>
            Octubre
          </Button>
          <Button variant="outline" onClick={() => setValue(96400)}>
            Noviembre
          </Button>
        </div>
      </div>
    )
  },
  play: async ({ canvasElement, canvas }) => {
    const ticker = canvasElement.querySelector('[data-slot=number-ticker]')!
    await waitFor(() => expect(shown(ticker)).toHaveTextContent('$18,250'), { timeout: 3000 })
    const width = ticker.getBoundingClientRect().width
    await userEvent.click(canvas.getByRole('button', { name: 'Noviembre' }))
    await expect(canvas.getByText('$96,400', { selector: '.sr-only' })).toBeInTheDocument()
    await expect(ticker.getBoundingClientRect().width).toBe(width)
    await waitFor(() => expect(shown(ticker)).toHaveTextContent('$96,400'), { timeout: 3000 })
    // Back to where it started, so the screenshot is the same whether this ran or not.
    await userEvent.click(canvas.getByRole('button', { name: 'Octubre' }))
    await waitFor(() => expect(shown(ticker)).toHaveTextContent('$18,250'), { timeout: 3000 })
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}
