// content/tarjetas/indice.ts

import type { Tarjeta } from '@/lib/tipos';

export const TARJETAS: Record<string, () => Promise<Tarjeta[]>> = {
  'c1-vias-energeticas': () => import('./c1-vias-energeticas').then((m) => m.TARJETAS_MODULO),
  'c2-cardiovascular': () => import('./c2-cardiovascular').then((m) => m.TARJETAS_MODULO),
  'c3-respiratorio-vo2': () => import('./c3-respiratorio-vo2').then((m) => m.TARJETAS_MODULO),
  'c4-nervioso-digestivo-osteomuscular': () =>
    import('./c4-nervioso-digestivo-osteomuscular').then((m) => m.TARJETAS_MODULO),
  'c5-umbrales-zonas': () => import('./c5-umbrales-zonas').then((m) => m.TARJETAS_MODULO),
  'c6-biomecanica': () => import('./c6-biomecanica').then((m) => m.TARJETAS_MODULO),
  'c7-nutricion-deportiva': () => import('./c7-nutricion-deportiva').then((m) => m.TARJETAS_MODULO),
  'c8-psicologia-deporte': () => import('./c8-psicologia-deporte').then((m) => m.TARJETAS_MODULO),
  'c9-dopaje': () => import('./c9-dopaje').then((m) => m.TARJETAS_MODULO),
  'd1-conceptualizacion': () => import('./d1-conceptualizacion').then((m) => m.TARJETAS_MODULO),
  'd2-carga': () => import('./d2-carga').then((m) => m.TARJETAS_MODULO),
  'd3-fuerza': () => import('./d3-fuerza').then((m) => m.TARJETAS_MODULO),
  'd4-resistencia': () => import('./d4-resistencia').then((m) => m.TARJETAS_MODULO),
  'd5-velocidad': () => import('./d5-velocidad').then((m) => m.TARJETAS_MODULO),
  'd6-flexibilidad': () => import('./d6-flexibilidad').then((m) => m.TARJETAS_MODULO),
  'd7-modelos-planificacion': () =>
    import('./d7-modelos-planificacion').then((m) => m.TARJETAS_MODULO),
  'd8-estructuras': () => import('./d8-estructuras').then((m) => m.TARJETAS_MODULO),
  // C5 entra en el paso 8; el bloque D en el paso 15; el resto del bloque C en
  // el paso 16; los bloques A y B en el paso 17.
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
