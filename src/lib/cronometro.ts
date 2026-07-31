// src/lib/cronometro.ts
// Lógica pura del cronómetro. SIN "use client" y SIN Date.now():
// el tiempo actual entra siempre como parámetro `ahoraMs`.
//
// ══ POR QUÉ ESTE ARCHIVO NO ES §7.4 LITERAL ══
//
// Es la quinta vez que un archivo de `src/lib/` del blueprint necesita el mismo
// par de arreglos —normalizar la entrada y acotar la salida— tras ADR-003 (§5),
// ADR-005 (§8), ADR-015 (§7.3) y ADR-017 (§7.2). `PENDIENTES.md` lo anticipó
// para este paso con esas palabras, y el cronómetro tiene las dos superficies:
// recibe `ahoraMs` de fuera y `SesionCronometro` de `localStorage`.
//
// El defecto concreto que esto cierra, y por qué es el peor posible aquí:
// `restantes()` de §7.4 devuelve `NaN` si `duracionSegundos` o `iniciadoEnMs`
// vienen corruptos, y **`NaN <= 0` es `false`**, así que `seAcabo()` responde
// «todavía no» PARA SIEMPRE. Un simulacro final con la duración corrupta nunca
// se auto-envía: el usuario ve `--:--`, se queda sin cronómetro y su intento no
// se cierra nunca. Ver ADR-019.
//
// La primera línea de defensa es `esqSesionCronometro` (`src/lib/esquemas.ts`),
// que rechaza el payload al leerlo. Esta es la segunda, y no sobra: la sesión
// también se construye en memoria, y un `duracionSegundos` calculado a partir de
// un `blueprint.minutos` inesperado no pasa por Zod.

import type { SesionCronometro } from './tipos';

/** Avisos en segundos restantes: 20 min, 10 min, 2 min. Brief §6.3. */
export const UMBRALES_AVISO = [1200, 600, 120] as const;
export type UmbralAviso = (typeof UMBRALES_AVISO)[number];

export const TEXTO_AVISO: Record<UmbralAviso, string> = {
  1200: 'Quedan 20 minutos.',
  600: 'Quedan 10 minutos. Prioriza los ítems sin responder.',
  120: 'Últimos 2 minutos. Se enviará automáticamente al llegar a cero.',
};

/** `true` si el valor sirve para hacer aritmética de tiempo. */
function esNumeroUsable(valor: unknown): valor is number {
  return typeof valor === 'number' && Number.isFinite(valor);
}

/**
 * Segundos transcurridos desde el inicio, según el reloj real.
 *
 * Devuelve 0 —y no `NaN`— ante una sesión con `iniciadoEnMs` corrupto o un
 * `ahoraMs` no finito. Es la lectura conservadora correcta: si no se puede saber
 * cuánto ha pasado, no se le descuenta tiempo al usuario.
 */
export function transcurridos(sesion: SesionCronometro, ahoraMs: number): number {
  if (!esNumeroUsable(ahoraMs) || !esNumeroUsable(sesion.iniciadoEnMs)) return 0;
  return Math.max(0, Math.floor((ahoraMs - sesion.iniciadoEnMs) / 1000));
}

/**
 * Segundos restantes. `null` si la sesión no tiene límite (quiz de módulo).
 *
 * Se recalcula SIEMPRE contra el reloj real, nunca contra un contador en
 * memoria: cerrar la pestaña no regala tiempo. Ese es el invariante del paso.
 *
 * Una `duracionSegundos` no finita se trata como **sesión agotada** (0), no como
 * sesión sin límite: degradar a `null` convertiría un simulacro cronometrado en
 * uno eterno, que es exactamente el fallo que este archivo existe para impedir.
 */
export function restantes(sesion: SesionCronometro, ahoraMs: number): number | null {
  if (sesion.duracionSegundos === null) return null;
  if (!esNumeroUsable(sesion.duracionSegundos)) return 0;
  return Math.max(0, sesion.duracionSegundos - transcurridos(sesion, ahoraMs));
}

export function seAcabo(sesion: SesionCronometro, ahoraMs: number): boolean {
  const r = restantes(sesion, ahoraMs);
  return r !== null && r <= 0;
}

