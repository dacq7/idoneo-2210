'use client';

// src/components/items/opcion-multiple.tsx — Client Component (§10.3).
//
// Ítem de opción múltiple: 5 opciones, 2 o 3 correctas. Se marca y se desmarca.
//
// Decisión: NO se bloquea la selección al llegar al número de correctas. El
// contador dice cuántas van y cuántas pide el ítem, pero si el usuario marca
// una de más, se marca. Impedirlo obligaría a desmarcar a ciegas para poder
// cambiar de opinión, y el examen tampoco impide equivocarse: `calificar()`
// exige el conjunto exacto, así que sobrar es fallar y el usuario tiene que
// verlo.

import { useCallback } from 'react';
import type { ItemMultiple } from '@/lib/tipos';
import { editable, enRevision, type PropsItem } from './contrato';
import { BotonOpcion, LETRAS, useAtajoNumerico, type MarcaOpcion } from './opcion';

export function OpcionMultiple({
  item,
  valor,
  modo,
  onCambio,
  numero,
  total,
}: PropsItem<number[], ItemMultiple>) {
  const revision = enRevision(modo);
  const elegidas = valor ?? [];
  const piden = item.correctas.length;

  const alternar = useCallback(
    (indice: number) => {
      const actuales = valor ?? [];
      const siguiente = actuales.includes(indice)
        ? actuales.filter((i) => i !== indice)
        : [...actuales, indice].sort((a, b) => a - b);
      onCambio(siguiente);
    },
    [valor, onCambio],
  );

  useAtajoNumerico(editable(modo), item.opciones.length, alternar);

  return (
    <div className="space-y-3">
      <p className="text-[0.8125rem] text-muted-foreground">
        Este ítem pide <strong className="font-semibold">{piden}</strong> respuestas.{' '}
        {/* role="status" anuncia el cambio de cuenta sin robar el foco, que
            sigue en la opción que el usuario acaba de marcar. */}
        <span role="status">
          {revision
            ? `Elegiste ${elegidas.length}.`
            : `Llevas ${elegidas.length} de ${piden}.`}
        </span>
      </p>

      <div
        role="group"
        aria-label={`Opciones del ítem ${numero} de ${total}. Elige ${piden}.`}
        className="space-y-2"
      >
        {item.opciones.map((texto, i) => {
          const elegida = elegidas.includes(i);
          const esCorrecta = item.correctas.includes(i);
          const marca: MarcaOpcion = !revision
            ? 'ninguna'
            : esCorrecta
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
              onElegir={() => alternar(i)}
              varias
            />
          );
        })}
      </div>
    </div>
  );
}
