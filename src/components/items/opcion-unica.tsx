'use client';

// src/components/items/opcion-unica.tsx — Client Component (§10.3).
//
// Ítem de opción única: 4 opciones, una correcta. `caso` usa exactamente el
// mismo control —su diferencia es la viñeta, que pinta la cabecera del
// envoltorio antes del enunciado—, así que el grupo de opciones vive aquí y
// `caso.tsx` lo reutiliza en vez de duplicarlo.
//
// La calificación NO se decide aquí: la hace `calificar()` de
// `src/lib/simulacro.ts` y llega convertida en `modo` (§13). Este componente
// solo sabe pintar cuatro estados.

import { useCallback } from 'react';
import type { ItemCaso, ItemUnica } from '@/lib/tipos';
import { editable, enRevision, type ModoItem, type PropsItem } from './contrato';
import { BotonOpcion, LETRAS, useAtajoNumerico, type MarcaOpcion } from './opcion';

/** El grupo de opciones que comparten `unica` y `caso`. */
export function GrupoOpcionUnica({
  opciones,
  correcta,
  valor,
  modo,
  onCambio,
  numero,
  total,
}: {
  opciones: readonly string[];
  correcta: number;
  valor: number | null;
  modo: ModoItem;
  onCambio: (valor: number) => void;
  numero: number;
  total: number;
}) {
  const revision = enRevision(modo);

  // `useCallback` para que el efecto del atajo no se vuelva a suscribir en cada
  // render (su lista de dependencias incluye el handler).
  const elegir = useCallback((indice: number) => onCambio(indice), [onCambio]);
  useAtajoNumerico(editable(modo), opciones.length, elegir);

  return (
    <div role="group" aria-label={`Opciones del ítem ${numero} de ${total}`} className="space-y-2">
      {opciones.map((texto, i) => {
        const elegida = valor === i;
        const marca: MarcaOpcion = !revision
          ? 'ninguna'
          : i === correcta
            ? 'correcta'
            : elegida
              ? 'fallo'
              : 'ninguna';

        return (
          <BotonOpcion
            key={texto}
            rotulo={LETRAS[i] ?? String(i + 1)}
            texto={texto}
            elegida={elegida}
            marca={marca}
            modo={modo}
            onElegir={() => elegir(i)}
          />
        );
      })}
    </div>
  );
}

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
