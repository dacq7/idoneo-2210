'use client';

// src/components/items/opcion-unica.tsx — Client Component (§10.3).
//
// Ítem de opción única: 4 opciones, una correcta.
//
// El grupo de opciones lo comparte con `caso` —que se diferencia en la viñeta,
// no en el control— y desde el Paso 12 vive en `grupo-opcion-unica.tsx`: tiene
// consumidor externo, así que es público por derecho propio y le toca archivo
// (ADR-022, regla 1).
//
// La calificación NO se decide aquí: la hace `calificar()` de
// `src/lib/simulacro.ts` y llega convertida en `modo` (§13). Este componente
// solo sabe pintar cuatro estados.

import type { ItemCaso, ItemUnica } from '@/lib/tipos';
import type { PropsItem } from './contrato';
import { GrupoOpcionUnica } from './grupo-opcion-unica';

export function OpcionUnica({
  item,
  valor,
  modo,
  onCambio,
  numero,
  total,
}: PropsItem<number, ItemUnica | ItemCaso>) {
  return (
    <GrupoOpcionUnica
      opciones={item.opciones}
      correcta={item.correcta}
      valor={valor}
      modo={modo}
      onCambio={onCambio}
      numero={numero}
      total={total}
    />
  );
}
