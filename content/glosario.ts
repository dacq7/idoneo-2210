// content/glosario.ts
// Unión de las "cajas de conceptos clave" de las cuatro cartillas.
// REGLA: todo conceptoClave de un módulo marcado 'completo' debe tener entrada
// aquí, o el build falla. Al terminar un módulo, se añaden sus términos.
//
// Vacío a propósito: el paso 6 copia las entradas de §9.5.

import type { EntradaGlosario } from '@/lib/tipos';

export const GLOSARIO: EntradaGlosario[] = [];

/** Filtro del glosario en cliente. <400 entradas: no necesita índice. */
export function normalizarBusqueda(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function buscarGlosario(consulta: string): EntradaGlosario[] {
  const q = normalizarBusqueda(consulta);
  if (q.length === 0) return GLOSARIO;
  return GLOSARIO.filter((e) => {
    const campos = [e.termino, e.definicion, ...(e.sinonimos ?? [])];
    return campos.some((c) => normalizarBusqueda(c).includes(q));
  });
}
