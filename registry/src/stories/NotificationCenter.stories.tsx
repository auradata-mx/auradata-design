import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import {
  ChartColumnIcon,
  DatabaseIcon,
  DownloadIcon,
  LayoutDashboardIcon,
  MessageSquareIcon,
  SparklesIcon,
  Share2Icon,
  UsersIcon,
} from 'lucide-react'

import { AppShell } from '@/components/blocks/app-shell'
import { AnnouncementBanner } from '@/components/ui/announcement-banner'
import { Button } from '@/components/ui/button'
import { NotificationCenter, type Notification } from '@/components/blocks/notification-center'

const NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Ana López compartió «Ventas por región» contigo',
    time: 'Hace 5 min',
    icon: <Share2Icon />,
  },
  {
    id: '2',
    title: 'Tu exportación de «Ventas 2026» está lista',
    description: 'Descárgala antes de 7 días.',
    time: 'Hace 20 min',
    icon: <DownloadIcon />,
  },
  {
    id: '3',
    title: 'El dataset «Clientes» no se actualizó',
    description: 'La conexión con BigQuery falló a las 06:00. Revisa la conexión en Ajustes.',
    time: 'Hace 2 h',
    icon: <DatabaseIcon />,
  },
  {
    id: '4',
    title: 'Carlos Ruiz comentó en «Margen por sucursal»',
    description: '¿Podemos ver esto por trimestre?',
    time: 'Ayer',
    icon: <MessageSquareIcon />,
    read: true,
  },
  {
    id: '5',
    title: 'Nueva versión de AuraData BI',
    description: 'Filtros guardados y exportación a Excel.',
    time: '12 nov',
    icon: <SparklesIcon />,
    read: true,
  },
]

const ON_PHONE = { viewport: { value: 'mobile', isRotated: false } }

const meta = {
  title: 'Blocks/Parts/Notification center',
  component: NotificationCenter,
  args: { notifications: NOTIFICATIONS, onMarkAllRead: fn(), onSelect: fn() },
  // Room for the open popover under the bell, at the right as in the top bar.
  render: (args) => (
    <div className="flex min-h-130 justify-end">
      <NotificationCenter {...args} />
    </div>
  ),
} satisfies Meta<typeof NotificationCenter>

export default meta
type Story = StoryObj<typeof meta>

/** The bell with the unread count; the count is in the button's name. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const bell = within(canvasElement).getByRole('button', { name: 'Notificaciones, 3 sin leer' })
    await expect(bell.parentElement!.querySelector('[data-slot=notification-count]')).toHaveTextContent('3')
  },
}

/** Over nine unread, the count reads «9+». */
export const ManyUnread: Story = {
  args: {
    notifications: Array.from({ length: 12 }, (_, index) => ({
      id: String(index),
      title: `Informe ${index + 1} actualizado`,
      time: 'Hace 1 h',
    })),
  },
  play: async ({ canvasElement }) => {
    const bell = within(canvasElement).getByRole('button', { name: 'Notificaciones, 12 sin leer' })
    await expect(bell.parentElement!.querySelector('[data-slot=notification-count]')).toHaveTextContent('9+')
  },
}

/** Unread first, then read; a row calls `onSelect` (the app opens it and marks it read). */
export const Open: Story = {
  args: { defaultOpen: true },
  play: async ({ args, canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const panel = await body.findByRole('dialog', { name: 'Notificaciones' })
    const unread = within(panel).getByRole('list', { name: 'Sin leer' })
    const read = within(panel).getByRole('list', { name: 'Leídas' })
    await expect(within(unread).getAllByRole('listitem')).toHaveLength(3)
    await expect(within(read).getAllByRole('listitem')).toHaveLength(2)
    await waitFor(() => expect(within(panel).getByRole('button', { name: 'Marcar todas como leídas' })).toBeVisible())
    await userEvent.click(within(panel).getByRole('button', { name: /Tu exportación de «Ventas 2026» está lista/ }))
    await expect(args.onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: '2' }))
    // Back to the opening state for the screenshot: no row focused.
    ;(canvasElement.ownerDocument.activeElement as HTMLElement | null)?.blur()
  },
}

function Stateful(props: React.ComponentProps<typeof NotificationCenter>) {
  const [notifications, setNotifications] = useState(props.notifications)
  return (
    <div className="flex min-h-130 justify-end">
      <NotificationCenter
        {...props}
        notifications={notifications}
        onMarkAllRead={() => {
          props.onMarkAllRead?.()
          setNotifications((all) => all.map((item) => ({ ...item, read: true })))
        }}
      />
    </div>
  )
}

