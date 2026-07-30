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

export function normalizar(texto: string): string {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

export function porcentaje(correctas: number, total: number): number {
  return total === 0 ? 0 : Math.round((correctas / total) * 100);
}
