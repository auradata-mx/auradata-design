'use client';
import { ChartColumnIcon, DatabaseIcon, FilePlusIcon, SettingsIcon, UserPlusIcon } from 'lucide-react';
import { SearchCommand, shortcutLabel, type SearchCommandGroup } from '@/components/ui/search-command';

const groups: SearchCommandGroup[] = [
  {
    heading: 'Informes',
    items: [
      { id: 'ventas-por-region', label: 'Ventas por región', icon: <ChartColumnIcon aria-hidden />, keywords: ['Ventas'] },
      { id: 'margen-por-producto', label: 'Margen por producto', icon: <ChartColumnIcon aria-hidden />, keywords: ['Finanzas'] },
      { id: 'clientes-activos', label: 'Clientes activos', icon: <ChartColumnIcon aria-hidden />, keywords: ['Marketing'] },
    ],
  },
  {
    heading: 'Datasets',
    items: [
      { id: 'pedidos-2026', label: 'Pedidos 2026', icon: <DatabaseIcon aria-hidden /> },
      { id: 'catalogo-de-productos', label: 'Catálogo de productos', icon: <DatabaseIcon aria-hidden /> },
    ],
  },
  {
    heading: 'Acciones',
    items: [
      { id: 'nuevo-informe', label: 'Crear informe', icon: <FilePlusIcon aria-hidden />, shortcut: shortcutLabel('n') },
      { id: 'invitar', label: 'Invitar a tu equipo', icon: <UserPlusIcon aria-hidden /> },
      { id: 'configuracion', label: 'Abrir configuración', icon: <SettingsIcon aria-hidden />, shortcut: shortcutLabel(',') },
    ],
  },
];

// This site's own search already takes ⌘K, so the example listens to ⌘J; in your app keep the default `k`.
export default function SearchCommandDemo() {
  return <SearchCommand groups={groups} hotkey="j" />;
}
