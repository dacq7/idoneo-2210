// src/lib/esquemas.ts
// Se importa desde el validador de build (Node) y desde almacenamiento.ts
// (navegador, para el JSON importado). Sin directiva de cliente.
//
// Escrito contra la API de Zod 3 (`superRefine`, `message`, `z.record` de un
// argumento). NO migrar a Zod 4: este archivo es el único guardián de ~750
// ítems y no vale la pena arriesgarlo por una versión mayor.
//
// DESVIACIÓN respecto al §5 literal del blueprint — ver ADR-003:
// §5 envuelve cada miembro de `esqItem` en `.superRefine(...)` y luego los pasa
// a `z.discriminatedUnion`. En Zod 3 eso convierte el miembro en `ZodEffects`,
// que no tiene `.shape`, y `discriminatedUnion` lanza un TypeError al construirse
// — es decir, al importar este módulo. Aquí los refinamientos viven en funciones
// nombradas que se aplican DOS veces: al esquema por tipo (para conservar los
// exports individuales) y a la unión (con un switch). Reglas y mensajes idénticos.

import { z } from 'zod';
import type { BloqueId, Item, NivelCognitivo, TipoItem } from './tipos';

/* ─── Primitivos ──────────────────────────────────────────────────── */

export const esqBloqueId = z.enum(['A', 'B', 'C', 'D']);
export const esqNivel = z.enum(['recuerdo', 'comprension', 'aplicacion']);
export const esqDificultad = z.union([z.literal(1), z.literal(2), z.literal(3)]);
export const esqEstadoContenido = z.enum(['completo', 'en-preparacion']);

const RE_ID_ITEM = /^[ABCD]\d{1,2}-\d{3}$/;
const RE_REFERENCIA = /^Cartilla [1-4], Tema \d+/;
const RE_ID_ERRATA = /^[XE]-\d{2}$/;
const RE_FECHA = /^\d{4}-\d{2}-\d{2}$/;

const camposBase = {
  id: z.string().regex(RE_ID_ITEM, 'el id debe tener la forma "C5-014"'),
  modulo: z.string().min(3),
  bloque: esqBloqueId,
  nivel: esqNivel,
  dificultad: esqDificultad,
  enunciado: z.string().min(15, 'el enunciado es demasiado corto'),
  explicacion: z
    .string()
    .min(200, 'la explicación debe tener al menos 200 caracteres'),
  referencia: z
    .string()
    .regex(RE_REFERENCIA, 'la referencia debe empezar por "Cartilla N, Tema M"'),
  etiquetas: z.array(z.string().min(2)).min(1, 'al menos una etiqueta'),
  contradiccion: z.string().regex(RE_ID_ERRATA).optional(),
};

/** Un refinamiento reutilizable: se aplica al esquema por tipo y a la unión. */
type Refinamiento<T extends z.ZodTypeAny> = (
  valor: z.output<T>,
  ctx: z.RefinementCtx,
) => void;

/* ─── Los 7 tipos de ítem ─────────────────────────────────────────── */

const objItemUnica = z.object({
  ...camposBase,
  tipo: z.literal('unica'),
  opciones: z.array(z.string().min(1)).length(4, 'única: exactamente 4 opciones'),
  correcta: z.number().int().min(0).max(3),
});

const refItemUnica: Refinamiento<typeof objItemUnica> = (it, ctx) => {
  if (new Set(it.opciones).size !== it.opciones.length) {
    ctx.addIssue({ code: 'custom', message: 'hay opciones duplicadas' });
  }
};

export const esqItemUnica = objItemUnica.superRefine(refItemUnica);

const objItemMultiple = z.object({
  ...camposBase,
  tipo: z.literal('multiple'),
  opciones: z.array(z.string().min(1)).length(5, 'múltiple: exactamente 5 opciones'),
  correctas: z.array(z.number().int().min(0)).min(2).max(3),
});

const refItemMultiple: Refinamiento<typeof objItemMultiple> = (it, ctx) => {
  // [ADR-005, hueco 3] `unica` y `caso` ya vigilaban las opciones duplicadas;
  // `multiple` no. Es irresoluble para quien responde: la correcta aparece dos
  // veces y solo un índice cuenta. Mensaje reutilizado a propósito.
  if (new Set(it.opciones).size !== it.opciones.length) {
    ctx.addIssue({ code: 'custom', message: 'hay opciones duplicadas' });
  }
  if (new Set(it.correctas).size !== it.correctas.length) {
    ctx.addIssue({ code: 'custom', message: 'correctas tiene índices repetidos' });
  }
  if (it.correctas.some((i) => i >= it.opciones.length)) {
    ctx.addIssue({ code: 'custom', message: 'un índice de correctas está fuera de rango' });
  }
};

export const esqItemMultiple = objItemMultiple.superRefine(refItemMultiple);

export const esqItemVf = z.object({
  ...camposBase,
  tipo: z.literal('vf'),
  correcta: z.boolean(),
});

