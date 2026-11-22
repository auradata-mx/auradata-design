import type { Meta, StoryObj } from '@storybook/react-vite'
import { useEffect, useState } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { ChartColumnIcon, DatabaseIcon, LayoutDashboardIcon, UsersIcon } from 'lucide-react'

import { AppShell, type NavGroup } from '@/components/blocks/app-shell'
import { Chat, type ChatMessage } from '@/components/blocks/chat'
import { Login } from '@/components/blocks/login'
import { NotFound } from '@/components/blocks/not-found'
import { Settings } from '@/components/blocks/settings'
import { Button } from '@/components/ui/button'
import { KpiCard } from '@/components/ui/kpi-card'
import { PageHeader } from '@/components/ui/page-header'

const NAV: NavGroup[] = [
  {
    label: 'Explorar',
    items: [
      { title: 'Informes', href: '#informes', icon: LayoutDashboardIcon, active: true },
      { title: 'Gráficas', href: '#graficas', icon: ChartColumnIcon },
      { title: 'Datasets', href: '#datasets', icon: DatabaseIcon },
    ],
  },
  { label: 'Administrar', items: [{ title: 'Equipo', href: '#equipo', icon: UsersIcon }] },
]
const USER = { name: 'Ana López', email: 'ana@empresa.mx' }
const WORKSPACES = {
  workspaces: [
    { id: 'ventas', name: 'Ventas', description: '12 miembros' },
    { id: 'finanzas', name: 'Finanzas', description: '5 miembros' },
  ],
  current: 'ventas',
  onCreate: () => {},
}
const THEME = { theme: 'system' as const, onThemeChange: () => {} }

const SUGGESTIONS = [
  '¿Cuánto vendimos este mes?',
  '¿Qué región creció más?',
  'Compara el ticket promedio con septiembre',
]

const CONVERSATION: ChatMessage[] = [
  { id: '1', role: 'user', text: '¿Cuánto vendimos este mes?' },
  {
    id: '2',
    role: 'assistant',
    text: 'En noviembre llevas $4.16\u00a0M en ventas, 6.2\u00a0% más que en octubre. El Centro aporta casi la mitad.',
    embeds: [
      {
        type: 'kpi',
        label: 'Ventas del mes',
        value: '$4.16\u00a0M',
        change: 0.062,
        comparison: 'vs. octubre',
        trend: [3.2, 3.4, 3.3, 3.6, 3.8, 3.9, 4.16],
      },
    ],
  },
  { id: '3', role: 'user', text: '¿Y por región?' },
  {
    id: '4',
    role: 'assistant',
    text: 'El Centro sigue al frente; el Norte es la región que más creció desde julio.',
    embeds: [
      {
        type: 'chart',
        title: 'Ventas por región (miles de pesos)',
        xKey: 'mes',
        series: { norte: 'Norte', centro: 'Centro', sur: 'Sur' },
        data: [
          { mes: 'Ago', norte: 1210, centro: 1980, sur: 820 },
          { mes: 'Sep', norte: 1150, centro: 2010, sur: 870 },
          { mes: 'Oct', norte: 1284, centro: 2031, sur: 846 },
          { mes: 'Nov', norte: 1392, centro: 2104, sur: 880 },
        ],
      },
    ],
  },
]

/** A CSS color as sRGB, painted over a background (for colors with alpha). */
const paint = (color: string, background: string) => {
  const context = document.createElement('canvas').getContext('2d', { willReadFrequently: true })!
  context.fillStyle = background
  context.fillRect(0, 0, 1, 1)
  context.fillStyle = color
  context.fillRect(0, 0, 1, 1)
  return [...context.getImageData(0, 0, 1, 1).data.slice(0, 3)]
}

