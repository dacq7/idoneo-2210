// src/lib/sesion-activa.ts
// «¿Hay un simulacro cronometrado en curso?», y el canal para enterarse cuando
// eso cambie. Sin directiva de cliente: módulo neutro con guardas de SSR.
//
// ══════════════════════════════════════════════════════════════════════════
// POR QUÉ ESTÁ SEPARADO DE `almacenamiento.ts` — ADR-021
// ══════════════════════════════════════════════════════════════════════════
//
// Su único consumidor de UI es `OcultaEnSimulacro`, que vive en `Shell` y por
// tanto en el **layout raíz**: lo que este archivo importe lo descarga el
// usuario en TODAS las rutas, incluida la portada. `almacenamiento.ts` importa
// Zod —legítimamente, para validar el progreso al leerlo— y arrastrarlo hasta
// aquí costaba ~13 kB gz por primera carga a cambio de responder un booleano.
//
// Así que este archivo **no importa Zod ni los esquemas**. Lee la clave en
// crudo y solo comprueba si existe. La lectura validada —`leerSesion()`, que
// necesita el esquema— se queda en `almacenamiento.ts`, que solo entra en el
// bundle de las rutas que de verdad manejan una sesión.
//
// Los canales de estado y de sesión están separados a propósito, igual que sus
// claves: durante un simulacro la sesión se escribe una vez por respuesta, y si
// fueran uno solo cada respuesta despertaría a todo componente suscrito al
// progreso —el resumen de la portada, la racha, las etapas— sin que nada suyo
// haya cambiado.

import { CLAVE_SESION, leerCrudo } from './almacenamiento-crudo';

const oyentes = new Set<() => void>();

/** La llaman `guardarSesion` y `borrarSesion` desde `almacenamiento.ts`. */
export function notificarSesion(): void {
  for (const oyente of oyentes) oyente();
}

export function suscribirSesion(oyente: () => void): () => void {
  oyentes.add(oyente);
  const alCambiarStorage = (e: StorageEvent) => {
    if (e.key === CLAVE_SESION) notificarSesion();
  };
  if (typeof window !== 'undefined') window.addEventListener('storage', alCambiarStorage);
  return () => {
    oyentes.delete(oyente);
    if (typeof window !== 'undefined') window.removeEventListener('storage', alCambiarStorage);
  };
}

/**
 * Snapshot **estable** para `useSyncExternalStore`: devuelve un booleano, no el
 * objeto. Devolver la sesión parseada metería a React en un bucle infinito de
 * renders, porque `JSON.parse` produce una referencia nueva en cada lectura y el
 * hook compara por identidad. Es el mismo motivo por el que `obtenerSnapshot`
 * cachea su `snapshot`.
 *
 * Se lee en crudo, sin `leerSesion()`: esta función SÍ se ejecuta durante el
 * render y `leerSesion` no es libre de efectos —se autolimpia si el payload es
 * ilegible—.
 */
export function haySesionEnCurso(): boolean {
  return leerCrudo(CLAVE_SESION) !== null;
}

export function haySesionEnCursoServidor(): false {
  return false;
}
