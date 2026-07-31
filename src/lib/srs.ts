// src/lib/srs.ts
// SM-2 simplificado, calidad binaria (acertó / falló).
// Funciones puras: reciben `hoy` en formato 'YYYY-MM-DD'.

import { diasEntre, soloFecha, sumarDias } from './fechas';
import type { TarjetaSRS } from './tipos';

export const FACILIDAD_INICIAL = 2.5;
export const FACILIDAD_MIN = 1.3;
export const FACILIDAD_MAX = 2.8;
export const LIMITE_COLA_DIARIA = 30;

/**
 * Techo del intervalo, en días (100 años). No es una decisión pedagógica:
 * con la facilidad en el máximo el intervalo crece exponencialmente y hacia
 * la 18.ª repetición `sumarDias` construye un Date fuera de rango, con dos
 * consecuencias — `toISOString()` lanza RangeError dentro de un handler, y
 * justo antes emite años expandidos ('+112632-03') que `esqTarjetaSRS`
 * rechaza, mandando TODO el progreso del usuario a cuarentena. Una tarjeta
 * programada a 100 años ya está retirada de hecho: el tope no cambia ningún
 * comportamiento alcanzable estudiando.
 */
export const MAX_INTERVALO_DIAS = 36_500;

export function crearTarjetaSRS(id: string, hoy: string): TarjetaSRS {
  return {
    id,
    facilidad: FACILIDAD_INICIAL,
    intervaloDias: 0,
    repeticiones: 0,
    // `soloFecha` es la única guarda del formato: es el único punto del motor
    // que escribe `hoy` tal cual (el resto pasa por `sumarDias`, que ya
    // recorta). Un handler que pase un ISO completo escribiría una fecha que
    // `esqTarjetaSRS` rechaza y que además nunca volvería a entrar en la cola,
    // porque `colaDelDia` compara como string.
    proximaRevision: soloFecha(hoy),
  };
}

/**
 * Calcula el siguiente estado de una tarjeta tras una respuesta.
 *
 *  Falla   → repeticiones = 0, intervalo = 1 día, EF = max(1.3, EF − 0.2)
 *  Acierta → repeticiones++, EF = min(2.8, EF + 0.1)
 *            intervalo: 1 (1.ª) · 3 (2.ª) · redondear(intervalo × EF) (3.ª+)
 */
export function programarSiguiente(
  tarjeta: TarjetaSRS,
  acerto: boolean,
  hoy: string,
): TarjetaSRS {
  if (!acerto) {
    return {
      ...tarjeta,
      repeticiones: 0,
      intervaloDias: 1,
      facilidad: Math.max(FACILIDAD_MIN, redondear2(tarjeta.facilidad - 0.2)),
      proximaRevision: sumarDias(hoy, 1),
    };
  }

  const repeticiones = tarjeta.repeticiones + 1;
  const facilidad = Math.min(FACILIDAD_MAX, redondear2(tarjeta.facilidad + 0.1));
  const intervaloDias =
    repeticiones === 1
      ? 1
      : repeticiones === 2
        ? 3
        : // Suelo de 1 día y techo de MAX_INTERVALO_DIAS. El suelo importa
          // porque `esqTarjetaSRS` admite intervaloDias 0 con repeticiones
          // altas: un respaldo así se multiplicaría por 0 y dejaría la
          // tarjeta venciendo hoy para siempre, sin drenar nunca la cola.
          Math.min(MAX_INTERVALO_DIAS, Math.max(1, Math.round(tarjeta.intervaloDias * facilidad)));

  return {
    ...tarjeta,
    repeticiones,
    facilidad,
    intervaloDias,
    proximaRevision: sumarDias(hoy, intervaloDias),
  };
}

function redondear2(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Registra el resultado de una revisión sobre la cola completa. */
export function registrarRevision(
  cola: Record<string, TarjetaSRS>,
  id: string,
  acerto: boolean,
  hoy: string,
): Record<string, TarjetaSRS> {
  const actual = cola[id] ?? crearTarjetaSRS(id, hoy);
  return { ...cola, [id]: programarSiguiente(actual, acerto, hoy) };
}

/**
 * Encola elementos nuevos. Se llama con:
 *  - toda tarjeta vista en la etapa Tarjetas
 *  - todo ítem fallado en práctica, quiz o simulacro
 * Si el elemento ya está en la cola no se toca (no se reinicia su progreso).
 */
export function encolar(
  cola: Record<string, TarjetaSRS>,
  ids: readonly string[],
  hoy: string,
): Record<string, TarjetaSRS> {
  const siguiente = { ...cola };
  for (const id of ids) {
    if (!siguiente[id]) siguiente[id] = crearTarjetaSRS(id, hoy);
  }
  return siguiente;
}

/**
 * Cola del día: vencidas y de hoy, priorizando las más atrasadas.
 * Máximo LIMITE_COLA_DIARIA elementos. Orden determinista (desempate por id).
 */
export function colaDelDia(
  cola: Record<string, TarjetaSRS>,
  hoy: string,
  limite: number = LIMITE_COLA_DIARIA,
): TarjetaSRS[] {
  return Object.values(cola)
    .filter((t) => t.proximaRevision <= hoy)
    .sort((a, b) => {
      const atrasoA = diasEntre(a.proximaRevision, hoy);
      const atrasoB = diasEntre(b.proximaRevision, hoy);
      return atrasoB - atrasoA || a.id.localeCompare(b.id);
    })
    .slice(0, limite);
}

export interface ResumenRepaso {
  pendientesHoy: number;
  totalEnCola: number;
  /** Días hasta el próximo repaso cuando hoy no hay nada. null si la cola está vacía. */
  proximoEnDias: number | null;
}

export function resumirRepaso(cola: Record<string, TarjetaSRS>, hoy: string): ResumenRepaso {
  const todas = Object.values(cola);
  const pendientes = todas.filter((t) => t.proximaRevision <= hoy);
  const futuras = todas
    .filter((t) => t.proximaRevision > hoy)
    .map((t) => diasEntre(hoy, t.proximaRevision))
    .sort((a, b) => a - b);

  return {
    pendientesHoy: pendientes.length,
    totalEnCola: todas.length,
    proximoEnDias: futuras.length > 0 ? futuras[0] : null,
  };
}
