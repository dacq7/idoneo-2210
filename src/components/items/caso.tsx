'use client';

// src/components/items/caso.tsx — Client Component (§10.3).
//
// Ítem de caso: una situación de campo (`viñeta`) + una pregunta + 4 opciones.
//
// La viñeta NO se pinta aquí, y es decisión, no olvido: §4 manda que se muestre
// ANTES del enunciado, y el enunciado lo pinta la cabecera del envoltorio para
// que los 7 tipos lo presenten igual. Meter la viñeta aquí la dejaría DEBAJO de
// la pregunta que contextualiza, que es justo al revés de lo que sirve. La pinta
// `envoltorio-item.tsx`, que es quien controla ese orden.
//
// Lo que queda —las 4 opciones— es idéntico a `unica`, así que se reutiliza su
// grupo en vez de mantener dos copias que se desincronizarían.

import type { ItemCaso } from '@/lib/tipos';
import type { PropsItem } from './contrato';
import { GrupoOpcionUnica } from './grupo-opcion-unica';

export function Caso({ item, valor, modo, onCambio, numero, total }: PropsItem<number, ItemCaso>) {
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
