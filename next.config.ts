import withSerwistInit from '@serwist/next';
import type { NextConfig } from 'next';

// [Paso 18.1] Reescritura completa del archivo con withSerwist, como anticipaba
// la nota del Paso 11. `reactStrictMode: true` SOBREVIVE: es obligación
// declarada en PENDIENTES.md y §16 ya lo incluía, así que no hay conflicto.

const withSerwist = withSerwistInit({
  swSrc: 'src/app/sw.ts',
  swDest: 'public/sw.js',
  // En desarrollo el service worker estorba: cachea justo lo que acabas de
  // cambiar y obliga a vaciar el almacenamiento en cada edición.
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig: NextConfig = {
  // Solo afecta a desarrollo. Se activó en el Paso 11, y no aquí, para que el
  // doble disparo de efectos apareciera mientras era barato: el auto-envío de
  // usar-cronometro y el IntersectionObserver de marcador-lectura son justo el
  // código donde ese bug es caro de encontrar tarde.
  reactStrictMode: true,
};

export default withSerwist(nextConfig);
