'use client';
import { useEffect, useState } from 'react';
import { ChartColumnIcon } from 'lucide-react';
import { SearchCommand, type SearchCommandGroup } from '@/components/ui/search-command';

const reports: SearchCommandGroup[] = [
  {
    heading: 'Informes',
    items: [
      { id: 'ventas-por-region', label: 'Ventas por región', icon: <ChartColumnIcon aria-hidden /> },
      { id: 'margen-por-producto', label: 'Margen por producto', icon: <ChartColumnIcon aria-hidden /> },
    ],
  },
];

export default function SearchCommandLoading() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // A search on the server: «Buscando…» for a moment each time the palette opens, then the results.
  useEffect(() => {
    if (!open) return;
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, [open]);

  return (
    <SearchCommand
      groups={loading ? [] : reports}
      loading={loading}
      open={open}
      onOpenChange={setOpen}
      hotkey={null}
    >
      Buscar en el servidor…
    </SearchCommand>
  );
}
