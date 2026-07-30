// src/lib/tipos.ts
// Modelo de datos completo de Idóneo 2210.
// Sin directiva de cliente: este archivo solo exporta tipos.

/* ══════════════════════════════════════════════════════════════════
   CONTENIDO
   ══════════════════════════════════════════════════════════════════ */

export type BloqueId = 'A' | 'B' | 'C' | 'D';
export type NivelCognitivo = 'recuerdo' | 'comprension' | 'aplicacion';
export type Dificultad = 1 | 2 | 3;

export type TipoItem =
  | 'unica'
  | 'multiple'
  | 'vf'
  | 'emparejar'
  | 'calculo'
  | 'ordenar'
  | 'caso';

/** Los módulos 'en-preparacion' quedan exentos de las cuotas del validador
 *  y muestran un estado vacío honesto en la app. Ver §2.2. */
export type EstadoContenido = 'completo' | 'en-preparacion';

export interface Bloque {
  id: BloqueId;
  numeroCartilla: 1 | 2 | 3 | 4;
  titulo: string;
  descripcion: string;
  /** Fracción del examen final. La suma de los 4 debe ser 1. */
  pesoExamen: number;
  /** Sufijo del token de color: 'a' | 'b' | 'c' | 'd'. Ver §11. */
  color: 'a' | 'b' | 'c' | 'd';
  /** Slugs de sus módulos, en orden de estudio. */
  modulos: string[];
}

export interface Modulo {
  /** Ej. 'c5-umbrales-zonas'. Es la clave primaria del contenido. */
  slug: string;
  bloque: BloqueId;
  /** Orden dentro del bloque, empezando en 1. */
  orden: number;
  titulo: string;
  subtitulo: string;
  minutosEstimados: number;
  /** 3–5 objetivos, en infinitivo. */
  objetivos: string[];
  /** Alimenta el glosario global. Todo concepto aquí debe tener
   *  entrada en content/glosario.ts si el módulo es 'completo'. */
  conceptosClave: string[];
  /** Slugs de módulos que conviene estudiar antes. Alimenta lib/plan.ts. */
  prerequisitos: string[];
  estadoContenido: EstadoContenido;
}

/* ══════════════════════════════════════════════════════════════════
   ÍTEMS — unión discriminada por `tipo`
   ══════════════════════════════════════════════════════════════════ */

export interface ItemBase {
  /** Formato obligatorio: bloque + número de módulo + consecutivo. Ej. 'C5-014'. */
  id: string;
  /** Slug del módulo. Debe existir en content/estructura.ts. */
  modulo: string;
  bloque: BloqueId;
  nivel: NivelCognitivo;
  dificultad: Dificultad;
  /** Admite markdown en línea (**negrita**, `código`, subíndices con _). */
  enunciado: string;
  /** OBLIGATORIA, mínimo 200 caracteres. Estructura fija:
   *  por qué la correcta lo es → por qué falla el distractor más tentador → dato para recordar. */
  explicacion: string;
  /** Formato: 'Cartilla N, Tema M, Subtema M.X — Título'. */
  referencia: string;
  etiquetas: string[];
  /** Id de una entrada de content/erratas.ts (X-01, E-09, …). */
  contradiccion?: string;
}

export interface ItemUnica extends ItemBase {
  tipo: 'unica';
  /** Exactamente 4. */
  opciones: string[];
  /** Índice en `opciones`. */
  correcta: number;
}

export interface ItemMultiple extends ItemBase {
  tipo: 'multiple';
  /** Exactamente 5. */
  opciones: string[];
  /** 2 o 3 índices distintos. */
  correctas: number[];
}

export interface ItemVerdaderoFalso extends ItemBase {
  tipo: 'vf';
  correcta: boolean;
}

export interface ItemEmparejar extends ItemBase {
  tipo: 'emparejar';
  /** 4–6 elementos. */
  izquierda: string[];
  /** Mismo largo que `izquierda`. Se baraja al presentar. */
  derecha: string[];
  /** Pares [índiceIzquierda, índiceDerecha] correctos, uno por elemento. */
  pares: [number, number][];
}

export interface ItemCalculo extends ItemBase {
  tipo: 'calculo';
  respuesta: number;
  /** Tolerancia absoluta, en unidades de `unidad`. Debe ser > 0. */
  tolerancia: number;
  /** 'lpm', 'ml/kg/min', '%', 'm', … */
  unidad: string;
  /** Resolución paso a paso, mostrada tras responder. Mínimo 2 pasos. */
  pasos: string[];
}

export interface ItemOrdenar extends ItemBase {
  tipo: 'ordenar';
  /** SIEMPRE se escriben en el orden correcto. El barajado lo hace el motor. */
  elementos: string[];
  /** En el ítem canónico es [0, 1, 2, …, n-1]. Tras presentarItem() apunta
   *  a las posiciones del array barajado. Ver §7.3. */
  ordenCorrecto: number[];
}