const objItemEmparejar = z.object({
  ...camposBase,
  tipo: z.literal('emparejar'),
  izquierda: z.array(z.string().min(1)).min(4).max(6),
  derecha: z.array(z.string().min(1)).min(4).max(6),
  pares: z.array(z.tuple([z.number().int().min(0), z.number().int().min(0)])),
});

const refItemEmparejar: Refinamiento<typeof objItemEmparejar> = (it, ctx) => {
  if (it.izquierda.length !== it.derecha.length) {
    ctx.addIssue({ code: 'custom', message: 'izquierda y derecha deben tener el mismo largo' });
  }
  if (it.pares.length !== it.izquierda.length) {
    ctx.addIssue({ code: 'custom', message: 'debe haber un par por cada elemento de izquierda' });
  }
  const izq = new Set<number>();
  // [ADR-005, hueco 4] §5 solo vigilaba el índice izquierdo. Sin el gemelo,
  // pares como [[0,0],[1,0],[2,2],[3,3]] pasan: el derecho 0 se usa dos veces,
  // el 1 queda huérfano y la relación deja de ser biyectiva.
  const der = new Set<number>();
  for (const [i, d] of it.pares) {
    if (i >= it.izquierda.length || d >= it.derecha.length) {
      ctx.addIssue({ code: 'custom', message: `el par [${i},${d}] está fuera de rango` });
    }
    if (izq.has(i)) {
      ctx.addIssue({ code: 'custom', message: `el índice izquierdo ${i} aparece dos veces` });
    }
    izq.add(i);
    if (der.has(d)) {
      ctx.addIssue({ code: 'custom', message: `el índice derecho ${d} aparece dos veces` });
    }
    der.add(d);
  }
};

export const esqItemEmparejar = objItemEmparejar.superRefine(refItemEmparejar);

export const esqItemCalculo = z.object({
  ...camposBase,
  tipo: z.literal('calculo'),
  respuesta: z.number().finite(),
  tolerancia: z.number().positive('la tolerancia debe ser > 0'),
  unidad: z.string().min(1),
  pasos: z.array(z.string().min(3)).min(2, 'cálculo: al menos 2 pasos de resolución'),
});

const objItemOrdenar = z.object({
  ...camposBase,
  tipo: z.literal('ordenar'),
  elementos: z.array(z.string().min(1)).min(3).max(8),
  ordenCorrecto: z.array(z.number().int().min(0)),
});

const refItemOrdenar: Refinamiento<typeof objItemOrdenar> = (it, ctx) => {
  if (it.ordenCorrecto.length !== it.elementos.length) {
    ctx.addIssue({ code: 'custom', message: 'ordenCorrecto debe tener un índice por elemento' });
    return;
  }
  const ordenado = [...it.ordenCorrecto].sort((a, b) => a - b);
  if (ordenado.some((v, i) => v !== i)) {
    ctx.addIssue({
      code: 'custom',
      message: 'ordenCorrecto debe ser una permutación de 0..n-1 (en el ítem canónico: [0,1,2,…])',
    });
  }
};

export const esqItemOrdenar = objItemOrdenar.superRefine(refItemOrdenar);

const objItemCaso = z.object({
  ...camposBase,
  tipo: z.literal('caso'),
  viñeta: z.string().min(60, 'la viñeta debe describir una situación (mín. 60 caracteres)'),
  opciones: z.array(z.string().min(1)).length(4, 'caso: exactamente 4 opciones'),
  correcta: z.number().int().min(0).max(3),
});

const refItemCaso: Refinamiento<typeof objItemCaso> = (it, ctx) => {
  if (new Set(it.opciones).size !== it.opciones.length) {
    ctx.addIssue({ code: 'custom', message: 'hay opciones duplicadas' });
  }
};

export const esqItemCaso = objItemCaso.superRefine(refItemCaso);

/** Los miembros de la unión son los objetos PLANOS: `discriminatedUnion` de
 *  Zod 3 lee `.shape` del miembro y un `ZodEffects` no lo tiene. Los
 *  refinamientos se reaplican aquí, sobre el tipo ya estrechado. */
export const esqItem = z
  .discriminatedUnion('tipo', [
    objItemUnica,
    objItemMultiple,
    esqItemVf,
    objItemEmparejar,
    esqItemCalculo,
    objItemOrdenar,
    objItemCaso,
  ])
  .superRefine((it, ctx) => {
    switch (it.tipo) {
      case 'unica':
        return refItemUnica(it, ctx);
      case 'multiple':
        return refItemMultiple(it, ctx);
      case 'emparejar':
        return refItemEmparejar(it, ctx);
      case 'ordenar':
        return refItemOrdenar(it, ctx);
      case 'caso':
        return refItemCaso(it, ctx);
      default:
        // 'vf' y 'calculo' no tienen refinamientos de colección.
        return;
    }
  });

/* ─── Cuotas por módulo (§2.2 del documento de contenido) ─────────── */

export interface ReglasCuota {
  /** Ítems mínimos por módulo. */
  minimoItems: number;
  /** Fracción mínima por nivel cognitivo. */
  minNivel: Record<NivelCognitivo, number>;
  /** Ítems mínimos por cada nivel de dificultad. */
  minPorDificultad: number;
  /** Tipos distintos mínimos representados. */
  minTiposDistintos: number;
}