const luminance = (rgb: number[]) => {
  const [r, g, b] = rgb.map((value) => {
    const c = value / 255
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

const contrast = (a: number[], b: number[]) => {
  const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (high + 0.05) / (low + 0.05)
}

/** The chat fills its parent: the whole screen on a phone, a panel as tall as a laptop screen from sm. */
function ChatFrame(props: React.ComponentProps<typeof Chat>) {
  return (
    <div className="h-svh sm:h-[min(720px,100svh)]">
      <Chat {...props} />
    </div>
  )
}

const meta = {
  title: 'Blocks/App',
  // Blocks are whole pages: no padding around them.
  parameters: { layout: 'fullscreen', themeFrame: { padded: false } },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>
type ChatStory = StoryObj<typeof Chat>

/**
 * Pages that must hold on a phone: stories tagged `mobile` open at 390×844 and the `mobile` Playwright
 * project checks them there. The tag stays literal on each story: Storybook's indexer reads it statically.
 */
const ON_PHONE = { viewport: { value: 'mobile', isRotated: false } }

export const SignIn: Story = { tags: ['mobile'], globals: ON_PHONE, render: () => <Login product="BI" /> }

export const Shell: Story = {
  tags: ['mobile'],
  globals: ON_PHONE,
  render: () => (
    <AppShell
      product="BI"
      nav={NAV}
      user={USER}
      workspaces={WORKSPACES}
      theme={THEME}
      breadcrumbs={['Informes', 'Ventas 2026']}
      actions={<Button>Compartir</Button>}
    >
      <div className="grid gap-6">
        <PageHeader title="Ventas 2026" description="Actualizado hace 5 minutos." />
        <div className="grid gap-4 lg:grid-cols-3">
          <KpiCard label="Ventas del mes" value="$4.16 M" change={0.062} comparison="vs. septiembre" />
          <KpiCard label="Clientes activos" value="1,284" change={-0.021} comparison="vs. septiembre" />
          <KpiCard label="Ticket promedio" value="$3,240" change={0} comparison="vs. septiembre" />
        </div>
      </div>
    </AppShell>
  ),
  play: async ({ canvasElement }) => {
    // Each chevron sits between two crumbs: never over the text before or after it.
    const nav = within(canvasElement).getByRole('navigation', { name: 'Ruta de navegación' })
    const before = within(nav).getByText('Informes').getBoundingClientRect()
    const after = within(nav).getByText('Ventas 2026').getBoundingClientRect()
    const chevron = nav.querySelector('[data-slot=breadcrumb-separator] svg')!.getBoundingClientRect()
    await expect(chevron.left).toBeGreaterThanOrEqual(before.right)
    await expect(chevron.right).toBeLessThanOrEqual(after.left)
  },
}

export const SettingsPage: Story = {
  tags: ['mobile'],
  globals: ON_PHONE,
  name: 'Settings',
  render: () => (
    <AppShell product="BI" nav={NAV} user={USER} workspaces={WORKSPACES} theme={THEME} breadcrumbs={['Ajustes']}>
      <Settings />
    </AppShell>
  ),
}

export const NotFoundPage: Story = { tags: ['mobile'], globals: ON_PHONE, name: 'Not found', render: () => <NotFound /> }

/** No messages yet: what to ask, with suggestions that send themselves. */
export const ChatEmpty: ChatStory = {
  name: 'Chat empty',
  render: (args) => <ChatFrame {...args} />,
  args: { messages: [], suggestions: SUGGESTIONS, onSend: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('heading', { name: 'Pregúntale a tus datos' })).toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: '¿Cuánto vendimos este mes?' }))
    await expect(args.onSend).toHaveBeenCalledWith('¿Cuánto vendimos este mes?')
    // The composer is a text control: its edge reads 3:1 against the page and its own fill, light and dark.
    const composer = canvas.getByRole('textbox', { name: 'Mensaje' }).parentElement!
    const root = document.documentElement
    const wasDark = root.classList.contains('dark')
    for (const dark of [false, true]) {
      root.classList.toggle('dark', dark)
      const page = paint(getComputedStyle(document.body).getPropertyValue('--background'), '#fff')
      const fill = paint(getComputedStyle(composer).backgroundColor, `rgb(${page.join(' ')})`)
      const border = paint(getComputedStyle(composer).borderTopColor, `rgb(${page.join(' ')})`)
      await expect(contrast(border, page), dark ? 'dark page' : 'light page').toBeGreaterThanOrEqual(3)
      await expect(contrast(border, fill), dark ? 'dark fill' : 'light fill').toBeGreaterThanOrEqual(3)
    }
    root.classList.toggle('dark', wasDark)
    // Rest state for the screenshot: nothing focused.
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}

/** Answers can carry a KPI card or a small chart. Enter sends; the box clears. */
export const ChatConversation: ChatStory = {
  tags: ['mobile'],
  globals: ON_PHONE,
  name: 'Chat conversation',
  render: (args) => <ChatFrame {...args} />,
  args: { messages: CONVERSATION, suggestions: SUGGESTIONS, onSend: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', { name: 'Mensaje' })
    const send = canvas.getByRole('button', { name: 'Enviar' })
    await expect(send).toBeDisabled()
    await userEvent.type(input, '¿Y el ticket promedio?')
    await userEvent.click(send)
    await expect(args.onSend).toHaveBeenCalledWith('¿Y el ticket promedio?')
    await expect(input).toHaveValue('')
    // Enter sends too; Shift+Enter is a new line.
    await userEvent.type(input, 'Gracias{Enter}')
    await expect(args.onSend).toHaveBeenLastCalledWith('Gracias')
    await expect(input).toHaveValue('')
    // Blank text is never sent.
    await userEvent.type(input, '   {Enter}')
    await expect(args.onSend).toHaveBeenCalledTimes(2)
    await userEvent.clear(input)
    // Rest state for the screenshot: nothing focused.
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}

/** While the answer is on its way: a thinking row, and the send button waits. */
export const ChatLoading: ChatStory = {
  name: 'Chat loading',
  render: (args) => <ChatFrame {...args} />,
  args: { messages: CONVERSATION.slice(0, 1), loading: true, onSend: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('status')).toHaveTextContent('Pensando…')
    await userEvent.type(canvas.getByRole('textbox', { name: 'Mensaje' }), 'Otra pregunta{Enter}')
    await expect(args.onSend).not.toHaveBeenCalled()
    await userEvent.clear(canvas.getByRole('textbox', { name: 'Mensaje' }))
    // Rest state for the screenshot: nothing focused.
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}

/** An answer that failed: «No pudimos responder» and «Reintentar», which asks the app to try that message again. */
export const ChatError: ChatStory = {
  name: 'Chat error',
  render: (args) => <ChatFrame {...args} />,
  args: {
    messages: [
      CONVERSATION[0],
      { id: '2', role: 'assistant', text: 'Se agotó el tiempo de espera de la consulta.', status: 'error' },
    ],
    onSend: fn(),
    onRetry: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('No pudimos responder')).toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: 'Reintentar' }))
    await expect(args.onRetry).toHaveBeenCalledWith('2')
    // Rest state for the screenshot: nothing focused.
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}

