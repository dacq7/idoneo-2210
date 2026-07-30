// content/erratas.ts
// Contradicciones entre cartillas (X-*) y erratas de contenido (E-*).
// Alimenta la ruta /erratas y el componente <AlertaContradiccion />.
// Regla de producto: si un ítem toca un punto de aquí, se redacta evitando la
// ambigüedad y la explicación enlaza la entrada correspondiente.
//
// Vacío a propósito: el paso 6 copia las 14 entradas de §9.3.

import type { Errata } from '@/lib/tipos';

export const ERRATAS: Errata[] = [];

export const ERRATAS_POR_ID = new Map(ERRATAS.map((e) => [e.id, e]));

export function erratasDelModulo(slug: string): Errata[] {
  return ERRATAS.filter((e) => e.modulos.includes(slug));
}
