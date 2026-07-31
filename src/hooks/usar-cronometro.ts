'use client';

// src/hooks/usar-cronometro.ts — el ÚNICO lugar de la app donde se lee el reloj
// para el cronómetro. Se exporta como `useCronometro` y el archivo conserva su
// nombre en español (ADR-007).
//
// ══ POR QUÉ NO HAY UN CONTADOR EN MEMORIA ══
// Cada tick recalcula desde `sesion.iniciadoEnMs` contra el reloj real. Nunca
// «restar uno cada segundo»: los temporizadores se congelan cuando el navegador
// manda la pestaña a segundo plano —que en móvil ocurre al bloquear la
// pantalla—, así que un contador propio regalaría exactamente el tiempo que el
// usuario pasó fuera. De ahí también los listeners de `visibilitychange` y
// `focus`: al volver, la cifra se corrige de golpe.
//
// ══ EL PRIMER RENDER DEVUELVE null ══
// `restantesSeg` es `null` hasta el primer efecto. El componente pinta `--:--`.
// Sin eso, servidor y cliente renderizarían cifras distintas y Next lo señalaría
// como error de hidratación (§22 regla 6).

import { useEffect, useRef, useState } from 'react';
import { avisoPendiente, restantes, seAcabo, type UmbralAviso } from '@/lib/cronometro';
import type { SesionCronometro } from '@/lib/tipos';

interface Resultado {
  /** `null` durante el primer render y cuando la sesión no tiene límite. */
  restantesSeg: number | null;
  terminado: boolean;
  /** Umbral cruzado y aún no visto. El consumidor lo marca y persiste. */
  aviso: UmbralAviso | null;
}

export function useCronometro(
  sesion: SesionCronometro | null,
  alTerminar: () => void,
): Resultado {
  const [restantesSeg, setRestantes] = useState<number | null>(null);
  const [aviso, setAviso] = useState<UmbralAviso | null>(null);
  const [terminado, setTerminado] = useState(false);

  // El auto-envío tiene que dispararse UNA vez. `useRef` y no estado: entre el
  // `setTerminado(true)` y el re-render puede entrar otro tick, y la clausura
  // todavía vería el valor viejo. Es el mismo motivo por el que `terminar()` de
  // `useSesion` guarda su resumen en una ref.
  const yaEnvie = useRef(false);

  // `alTerminar` en una ref: si el consumidor pasa una función nueva en cada
  // render, tenerla como dependencia del efecto reinstalaría el intervalo cada
  // vez. El intervalo lee siempre la última versión sin volver a montarse.
  const refTerminar = useRef(alTerminar);
  useEffect(() => {
    refTerminar.current = alTerminar;
  }, [alTerminar]);

  useEffect(() => {
    if (sesion === null) return;

    const tick = () => {
      // Efecto: aquí SÍ se puede leer el reloj (§10.4).
      const ahora = Date.now();
      setRestantes(restantes(sesion, ahora));
      setAviso(avisoPendiente(sesion, ahora));
      if (seAcabo(sesion, ahora) && !yaEnvie.current) {
        yaEnvie.current = true;
        setTerminado(true);
        refTerminar.current();
      }
    };

    tick();
    const id = window.setInterval(tick, 1000);
    // Los timers se congelan en segundo plano: al volver hay que recalcular ya,
    // sin esperar al siguiente tick.
    const alVolver = () => tick();
    document.addEventListener('visibilitychange', alVolver);
    window.addEventListener('focus', alVolver);

    return () => {
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', alVolver);
      window.removeEventListener('focus', alVolver);
    };
  }, [sesion]);

  return { restantesSeg, terminado, aviso };
}
