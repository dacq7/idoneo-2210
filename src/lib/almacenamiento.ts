// src/lib/almacenamiento.ts
// Único punto de acceso a localStorage. Ver §22, regla 4.
// sin directiva de cliente: módulo neutro con guardas de SSR.
//
// Desviaciones de §6, ambas para cumplir §22 regla 12 ("Nunca destruir el
// progreso del usuario"):
//   · ADR-008 — cuarentena del estado ilegible antes de sobrescribirlo.
//   · ADR-008 — `escribirCrudo` degrada a memoria cuando la escritura falla.
// Van marcadas con [ADR-008].

// [ADR-021] Del archivo de progreso, NO de `./esquemas`: importar el barril
// metería los siete esquemas de ítem —y tarjetas, glosario y datos duros— en el
// bundle del navegador, donde no los usa nadie. Y desde este paso
// `almacenamiento.ts` está en el grafo del layout raíz, así que ese peso lo
// pagarían TODAS las rutas.
import { esqEstadoProgreso, esqSesionCronometro } from './esquemas-progreso';
// [ADR-021] El acceso crudo y el canal de la sesión viven aparte para que un
// consumidor que solo pregunta «¿hay simulacro en curso?» no arrastre Zod.
import {
  borrarCrudo,
  CLAVE_ESTADO,
  CLAVE_ILEGIBLE,
  CLAVE_INSTALAR,
  CLAVE_SESION,
  escribirCrudo,
  hayLocalStorage,
  leerCrudo,
} from './almacenamiento-crudo';
import { soloFecha } from './fechas';
import { notificarSesion } from './sesion-activa';
import type {
  EstadoModulo,
  EstadoProgreso,
  IntentoSimulacro,
  SesionCronometro,
  TarjetaSRS,
} from './tipos';

export const VERSION_ESQUEMA = 1 as const;

/** Máximo de intentos que se conservan. FIFO: se descartan los más viejos. */
const MAX_INTENTOS = 30;

/* ─── Estado inicial y migraciones ────────────────────────────────── */

export function crearEstadoInicial(ahoraISO: string): EstadoProgreso {
  return {
    version: VERSION_ESQUEMA,
    creadoEn: ahoraISO,
    diagnosticoHecho: false,
    modulos: {},
    colaRepaso: {},
    intentos: [],
    racha: { dias: 0, ultimoDiaActivo: '' },
    preferencias: { tema: 'sistema', sonido: true, ultimoRespaldo: null },
  };
}

export function estadoModuloInicial(): EstadoModulo {
  return {
    teoriaLeida: false,
    tarjetasVistas: 0,
    practicaCompletada: false,
    mejorQuiz: null,
    intentosQuiz: 0,
    dominado: false,
    ultimaVisita: null,
  };
}

/**
 * Convierte un objeto de cualquier versión anterior al esquema actual.
 * Devuelve null si el dato es irrecuperable — NO crea un estado nuevo, porque
 * esta función se llama desde el snapshot de React y no puede leer el reloj.
 * Cuando se cree la versión 2, se añade aquí un bloque `if (v.version === 1)`.
 * NUNCA borrar el progreso del usuario por un cambio de esquema: lo que no se
 * puede migrar se aparta con apartarIlegible(), no se descarta.
 */
export function intentarMigrar(bruto: unknown): EstadoProgreso | null {
  if (!bruto || typeof bruto !== 'object') return null;
  const candidato = bruto as Partial<EstadoProgreso>;

  // Sin versión = pre-lanzamiento. Se descarta.
  if (typeof candidato.version !== 'number') return null;

  // [ADR-008] Un estado de una versión más nueva no se "migra hacia abajo":
  // se aparta intacto. Hoy es la única versión, así que esto protege del futuro.
  if (candidato.version > VERSION_ESQUEMA) return null;

  // if (candidato.version === 1) { ...transformar a 2...; }

  const validado = esqEstadoProgreso.safeParse(candidato);
  if (!validado.success) {
    console.warn('[almacenamiento] estado corrupto, se reinicia:', validado.error.issues);
    return null;
  }
  return validado.data as EstadoProgreso;
}

