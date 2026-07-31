'use client';

// src/components/items/grupo-opcion-unica.tsx — Client Component (§10.3).
//
// El grupo de cuatro opciones con una sola correcta. Lo comparten DOS tipos de
// ítem: `unica` y `caso` —que se diferencian en la viñeta, no en el control—,
// así que la lógica vive aquí una sola vez.
//
// ══ POR QUÉ TIENE ARCHIVO PROPIO (Paso 12, obligación de ADR-022) ══
// Estaba en `opcion-unica.tsx`, que exportaba dos componentes y por tanto
// incumplía la regla 1 —«un componente **exportado** por archivo»— con la
// redacción que el usuario fijó el 2026-07-31. `PENDIENTES.md` pedía decidir
// **mirando el código** y no contando exports, y mirándolo la respuesta es
// clara: este componente **tiene un consumidor externo** (`caso.tsx`), así que
// no es un auxiliar interno de `OpcionUnica` sino una pieza pública por derecho
// propio. Su sitio es un archivo, igual que `BotonOpcion` en `opcion.tsx`.
//
// El criterio que deja escrito, y sirve para el próximo caso: **un componente
// con consumidor fuera de su archivo es público**; uno que solo usa el archivo
// que lo define es un auxiliar y puede convivir.
//
// La calificación NO se decide aquí: la hace `calificar()` de
// `src/lib/simulacro.ts` y llega convertida en `modo` (§13).

import { useCallback } from 'react';
import { editable, enRevision, type ModoItem } from './contrato';
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
