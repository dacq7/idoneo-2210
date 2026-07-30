// src/app/layout.tsx — Server Component, sin directiva de cliente
// §11.2 del blueprint, con dos ajustes de ADR-009:
//   · la fuente display es Barlow Condensed, no Barlow (D-7)
//   · se omite `manifest:` hasta el Paso 18.1, porque el archivo no existe
//     todavía y produciría un 404 en consola desde este paso.

import type { Metadata, Viewport } from 'next';
import { Barlow_Condensed, Inter, JetBrains_Mono } from 'next/font/google';
import { Proveedores } from '@/components/layout/proveedores';
import { Shell } from '@/components/layout/shell';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--fuente-cuerpo',
  display: 'swap',
});

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--fuente-titulo',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--fuente-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: { default: 'Idóneo 2210', template: '%s · Idóneo 2210' },
  description:
    'Preparación para la Evaluación de Idoneidad del Entrenador Deportivo (Ley 2210 de 2022). 29 módulos, simulacros cronometrados y repaso espaciado.',
  applicationName: 'Idóneo 2210',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'Idóneo 2210' },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fbfcfd' },
    { media: '(prefers-color-scheme: dark)', color: '#0c1117' },
  ],
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning es obligatorio: next-themes escribe la clase del
    // tema en <html> antes de la hidratación, así que servidor y cliente
    // difieren en ese atributo a propósito.
    <html
      lang="es-CO"
      suppressHydrationWarning
      className={`${inter.variable} ${barlowCondensed.variable} ${mono.variable}`}
    >
      <body className="min-h-dvh bg-background font-sans text-foreground antialiased">
        <Proveedores>
          <Shell>{children}</Shell>
        </Proveedores>
      </body>
    </html>
  );
}
