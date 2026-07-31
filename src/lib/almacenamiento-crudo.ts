// src/lib/almacenamiento-crudo.ts
// El acceso de bajo nivel a `localStorage`, y las claves. Sin directiva de
// cliente: módulo neutro con guardas de SSR.
//
// ══════════════════════════════════════════════════════════════════════════
// POR QUÉ EXISTE ESTE ARCHIVO — ADR-021
// ══════════════════════════════════════════════════════════════════════════
//
// No relaja §22 regla 4 («todo acceso a localStorage pasa por
// `lib/almacenamiento`»): **nadie fuera de `src/lib/` importa esto**. Los
// componentes siguen llamando a `almacenamiento.ts` y a `sesion-activa.ts`. Lo
// que hace es permitir que un consumidor que solo necesita saber SI hay una
// sesión no arrastre el validador de Zod.
//
// El detonante fue medible: `OcultaEnSimulacro` vive en `Shell`, así que desde
// el Paso 11 el grafo del **layout raíz** —todas las rutas, incluida la
// portada— incluía `almacenamiento.ts` entero, y con él Zod y `esqEstadoProgreso`.
// Ese peso lo pagaba una app que debe cargar en menos de 3 s en 4G (§3).
//
// El estado degradado (`memoria`, `localStorageUsable`) vive aquí y es
// **compartido**, que es justo lo que hay que preservar: si `sesion-activa.ts`
// tuviera su propia copia, una escritura fallida por disco lleno degradaría un
// módulo y no el otro, y volveríamos al defecto de ADR-008 por otra puerta.

export const CLAVE_ESTADO = 'idoneo2210:estado';
export const CLAVE_SESION = 'idoneo2210:sesion';
/** [ADR-008] Tercera clave: el payload que no se pudo leer, apartado. */
export const CLAVE_ILEGIBLE = 'idoneo2210:estado-ilegible';

/* ─── Acceso crudo con degradación elegante ───────────────────────── */

/** Respaldo en memoria: modo incógnito de Safari lanza al escribir. */
const memoria = new Map<string, string>();
let localStorageUsable: boolean | null = null;

export function hayLocalStorage(): boolean {
  if (typeof window === 'undefined') return false;
  if (localStorageUsable !== null) return localStorageUsable;
  try {
    const prueba = '__idoneo_prueba__';
    window.localStorage.setItem(prueba, '1');
    window.localStorage.removeItem(prueba);
    localStorageUsable = true;
  } catch {
    localStorageUsable = false;
  }
  return localStorageUsable;
}

export function leerCrudo(clave: string): string | null {
  if (typeof window === 'undefined') return null;
  if (!hayLocalStorage()) return memoria.get(clave) ?? null;
  try {
    return window.localStorage.getItem(clave);
  } catch {
    return memoria.get(clave) ?? null;
  }
}

export function escribirCrudo(clave: string, valor: string): void {
  if (typeof window === 'undefined') return;
  memoria.set(clave, valor);
  if (!hayLocalStorage()) return;
  try {
    window.localStorage.setItem(clave, valor);
  } catch (error) {
    // [ADR-008] QuotaExceededError: la sonda de 1 byte de hayLocalStorage()
    // pasa con el disco casi lleno, así que sin esta línea `localStorageUsable`
    // se quedaría en true y `leerCrudo` seguiría leyendo de localStorage,
    // devolviendo el valor VIEJO y pisando en silencio lo que sí está en
    // memoria. En un simulacro eso es reanudar perdiendo respuestas.
    // Se degrada a memoria para el resto de la sesión; el precio es perder la
    // sincronización entre pestañas, que con el disco lleno ya estaba roto.
    localStorageUsable = false;
    console.warn('[almacenamiento] no se pudo escribir en localStorage:', error);
  }
}

export function borrarCrudo(clave: string): void {
  memoria.delete(clave);
  if (typeof window === 'undefined' || !hayLocalStorage()) return;
  try {
    window.localStorage.removeItem(clave);
  } catch {
    /* sin acción */
  }
}
