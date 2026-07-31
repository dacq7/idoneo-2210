// src/lib/calculos.ts
// Todas las fórmulas médico-deportivas del examen, en un solo lugar (§15.1).
// Funciones puras, sin reloj y sin `"use client"`: las importa la calculadora
// —que sí es cliente— y las prueban los tests sin montar nada.
//
// ══ POR QUÉ ESTÁN AQUÍ Y NO EN EL COMPONENTE ══
// Son las mismas fórmulas que el banco pregunta en sus ítems de `calculo`. Si
// viven en el componente, no se pueden probar sin jsdom y no se pueden reusar.
// Y son exactamente el sitio donde un signo cambiado no da error de tipos y sí
// enseña mal a alguien que se está examinando.
//
// ══ ADR-014 EN EL CÓDIGO ══
// Dos decisiones de contenido viajan aquí y conviene que no se «arreglen» sin
// leer esto:
//   · `zonasEnLpm` expresa R2 en 80–90 % de la FCmáx, no en 75–85 %. Los dos
//     rangos son correctos y describen la misma zona en escalas distintas: el
//     primero en frecuencia cardíaca y el segundo en VO₂máx. Una calculadora
//     que devuelve lpm tiene que usar el de FCmáx.
//   · `FORMULAS_FCMAX` guarda la población de cada fórmula junto al cálculo,
//     porque elegir la de Fox para una mujer de 55 años es el error que el
//     módulo C2 enseña a evitar.

export type AutorFCmax = 'fox' | 'astrand' | 'tanaka' | 'gellish' | 'gulati';

export interface FormulaFCmax {
  etiqueta: string;
  /** Para quién se validó. Es parte del dato, no una nota al pie. */
  poblacion: string;
  calcular: (edad: number) => number;
}

export const FORMULAS_FCMAX: Record<AutorFCmax, FormulaFCmax> = {
  fox: {
    etiqueta: 'Fox et al. (1971)',
    poblacion: 'General',
    calcular: (edad) => 220 - edad,
  },
  astrand: {
    etiqueta: 'Astrand (1952)',
    poblacion: 'General',
    calcular: (edad) => 216.6 - 0.84 * edad,
  },
  tanaka: {
    etiqueta: 'Tanaka et al. (2001)',
    poblacion: 'Hombres y mujeres sanos',
    calcular: (edad) => 208 - 0.7 * edad,
  },
  gellish: {
    etiqueta: 'Gellish et al. (2007)',
    poblacion: 'Adultos activos',
    calcular: (edad) => 207 - 0.7 * edad,
  },
  gulati: {
    etiqueta: 'Gulati et al. (2010)',
    poblacion: 'Mujeres asintomáticas de mediana edad',
    calcular: (edad) => 206 - 0.88 * edad,
  },
};

export const AUTORES_FCMAX = Object.keys(FORMULAS_FCMAX) as AutorFCmax[];

/* ─── Cardiovascular ──────────────────────────────────────────────── */

export function fcReserva(fcMax: number, fcReposo: number): number {
  return fcMax - fcReposo;
}

/**
 * Método de Karvonen: FC objetivo = FCreposo + (FC de reserva × intensidad).
 *
 * `intensidad` va en fracción (0,70), no en porcentaje (70). Da valores más
 * altos que el porcentaje simple de FCmáx, y esa diferencia es la razón de que
 * el examen los distinga: aplicar el porcentaje sobre la reserva y llamarlo
 * «porcentaje de la FCmáx» es el error de C5-011.
 */
export function karvonen(fcMax: number, fcReposo: number, intensidad: number): number {
  return fcReposo + fcReserva(fcMax, fcReposo) * intensidad;
}

/** Gasto cardíaco en litros por minuto. El volumen sistólico entra en mL. */
export function gastoCardiaco(fc: number, volumenSistolicoMl: number): number {
  return (fc * volumenSistolicoMl) / 1000;
}

/** Convierte una toma de pulso a latidos por minuto. */
export function pulsoALpm(latidos: number, segundos: 6 | 10 | 15 | 30): number {
  return latidos * (60 / segundos);
}

/* ─── Zonas de entrenamiento ──────────────────────────────────────── */

export type NombreZona = 'R0' | 'R1' | 'R2' | 'R3';

export interface ZonaCalculada {
  zona: NombreZona;
  etiqueta: string;
  /** Límites en lpm, ya redondeados. */
  desde: number;
  hasta: number;
  /** Slug del módulo que la explica. La calculadora enlaza ahí. */
  modulo: string;
}

