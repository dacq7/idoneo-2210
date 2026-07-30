// src/components/modulo/lista-modulos.tsx — Server Component, sin directiva de cliente.
//
// Envuelve las fichas en una lista de verdad (<ul>/<li>), para que el lector de
// pantalla anuncie «lista con 9 elementos» y se pueda saltar de una a otra. Las
// dos rutas del Paso 6 la usan, así que la semántica no depende de que cada
// página se acuerde de ponerla.
//
// Separación gap-3 móvil · gap-4 desde sm, según DISENO.md §3.

import { TarjetaModulo, type ModuloEnLista } from './tarjeta-modulo';
import type { BloqueId } from '@/lib/tipos';

export function ListaModulos({
  modulos,
  bloque,
}: {
  modulos: readonly ModuloEnLista[];
  bloque: BloqueId;
}) {
  return (
    <ul className="grid gap-3 sm:gap-4">
      {modulos.map((modulo) => (
        <li key={modulo.slug}>
          <TarjetaModulo modulo={modulo} bloque={bloque} />
        </li>
      ))}
    </ul>
  );
}
