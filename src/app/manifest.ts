// src/app/manifest.ts — Server Component (§16).
// Next lo sirve en /manifest.webmanifest, que es la ruta que declara el
// `manifest:` de layout.tsx.

import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Idóneo 2210 — Evaluación de Idoneidad del Entrenador Deportivo',
    short_name: 'Idóneo 2210',
    description:
      '29 módulos, simulacros cronometrados y repaso espaciado para aprobar la Evaluación de Idoneidad (Ley 2210 de 2022).',
    start_url: '/',
    display: 'standalone',
    background_color: '#fbfcfd',
    theme_color: '#1f4f80',
    lang: 'es-CO',
    // Vertical: la app se usa de pie o sentado con una mano, y las pantallas
    // que más importan —opciones de ítem, cuadrícula de navegación— están
    // diseñadas a 375 px de ancho.
    orientation: 'portrait',
    categories: ['education', 'sports'],
    icons: [
      { src: '/icono-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icono-512.png', sizes: '512x512', type: 'image/png' },
      // El maskable NO es el mismo archivo: Android recorta hasta un 20 % por
      // lado, así que su marca se dibuja dentro del 60 % central.
      { src: '/icono-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