/** «Marcar todas como leídas» empties «Sin leer», hides itself and clears the count. */
export const MarkAllRead: Story = {
  args: { defaultOpen: true },
  render: (args) => <Stateful {...args} />,
  play: async ({ args, canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const panel = await body.findByRole('dialog', { name: 'Notificaciones' })
    await userEvent.click(within(panel).getByRole('button', { name: 'Marcar todas como leídas' }))
    await expect(args.onMarkAllRead).toHaveBeenCalledOnce()
    await waitFor(() => expect(within(panel).queryByRole('list', { name: 'Sin leer' })).toBeNull())
    await expect(within(panel).getAllByRole('listitem')).toHaveLength(5)
    await expect(within(panel).queryByRole('button', { name: 'Marcar todas como leídas' })).toBeNull()
    await expect(canvasElement.querySelector('[data-slot=notification-count]')).toBeNull()
  },
}

/** Nothing yet: what will show up here. */
export const Empty: Story = {
  args: { defaultOpen: true, notifications: [] },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const panel = await body.findByRole('dialog', { name: 'Notificaciones' })
    await waitFor(() => expect(within(panel).getByText('No tienes notificaciones')).toBeVisible())
    await expect(within(canvasElement).getByRole('button', { name: 'Notificaciones' })).toBeVisible()
  },
}

/** Loading: rows with the shape of a notification; the list is busy and the count waits. */
export const Loading: Story = {
  args: { defaultOpen: true, loading: true, notifications: [] },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const panel = await body.findByRole('dialog', { name: 'Notificaciones' })
    await expect(panel.querySelector('[aria-busy=true]')).not.toBeNull()
    await expect(within(panel).getByText('Cargando notificaciones')).toBeInTheDocument()
  },
}

/** On a phone the list opens in a drawer from the bottom. */
export const OnPhone: Story = {
  tags: ['mobile'],
  globals: ON_PHONE,
  args: { defaultOpen: true },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const panel = await body.findByRole('dialog', { name: 'Notificaciones' })
    await expect(panel).toHaveAttribute('data-slot', 'drawer-popup')
    await expect(panel).toHaveAttribute('data-swipe-direction', 'down')
  },
}

const NAV = [
  {
    label: 'Análisis',
    items: [
      { title: 'Informes', href: '#informes', icon: LayoutDashboardIcon, active: true },
      { title: 'Gráficas', href: '#graficas', icon: ChartColumnIcon },
      { title: 'Datasets', href: '#datasets', icon: DatabaseIcon },
    ],
  },
  { label: 'Administrar', items: [{ title: 'Equipo', href: '#equipo', icon: UsersIcon }] },
]

/** In the app shell: `notifications` puts the bell in the top bar; a banner can sit above the page. */
export const InAppShell: Story = {
  tags: ['mobile'],
  parameters: { themeFrame: { padded: false } },
  render: (args) => (
    <AppShell
      product="BI"
      nav={NAV}
      user={{ name: 'Ana López', email: 'ana@auradata.mx' }}
      breadcrumbs={['Informes', 'Ventas por región']}
      actions={<Button size="sm">Compartir</Button>}
      notifications={{ notifications: args.notifications, onMarkAllRead: args.onMarkAllRead }}
      banner={
        <AnnouncementBanner
          variant="warning"
          title="Mantenimiento programado"
          description={'El sábado 29 de noviembre, de 22:00 a\u00a023:00, AuraData BI no estará disponible.'}
          onDismiss={() => {}}
        />
      }
    >
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="h-28 rounded-xl border bg-card" />
        ))}
      </div>
    </AppShell>
  ),
  play: async ({ canvasElement }) => {
    const header = canvasElement.querySelector('header')!
    await expect(within(header).getByRole('button', { name: 'Notificaciones, 3 sin leer' })).toBeVisible()
    // The banner sits right under the top bar, full width of the page.
    const banner = within(canvasElement).getByRole('region', { name: 'Mantenimiento programado' })
    await expect(Math.round(banner.getBoundingClientRect().top)).toBe(Math.round(header.getBoundingClientRect().bottom))
    await expect(banner.getBoundingClientRect().width).toBe(header.getBoundingClientRect().width)
  },
}