export interface ItemCaso extends ItemBase {
  tipo: 'caso';
  /** Situación de 2–4 líneas. Se muestra antes del enunciado. */
  viñeta: string;
  opciones: string[];
  correcta: number;
}

export type Item =
  | ItemUnica
  | ItemMultiple
  | ItemVerdaderoFalso
  | ItemEmparejar
  | ItemCalculo
  | ItemOrdenar
  | ItemCaso;

/* ══════════════════════════════════════════════════════════════════
   TARJETAS, GLOSARIO, ERRATAS, DATOS DUROS
   ══════════════════════════════════════════════════════════════════ */

export interface Tarjeta {
  /** Formato: slug del módulo en mayúsculas + '-T' + consecutivo. Ej. 'C5-T07'. */
  id: string;
  modulo: string;
  frente: string;
  reverso: string;
  tipo: 'definicion' | 'dato' | 'clasificacion' | 'formula';
}

export interface EntradaGlosario {
  termino: string;
  definicion: string;
  /** Slug del módulo donde se explica. Genera el enlace "Ver módulo". */
  modulo: string;
  sinonimos?: string[];
}

/**
 * - `contradiccion`: dos cartillas dan valores distintos para el mismo dato.
 * - `errata`: la cartilla dice algo incorrecto (de contenido, de tabla o tipográfico).
 * - `aclaracion`: la cartilla NO se equivoca; el dato se confunde con otro vecino.
 *   Existe para desambiguar, no para corregir. Ver ADR-012.
 */
export type TipoErrata = 'contradiccion' | 'errata' | 'aclaracion';

export interface Errata {
  /** Familia + consecutivo. 'X-*' nace de una divergencia entre cartillas
   *  (`contradiccion`, o la `aclaracion` que la desambigua); 'E-*' es errata de
   *  contenido. El prefijo marca la familia, no el `tipo`. Ver ADR-012. */
  id: string;
  tipo: TipoErrata;
  tema: string;
  ubicacion: string;
  /** Qué dice la cartilla. */
  diceLaCartilla: string;
  /** Qué es correcto, o cómo responder si hay conflicto.
   *  En una `aclaracion`, dice explícitamente que no hay conflicto. */
  loCorrecto: string;
  /** Instrucción operativa para el examen. */
  comoResponder: string;
  /** Slugs de los módulos afectados. */
  modulos: string[];
}

export interface DatoDuro {
  id: string;
  categoria: string;
  concepto: string;
  /** El valor exacto que se pregunta. */
  valor: string;
  modulo: string;
  /** Id de errata si el dato está en conflicto entre cartillas. */
  contradiccion?: string;
}

/* ══════════════════════════════════════════════════════════════════
   BLUEPRINTS DE EXAMEN
   ══════════════════════════════════════════════════════════════════ */

export type TipoIntento = 'diagnostico' | 'quiz' | 'bloque' | 'final';

/** Cómo se reparte el total de ítems. Es la restricción primaria: se satisface
 *  exactamente. Las cuotas de nivel y tipo se satisfacen por aproximación. */
export type RepartoBlueprint =
  | { tipo: 'modulo'; cuotas: Record<string, number> }
  | { tipo: 'bloque'; cuotas: Partial<Record<BloqueId, number>> };

export interface BlueprintExamen {
  id: string;
  titulo: string;
  descripcion: string;
  totalItems: number;
  /** null = sin cronómetro (quiz de módulo). */
  minutos: number | null;
  reparto: RepartoBlueprint;
  porNivel: Record<NivelCognitivo, number>;
  porTipo?: Partial<Record<TipoItem, number>>;
  tiposPermitidos?: TipoItem[];
  dificultadesPermitidas?: Dificultad[];
  /** true = retroalimentación inmediata por ítem (solo la etapa Práctica). */
  feedbackInmediato: boolean;
}

/* ══════════════════════════════════════════════════════════════════
   PROGRESO DEL USUARIO — localStorage
   ══════════════════════════════════════════════════════════════════ */

export interface EstadoModulo {
  teoriaLeida: boolean;
  tarjetasVistas: number;
  practicaCompletada: boolean;
  /** 0–100. Mejor histórico, no el último intento. */
  mejorQuiz: number | null;
  intentosQuiz: number;
  /** mejorQuiz >= 80. */
  dominado: boolean;
  ultimaVisita: string | null;
}

export interface TarjetaSRS {
  /** Id de tarjeta ('C5-T07') o de ítem ('C5-014'). */
  id: string;
  /** Factor de facilidad (EF). Arranca en 2.5, rango [1.3, 2.8]. */
  facilidad: number;
  intervaloDias: number;
  repeticiones: number;
  /** ISO date (solo fecha, sin hora: 'YYYY-MM-DD'). */
  proximaRevision: string;
}

export interface RespuestaItem {
  itemId: string;
  /** Se valida contra el tipo del ítem con lib/simulacro.ts#calificar. */
  respuesta: unknown;
  correcta: boolean;
  segundos: number;
  /** "Revisar después". */
  marcada: boolean;
}