/** Versión con respaldo. Solo se llama desde efectos y handlers, nunca en render. */
export function migrar(bruto: unknown, ahoraISO: string): EstadoProgreso {
  return intentarMigrar(bruto) ?? crearEstadoInicial(ahoraISO);
}

/* ─── [ADR-008] Cuarentena del estado ilegible ────────────────────── */

export type MotivoIlegible = 'no-json' | 'sin-version' | 'version-futura' | 'invalido';

export interface EstadoIlegible {
  motivo: MotivoIlegible;
  /** ISO del momento en que se apartó. */
  guardadoEn: string;
  /** El texto original, byte a byte. Es lo único que puede salvar el progreso. */
  payload: string;
}

/** Por qué un payload no se pudo leer. null = se leyó bien. Sin efectos. */
function clasificarIlegible(crudo: string): MotivoIlegible | null {
  let bruto: unknown;
  try {
    bruto = JSON.parse(crudo);
  } catch {
    return 'no-json';
  }
  if (!bruto || typeof bruto !== 'object') return 'no-json';
  const candidato = bruto as Partial<EstadoProgreso>;
  if (typeof candidato.version !== 'number') return 'sin-version';
  if (candidato.version > VERSION_ESQUEMA) return 'version-futura';
  return esqEstadoProgreso.safeParse(candidato).success ? null : 'invalido';
}

/**
 * Aparta el estado guardado si no se puede leer, ANTES de sobrescribirlo.
 * No restaura el progreso —un payload que no parsea es irrecuperable en el caso
 * general— pero lo deja inspeccionable, exportable y recuperable a mano, en vez
 * de silenciosamente perdido. Se llama desde `leerEstado`, que es camino de
 * efecto o handler: NUNCA desde `obtenerSnapshot`, que corre en render (§22 regla 6).
 */
export function apartarIlegible(ahoraISO: string): EstadoIlegible | null {
  const crudo = leerCrudo(CLAVE_ESTADO);
  if (!crudo) return null;

  // La primera cuarentena gana: un fallo posterior no debe pisar el payload
  // bueno que ya estaba apartado.
  const ya = leerIlegible();
  if (ya) return ya;

  const motivo = clasificarIlegible(crudo);
  if (!motivo) return null;

  const registro: EstadoIlegible = { motivo, guardadoEn: ahoraISO, payload: crudo };
  escribirCrudo(CLAVE_ILEGIBLE, JSON.stringify(registro));
  return registro;
}

export function leerIlegible(): EstadoIlegible | null {
  const crudo = leerCrudo(CLAVE_ILEGIBLE);
  if (!crudo) return null;
  try {
    return JSON.parse(crudo) as EstadoIlegible;
  } catch {
    borrarCrudo(CLAVE_ILEGIBLE);
    return null;
  }
}

export function descartarIlegible(): void {
  borrarCrudo(CLAVE_ILEGIBLE);
}

/* ─── Snapshot cacheado + suscripción (para useSyncExternalStore) ─── */

let snapshot: EstadoProgreso | null = null;
const oyentes = new Set<() => void>();

function notificar(): void {
  for (const oyente of oyentes) oyente();
}

export function suscribir(oyente: () => void): () => void {
  oyentes.add(oyente);
  // Sincroniza entre pestañas del mismo navegador.
  const alCambiarStorage = (e: StorageEvent) => {
    if (e.key === CLAVE_ESTADO) {
      snapshot = null;
      notificar();
    }
  };
  if (typeof window !== 'undefined') window.addEventListener('storage', alCambiarStorage);
  return () => {
    oyentes.delete(oyente);
    if (typeof window !== 'undefined') window.removeEventListener('storage', alCambiarStorage);
  };
}

/** Snapshot estable: devuelve SIEMPRE la misma referencia hasta que hay escritura.
 *  Sin esto, useSyncExternalStore entra en bucle infinito de renders.
 *  No lee el reloj: se ejecuta durante el render. Ver §22, regla 6. */
