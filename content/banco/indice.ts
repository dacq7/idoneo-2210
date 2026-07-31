// content/banco/indice.ts
// Cada módulo se carga con import() dinámico: el bundle inicial no lleva
// 750 ítems. El simulacro final los pide todos, pero bajo interacción.

import type { Item } from '@/lib/tipos';

export const BANCO: Record<string, () => Promise<Item[]>> = {
  'c1-vias-energeticas': () => import('./c1-vias-energeticas').then((m) => m.ITEMS),
  'c2-cardiovascular': () => import('./c2-cardiovascular').then((m) => m.ITEMS),
  'c3-respiratorio-vo2': () => import('./c3-respiratorio-vo2').then((m) => m.ITEMS),
  'c4-nervioso-digestivo-osteomuscular': () =>
    import('./c4-nervioso-digestivo-osteomuscular').then((m) => m.ITEMS),
  'c5-umbrales-zonas': () => import('./c5-umbrales-zonas').then((m) => m.ITEMS),
  'c6-biomecanica': () => import('./c6-biomecanica').then((m) => m.ITEMS),
  'c7-nutricion-deportiva': () => import('./c7-nutricion-deportiva').then((m) => m.ITEMS),
  'c8-psicologia-deporte': () => import('./c8-psicologia-deporte').then((m) => m.ITEMS),
  'c9-dopaje': () => import('./c9-dopaje').then((m) => m.ITEMS),
  'd1-conceptualizacion': () => import('./d1-conceptualizacion').then((m) => m.ITEMS),
  'd2-carga': () => import('./d2-carga').then((m) => m.ITEMS),
  'd3-fuerza': () => import('./d3-fuerza').then((m) => m.ITEMS),
  'd4-resistencia': () => import('./d4-resistencia').then((m) => m.ITEMS),
  'd5-velocidad': () => import('./d5-velocidad').then((m) => m.ITEMS),
  'd6-flexibilidad': () => import('./d6-flexibilidad').then((m) => m.ITEMS),
  'd7-modelos-planificacion': () => import('./d7-modelos-planificacion').then((m) => m.ITEMS),
  'd8-estructuras': () => import('./d8-estructuras').then((m) => m.ITEMS),
  'b1-fundamentos-pedagogia': () => import('./b1-fundamentos-pedagogia').then((m) => m.ITEMS),
  'b2-principios': () => import('./b2-principios').then((m) => m.ITEMS),
  'b3-modelos-pedagogicos': () => import('./b3-modelos-pedagogicos').then((m) => m.ITEMS),
  'b4-componentes-didacticos': () => import('./b4-componentes-didacticos').then((m) => m.ITEMS),
  'b5-estilos-ensenanza': () => import('./b5-estilos-ensenanza').then((m) => m.ITEMS),
  'b6-aprendizaje-sesion': () => import('./b6-aprendizaje-sesion').then((m) => m.ITEMS),
  'a1-celula': () => import('./a1-celula').then((m) => m.ITEMS),
  'a2-terminologia-anatomica': () => import('./a2-terminologia-anatomica').then((m) => m.ITEMS),
  'a3-tejidos-organos-sistemas': () =>
    import('./a3-tejidos-organos-sistemas').then((m) => m.ITEMS),
  'a4-nutrientes': () => import('./a4-nutrientes').then((m) => m.ITEMS),
  'a5-sistemas-energeticos-biomarcadores': () =>
    import('./a5-sistemas-energeticos-biomarcadores').then((m) => m.ITEMS),
  'a6-estadistica': () => import('./a6-estadistica').then((m) => m.ITEMS),
  // Los 29 módulos se registran aquí a medida que su contenido existe.
  // C5 entra en el paso 8; el bloque D en el paso 15; el resto del bloque C en
  // el paso 16; los bloques A y B en el paso 17.
};

export async function cargarBancoModulo(slug: string): Promise<Item[]> {
  const cargar = BANCO[slug];
  return cargar ? cargar() : [];
}

export async function cargarBancoBloque(slugs: readonly string[]): Promise<Item[]> {
  const tandas = await Promise.all(slugs.map(cargarBancoModulo));
  return tandas.flat();
}

/** Solo para el simulacro final y el diagnóstico. Se llama desde un handler
 *  de click, nunca en render ni al montar. */
export async function cargarBancoCompleto(): Promise<Item[]> {
  const tandas = await Promise.all(Object.values(BANCO).map((c) => c()));
  return tandas.flat();
}

/**
 * Cuántos ítems publicados tiene cada módulo. **Solo conteos**: ni un enunciado,
 * ni una explicación.
 *
 * Es lo que permite que las portadas de `/simulacros` digan la verdad sobre si
 * el banco alcanza —`diagnosticarViabilidad` en `src/lib/simulacro.ts`— sin
 * mandar el banco al navegador. Con 29 módulos son 29 números; el banco completo
 * serían ~750 ítems en la carga útil RSC de una ruta que el usuario abre para
 * *decidir* si va a hacer un simulacro, no para hacerlo (ADR-010).
 *
 * Se llama desde Server Components. En build carga el banco entero una vez por
 * ruta estática, que es el momento correcto para pagarlo.
 */
export async function censarBanco(): Promise<Record<string, number>> {
  const entradas = await Promise.all(
    Object.entries(BANCO).map(async ([slug, cargar]) => [slug, (await cargar()).length] as const),
  );
  return Object.fromEntries(entradas);
}
