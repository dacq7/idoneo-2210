// content/banco/indice.ts
// Cada módulo se carga con import() dinámico: el bundle inicial no lleva
// 750 ítems. El simulacro final los pide todos, pero bajo interacción.

import type { Item } from '@/lib/tipos';

export const BANCO: Record<string, () => Promise<Item[]>> = {
  'c5-umbrales-zonas': () => import('./c5-umbrales-zonas').then((m) => m.ITEMS),
  // Los 29 módulos se registran aquí a medida que su contenido existe.
  // C5 entra en el paso 8; los 28 restantes en los pasos 15–17.
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
