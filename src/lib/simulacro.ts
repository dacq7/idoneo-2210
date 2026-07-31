// src/lib/simulacro.ts
// Muestreo estratificado determinista + barajado reproducible + calificación.
// Funciones puras. SIN "use client".

import type {
  BloqueId,
  BlueprintExamen,
  Item,
  NivelCognitivo,
  TipoItem,
} from './tipos';

/* ─── PRNG determinista (mulberry32) ──────────────────────────────── */

export type Rng = () => number;

/** Misma semilla ⇒ misma secuencia, en cualquier navegador y en Node. */
export function crearRng(semilla: number): Rng {
  let a = semilla >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fisher-Yates con el rng inyectado. Nunca usar Math.random(). */
export function barajar<T>(lista: readonly T[], rng: Rng): T[] {
  const copia = lista.slice();
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

/* ─── Muestreo estratificado ──────────────────────────────────────── */

interface Unidad {
  clave: string;
  cuota: number;
  pool: Item[];
}

/**
 * Arma un simulacro respetando el blueprint.
 *
 * Restricción PRIMARIA (se satisface exactamente): el reparto por módulo o
 * por bloque. Restricciones SECUNDARIAS (se satisfacen por aproximación
 * codiciosa): las cuotas por nivel cognitivo y por tipo de ítem. No existe
 * una solución exacta simultánea en el caso general — es un problema de flujo —
 * y una heurística codiciosa con déficit da desviaciones de 1–2 ítems, que es
 * irrelevante pedagógicamente y cuesta 40 líneas en vez de 400.
 *
 * `itemsRecientes` son los ítems vistos en los últimos 2 intentos: se penalizan
 * sin prohibirse, para que un segundo simulacro no sea el mismo examen.
 *
 * Determinismo: mismos (blueprint, banco, semilla, itemsRecientes) ⇒ mismo
 * resultado. El orden del banco se normaliza por id antes de muestrear.
 */
export function armarSimulacro(
  bp: BlueprintExamen,
  banco: readonly Item[],
  semilla: number,
  itemsRecientes: readonly string[] = [],
): Item[] {
  const rng = crearRng(semilla);
  const recientes = new Set(itemsRecientes);

  const elegibles = banco
    .filter(
      (it) =>
        (!bp.tiposPermitidos || bp.tiposPermitidos.includes(it.tipo)) &&
        (!bp.dificultadesPermitidas || bp.dificultadesPermitidas.includes(it.dificultad)),
    )
    .slice()
    .sort((a, b) => a.id.localeCompare(b.id));

  const deficitNivel: Record<NivelCognitivo, number> = { ...bp.porNivel };
  const deficitTipo = new Map<TipoItem, number>(
    Object.entries(bp.porTipo ?? {}).map(([t, n]) => [t as TipoItem, n as number]),
  );

  const usados = new Set<string>();
  const seleccion: Item[] = [];

  const unidades: Unidad[] =
    bp.reparto.tipo === 'modulo'
      ? Object.entries(bp.reparto.cuotas).map(([slug, cuota]) => ({
          clave: slug,
          cuota,
          pool: elegibles.filter((it) => it.modulo === slug),
        }))
      : Object.entries(bp.reparto.cuotas).map(([bloque, cuota]) => ({
          clave: bloque,
          cuota: cuota as number,
          pool: elegibles.filter((it) => it.bloque === (bloque as BloqueId)),
        }));

  // Primero las unidades con menos margen: si un módulo tiene justo los ítems
  // que le tocan, hay que servirlo antes de que otro le robe candidatos.
  unidades.sort(
    (a, b) =>
      a.pool.length - a.cuota - (b.pool.length - b.cuota) || a.clave.localeCompare(b.clave),
  );

  const tomar = (candidatos: Item[]): Item | null => {
    if (candidatos.length === 0) return null;
    const elegido = elegirMejor(candidatos, deficitNivel, deficitTipo, recientes, rng);
    usados.add(elegido.id);
    seleccion.push(elegido);
    deficitNivel[elegido.nivel] -= 1;
    const dt = deficitTipo.get(elegido.tipo);
    if (dt !== undefined) deficitTipo.set(elegido.tipo, dt - 1);
    return elegido;
  };

  for (const unidad of unidades) {
    for (let n = 0; n < unidad.cuota; n++) {
      if (!tomar(unidad.pool.filter((it) => !usados.has(it.id)))) break;
    }
  }

  // Relleno: si algún módulo no tenía ítems suficientes (contenido en
  // preparación), se completa desde el pool global para no entregar un
  // simulacro corto.
  while (seleccion.length < bp.totalItems) {
    if (!tomar(elegibles.filter((it) => !usados.has(it.id)))) break;
  }

  return barajar(seleccion.slice(0, bp.totalItems), rng);
}

function elegirMejor(
  candidatos: Item[],
  deficitNivel: Record<NivelCognitivo, number>,
  deficitTipo: Map<TipoItem, number>,
  recientes: Set<string>,
  rng: Rng,
): Item {
  let mejor = candidatos[0];
  let mejorPuntaje = -Infinity;
  for (const it of candidatos) {
    const bonoNivel = deficitNivel[it.nivel] > 0 ? 3 : 0;
    const objetivoTipo = deficitTipo.get(it.tipo);
    const bonoTipo = objetivoTipo === undefined ? 0 : objetivoTipo > 0 ? 2 : -1;
    const castigo = recientes.has(it.id) ? 2 : 0;
    // El jitter desempata de forma determinista dada la semilla.
    const puntaje = bonoNivel + bonoTipo - castigo + rng() * 0.9;
    if (puntaje > mejorPuntaje) {
      mejorPuntaje = puntaje;
      mejor = it;
    }
  }
  return mejor;
}

/** Diagnóstico de desviación. Se usa en los tests y en el validador. */
export interface Cobertura {
  total: number;
  porUnidad: Record<string, { obtenido: number; objetivo: number }>;
  porNivel: Record<NivelCognitivo, { obtenido: number; objetivo: number }>;
  porTipo: Partial<Record<TipoItem, { obtenido: number; objetivo: number }>>;
}

export function medirCobertura(bp: BlueprintExamen, items: readonly Item[]): Cobertura {
  const porUnidad: Cobertura['porUnidad'] = {};
  const cuotas = bp.reparto.cuotas as Record<string, number>;
  for (const [clave, objetivo] of Object.entries(cuotas)) {
    const obtenido = items.filter((it) =>
      bp.reparto.tipo === 'modulo' ? it.modulo === clave : it.bloque === clave,
    ).length;
    porUnidad[clave] = { obtenido, objetivo };
  }

  const porNivel = {
    recuerdo: { obtenido: 0, objetivo: bp.porNivel.recuerdo },
    comprension: { obtenido: 0, objetivo: bp.porNivel.comprension },
    aplicacion: { obtenido: 0, objetivo: bp.porNivel.aplicacion },
  };
  for (const it of items) porNivel[it.nivel].obtenido += 1;

  const porTipo: Cobertura['porTipo'] = {};
  for (const [tipo, objetivo] of Object.entries(bp.porTipo ?? {})) {
    porTipo[tipo as TipoItem] = {
      obtenido: items.filter((it) => it.tipo === tipo).length,
      objetivo: objetivo as number,
    };
  }

  return { total: items.length, porUnidad, porNivel, porTipo };
}

/* ─── Viabilidad: ¿alcanza el banco para armar este examen? ───────── */

/**
 * Lo que el servidor sabe de un módulo sin mandar un solo ítem al cliente.
 * Tres campos por módulo: 29 módulos son ~90 valores, frente a los ~750 ítems
 * completos que costaría mandar el banco (ADR-010).
 */
export interface CensoModulo {
  slug: string;
  bloque: BloqueId;
  /** Ítems publicados. 0 en un módulo `'en-preparacion'`. */
  disponibles: number;
}

export interface DeficitUnidad {
  /** Slug del módulo o id del bloque, según el reparto del blueprint. */
  clave: string;
  cuota: number;
  disponibles: number;
}

export interface Viabilidad {
  /** `false` ⇒ el examen NO se puede armar completo. La UI no debe ofrecerlo. */
  viable: boolean;
  totalRequerido: number;
  totalDisponible: number;
  /** Cuántos ítems faltan para poder armarlo. 0 si es viable. */
  faltan: number;
  /** Unidades del reparto que no llegan a su cuota, de mayor a menor déficit. */
  deficits: DeficitUnidad[];
  /**
   * `true` cuando hay ítems de sobra en total pero alguna unidad queda corta: el
   * examen se arma —el relleno de `armarSimulacro` lo completa— pero **no**
   * respeta el reparto del blueprint. Es una advertencia, no un bloqueo.
   */
  repartoIncumplido: boolean;
  /**
   * `false` si el blueprint filtra por tipo o dificultad. El censo cuenta ítems
   * publicados, no ítems *elegibles*, así que en ese caso el veredicto es una
   * **cota superior**: puede decir «viable» y no serlo.
   *
   * Hoy no afecta a nadie: ni el simulacro final ni el de bloque filtran. El
   * primero que lo hará es el diagnóstico del Paso 13
   * (`tiposPermitidos: ['unica','emparejar','caso']`, dificultades 1 y 2), y ahí
   * hay que ampliar el censo con la distribución conjunta tipo × dificultad —no
   * sirven las marginales— o cargar el banco en el servidor y contar de verdad.
   */
  exacto: boolean;
}

/**
 * Decide, **antes de armar nada**, si el banco alcanza para este blueprint.
 *
 * Existe porque `armarSimulacro` no puede responder esta pregunta: su relleno
 * está diseñado para completar desde el pool global cuando un módulo se queda
 * corto —que es lo correcto mientras el contenido se escribe—, y con el banco de
 * hoy eso significa que un «simulacro final de 100 ítems» devolvería 28 ítems de
 * C5 repetidos por los cuatro bloques y **se presentaría como el examen real**.
 * Un examen de 28 ítems etiquetado como el simulacro de 100 no mide nada y
 * miente sobre el resultado, que es lo contrario de lo que la app promete
 * (§22 regla 11: retroalimentación honesta).
 *
 * Función pura sobre el censo. No carga contenido y no conoce el reloj.
 */
export function diagnosticarViabilidad(
  bp: BlueprintExamen,
  censo: readonly CensoModulo[],
): Viabilidad {
  const cuotas = bp.reparto.cuotas as Record<string, number>;

  const disponiblesDe = (clave: string): number =>
    censo
      .filter((m) => (bp.reparto.tipo === 'modulo' ? m.slug === clave : m.bloque === clave))
      .reduce((suma, m) => suma + m.disponibles, 0);

  const deficits: DeficitUnidad[] = [];
  for (const [clave, cuota] of Object.entries(cuotas)) {
    const disponibles = disponiblesDe(clave);
    if (disponibles < cuota) deficits.push({ clave, cuota, disponibles });
  }
  deficits.sort(
    (a, b) => b.cuota - b.disponibles - (a.cuota - a.disponibles) || a.clave.localeCompare(b.clave),
  );

  // El pool del que sale el relleno son SOLO las unidades del reparto: un
  // simulacro del bloque C no se rellena con ítems del bloque A. Contar el banco
  // entero aquí daría un «viable» falso en cuanto haya contenido de otros
  // bloques, que es exactamente el escenario de los pasos 15–17.
  const claves = Object.keys(cuotas);
  const totalDisponible = censo
    .filter((m) =>
      bp.reparto.tipo === 'modulo' ? claves.includes(m.slug) : claves.includes(m.bloque),
    )
    .reduce((suma, m) => suma + m.disponibles, 0);

  const totalRequerido = bp.totalItems;

  return {
    viable: totalDisponible >= totalRequerido,
    totalRequerido,
    totalDisponible,
    faltan: Math.max(0, totalRequerido - totalDisponible),
    deficits,
    repartoIncumplido: totalDisponible >= totalRequerido && deficits.length > 0,
    exacto: bp.tiposPermitidos === undefined && bp.dificultadesPermitidas === undefined,
  };
}

/* ─── Presentación (barajado de opciones) ─────────────────────────── */

/**
 * Devuelve una copia del ítem con las opciones barajadas y los índices
 * correctos remapeados. Reproducible: misma semilla ⇒ mismo barajado, lo que
 * permite revisar un intento con exactamente la pantalla que vio el usuario.
 *
 * `vf` y `calculo` se devuelven intactos: no tienen opciones que barajar.
 */
export function presentarItem(item: Item, rng: Rng): Item {
  switch (item.tipo) {
    case 'unica':
    case 'caso': {
      const idx = barajar(
        item.opciones.map((_, i) => i),
        rng,
      );
      return {
        ...item,
        opciones: idx.map((i) => item.opciones[i]),
        correcta: idx.indexOf(item.correcta),
      };
    }
    case 'multiple': {
      const idx = barajar(
        item.opciones.map((_, i) => i),
        rng,
      );
      return {
        ...item,
        opciones: idx.map((i) => item.opciones[i]),
        correctas: item.correctas.map((c) => idx.indexOf(c)).sort((a, b) => a - b),
      };
    }
    case 'emparejar': {
      const idx = barajar(
        item.derecha.map((_, i) => i),
        rng,
      );
      return {
        ...item,
        derecha: idx.map((i) => item.derecha[i]),
        pares: item.pares.map(([i, d]) => [i, idx.indexOf(d)] as [number, number]),
      };
    }
    case 'ordenar': {
      const idx = barajar(
        item.elementos.map((_, i) => i),
        rng,
      );
      return {
        ...item,
        elementos: idx.map((i) => item.elementos[i]),
        // ordenCorrecto[k] = posición, en el array barajado, del elemento
        // que debe ir en el lugar k.
        ordenCorrecto: item.ordenCorrecto.map((o) => idx.indexOf(o)),
      };
    }
    default:
      // `vf` y `calculo` no tienen opciones que barajar, pero igual se copian:
      // los módulos de content/banco/ son singletons de ES module y devolver la
      // misma referencia dejaría que una mutación accidental en la UI corrompiera
      // el banco para el resto de la sesión.
      return { ...item };
  }
}

/** Presenta una tanda completa. El rng avanza ítem a ítem: el resultado
 *  depende del orden, que es justamente lo que se quiere reproducir. */
export function presentarTanda(items: readonly Item[], semilla: number): Item[] {
  const rng = crearRng(semilla);
  return items.map((it) => presentarItem(it, rng));
}

/* ─── Calificación ────────────────────────────────────────────────── */

/**
 * Forma de `respuesta` según el tipo:
 *   unica | caso  → number (índice)
 *   multiple      → number[] (índices)
 *   vf            → boolean
 *   emparejar     → [number, number][] (pares elegidos)
 *   calculo       → number
 *   ordenar       → number[] (posiciones del array presentado, en el orden
 *                             en que el usuario las colocó)
 * Cualquier otra forma se califica como incorrecta, nunca lanza.
 */
export function calificar(item: Item, respuesta: unknown): boolean {
  switch (item.tipo) {
    case 'unica':
    case 'caso':
      return typeof respuesta === 'number' && respuesta === item.correcta;

    case 'vf':
      return typeof respuesta === 'boolean' && respuesta === item.correcta;

    case 'calculo':
      return (
        typeof respuesta === 'number' &&
        Number.isFinite(respuesta) &&
        Math.abs(respuesta - item.respuesta) <= item.tolerancia
      );

    case 'multiple': {
      if (!Array.isArray(respuesta)) return false;
      // Un elemento no numérico invalida la respuesta entera: filtrarlo en
      // silencio permitiría que ["0", 1, "basura"] se calificara como correcta.
      if (!respuesta.every((n) => typeof n === 'number')) return false;
      const dadas = [...new Set(respuesta as number[])].sort((a, b) => a - b);
      const esperadas = [...item.correctas].sort((a, b) => a - b);
      return dadas.length === esperadas.length && dadas.every((v, i) => v === esperadas[i]);
    }

    case 'ordenar': {
      if (!Array.isArray(respuesta)) return false;
      return (
        respuesta.length === item.ordenCorrecto.length &&
        respuesta.every((v, i) => v === item.ordenCorrecto[i])
      );
    }

    case 'emparejar': {
      if (!Array.isArray(respuesta)) return false;
      const pares = respuesta as unknown[];
      if (pares.length !== item.pares.length) return false;
      const esperado = new Map(item.pares);
      const vistos = new Set<number>();
      for (const par of pares) {
        if (!Array.isArray(par) || par.length !== 2) return false;
        const [i, d] = par as [unknown, unknown];
        if (typeof i !== 'number' || typeof d !== 'number') return false;
        if (vistos.has(i)) return false;
        vistos.add(i);
        if (esperado.get(i) !== d) return false;
      }
      return true;
    }
  }
}

/** true si el usuario dejó el ítem sin tocar. Distingue "en blanco" de "errado". */
export function sinResponder(respuesta: unknown): boolean {
  if (respuesta === null || respuesta === undefined) return true;
  if (Array.isArray(respuesta)) return respuesta.length === 0;
  if (typeof respuesta === 'string') return respuesta.trim() === '';
  return false;
}

/** Ítems vistos en los últimos N intentos. Alimenta `itemsRecientes`. */
export function itemsDeIntentosRecientes(
  intentos: readonly { itemIds: string[] }[],
  cuantos = 2,
): string[] {
  return [...new Set(intentos.slice(0, cuantos).flatMap((i) => i.itemIds))];
}
