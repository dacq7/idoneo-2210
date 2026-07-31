'use client';

// src/components/sesion/cronometro-visual.tsx — Client Component (§10.3).
//
// ══════════════════════════════════════════════════════════════════════════
// LO QUE NO PUEDE SER: UNA REGIÓN VIVA QUE HABLA CADA SEGUNDO
// ══════════════════════════════════════════════════════════════════════════
//
// Es el error clásico de los cronómetros accesibles y aquí sería devastador: un
// `aria-live` sobre una cifra que cambia cada segundo hace que el lector de
// pantalla interrumpa al usuario **120 veces por minuto durante dos horas**,
// pisando la lectura del enunciado que está intentando responder. El simulacro
// se volvería imposible de hacer con lector.
//
// El reparto correcto son dos canales distintos:
//
//  1. **La cifra** — `role="timer"` **sin** `aria-live`. `role="timer"` está
//     hecho exactamente para esto: marca la región como un contador consultable
//     y, sin `aria-live`, **no anuncia nada solo**. El usuario la consulta
//     cuando quiere. Se le pone `aria-live="off"` explícito para que ninguna
//     herencia futura lo cambie por accidente.
//
//  2. **Los avisos** — una región `role="status"` (polite, implícito) separada,
//     que solo recibe texto en los tres umbrales: 20 min, 10 min y 2 min. Tres
//     anuncios en toda la sesión, no siete mil.
//
// **El `aria-label` se recalcula por MINUTO, no por segundo.** Aunque
// `role="timer"` no anuncie, algunos lectores releen el nombre accesible al
// devolver el foco al contenedor; con los segundos dentro, esa relectura sería
// distinta cada vez y confusa. Con minutos —«quedan 43 minutos»— es estable y
// además es la cifra que el usuario necesita para decidir el ritmo. La precisión
// al segundo es información visual, y ahí sí está, en la cifra.
//
// ══ TIPOGRAFÍA ══
// `font-mono` con `tabular-nums`: sin cifras de ancho fijo el cronómetro «salta»
// cada segundo al cambiar de dígito, y el movimiento en el borde del campo
// visual roba atención cada segundo durante dos horas.

import { AlertTriangle } from 'lucide-react';
import { formatearDuracion } from '@/lib/fechas';
import { severidad, TEXTO_AVISO, type UmbralAviso } from '@/lib/cronometro';
import { cn } from '@/lib/utils';

interface Props {
  /** `null` = aún no montó (primer render) o sesión sin límite. */
  restantesSeg: number | null;
  /** Umbral ya mostrado, para el texto del aviso. `null` = sin aviso visible. */
  avisoVisible: UmbralAviso | null;
}

function etiquetaHablada(restantesSeg: number | null): string {
  if (restantesSeg === null) return 'Tiempo restante, calculando';
  if (restantesSeg <= 0) return 'Tiempo agotado';
  const minutos = Math.ceil(restantesSeg / 60);
  if (minutos === 1) return 'Queda menos de un minuto';
  return `Quedan ${minutos} minutos`;
}

export function CronometroVisual({ restantesSeg, avisoVisible }: Props) {
  const nivel = severidad(restantesSeg);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[0.6875rem] font-semibold uppercase leading-[1.1] tracking-[0.08em] text-muted-foreground">
          Tiempo restante
        </span>

        <span
          role="timer"
          // Sin esto, un `aria-live` heredado de un ancestro convertiría la
          // cifra en un anuncio por segundo. Es una guarda barata contra un
          // fallo que no se ve hasta que alguien prueba con lector.
          aria-live="off"
          aria-label={etiquetaHablada(restantesSeg)}
          className={cn(
            'font-mono text-2xl font-semibold leading-none tabular-nums',
            nivel === 'normal' && 'text-foreground',
            // `text-aviso` como TEXTO: es el consumidor real del token, no el
            // `<Ojo>` del MDX, donde solo tiñe el icono. Corrige DISENO.md §1.4
            // fila D-1, que lo afirmaba de aquel.
            //
            // [A-36] Medido sobre **`--background`**, que es la superficie real
            // —este bloque no vive dentro de una tarjeta—: 4,65:1 en claro y
            // 9,30:1 en oscuro. Pasa AA, con **0,15 de margen** en claro: si
            // alguien toca `--aviso`, se vuelve a medir aquí.
            nivel === 'atencion' && 'text-aviso',
            nivel === 'critico' && 'text-destructive',
          )}
        >
          {/* La cifra exacta es información visual. El nombre accesible del
              contenedor ya dice los minutos, así que un lector no necesita
              deletrear «cuatro tres dos cero». */}
          <span aria-hidden="true">
            {restantesSeg === null ? '--:--' : formatearDuracion(restantesSeg)}
          </span>
        </span>
      </div>

      {/* Región viva SIEMPRE montada, aunque esté vacía: un contenedor
          `aria-live` que aparece junto con su contenido no se anuncia de forma
          fiable —el lector necesita haber visto la región antes para detectar el
          cambio—. Es el mismo patrón que la retroalimentación de los ítems.

          `polite` y no `assertive`: el aviso llega mientras el usuario lee un
          enunciado, y cortarle la lectura a mitad para decirle que quedan 20
          minutos le cuesta más tiempo del que le ahorra. */}
      {/* Con nombre: la pantalla tiene otra región `status` —el «Ítem 3 de
          100»— y sin nombre las dos son indistinguibles para quien navega por
          regiones. También es lo que permite dirigirse a ella en los tests sin
          depender del orden del DOM. */}
      <div role="status" aria-label="Avisos del tiempo" className="min-h-0">
        {avisoVisible !== null ? (
          <p
            className={cn(
              'flex items-start gap-2 rounded-md border-l-4 p-3 text-[0.8125rem] leading-[1.45]',
              avisoVisible === 120
                ? 'border-destructive bg-destructive/10 text-foreground'
                : 'border-aviso bg-aviso/10 text-foreground',
            )}
          >
            <AlertTriangle
              className={cn(
                'mt-0.5 size-4 shrink-0',
                avisoVisible === 120 ? 'text-destructive' : 'text-aviso',
              )}
              aria-hidden="true"
            />
            {TEXTO_AVISO[avisoVisible]}
          </p>
        ) : null}
      </div>
    </div>
  );
}
