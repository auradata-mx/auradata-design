'use client';
import { useState } from 'react';
import { Columns3Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const columns = ['Cliente', 'Región', 'Monto', 'Fecha'];

export default function DropdownMenuCheckboxes() {
  const [visible, setVisible] = useState(['Cliente', 'Monto', 'Fecha']);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        <Columns3Icon data-icon="inline-start" aria-hidden />
        Columnas
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Columnas visibles</DropdownMenuLabel>
          {columns.map((column) => (
            <DropdownMenuCheckboxItem
              key={column}
              checked={visible.includes(column)}
              onCheckedChange={(checked) =>
                setVisible((current) => (checked ? [...current, column] : current.filter((name) => name !== column)))
              }
            >
              {column}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