const SQL = `SELECT region, SUM(total) AS ventas
FROM pedidos_2026
WHERE fecha >= DATE '2026-11-01'
GROUP BY region
ORDER BY ventas DESC;`

/** An answer that shows the SQL it ran: hidden under «Ver consulta SQL» until asked for. */
export const ChatWithSql: ChatStory = {
  name: 'Chat with SQL',
  render: (args) => <ChatFrame {...args} />,
  args: {
    messages: [
      { id: '1', role: 'user', text: '¿Qué región vendió más en noviembre?' },
      {
        id: '2',
        role: 'assistant',
        text: 'El Centro, con $2.10\u00a0M; le siguen el Norte ($1.39\u00a0M) y el Sur ($0.88\u00a0M).',
        sql: SQL,
      },
    ],
    onSend: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // The scroller keeps the messages hidden until its first scroll: wait for them.
    const toggle = await canvas.findByRole('button', { name: 'Ver consulta SQL' })
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await expect(canvas.queryByText(/FROM pedidos_2026/)).toBeNull()
    await userEvent.click(toggle)
    await expect(toggle).toHaveAttribute('aria-expanded', 'true')
    await expect(await canvas.findByText(/FROM pedidos_2026/)).toBeVisible()
    // Rest state for the screenshot: the query open, nothing focused.
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}

/** Files go with the question: «Adjuntar archivo» picks them, each one can be removed, and they are sent with it. */
export const ChatAttachments: ChatStory = {
  tags: ['mobile'],
  globals: ON_PHONE,
  name: 'Chat attachments',
  render: (args) => <ChatFrame {...args} />,
  args: {
    messages: [
      {
        id: '1',
        role: 'user',
        text: 'Compara estas ventas con las del sistema.',
        attachments: [{ name: 'ventas-octubre.xlsx', size: 860_160 }],
      },
      { id: '2', role: 'assistant', text: 'Coinciden en 98\u00a0%: faltan 14 pedidos del 31 de octubre en tu archivo.' },
    ],
    attach: { accept: '.csv,.xlsx,.pdf' },
    onSend: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    // A sent message shows its files.
    await expect(await canvas.findByText('ventas-octubre.xlsx')).toBeVisible()
    await expect(canvas.getByText('840 KB')).toBeVisible()
    // The sent file ends flush with its bubble (within the 4 px focus allowance).
    const sent = canvas.getByRole('list', { name: 'Archivos de la pregunta' }).querySelector('[data-slot=attachment]')!
    const bubble = canvas.getByText('Compara estas ventas con las del sistema.')
    await expect(Math.abs(sent.getBoundingClientRect().right - bubble.getBoundingClientRect().right)).toBeLessThanOrEqual(4)
    const input = canvasElement.querySelector<HTMLInputElement>('[data-slot=chat-file-input]')!
    await expect(input).toHaveAttribute('accept', '.csv,.xlsx,.pdf')
    await expect(canvas.getByRole('button', { name: 'Adjuntar archivo' })).toBeEnabled()
    await userEvent.upload(input, [
      new File(['region,total'], 'ventas.csv', { type: 'text/csv' }),
      new File(['%PDF'], 'informe.pdf', { type: 'application/pdf' }),
    ])
    const files = canvas.getByRole('list', { name: 'Archivos adjuntos' })
    await expect(within(files).getAllByRole('listitem')).toHaveLength(2)
    await userEvent.click(canvas.getByRole('button', { name: 'Quitar informe.pdf' }))
    await expect(within(files).getAllByRole('listitem')).toHaveLength(1)
    // A file alone can be sent; the text goes with it when there is one.
    await userEvent.type(canvas.getByRole('textbox', { name: 'Mensaje' }), 'Resume este archivo{Enter}')
    await expect(args.onSend).toHaveBeenCalledWith('Resume este archivo', [expect.objectContaining({ name: 'ventas.csv' })])
    await expect(canvas.queryByRole('list', { name: 'Archivos adjuntos' })).toBeNull()
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}

const STREAMED = 'En noviembre vendiste $4.16\u00a0M, 6.2\u00a0% más que en octubre. El Centro aportó la mitad.'

/**
 * An answer still arriving: a cursor after the text, the message `aria-busy` (screen readers read it once it is
 * whole) and «Detener respuesta» instead of «Enviar». The cursor stops blinking with reduced motion.
 */
export const ChatStreaming: ChatStory = {
  name: 'Chat streaming',
  render: (args) => <ChatFrame {...args} />,
  args: {
    messages: [
      { id: '1', role: 'user', text: '¿Cuánto vendimos en noviembre?' },
      { id: '2', role: 'assistant', text: STREAMED.slice(0, 52), streaming: true },
    ],
    onSend: fn(),
    onStop: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const answer = canvasElement.querySelector('[data-slot=chat-message][data-role=assistant]')!
    await expect(answer).toHaveAttribute('aria-busy', 'true')
    const cursor = answer.querySelector('[data-slot=chat-cursor]')!
    await expect(cursor).toHaveAttribute('aria-hidden', 'true')
    await expect(cursor).toHaveClass('motion-reduce:animate-none')
    // No new question while the answer arrives; «Detener respuesta» asks the app to stop it.
    await expect(canvas.queryByRole('button', { name: 'Enviar' })).toBeNull()
    await userEvent.click(canvas.getByRole('button', { name: 'Detener respuesta' }))
    await expect(args.onStop).toHaveBeenCalled()
    await userEvent.type(canvas.getByRole('textbox', { name: 'Mensaje' }), 'Otra{Enter}')
    await expect(args.onSend).not.toHaveBeenCalled()
    await userEvent.clear(canvas.getByRole('textbox', { name: 'Mensaje' }))
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}

/** The app appends the text as it arrives; when it is done the cursor goes and the answer is read out. */
function StreamingChat(props: React.ComponentProps<typeof Chat>) {
  const [length, setLength] = useState(0)
  useEffect(() => {
    if (length >= STREAMED.length) return
    const timer = setTimeout(() => setLength((current) => Math.min(current + 6, STREAMED.length)), 20)
    return () => clearTimeout(timer)
  }, [length])
  const done = length >= STREAMED.length
  return (
    <ChatFrame
      {...props}
      messages={[
        { id: '1', role: 'user', text: '¿Cuánto vendimos en noviembre?' },
        { id: '2', role: 'assistant', text: STREAMED.slice(0, length), streaming: !done },
      ]}
    />
  )
}

export const ChatStreamed: ChatStory = {
  name: 'Chat streamed',
  render: (args) => <StreamingChat {...args} />,
  args: { messages: [], onSend: fn() },
  play: async ({ canvasElement }) => {
    const answer = () => canvasElement.querySelector('[data-slot=chat-message][data-role=assistant]')!
    // textContent: toHaveTextContent collapses the no-break spaces of the received text only.
    await waitFor(() => expect(answer().textContent).toBe(STREAMED), { timeout: 3000 })
    await waitFor(() => expect(answer()).not.toHaveAttribute('aria-busy'))
    await expect(answer().querySelector('[data-slot=chat-cursor]')).toBeNull()
    await expect(within(canvasElement).getByRole('button', { name: 'Enviar' })).toBeVisible()
  },
}

/** Each finished answer takes 👍/👎; the app gets the message id, the rating and the optional reason. */
export const ChatFeedback: ChatStory = {
  name: 'Chat feedback',
  render: (args) => <ChatFrame {...args} />,
  args: {
    messages: [
      { id: '1', role: 'user', text: '¿Qué región creció más?' },
      { id: '2', role: 'assistant', text: 'El Norte: 9.4\u00a0% más que en octubre.' },
      { id: '3', role: 'user', text: '¿Y cuál cayó?' },
      { id: '4', role: 'assistant', text: 'El Sur bajó 2.1\u00a0%.', feedback: 'up' },
    ],
    onSend: fn(),
    onFeedback: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const [first, second] = await canvas.findAllByRole('button', { name: 'No útil' })
    // A saved rating shows pressed.
    await expect(canvas.getAllByRole('button', { name: 'Útil' })[1]).toHaveAttribute('aria-pressed', 'true')
    await expect(second).toHaveAttribute('aria-pressed', 'false')
    await userEvent.click(first)
    await expect(args.onFeedback).toHaveBeenLastCalledWith('2', 'down', undefined)
    const form = canvas.getByRole('group', { name: '¿Qué falló?' })
    await userEvent.click(within(form).getByRole('button', { name: 'Incompleta' }))
    await userEvent.click(within(form).getByRole('button', { name: 'Enviar' }))
    await expect(args.onFeedback).toHaveBeenLastCalledWith('2', 'down', { reason: 'Incompleta' })
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}

/** An answer that cites the dataset and report it used, and a finding with «Ver detalle». */
export const ChatInsights: ChatStory = {
  tags: ['mobile'],
  globals: ON_PHONE,
  name: 'Chat insights',
  render: (args) => <ChatFrame {...args} />,
  args: {
    messages: [
      { id: '1', role: 'user', text: '¿Hay algo raro en las ventas de noviembre?' },
      {
        id: '2',
        role: 'assistant',
        text: 'Sí: el Norte creció mucho más que el resto.',
        sources: [
          { id: 'd1', kind: 'dataset', label: 'pedidos_2026', href: '#dataset-pedidos' },
          { id: 'r1', kind: 'report', label: 'Ventas 2026', href: '#informe-ventas' },
        ],
        embeds: [
          {
            type: 'insight',
            title: 'El Norte creció más que ninguna región',
            value: '$1.39\u00a0M',
            change: 0.094,
            comparison: 'vs. octubre',
            description: 'Lo impulsaron las ventas en línea de Monterrey, que se duplicaron.',
            action: { href: '#norte' },
          },
        ],
      },
    ],
    onSend: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const sources = await canvas.findByRole('list', { name: 'Fuentes' })
    const links = within(sources).getAllByRole('link')
    await expect(links.map((link) => link.getAttribute('href'))).toEqual(['#dataset-pedidos', '#informe-ventas'])
    // The kind is read out before the name.
    await expect(links[0]).toHaveAccessibleName('Dataset: pedidos_2026')
    await expect(links[1]).toHaveAccessibleName('Informe: Ventas 2026')
    const insight = canvas.getByRole('article', { name: 'El Norte creció más que ninguna región' })
    await expect(within(insight).getByRole('link', { name: 'Ver detalle' })).toHaveAttribute('href', '#norte')
  },
}

type LoginStory = StoryObj<typeof Login>

/** The server said no: a destructive alert above the form and both inputs marked invalid. */
export const SignInError: LoginStory = {
  name: 'Sign in error',
  render: (args) => <Login {...args} />,
  args: { product: 'BI', error: 'El correo o la contraseña no son correctos.' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('alert')).toHaveTextContent('El correo o la contraseña no son correctos.')
    await expect(canvas.getByLabelText('Correo')).toHaveAttribute('aria-invalid', 'true')
    await expect(canvas.getByLabelText('Contraseña')).toHaveAttribute('aria-invalid', 'true')
  },
}

/** Signing in: the button spins and the inputs wait, so the form is not sent twice. */
export const SignInPending: LoginStory = {
  name: 'Sign in pending',
  render: (args) => <Login {...args} />,
  args: { product: 'BI', pending: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const submit = canvas.getByRole('button', { name: 'Entrando…' })
    await expect(submit).toBeDisabled()
    await expect(submit).toHaveAttribute('aria-busy', 'true')
    await expect(canvas.getByLabelText('Correo')).toBeDisabled()
    await expect(canvas.getByLabelText('Contraseña')).toBeDisabled()
  },
}

/** «Entrar» sends the form: `onSubmit` gets it with what was typed (the inputs carry `name`). */
export const SignInSubmit: LoginStory = {
  name: 'Sign in submit',
  render: (args) => <Login {...args} />,
  args: { product: 'BI', onSubmit: fn((event: React.FormEvent<HTMLFormElement>) => event.preventDefault()) },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(canvas.getByLabelText('Correo'), 'ana@empresa.mx')
    await userEvent.type(canvas.getByLabelText('Contraseña'), 'aurora-2026')
    await userEvent.click(canvas.getByRole('button', { name: 'Entrar' }))
    await expect(args.onSubmit).toHaveBeenCalledTimes(1)
    const event = (args.onSubmit as ReturnType<typeof fn>).mock.calls[0][0] as React.FormEvent<HTMLFormElement>
    const values = Object.fromEntries(new FormData(event.target as HTMLFormElement))
    await expect(values).toEqual({ email: 'ana@empresa.mx', password: 'aurora-2026' })
    // Rest state for the screenshot: nothing focused.
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}

type SettingsStory = StoryObj<typeof Settings>

/** What the server rejected, under its field: `FieldError` text and `aria-invalid`; the other fields stay as they are. */
export const SettingsErrors: SettingsStory = {
  name: 'Settings errors',
  render: (args) => (
    <div className="p-6">
      <Settings {...args} />
    </div>
  ),
  args: {
    errors: { email: 'Ese correo ya lo usa otra cuenta. Escribe otro.' },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Correo')).toHaveAttribute('aria-invalid', 'true')
    await expect(canvas.getByRole('alert')).toHaveTextContent('Ese correo ya lo usa otra cuenta. Escribe otro.')
    await expect(canvas.getByLabelText('Nombre')).not.toHaveAttribute('aria-invalid')
    await expect(canvas.getByRole('combobox', { name: 'Idioma' })).not.toHaveAttribute('aria-invalid')
  },
}

/** Saving: «Guardando…» with a spinner, disabled and `aria-busy`; the fields wait too. */
export const SettingsSaving: SettingsStory = {
  name: 'Settings saving',
  render: (args) => (
    <div className="p-6">
      <Settings {...args} />
    </div>
  ),
  args: { saving: true },
  play: async ({ canvasElement }) => {
    const save = within(canvasElement).getByRole('button', { name: 'Guardando…' })
    await expect(save).toBeDisabled()
    await expect(save).toHaveAttribute('aria-busy', 'true')
    await expect(within(canvasElement).getByLabelText('Nombre')).toBeDisabled()
    await expect(within(canvasElement).getByLabelText('Correo')).toBeDisabled()
  },
}
