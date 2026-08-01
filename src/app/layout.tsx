// src/app/layout.tsx — Server Component, sin directiva de cliente
// §11.2 del blueprint, con un ajuste de ADR-009: la fuente display es Barlow
// Condensed, no Barlow (D-7).
//
// [Paso 18.1] `manifest:` estaba omitido a propósito porque el archivo no
// existía y habría dado un 404 en consola desde el Paso 5. Ya existe
// (`src/app/manifest.ts`), así que se declara.

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

/**
 * [18.7] De dónde cuelga la imagen de Open Graph.
 *
 * Sin `metadataBase`, Next resuelve `/og.png` contra `http://localhost:3000` y
 * lo avisa en el build. En producción eso significa que **la previsualización
 * del enlace no carga**: WhatsApp intenta descargar la imagen de un localhost
 * que no es el suyo. Y compartir esta app es literalmente mandar un enlace
 * (§1), así que la portada sin imagen es un fallo del producto, no un detalle.
 *
 * Las tres fuentes van de más estable a menos, y **ninguna hay que configurarla
 * a mano**: Vercel las inyecta. `VERCEL_PROJECT_PRODUCTION_URL` es el dominio
 * de producción y no cambia entre despliegues; `VERCEL_URL` es la URL única de
 * cada uno y sirve para que las previsualizaciones también funcionen. El
 * localhost final es para desarrollo. Se mantiene la promesa de §18 de cero
 * variables de entorno que alguien tenga que rellenar.
 */
function baseDeMetadatos(): URL {
  const host =
    process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL ?? 'localhost:3000';
  const protocolo = host.startsWith('localhost') ? 'http' : 'https';
  return new URL(`${protocolo}://${host}`);
}

export const metadata: Metadata = {
  metadataBase: baseDeMetadatos(),
  title: { default: 'Idóneo 2210', template: '%s · Idóneo 2210' },
  description:
    'Preparación para la Evaluación de Idoneidad del Entrenador Deportivo (Ley 2210 de 2022). 29 módulos, simulacros cronometrados y repaso espaciado.',
  applicationName: 'Idóneo 2210',
  manifest: '/manifest.webmanifest',
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
