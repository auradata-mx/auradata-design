import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
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
    text: 'En noviembre llevas $4.16 M en ventas, 6.2 % más que en octubre. El Centro aporta casi la mitad.',
    embeds: [
      {
        type: 'kpi',
        label: 'Ventas del mes',
        value: '$4.16 M',
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

/** The chat fills its parent: here, a panel as tall as a laptop screen. */
function ChatFrame(props: React.ComponentProps<typeof Chat>) {
  return (
    <div className="h-[720px]">
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

export const SignIn: Story = { render: () => <Login product="BI" /> }

export const Shell: Story = {
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
}

export const SettingsPage: Story = {
  name: 'Settings',
  render: () => (
    <AppShell product="BI" nav={NAV} user={USER} workspaces={WORKSPACES} theme={THEME} breadcrumbs={['Ajustes']}>
      <Settings />
    </AppShell>
  ),
}

export const NotFoundPage: Story = { name: 'Not found', render: () => <NotFound /> }

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
    // Rest state for the screenshot: nothing focused.
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}

/** Answers can carry a KPI card or a small chart. Enter sends; the box clears. */
export const ChatConversation: ChatStory = {
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
