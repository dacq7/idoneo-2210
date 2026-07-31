// src/lib/esquemas-progreso.ts
// Los esquemas de lo que el USUARIO produce: progreso, intentos, cola de repaso
// y sesión cronometrada. Sin "use client": lo importan el navegador (a través de
// `almacenamiento.ts`) y los tests.
//
// ══════════════════════════════════════════════════════════════════════════
// POR QUÉ ESTÁ SEPARADO DE `esquemas.ts` — ADR-021
// ══════════════════════════════════════════════════════════════════════════
//
// §5 es un solo archivo y este es su ÚNICO cambio: **ni una línea de lógica se
// tocó**, los esquemas son byte-idénticos y `esquemas.ts` los sigue
// re-exportando, así que ningún consumidor cambia. Lo que cambia es qué entra al
// bundle del navegador.
//
// `almacenamiento.ts` importa `esqEstadoProgreso` para validar el progreso al
// leerlo, y eso es legítimo y está en §6. El problema es lo que venía de
// arrastre: con todo en un archivo, ese import metía también los **siete
// esquemas de ítem**, más tarjetas, glosario, datos duros y módulo — que en el
// cliente **no los usa nadie**. `PENDIENTES.md` lo anotó en el Paso 9 y dejó la
// decisión para el Paso 11.
//
// El Paso 11 la forzó: `OcultaEnSimulacro` vive en `Shell`, así que
// `almacenamiento.ts` pasó a estar en el grafo del **layout raíz** y ese peso
// dejó de pagarlo una ruta para pagarlo TODAS, incluida la portada. Medido con
// el comando oficial de COMPONENTES.md: `/layout` saltó de 132.0 a 148.4 kB gz,
// y `grep "exactamente 4 opciones"` encontraba los esquemas de ítem en un chunk
// de carga ansiosa del layout.
//
// La partición es por CONSUMIDOR, que es la línea natural: lo que valida
// contenido (build) frente a lo que valida progreso (navegador).

import { z } from 'zod';

const RE_FECHA = /^\d{4}-\d{2}-\d{2}$/;

/* ─── Progreso (valida el JSON importado en /ajustes) ─────────────── */

export const esqTarjetaSRS = z.object({
  id: z.string().min(3),
  facilidad: z.number().min(1.3).max(2.8),
  intervaloDias: z.number().int().min(0),
  repeticiones: z.number().int().min(0),
  proximaRevision: z.string().regex(RE_FECHA),
});

export const esqEstadoModulo = z.object({
  teoriaLeida: z.boolean(),
  tarjetasVistas: z.number().int().min(0),
  practicaCompletada: z.boolean(),
  mejorQuiz: z.number().min(0).max(100).nullable(),
  intentosQuiz: z.number().int().min(0),
  dominado: z.boolean(),
  ultimaVisita: z.string().nullable(),
});

const esqConteo = z.object({
  correctas: z.number().int().min(0),
  total: z.number().int().min(0),
});

export const esqIntento = z.object({
  id: z.string().min(1),
  tipo: z.enum(['diagnostico', 'quiz', 'bloque', 'final']),
  ambito: z.string().min(1),
  semilla: z.number(),
  iniciadoEn: z.string(),
  terminadoEn: z.string(),
  segundosUsados: z.number().int().min(0),
  totalItems: z.number().int().min(1),
  itemIds: z.array(z.string()),
  respuestas: z.array(
    z.object({
      itemId: z.string(),
      respuesta: z.unknown(),
      correcta: z.boolean(),
      segundos: z.number().min(0),
      marcada: z.boolean(),
    }),
  ),
  puntaje: z.number().min(0).max(100),
  /**
   * [ADR-023] `porBloque` y `porNivel` exigen **todas** sus claves. §5 las
   * declaraba como `z.record(esqConteo)` y ahí había un crash reproducido,
   * anotado en `PENDIENTES.md` desde el Paso 4 para decidirse aquí:
   *
   * un intento **sin** los bloques B, C y D pasa `z.record` sin problema, pero
   * el tipo afirma `Record<BloqueId, …>` con las cuatro claves. Entonces
   * `construirInforme` hace `desglose.porBloque[b.id].total` y revienta con
   * `Cannot read properties of undefined` — en la ruta `/resultados`, que es
   * la pantalla que el usuario abre justo después de dos horas de examen.
   *
   * La vía de entrada es real y no hipotética: `importarJSON` acepta ese
   * respaldo como válido en `/ajustes`.
   *
   * **Por qué aquí sí se endurece, cuando ADR-017 decidió no hacerlo con
   * `intervaloDias`:** el criterio es el mismo de siempre —validar en la capa
   * cuyo radio de daño corresponde al dato— y sale al revés porque el daño es
   * otro. Un `intervaloDias` absurdo es inofensivo: la cola solo compara
   * fechas. Un desglose incompleto **rompe la página**. Y el coste de rechazar
   * es simétrico en los dos casos (el estado entero va a cuarentena, ADR-008),
   * así que lo que decide es qué pasa si lo dejas pasar.
   *
   * `porModulo` se queda como `z.record`: sus claves son slugs, el conjunto
   * cambia con el contenido en los pasos 15–17 y el informe lo recorre con
   * `Object.entries`, nunca por clave fija.
   */
  desglose: z.object({
    porBloque: z.object({
      A: esqConteo,
      B: esqConteo,
      C: esqConteo,
      D: esqConteo,
    }),
    porModulo: z.record(esqConteo),
    porNivel: z.object({
      recuerdo: esqConteo,
      comprension: esqConteo,
      aplicacion: esqConteo,
    }),
  }),
});

