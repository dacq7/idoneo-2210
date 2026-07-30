// src/lib/utils.ts
// cn() lo consumen los 18 componentes de src/components/ui/: no cambiar
// su nombre ni su firma.

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { BloqueId } from './tipos';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Mapa estático: Tailwind necesita ver las clases completas en el código. */
export const CLASES_BLOQUE: Record<BloqueId, { fondo: string; texto: string; borde: string; suave: string }> = {
  A: { fondo: 'bg-bloque-a', texto: 'text-bloque-a', borde: 'border-bloque-a', suave: 'bg-bloque-a-suave' },
  B: { fondo: 'bg-bloque-b', texto: 'text-bloque-b', borde: 'border-bloque-b', suave: 'bg-bloque-b-suave' },
  C: { fondo: 'bg-bloque-c', texto: 'text-bloque-c', borde: 'border-bloque-c', suave: 'bg-bloque-c-suave' },
  D: { fondo: 'bg-bloque-d', texto: 'text-bloque-d', borde: 'border-bloque-d', suave: 'bg-bloque-d-suave' },
};

/**
 * Clase de relleno del acento que marca el contexto: el color del bloque si hay
 * uno, y el azul acero de marca si no. La usan la lengüeta del destino activo de
 * las dos barras de navegación (DISENO.md §4.5) y cualquier acento futuro que
 * deba seguir al bloque.
 *
 * Devuelve una clase del mapa estático, nunca una interpolada.
 */
export function claseAcentoBloque(bloque: BloqueId | null): string {
  return bloque ? CLASES_BLOQUE[bloque].fondo : 'bg-primary';
}

/**
 * Deriva el bloque en contexto a partir de la ruta, para el riel de bloques del
 * encabezado (DISENO.md §4.3). Devuelve null cuando la ruta no pertenece a
 * ningún bloque: `/`, `/repaso`, `/simulacros`, `/ajustes`, 404.
 *
 * Tres familias de ruta llevan bloque, y en las tres la letra está en la propia
 * URL, así que no hace falta consultar `content/estructura.ts`:
 *   /bloques/C                → 'C'  (el segmento ES el id)
 *   /modulos/c5-umbrales-…    → 'C'  (prefijo del slug)
 *   /simulacros/bloque/C      → 'C'
 *
 * Función pura, sin reloj y sin estado: se llama en el render de un componente
 * cliente en cada navegación.
 */
export function bloqueDeRuta(pathname: string): BloqueId | null {
  const partes = pathname.split('/').filter((p) => p.length > 0);
  const [primero, segundo, tercero] = partes;

  if (primero === 'bloques' || primero === 'modulos') return aBloqueId(segundo);
  if (primero === 'simulacros' && segundo === 'bloque') return aBloqueId(tercero);
  return null;
}

const IDS_BLOQUE = new Set<string>(['A', 'B', 'C', 'D']);

/** Toma la primera letra de un segmento de ruta y la valida como BloqueId. */
function aBloqueId(segmento: string | undefined): BloqueId | null {
  const letra = segmento?.charAt(0).toUpperCase();
  return letra && IDS_BLOQUE.has(letra) ? (letra as BloqueId) : null;
}

export function normalizar(texto: string): string {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

export function porcentaje(correctas: number, total: number): number {
  return total === 0 ? 0 : Math.round((correctas / total) * 100);
}
