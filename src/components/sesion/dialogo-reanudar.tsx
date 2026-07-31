'use client';

// src/components/sesion/dialogo-reanudar.tsx — Client Component (§10.3).
//
// «Tienes un simulacro a medias»: la pantalla que decide entre continuar el
// intento guardado y empezar uno nuevo.
//
// ══ NO ES UN MODAL, Y ES DELIBERADO ══
// §11.5 del blueprint lo llama «diálogo» y el nombre del archivo lo conserva,
// pero se construye como **panel en el flujo de la página**, no como `<Dialog>`
// flotante. Tres razones, la última decisiva:
//
//  1. Un modal exige trampa de foco, cierre con `Escape` y `aria-modal`. Todo
//     eso es superficie de fallo de accesibilidad a cambio de nada aquí: no hay
//     contenido detrás que interese proteger, la página está vacía salvo por
//     esta decisión.
//  2. `Escape` en un modal significa «cancelar», y aquí **no hay opción
//     neutra**: las dos salidas son destructivas o irreversibles. Un gesto que
//     el usuario asocia a «déjalo como estaba» no puede quedar sin destino.
//  3. En móvil un modal a pantalla casi completa es indistinguible de una
//     pantalla, con la desventaja de que se puede cerrar por accidente.
//
// ══ EL TIEMPO QUE MUESTRA ES EL REAL ══
// No el que quedaba al cerrar la pestaña: `restantes()` lo recalcula contra el
// reloj desde `iniciadoEnMs`. Si el usuario cerró con 40 minutos y vuelve dos
// horas después, aquí lee «se acabó el tiempo», que es la verdad. Cerrar la
// pestaña no regala tiempo, y el sitio donde eso se ve primero es esta pantalla.

import { AlertTriangle, Play, RotateCcw } from 'lucide-react';
import { formatearDuracion } from '@/lib/fechas';
import { resumirNavegacion } from '@/lib/cronometro';
import type { SesionCronometro } from '@/lib/tipos';
import { Boton } from './boton';

interface Props {
  sesion: SesionCronometro;
  /** Recalculado contra el reloj real. `null` = sesión sin límite. */
  restantesSeg: number | null;
  /** `true` si algún ítem guardado ya no existe en el banco publicado. */
  reconstruible: boolean;
  onContinuar: () => void;
  onEmpezarDeNuevo: () => void;
}

export function DialogoReanudar({
  sesion,
  restantesSeg,
  reconstruible,
  onContinuar,
  onEmpezarDeNuevo,
}: Props) {
  const { respondidas, sinResponder } = resumirNavegacion(sesion);
  const sinTiempo = restantesSeg !== null && restantesSeg <= 0;

  return (
    <section
      aria-labelledby="titulo-reanudar"
      className="space-y-4 rounded-lg border border-border bg-card p-4 shadow-sm sm:p-6"
    >
      <h2 id="titulo-reanudar">Tienes un simulacro a medias</h2>

      <p className="text-muted-foreground">
        Dejaste {respondidas} de {sesion.itemIds.length}{' '}
        {sesion.itemIds.length === 1 ? 'ítem respondido' : 'ítems respondidos'}
        {sinResponder > 0 ? ` y ${sinResponder} sin responder` : ''}.
      </p>

      {restantesSeg !== null ? (
        <p className={sinTiempo ? 'font-medium text-destructive' : 'text-muted-foreground'}>
          {sinTiempo ? (
            <>
              El tiempo de ese intento ya se acabó. El cronómetro corre desde que lo empezaste,
              también con la pestaña cerrada: si continúas, se cierra y se califica con lo que
              alcanzaste a responder.
            </>
          ) : (
            <>
              Te quedan{' '}
              <span className="font-mono font-semibold tabular-nums text-foreground">
                {formatearDuracion(restantesSeg)}
              </span>{' '}
              de tiempo real. El cronómetro no se detuvo mientras la pestaña estaba cerrada.
            </>
          )}
        </p>
      ) : null}

      {!reconstruible ? (
        <p className="flex items-start gap-2 rounded-md border-l-4 border-aviso bg-aviso/10 p-3 text-[0.8125rem] leading-[1.45]">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-aviso" aria-hidden="true" />
          {/* Reconstruir la tanda a medias daría un examen distinto del que el
              usuario respondió, y lo calificaría como si fuera el mismo. Antes
              que eso, se dice la verdad y se descarta. */}
          Algunas preguntas de ese intento ya no están publicadas, así que no se puede reconstruir
          tal como lo dejaste. Solo se puede empezar uno nuevo.
        </p>
      ) : null}

      <div className="flex flex-col gap-2 sm:flex-row">
        {reconstruible ? (
          <Boton onClick={onContinuar} className="min-h-[52px] flex-1 text-[0.9375rem]">
            <Play className="size-4" aria-hidden="true" />
            Continuar donde iba
          </Boton>
        ) : null}
        <Boton
          onClick={onEmpezarDeNuevo}
          variante={reconstruible ? 'contorno' : 'principal'}
          className="min-h-[52px] flex-1 text-[0.9375rem]"
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          Empezar uno nuevo
        </Boton>
      </div>

      <p className="text-[0.8125rem] leading-[1.45] text-muted-foreground">
        Empezar uno nuevo descarta lo que llevabas y no se puede deshacer.
      </p>
    </section>
  );
}
