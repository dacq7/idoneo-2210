// content/tarjetas/indice.ts

import type { Tarjeta } from '@/lib/tipos';

export const TARJETAS: Record<string, () => Promise<Tarjeta[]>> = {
  'c5-umbrales-zonas': () => import('./c5-umbrales-zonas').then((m) => m.TARJETAS_MODULO),
  // C5 entra en el paso 8; los 28 restantes en los pasos 15–17.
};

export async function cargarTarjetas(slug: string): Promise<Tarjeta[]> {
  const cargar = TARJETAS[slug];
  return cargar ? cargar() : [];
}

/** Para la cola de repaso, que mezcla tarjetas de varios módulos. */
export async function cargarTarjetasDe(slugs: readonly string[]): Promise<Tarjeta[]> {
  const tandas = await Promise.all(slugs.map(cargarTarjetas));
  return tandas.flat();
}