export function obtenerSnapshot(): EstadoProgreso | null {
  if (snapshot) return snapshot;
  const crudo = leerCrudo(CLAVE_ESTADO);
  if (!crudo) return null;
  try {
    snapshot = intentarMigrar(JSON.parse(crudo));
    return snapshot;
  } catch {
    return null;
  }
}

/** Snapshot del servidor: siempre null. Provoca que el primer render (server y
 *  cliente) sea idéntico y el estado real llegue en el render siguiente. */
export function obtenerSnapshotServidor(): null {
  return null;
}

/* ─── API pública ─────────────────────────────────────────────────── */

/** Lee el estado; si no existe, lo crea y lo persiste. Solo desde cliente. */
export function leerEstado(ahoraISO: string): EstadoProgreso {
  const actual = obtenerSnapshot();
  if (actual) return actual;
  // [ADR-008] Antes de pisar la clave, se aparta lo que hubiera y no se pudo leer.
  apartarIlegible(ahoraISO);
  const nuevo = crearEstadoInicial(ahoraISO);
  guardarEstado(nuevo);
  return nuevo;
}

export function guardarEstado(estado: EstadoProgreso): void {
  snapshot = estado;
  escribirCrudo(CLAVE_ESTADO, JSON.stringify(estado));
  notificar();
}

/**
 * Único mutador. Recibe el estado actual y devuelve el nuevo.
 * SIEMPRE devuelve un objeto nuevo (inmutable) para que React detecte el cambio.
 */
export function actualizarEstado(
  ahoraISO: string,
  transformar: (estado: EstadoProgreso) => EstadoProgreso,
): EstadoProgreso {
  const siguiente = transformar(leerEstado(ahoraISO));
  guardarEstado(siguiente);
  return siguiente;
}

export function reiniciarTodo(): void {
  borrarCrudo(CLAVE_ESTADO);
  borrarCrudo(CLAVE_SESION);
  // "Reiniciar todo con doble confirmación" incluye la cuarentena.
  borrarCrudo(CLAVE_ILEGIBLE);
  snapshot = null;
  notificar();
}

/* ─── Mutadores de dominio ────────────────────────────────────────── */

function conModulo(
  estado: EstadoProgreso,
  slug: string,
  ahoraISO: string,
  cambio: (m: EstadoModulo) => EstadoModulo,
): EstadoProgreso {
  const actual = estado.modulos[slug] ?? estadoModuloInicial();
  const siguiente = { ...cambio(actual), ultimaVisita: ahoraISO };
  return { ...estado, modulos: { ...estado.modulos, [slug]: siguiente } };
}

export function marcarTeoriaLeida(slug: string, ahoraISO: string): void {
  actualizarEstado(ahoraISO, (e) =>
    conModulo(e, slug, ahoraISO, (m) => ({ ...m, teoriaLeida: true })),
  );
}

export function registrarTarjetasVistas(slug: string, cantidad: number, ahoraISO: string): void {
  actualizarEstado(ahoraISO, (e) =>
    conModulo(e, slug, ahoraISO, (m) => ({
      ...m,
      tarjetasVistas: Math.max(m.tarjetasVistas, cantidad),
    })),
  );
}

export function marcarPracticaCompletada(slug: string, ahoraISO: string): void {
  actualizarEstado(ahoraISO, (e) =>
    conModulo(e, slug, ahoraISO, (m) => ({ ...m, practicaCompletada: true })),
  );
}

/** Umbral de dominio: 80 %. Definido en §3.2 del documento de contenido. */
export const UMBRAL_DOMINIO = 80;

export function registrarQuiz(slug: string, puntaje: number, ahoraISO: string): void {
  actualizarEstado(ahoraISO, (e) =>
    conModulo(e, slug, ahoraISO, (m) => {
      const mejor = m.mejorQuiz === null ? puntaje : Math.max(m.mejorQuiz, puntaje);
      return {
        ...m,
        mejorQuiz: mejor,
        intentosQuiz: m.intentosQuiz + 1,
        dominado: mejor >= UMBRAL_DOMINIO,
      };
    }),
  );
}