export interface DesgloseIntento {
  porBloque: Record<BloqueId, { correctas: number; total: number }>;
  porModulo: Record<string, { correctas: number; total: number }>;
  porNivel: Record<NivelCognitivo, { correctas: number; total: number }>;
}

export interface IntentoSimulacro {
  /** Igual a la semilla convertida a string. Es la clave de /resultados/[intentoId]. */
  id: string;
  tipo: TipoIntento;
  /** Slug de módulo, id de bloque, o 'global'. */
  ambito: string;
  semilla: number;
  iniciadoEn: string;
  terminadoEn: string;
  segundosUsados: number;
  totalItems: number;
  /** En el orden en que se presentaron. Permite reconstruir el intento sin re-muestrear. */
  itemIds: string[];
  respuestas: RespuestaItem[];
  /** 0–100, redondeado. */
  puntaje: number;
  desglose: DesgloseIntento;
}

export interface Preferencias {
  tema: 'claro' | 'oscuro' | 'sistema';
  sonido: boolean;
  /** ISO date del último respaldo exportado. Alimenta el recordatorio de los 7 días. */
  ultimoRespaldo: string | null;
}

export interface EstadoProgreso {
  version: 1;
  creadoEn: string;
  /** Opcional, solo para saludar. */
  nombre?: string;
  /** ISO date. Alimenta lib/plan.ts. */
  fechaExamen?: string;
  diagnosticoHecho: boolean;
  modulos: Record<string, EstadoModulo>;
  /** Clave = id de tarjeta o de ítem. */
  colaRepaso: Record<string, TarjetaSRS>;
  intentos: IntentoSimulacro[];
  racha: { dias: number; ultimoDiaActivo: string };
  preferencias: Preferencias;
}

/* ══════════════════════════════════════════════════════════════════
   SESIÓN EN CURSO — clave de localStorage separada
   ══════════════════════════════════════════════════════════════════ */

export interface RespuestaEnCurso {
  valor: unknown;
  segundos: number;
  marcada: boolean;
}

export interface SesionCronometro {
  intentoId: string;
  tipo: TipoIntento;
  ambito: string;
  semilla: number;
  /** Epoch ms. El tiempo restante SIEMPRE se recalcula desde aquí contra el
   *  reloj real. Cerrar la pestaña no regala tiempo. */
  iniciadoEnMs: number;
  /** null = sin límite (quiz de módulo). */
  duracionSegundos: number | null;
  /** Orden de presentación. Reconstruye la sesión tras recargar. */
  itemIds: string[];
  respuestas: Record<string, RespuestaEnCurso>;
  /** Segundos-umbral de aviso ya mostrados: [1200, 600, 120]. */
  avisosVistos: number[];
}

/* ══════════════════════════════════════════════════════════════════
   INFORME
   ══════════════════════════════════════════════════════════════════ */

export type ClaveVeredicto = 'riesgo' | 'camino' | 'listo' | 'solido';

export interface Veredicto {
  clave: ClaveVeredicto;
  titulo: string;
  mensaje: string;
  /** Token de color: 'destructive' | 'aviso' | 'primary' | 'exito'. */
  color: string;
}

export interface TemaPrioritario {
  modulo: string;
  titulo: string;
  bloque: BloqueId;
  correctas: number;
  total: number;
  porcentaje: number;
}

export interface Informe {
  intentoId: string;
  tipo: TipoIntento;
  puntaje: number;
  veredicto: Veredicto;
  segundosUsados: number;
  desglose: DesgloseIntento;
  dominioPorBloque: { bloque: BloqueId; titulo: string; porcentaje: number; total: number }[];
  dominioPorModulo: { modulo: string; titulo: string; porcentaje: number; total: number }[];
  temasPrioritarios: TemaPrioritario[];
  /** Mensajes accionables de detección de patrón. Puede venir vacío. */
  patrones: string[];
  /** Delta de puntos porcentuales contra el intento anterior del mismo tipo. */
  deltaPorBloque: Record<BloqueId, number | null> | null;
  sinResponder: number;
}

/* ══════════════════════════════════════════════════════════════════
   PLAN DE ESTUDIO
   ══════════════════════════════════════════════════════════════════ */

export type TareaPlan =
  | { clase: 'modulo'; slug: string; titulo: string; minutos: number }
  | { clase: 'repaso'; descripcion: string; minutos: number }
  | { clase: 'simulacro'; ambito: string; descripcion: string; minutos: number };

export interface DiaPlan {
  /** 'YYYY-MM-DD'. */
  fecha: string;
  /** 1 = hoy. */
  indice: number;
  tareas: TareaPlan[];
  minutosTotales: number;
}

export interface Plan {
  generadoEn: string;
  fechaExamen: string;
  diasDisponibles: number;
  dias: DiaPlan[];
  /** Advertencias honestas: "quedan 5 días para 29 módulos". */
  advertencias: string[];
}
