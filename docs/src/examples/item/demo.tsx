'use client';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from '@/components/ui/item';
import { initials } from '@/lib/initials';

const workspaces = [
  { name: 'Finanzas', detail: '24 informes · 8 personas', role: 'Admin' },
  { name: 'Ventas Bajío', detail: '12 informes · 15 personas', role: 'Editor' },
  { name: 'Operaciones', detail: '7 informes · 4 personas', role: 'Lector' },
];

export default function ItemDemo() {
  return (
    <ItemGroup className="max-w-md">
      {workspaces.map((workspace) => (
        <Item key={workspace.name} variant="outline" role="listitem">
          <ItemMedia>
            <Avatar>
              <AvatarFallback>{initials(workspace.name)}</AvatarFallback>
            </Avatar>
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{workspace.name}</ItemTitle>
            <ItemDescription>{workspace.detail}</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Badge variant="secondary">{workspace.role}</Badge>
          </ItemActions>
        </Item>
      ))}
    </ItemGroup>
  );
}