export function guardarIntento(intento: IntentoSimulacro, ahoraISO: string): void {
  actualizarEstado(ahoraISO, (e) => ({
    ...e,
    diagnosticoHecho: e.diagnosticoHecho || intento.tipo === 'diagnostico',
    intentos: [intento, ...e.intentos].slice(0, MAX_INTENTOS),
  }));
}

export function obtenerIntento(estado: EstadoProgreso, id: string): IntentoSimulacro | null {
  return estado.intentos.find((i) => i.id === id) ?? null;
}

/** Reemplaza la cola de repaso completa. lib/srs.ts calcula el contenido. */
export function guardarColaRepaso(cola: Record<string, TarjetaSRS>, ahoraISO: string): void {
  actualizarEstado(ahoraISO, (e) => ({ ...e, colaRepaso: cola }));
}

export function guardarPreferencias(
  cambios: Partial<EstadoProgreso['preferencias']>,
  ahoraISO: string,
): void {
  actualizarEstado(ahoraISO, (e) => ({
    ...e,
    preferencias: { ...e.preferencias, ...cambios },
  }));
}

export function guardarDatosPersonales(
  cambios: { nombre?: string; fechaExamen?: string },
  ahoraISO: string,
): void {
  actualizarEstado(ahoraISO, (e) => ({ ...e, ...cambios }));
}

/**
 * Racha: +1 si el último día activo fue ayer, se mantiene si fue hoy,
 * se reinicia a 1 en cualquier otro caso. `hoy` en formato 'YYYY-MM-DD'.
 */
export function tocarRacha(hoy: string, ayer: string, ahoraISO: string): void {
  actualizarEstado(ahoraISO, (e) => {
    if (e.racha.ultimoDiaActivo === hoy) return e;
    const dias = e.racha.ultimoDiaActivo === ayer ? e.racha.dias + 1 : 1;
    return { ...e, racha: { dias, ultimoDiaActivo: hoy } };
  });
}

/* ─── Sesión cronometrada ─────────────────────────────────────────── */

/**
 * [ADR-019] §6 hacía `JSON.parse(crudo) as SesionCronometro` sin validar. El
 * cast es una promesa que nadie comprobaba: un payload sin `duracionSegundos`
 * dejaba `restantes()` en `NaN` y `seAcabo()` en `false` para siempre, con lo
 * que el simulacro no se auto-enviaba nunca. Ahora pasa por Zod.
 *
 * **No es libre de efectos**: se autolimpia si el payload es ilegible. Llamarla
 * desde un efecto o un handler, nunca en el cuerpo de un render.
 *
 * Una sesión ilegible **no va a cuarentena** (ADR-008), a diferencia del
 * progreso: lo que se pierde es un simulacro en curso que ya no se puede
 * reconstruir, no el historial del usuario, que vive en otra clave y no se toca.
 */
export function leerSesion(): SesionCronometro | null {
  const crudo = leerCrudo(CLAVE_SESION);
  if (!crudo) return null;
  let bruto: unknown;
  try {
    bruto = JSON.parse(crudo);
  } catch {
    borrarCrudo(CLAVE_SESION);
    notificarSesion();
    return null;
  }
  const validado = esqSesionCronometro.safeParse(bruto);
  if (!validado.success) {
    console.warn('[almacenamiento] sesión ilegible, se descarta:', validado.error.issues);
    borrarCrudo(CLAVE_SESION);
    notificarSesion();
    return null;
  }
  return validado.data as SesionCronometro;
}

export function guardarSesion(sesion: SesionCronometro): void {
  escribirCrudo(CLAVE_SESION, JSON.stringify(sesion));
  notificarSesion();
}

export function borrarSesion(): void {
  borrarCrudo(CLAVE_SESION);
  notificarSesion();
}

/* ─── Suscripción a la clave de sesión ────────────────────────────── */
//
// Implementadas en `sesion-activa.ts` (sin Zod) y re-exportadas aquí para que
// el resto del código siga teniendo un único sitio al que mirar. Ver ADR-021.
export { haySesionEnCurso, haySesionEnCursoServidor, suscribirSesion } from './sesion-activa';

/* ─── Exportar / importar ─────────────────────────────────────────── */

export function exportarJSON(estado: EstadoProgreso): string {
  return JSON.stringify(estado, null, 2);
}