/**
 * Las cuatro zonas en lpm a partir de la FCmáx, con los rangos de **porcentaje
 * de frecuencia cardíaca** (§14.1). R2 va 80–90 % aquí: su otro rango, 75–85 %,
 * está expresado en porcentaje del VO₂máx y no se puede convertir a lpm.
 */
export function zonasEnLpm(fcMax: number): ZonaCalculada[] {
  const p = (x: number) => Math.round(fcMax * x);
  return [
    {
      zona: 'R0',
      etiqueta: 'Recuperación · por debajo del 65 %',
      desde: 0,
      hasta: p(0.65),
      modulo: 'c5-umbrales-zonas',
    },
    {
      zona: 'R1',
      etiqueta: 'Umbral aeróbico (VT1) · 65–75 %',
      desde: p(0.65),
      hasta: p(0.75),
      modulo: 'c5-umbrales-zonas',
    },
    {
      zona: 'R2',
      etiqueta: 'Umbral anaeróbico (VT2) · 80–90 %',
      desde: p(0.8),
      hasta: p(0.9),
      modulo: 'c5-umbrales-zonas',
    },
    {
      zona: 'R3',
      etiqueta: 'Potencia aeróbica · 90–95 %',
      desde: p(0.9),
      hasta: p(0.95),
      modulo: 'c5-umbrales-zonas',
    },
  ];
}

/* ─── Carga ───────────────────────────────────────────────────────── */

/**
 * Densidad = trabajo / (trabajo + pausa). Devuelve una fracción de 0 a 1.
 *
 * Con total 0 devuelve 0 en vez de NaN: la calculadora arranca con los campos
 * vacíos y un NaN pintado en pantalla parece que la app se rompió.
 */
export function densidad(trabajoSeg: number, descansoSeg: number): number {
  const total = trabajoSeg + descansoSeg;
  return total === 0 ? 0 : trabajoSeg / total;
}

/* ─── MET y VO₂ ───────────────────────────────────────────────────── */

export const ML_KG_MIN_POR_MET = 3.5;

export function metsDesdeVo2(vo2MlKgMin: number): number {
  return vo2MlKgMin / ML_KG_MIN_POR_MET;
}

export function vo2DesdeMets(mets: number): number {
  return mets * ML_KG_MIN_POR_MET;
}

/* ─── Antropometría ───────────────────────────────────────────────── */

/** IMC = peso / estatura². La estatura entra en METROS. */
export function imc(pesoKg: number, estaturaM: number): number {
  return estaturaM === 0 ? 0 : pesoKg / (estaturaM * estaturaM);
}

export function indiceCinturaCadera(cinturaCm: number, caderaCm: number): number {
  return caderaCm === 0 ? 0 : cinturaCm / caderaCm;
}

/**
 * Lectura del IMC según los cortes de la OMS.
 *
 * Va acompañada SIEMPRE de la advertencia de `NOTA_IMC`: en un deportista con
 * mucha masa muscular el IMC clasifica mal, y una calculadora para entrenadores
 * que devuelva «sobrepeso» sobre un jugador de rugby sin decir eso está
 * enseñando algo falso.
 */
export function categoriaIMC(valor: number): string {
  if (valor <= 0) return '—';
  if (valor < 18.5) return 'Bajo peso';
  if (valor < 25) return 'Normopeso';
  if (valor < 30) return 'Sobrepeso';
  return 'Obesidad';
}

export const NOTA_IMC =
  'El IMC no distingue músculo de grasa. En deportistas con mucha masa muscular ' +
  'clasifica mal, y por sí solo no describe la composición corporal de nadie.';

/* ─── Entrada del usuario ─────────────────────────────────────────── */

/**
 * Convierte lo que el usuario escribió en un número, o null si no hay número.
 *
 * **Acepta coma decimal**, que es como escribe la gente en Colombia: «126,2».
 * §13 lo fija como regla transversal y aquí es donde se cumple para toda la
 * calculadora. Sin esto, `Number('126,2')` es NaN y el campo parece roto.
 */
export function aNumero(texto: string): number | null {
  const limpio = texto.trim().replace(',', '.');
  if (limpio === '') return null;
  const n = Number(limpio);
  return Number.isFinite(n) ? n : null;
}

/** Redondeo a `decimales` cifras, devolviendo número. Para pintar resultados. */
export function redondear(valor: number, decimales = 1): number {
  const factor = 10 ** decimales;
  return Math.round(valor * factor) / factor;
}