export const esqEstadoProgreso = z.object({
  version: z.literal(1),
  creadoEn: z.string(),
  nombre: z.string().max(40).optional(),
  fechaExamen: z.string().regex(RE_FECHA).optional(),
  diagnosticoHecho: z.boolean(),
  modulos: z.record(esqEstadoModulo),
  colaRepaso: z.record(esqTarjetaSRS),
  intentos: z.array(esqIntento),
  racha: z.object({ dias: z.number().int().min(0), ultimoDiaActivo: z.string() }),
  preferencias: z.object({
    tema: z.enum(['claro', 'oscuro', 'sistema']),
    sonido: z.boolean(),
    ultimoRespaldo: z.string().nullable(),
  }),
});

export type EstadoProgresoValidado = z.infer<typeof esqEstadoProgreso>;

/* ─── Sesión cronometrada (valida lo que devuelve `leerSesion`) ───── */

/**
 * §6 hace `JSON.parse(crudo) as SesionCronometro` **sin validar**, y ese cast es
 * una promesa que nadie comprueba. Con un payload como `{"foo":1}` devuelve un
 * objeto sin `itemIds` ni `duracionSegundos`: recorrer `itemIds` lanza
 * `TypeError` y `restantes()` daría `NaN` —porque `undefined !== null`—, con lo
 * que **`seAcabo()` responde `false` para siempre y el simulacro no se
 * auto-envía nunca**. Estaba anotado en `PENDIENTES.md` para decidirlo aquí.
 *
 * **Por qué este esquema sí puede rechazar, y `esqTarjetaSRS` no.** ADR-017
 * decidió deliberadamente NO poner un `.max()` a `intervaloDias`, porque
 * `esqTarjetaSRS` se evalúa dentro de `esqEstadoProgreso` y un dato absurdo en
 * una tarjeta suelta habría mandado a cuarentena **todo el progreso** del
 * usuario. Aquí la situación es la contraria y por eso la decisión también lo
 * es: `SesionCronometro` vive en su **propia clave** de `localStorage`, así que
 * descartarla no toca ni un intento, ni la racha, ni la cola de repaso. Lo que
 * se pierde es un simulacro en curso ya ilegible, y la alternativa —dejarlo
 * pasar— es un cronómetro que no termina. Ver ADR-019.
 */
export const esqRespuestaEnCurso = z.object({
  // `valor` se deja como `unknown` a propósito: su forma depende del tipo del
  // ítem (índice, array de índices, booleano, número, pares…) y quien la
  // interpreta es `calificar()`, que ya devuelve `false` ante basura sin lanzar.
  // Validarla aquí duplicaría esa tabla y descartaría sesiones por una respuesta
  // rara en un solo ítem.
  valor: z.unknown(),
  segundos: z.number().min(0),
  marcada: z.boolean(),
});

export const esqSesionCronometro = z.object({
  intentoId: z.string().min(1),
  tipo: z.enum(['diagnostico', 'quiz', 'bloque', 'final']),
  ambito: z.string().min(1),
  semilla: z.number().finite(),
  /** Epoch ms. `finite` es lo que impide el `NaN` que congela `seAcabo()`. */
  iniciadoEnMs: z.number().finite(),
  /** `null` = sin límite. Un número ha de ser finito y positivo. */
  duracionSegundos: z.number().finite().positive().nullable(),
  itemIds: z.array(z.string().min(1)).min(1),
  respuestas: z.record(esqRespuestaEnCurso),
  avisosVistos: z.array(z.number().int()),
});

export type SesionCronometroValidada = z.infer<typeof esqSesionCronometro>;
