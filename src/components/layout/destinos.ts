// src/components/layout/destinos.ts
// Los cinco destinos de la navegación principal (§11.5), en un solo lugar:
// nav-inferior.tsx (móvil) y barra-lateral.tsx (desde lg) los renderizan con
// forma distinta pero nunca con contenido distinto.
//
// Sin directiva de cliente: es data. Los iconos son referencias a componentes de
// lucide-react y se bundlean con el componente cliente que los importa.

import { House, Layers, RotateCcw, Settings, Timer, type LucideIcon } from 'lucide-react';

export interface Destino {
  href: string;
  /** Etiqueta visible. La misma en las dos barras: una acción no cambia de nombre. */
  etiqueta: string;
  icono: LucideIcon;
  /** Descripción para el lector de pantalla cuando la etiqueta sola es ambigua. */
  titulo: string;
}

export const DESTINOS: Destino[] = [
  { href: '/', etiqueta: 'Inicio', icono: House, titulo: 'Inicio' },
  { href: '/modulos', etiqueta: 'Módulos', icono: Layers, titulo: 'Módulos de estudio' },
  { href: '/repaso', etiqueta: 'Repaso', icono: RotateCcw, titulo: 'Repaso del día' },
  { href: '/simulacros', etiqueta: 'Simulacros', icono: Timer, titulo: 'Simulacros cronometrados' },
  { href: '/ajustes', etiqueta: 'Ajustes', icono: Settings, titulo: 'Ajustes y respaldo' },
];

/**
 * Un destino está activo si la ruta es exactamente la suya o una subruta.
 * Inicio se compara exacto: `/` es prefijo de todo lo demás.
 *
 * Pura y sin reloj: la llama el render de las dos barras en cada navegación.
 */
export function destinoActivo(href: string, pathname: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}
