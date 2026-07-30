// src/components/items/contrato.ts — solo tipos. Sin directiva de cliente.
//
// El contrato que comparten los 7 componentes de ítem, de modo que el
// controlador de sesión no necesite saber con qué tipo está tratando.
//
// Diferencia deliberada con §13 del blueprint: allí `item` es `Item` (la unión
// completa) y cada componente hace `item as ItemUnica` en su cuerpo. Aquí el
// tipo del ítem es un PARÁMETRO GENÉRICO, así que:
//
//   - los 7 componentes reciben ya su variante y no llevan ni un cast;
//   - el único cast del sistema vive en `envoltorio-item.tsx`, dentro del
//     `switch` sobre `item.tipo` que lo justifica, y está comentado allí.
//
// Un cast en un sitio que el compilador vigila (el switch es exhaustivo) es
// mejor que siete casts repartidos por siete archivos.

import type { Item } from '@/lib/tipos';

/**
 * Los cuatro estados de un ítem. Todo componente los implementa, incluso los
 * que hoy no tienen productor:
 *
 *  - `respondiendo`         el usuario puede elegir y cambiar de opinión.
 *  - `bloqueado`            respondió, la respuesta queda fija y AÚN NO hay
 *                           veredicto. Hoy no lo produce nadie: nace con el
 *                           simulacro cronometrado del Paso 11. Se implementa
 *                           ahora porque forma parte del contrato y añadirlo
 *                           después obligaría a volver a los 7 componentes.
 *  - `revision-correcta`    hay veredicto y acertó.
 *  - `revision-incorrecta`  hay veredicto y falló (o lo dejó en blanco).
 */
export type ModoItem =
  | 'respondiendo'
  | 'bloqueado'
  | 'revision-correcta'
  | 'revision-incorrecta';

export interface PropsItem<TValor = unknown, TItem extends Item = Item> {
  item: TItem;
  /** `null` = sin responder. Es distinto de «respondió cualquier cosa». */
  valor: TValor | null;
  modo: ModoItem;
  onCambio: (valor: TValor) => void;
  /** Índice 1-based, para el nombre accesible del grupo de opciones. */
  numero: number;
  total: number;
}

/** Hay veredicto en pantalla: se muestran las marcas de correcto e incorrecto. */
export function enRevision(modo: ModoItem): boolean {
  return modo === 'revision-correcta' || modo === 'revision-incorrecta';
}

/** El usuario todavía puede cambiar su respuesta. */
export function editable(modo: ModoItem): boolean {
  return modo === 'respondiendo';
}
