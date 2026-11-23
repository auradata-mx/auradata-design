'use client';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';

const docs = [
  { href: '#primeros-pasos', title: 'Primeros pasos', description: 'Conecta tu primera base de datos y arma un informe.' },
  { href: '#sql-lab', title: 'SQL Lab', description: 'Consulta tus datasets y guarda las consultas.' },
  { href: '#api', title: 'API', description: 'Lleva tus informes a tus propias apps.' },
];

export default function NavigationMenuDemo() {
  return (
    <NavigationMenu aria-label="Principal">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink href="#producto" className={navigationMenuTriggerStyle()}>
            Producto
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#precios" className={navigationMenuTriggerStyle()}>
            Precios
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem value="docs">
          <NavigationMenuTrigger>Docs</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-72 gap-1 sm:w-80">
              {docs.map((doc) => (
                <li key={doc.href}>
                  <NavigationMenuLink href={doc.href} className="grid gap-1">
                    <span className="font-medium">{doc.title}</span>
                    <span className="text-muted-foreground">{doc.description}</span>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