export function nombreArchivoRespaldo(hoy: string): string {
  return `idoneo-2210-respaldo-${hoy}.json`;
}

export type ResultadoImportacion =
  | { ok: true; estado: EstadoProgreso }
  | { ok: false; error: string };

/**
 * Valida con Zod antes de tocar nada. Un archivo corrupto NUNCA debe
 * destruir el progreso actual: por eso devuelve un resultado en vez de escribir.
 */
export function importarJSON(texto: string): ResultadoImportacion {
  let bruto: unknown;
  try {
    bruto = JSON.parse(texto);
  } catch {
    return { ok: false, error: 'El archivo no es un JSON válido.' };
  }
  const validado = esqEstadoProgreso.safeParse(bruto);
  if (!validado.success) {
    const primero = validado.error.issues[0];
    return {
      ok: false,
      error: `El archivo no es un respaldo de Idóneo 2210 (${primero.path.join('.') || 'raíz'}: ${primero.message}).`,
    };
  }
  return { ok: true, estado: validado.data as EstadoProgreso };
}

/**
 * Recordatorio de respaldo cada 7 días de uso.
 *
 * ══ [ADR-030] LA VERSIÓN DE §6 TENÍA UN HUECO Y AQUÍ SE CIERRA ══
 * El blueprint miraba `racha.dias` cuando no había respaldo previo, y la racha
 * son días **consecutivos**: se reinicia a 1 en cuanto se salta uno. Un
 * entrenador que estudia tres noches por semana durante dos meses nunca llegaba
 * a 7 y **nunca veía el recordatorio**, que es justo el usuario que la app
 * describe en §1. El Paso 10 lo dejó documentado con un test y lo mandó aquí,
 * que es donde hay UI y contexto para decidirlo.
 *
 * La regla nueva es una sola y no depende de la constancia: **si hay progreso
 * que perder y hace 7 días o más del último respaldo —o del día en que empezaste,
 * si nunca hiciste uno— se avisa.**
 *
 * También cae la condición `racha.ultimoDiaActivo === hoy` de la segunda rama.
 * Existía para avisar solo en días de uso, y era contraproducente: la racha la
 * escribe la portada, así que entrar directo a /ajustes desde el pie dejaba el
 * aviso invisible el mismo día en que el usuario estaba mirando la pantalla del
 * respaldo. Quien lee /ajustes está usando la app, por definición.
 *
 * `hoy` desaparece de la firma porque ya no se usa: dejarlo sería mentir sobre
 * lo que la función necesita.
 */
export function necesitaRespaldo(estado: EstadoProgreso, hace7: string): boolean {
  // Sin intentos no hay nada que perder que no se recupere en cinco minutos.
  if (estado.intentos.length === 0) return false;
  const referencia = estado.preferencias.ultimoRespaldo ?? soloFecha(estado.creadoEn);
  return referencia <= hace7;
}

/* ─── [Paso 18.1] Aviso de instalación de la PWA ──────────────────── */

/** true si el usuario ya cerró el aviso en ESTE navegador. Sin efectos. */
export function avisoInstalarDescartado(): boolean {
  return leerCrudo(CLAVE_INSTALAR) === '1';
}

export function descartarAvisoInstalar(): void {
  escribirCrudo(CLAVE_INSTALAR, '1');
}

/* ─── [Paso 18.5] Salud del almacenamiento ────────────────────────── */

/**
 * true si `localStorage` NO está disponible y todo vive en el respaldo en
 * memoria: modo incógnito de Safari, disco lleno, permisos bloqueados.
 *
 * En ese estado la app funciona pero **el progreso no sobrevive a un recargue**,
 * y el usuario no tiene forma de saberlo si nadie se lo dice. `/ajustes` lo dice.
 *
 * NO es libre de efectos la primera vez que se llama: `hayLocalStorage()`
 * escribe y borra una sonda de 1 byte para averiguarlo. Llamarla desde un
 * efecto, nunca en render.
 */
export function almacenamientoDegradado(): boolean {
  if (typeof window === 'undefined') return false;
  return !hayLocalStorage();
}
