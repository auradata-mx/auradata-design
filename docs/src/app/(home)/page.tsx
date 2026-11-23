import Link from 'next/link';
import { ArrowRight, BookOpen, Blocks, LayoutGrid, Palette, Wrench } from 'lucide-react';
// The real registry module, not a copy: the docs render exactly what `npx shadcn add` installs.
import { buttonVariants } from '@/components/ui/button';
import { InstallCommand } from '@docs/components/install-command';
import { registryUrl, storybookUrl } from '@docs/lib/shared';

const sections = [
  {
    title: 'Instalación',
    href: '/docs/installation',
    description: 'Agrega la marca y los componentes a una app de React con el CLI de shadcn.',
    icon: Wrench,
  },
  {
    title: 'Marca',
    href: '/docs/brand',
    description: 'Logotipo, tipografía, color y voz: la identidad de AuraData.',
    icon: Palette,
  },
  {
    title: 'Componentes',
    href: '/docs/components',
    description: 'Cada componente con un ejemplo en vivo, su comando de instalación y sus props.',
    icon: LayoutGrid,
  },
  {
    title: 'Bloques',
    href: '/docs/blocks',
    description: 'Pantallas completas listas para copiar: login, dashboard, chat y más.',
    icon: Blocks,
  },
  {
    title: 'Storybook',
    href: storybookUrl,
    description: 'El taller: cada estado de cada componente, con pruebas visuales y de accesibilidad.',
    icon: BookOpen,
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-16 px-6 py-16 md:py-24">
      <section className="flex flex-col items-start gap-6">
        <p className="text-sm font-medium text-muted-foreground">Sistema de diseño</p>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl">
          Claramente imaginado.{' '}
          <span className="bg-(image:--aura-gradient-brand) bg-clip-text text-transparent">Precisamente construido.</span>
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          La marca, los tokens y los componentes de React con los que se construyen los productos de AuraData. Se
          instalan con el CLI de shadcn y quedan en tu código.
        </p>
        <InstallCommand command={`npx shadcn add ${registryUrl}/auradata-theme.json`} />
        <div className="flex flex-wrap gap-3">
          {/* Links styled as buttons keep link semantics (a Base UI Button rendered as a link would be role="button"). */}
          <Link href="/docs/installation" className={buttonVariants({ size: 'lg' })}>
            Empezar
            <ArrowRight data-icon="inline-end" />
          </Link>
          <Link href="/docs/components" className={buttonVariants({ size: 'lg', variant: 'outline' })}>
            Ver componentes
          </Link>
        </div>
      </section>

      <section aria-labelledby="sections-heading" className="flex flex-col gap-6">
        <h2 id="sections-heading" className="text-2xl font-semibold tracking-tight">
          Explora
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map(({ title, href, description, icon: Icon }) => (
            <li key={title}>
              <Link
                href={href}
                className="flex h-full flex-col gap-3 rounded-xl border bg-card p-5 text-card-foreground transition-colors hover:bg-accent"
              >
                <Icon aria-hidden className="size-5 text-primary" />
                <span className="font-medium">{title}</span>
                <span className="text-sm text-muted-foreground">{description}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
