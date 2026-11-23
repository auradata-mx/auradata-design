import type { Metadata } from 'next';
import { Provider } from '@docs/components/provider';
import { appName, siteDescription } from '@docs/lib/shared';
import './global.css';

export const metadata: Metadata = {
  title: { default: appName, template: `%s · ${appName}` },
  description: siteDescription,
  icons: {
    icon: [
      { url: '/brand/continua/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/brand/continua/favicon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/brand/continua/favicon-180.png',
  },
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