export const CUOTAS: ReglasCuota = {
  minimoItems: 25,
  minNivel: { recuerdo: 0.4, comprension: 0.3, aplicacion: 0.2 },
  minPorDificultad: 3,
  minTiposDistintos: 4,
};

/** [ADR-005, hueco 5] El bloque C pesa el 33 % del examen y §14.4 le pide 28
 *  ítems por módulo, no 25. El entregable del paso 16 dice "≥28 cada uno".
 *  CUOTAS no se toca: subirlo a 28 lo exigiría también a los otros 3 bloques. */
export const CUOTAS_BLOQUE_C: ReglasCuota = { ...CUOTAS, minimoItems: 28 };

export function cuotasDelBloque(bloque: BloqueId): ReglasCuota {
  return bloque === 'C' ? CUOTAS_BLOQUE_C : CUOTAS;
}

/** Verifica las cuotas de un módulo. Devuelve la lista de incumplimientos
 *  (vacía = pasa). Se usa en scripts/validar-banco.ts y en los tests. */
export function verificarCuotas(items: Item[], reglas: ReglasCuota = CUOTAS): string[] {
  const fallos: string[] = [];
  const n = items.length;

  if (n < reglas.minimoItems) {
    fallos.push(`tiene ${n} ítems, el mínimo es ${reglas.minimoItems}`);
  }
  if (n === 0) return fallos;

  const porNivel: Record<NivelCognitivo, number> = {
    recuerdo: 0,
    comprension: 0,
    aplicacion: 0,
  };
  const porDificultad: Record<number, number> = { 1: 0, 2: 0, 3: 0 };
  const tipos = new Set<TipoItem>();

  for (const it of items) {
    porNivel[it.nivel] += 1;
    porDificultad[it.dificultad] += 1;
    tipos.add(it.tipo);
  }

  for (const nivel of ['recuerdo', 'comprension', 'aplicacion'] as NivelCognitivo[]) {
    const fraccion = porNivel[nivel] / n;
    if (fraccion < reglas.minNivel[nivel]) {
      fallos.push(
        `nivel "${nivel}": ${porNivel[nivel]}/${n} = ${(fraccion * 100).toFixed(0)} %, ` +
          `mínimo ${(reglas.minNivel[nivel] * 100).toFixed(0)} %`,
      );
    }
  }

  for (const d of [1, 2, 3]) {
    if (porDificultad[d] < reglas.minPorDificultad) {
      fallos.push(
        `dificultad ${d}: ${porDificultad[d]} ítems, mínimo ${reglas.minPorDificultad}`,
      );
    }
  }

  if (tipos.size < reglas.minTiposDistintos) {
    fallos.push(
      `solo ${tipos.size} tipos distintos (${[...tipos].join(', ')}), mínimo ${reglas.minTiposDistintos}`,
    );
  }

  return fallos;
}

/* ─── Tarjetas, glosario, erratas, datos duros ────────────────────── */

export const esqTarjeta = z.object({
  id: z.string().regex(/^[ABCD]\d{1,2}-T\d{2}$/, 'el id de tarjeta debe ser como "C5-T07"'),
  modulo: z.string().min(3),
  frente: z.string().min(5),
  reverso: z.string().min(5),
  tipo: z.enum(['definicion', 'dato', 'clasificacion', 'formula']),
});

export const esqEntradaGlosario = z.object({
  termino: z.string().min(2),
  definicion: z.string().min(40),
  modulo: z.string().min(3),
  sinonimos: z.array(z.string().min(2)).optional(),
});

export const esqErrata = z.object({
  id: z.string().regex(RE_ID_ERRATA),
  tipo: z.enum(['contradiccion', 'errata']),
  tema: z.string().min(4),
  ubicacion: z.string().min(4),
  diceLaCartilla: z.string().min(10),
  loCorrecto: z.string().min(10),
  comoResponder: z.string().min(20),
  modulos: z.array(z.string().min(3)).min(1),
});

export const esqDatoDuro = z.object({
  id: z.string().min(3),
  categoria: z.string().min(3),
  concepto: z.string().min(3),
  valor: z.string().min(1),
  modulo: z.string().min(3),
  contradiccion: z.string().regex(RE_ID_ERRATA).optional(),
});

export const esqModulo = z.object({
  slug: z.string().regex(/^[a-d]\d{1,2}-[a-z0-9-]+$/, 'slug como "c5-umbrales-zonas"'),
  bloque: esqBloqueId,
  orden: z.number().int().positive(),
  titulo: z.string().min(4),
  subtitulo: z.string().min(10),
  minutosEstimados: z.number().int().min(10).max(90),
  objetivos: z.array(z.string().min(10)).min(3).max(5),
  conceptosClave: z.array(z.string().min(2)).min(3),
  prerequisitos: z.array(z.string().min(3)),
  estadoContenido: esqEstadoContenido,
});

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
  desglose: z.object({
    porBloque: z.record(esqConteo),
    porModulo: z.record(esqConteo),
    porNivel: z.record(esqConteo),
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