/**
 * `false` si la sesión dice haber empezado **en el futuro**.
 *
 * Es el hueco que dejó ADR-019 y que el `code-reviewer` midió: `transcurridos()`
 * acota con `Math.max(0, …)`, así que un `iniciadoEnMs` posterior a `ahoraMs` se
 * lee como «no ha pasado nada» y `seAcabo()` devuelve `false` **indefinidamente**
 * — el mismo simulacro que no termina nunca que ADR-019 existe para impedir,
 * por otra puerta.
 *
 * No es solo un vector de trampa. El caso real es un Android de gama media que
 * arranca con el reloj desincronizado: escribe un `iniciadoEnMs` futuro y,
 * cuando NTP lo corrige hacia atrás, ese intento ya no se auto-envía jamás.
 *
 * **Por qué esto no puede vivir en `esqSesionCronometro`:** «futuro» depende del
 * reloj, y un esquema de Zod es puro y no lo conoce. La comprobación va donde
 * ya se lee el reloj — la reanudación—, y ahí una sesión incoherente se trata
 * como no reconstruible, igual que una a la que le faltan ítems.
 *
 * Se tolera 1 minuto de desfase: el reloj del dispositivo y el instante de
 * escritura no tienen por qué coincidir al milisegundo, y descartar una sesión
 * legítima por 200 ms de deriva sería peor que el fallo que se está evitando.
 */
export const TOLERANCIA_INICIO_FUTURO_MS = 60_000;

export function inicioCoherente(sesion: SesionCronometro, ahoraMs: number): boolean {
  if (!esNumeroUsable(ahoraMs) || !esNumeroUsable(sesion.iniciadoEnMs)) return false;
  return sesion.iniciadoEnMs - ahoraMs <= TOLERANCIA_INICIO_FUTURO_MS;
}

/**
 * Avisos que deben mostrarse ahora y aún no se mostraron.
 *
 * Devuelve el umbral **más pequeño** cruzado: si el usuario vuelve tras 15 min
 * de ausencia no se le apilan tres notificaciones, se le muestra la relevante.
 */
export function avisoPendiente(sesion: SesionCronometro, ahoraMs: number): UmbralAviso | null {
  const r = restantes(sesion, ahoraMs);
  if (r === null || r <= 0) return null;
  const vistos = new Set(sesion.avisosVistos);
  const cruzados = UMBRALES_AVISO.filter((u) => r <= u && !vistos.has(u));
  return cruzados.length > 0 ? cruzados[cruzados.length - 1] : null;
}

/**
 * Marca un umbral como visto, **y también los mayores**: si mostramos el de
 * 10 min, el de 20 ya no tiene sentido.
 *
 * La salida se acota a los tres umbrales conocidos. Sin eso, un `avisosVistos`
 * heredado de un respaldo raro (`[999]`) crecería sin control en cada escritura
 * y se llevaría bytes de la cuota de `localStorage` en la ruta que más escribe
 * de toda la app: una vez por respuesta durante 120 minutos.
 */
export function marcarAvisoVisto(sesion: SesionCronometro, umbral: UmbralAviso): SesionCronometro {
  const aMarcar = UMBRALES_AVISO.filter((u) => u >= umbral);
  const vistos = new Set([...sesion.avisosVistos, ...aMarcar]);
  return {
    ...sesion,
    // El orden es el de UMBRALES_AVISO, no el de inserción: hace que dos
    // sesiones con los mismos avisos serialicen igual.
    avisosVistos: UMBRALES_AVISO.filter((u) => vistos.has(u)),
  };
}

/** 'normal' | 'atencion' (≤10 min) | 'critico' (≤2 min). Dirige el color. */
export type SeveridadCronometro = 'normal' | 'atencion' | 'critico';

export function severidad(restantesSeg: number | null): SeveridadCronometro {
  if (restantesSeg === null || !esNumeroUsable(restantesSeg)) return 'normal';
  if (restantesSeg <= 120) return 'critico';
  if (restantesSeg <= 600) return 'atencion';
  return 'normal';
}

export interface ResumenNavegacion {
  respondidas: number;
  marcadas: number;
  sinResponder: number;
}

export function resumirNavegacion(sesion: SesionCronometro): ResumenNavegacion {
  let respondidas = 0;
  let marcadas = 0;
  for (const id of sesion.itemIds) {
    const r = sesion.respuestas[id];
    if (r && r.valor !== null && r.valor !== undefined) respondidas += 1;
    if (r?.marcada) marcadas += 1;
  }
  return { respondidas, marcadas, sinResponder: sesion.itemIds.length - respondidas };
}

export type EstadoItemNav = 'sin-responder' | 'respondida' | 'marcada';

export function estadoItem(sesion: SesionCronometro, itemId: string): EstadoItemNav {
  const r = sesion.respuestas[itemId];
  if (r?.marcada) return 'marcada';
  if (r && r.valor !== null && r.valor !== undefined) return 'respondida';
  return 'sin-responder';
}
