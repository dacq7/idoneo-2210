'use client';

// src/components/items/verdadero-falso.tsx — Client Component (§10.3).
//
// Dos botones grandes. Mismo tratamiento visual que `unica`: el chip lleva «V» o
// «F» en vez de la letra, y el atajo es 1 = Verdadero, 2 = Falso.

import { useCallback } from 'react';
import type { ItemVerdaderoFalso } from '@/lib/tipos';
import { editable, enRevision, type PropsItem } from './contrato';
import { BotonOpcion, useAtajoNumerico, type MarcaOpcion } from './opcion';

const OPCIONES = [
  { valor: true, rotulo: 'V', texto: 'Verdadero' },
  { valor: false, rotulo: 'F', texto: 'Falso' },
] as const;

export function VerdaderoFalso({
  item,
  valor,
  modo,
  onCambio,
  numero,
  total,
}: PropsItem<boolean, ItemVerdaderoFalso>) {
  const revision = enRevision(modo);

  const elegirPorIndice = useCallback(
    (indice: number) => {
      const opcion = OPCIONES[indice];
      if (opcion) onCambio(opcion.valor);
    },
    [onCambio],
  );

  useAtajoNumerico(editable(modo), OPCIONES.length, elegirPorIndice);

  return (
    <div
      role="group"
      aria-label={`Verdadero o falso. Ítem ${numero} de ${total}`}
      className="space-y-2"
    >
      {OPCIONES.map((opcion) => {
        const elegida = valor === opcion.valor;
        const marca: MarcaOpcion = !revision
          ? 'ninguna'
          : opcion.valor === item.correcta
            ? 'correcta'
            : elegida
              ? 'fallo'
              : 'ninguna';

        return (
          <BotonOpcion
            key={opcion.rotulo}
            rotulo={opcion.rotulo}
            texto={opcion.texto}
            elegida={elegida}
            marca={marca}
            modo={modo}
            onElegir={() => onCambio(opcion.valor)}
          />
        );
      })}
    </div>
  );
}
