// src/lib/informe.ts
// Construye el informe diagnóstico. Funciones puras, sin directiva de cliente
// y sin reloj: todo lo que necesita llega por parámetro.
//
// ══ QUÉ ES ESTE ARCHIVO Y QUÉ NO ══
// Es el dueño de cómo se lee un intento: el puntaje, el veredicto, el desglose
// por bloque/módulo/nivel, los cinco temas prioritarios y la detección de
// patrón. No decide si una respuesta es correcta —eso es `calificar()` de
// `simulacro.ts`— ni escribe nada en `localStorage`.
//
// Desde este paso, `usar-sesion.ts` deja de calcular el puntaje con su copia de
// la fórmula y llama a `calcularPuntaje` de aquí. Estaba marcado en el archivo
// desde el Paso 9.

import { sinResponder } from './simulacro';
import type {
  Bloque,
  BloqueId,
  DesgloseIntento,
  Informe,
  IntentoSimulacro,
  Item,
  Modulo,
  NivelCognitivo,
  RespuestaItem,
  TemaPrioritario,
  Veredicto,
} from './tipos';

/**
 * Lo mínimo que el informe necesita saber de un módulo y de un bloque.
 *
 * No son `Modulo` y `Bloque` completos **a propósito** (ADR-010): estos tipos
 * cruzan la frontera hacia el cliente, y `Modulo` arrastra `objetivos`,
 * `conceptosClave`, `subtitulo` y `prerequisitos` — con 29 módulos, kilobytes
 * de carga útil por una pantalla que solo pinta títulos.
 *
 * `Modulo` y `Bloque` siguen siendo asignables a estos, así que el servidor y
 * los tests pueden pasar el objeto entero sin conversión.
 */
export type ModuloDelInforme = Pick<Modulo, 'slug' | 'titulo' | 'bloque'>;
export type BloqueDelInforme = Pick<Bloque, 'id' | 'titulo'>;

const BLOQUES: BloqueId[] = ['A', 'B', 'C', 'D'];
const NIVELES: NivelCognitivo[] = ['recuerdo', 'comprension', 'aplicacion'];

/** Mínimo de ítems evaluados para que un módulo pueda entrar al top-5. */
export const MIN_ITEMS_TEMA_PRIORITARIO = 3;

/**
 * Cuenta aciertos por bloque, módulo y nivel cognitivo.
 *
 * Las cuatro claves de bloque y las tres de nivel se inicializan **siempre**,
 * aunque el intento no toque ese bloque. Es lo que permite que el resto del
 * motor las lea por clave sin comprobar existencia, y lo que `esqIntento`
 * exige desde ADR-023 — con `z.record` a secas, un desglose incompleto pasaba
 * la validación y rompía `construirInforme` al leer `porBloque.B.total`.
 *
 * Una respuesta cuyo ítem no está en `items` se ignora en silencio: pasa
 * cuando se revisa un intento viejo y el contenido cambió (pasos 15–17). Es
 * preferible a un informe que revienta, y el conteo sigue siendo honesto
 * porque `total` cuenta lo evaluado, no lo prometido.
 */
export function calcularDesglose(
  items: readonly Item[],
  respuestas: readonly RespuestaItem[],
): DesgloseIntento {
  const porItem = new Map(items.map((it) => [it.id, it]));

  const porBloque = Object.fromEntries(
    BLOQUES.map((b) => [b, { correctas: 0, total: 0 }]),
  ) as DesgloseIntento['porBloque'];
  const porNivel = Object.fromEntries(
    NIVELES.map((n) => [n, { correctas: 0, total: 0 }]),
  ) as DesgloseIntento['porNivel'];
  const porModulo: DesgloseIntento['porModulo'] = {};

  for (const r of respuestas) {
    const item = porItem.get(r.itemId);
    if (!item) continue;

    porBloque[item.bloque].total += 1;
    porNivel[item.nivel].total += 1;
    porModulo[item.modulo] ??= { correctas: 0, total: 0 };
    porModulo[item.modulo].total += 1;

    if (r.correcta) {
      porBloque[item.bloque].correctas += 1;
      porNivel[item.nivel].correctas += 1;
      porModulo[item.modulo].correctas += 1;
    }
  }

  return { porBloque, porModulo, porNivel };
}

/**
 * 0–100, redondeado. **El denominador es el total de ítems presentados, no el
 * de respondidos**: dejar en blanco no mejora el puntaje, que es lo que hace
 * comparable un simulacro con auto-envío contra uno terminado a mano.
 */
export function calcularPuntaje(respuestas: readonly RespuestaItem[], total: number): number {
  if (total <= 0) return 0;
  return Math.round((respuestas.filter((r) => r.correcta).length / total) * 100);
}

/**
 * Escala de §3.4 del documento de contenido.
 *
 * **Estos cortes son criterio interno de la app, NO el puntaje oficial de
 * aprobación de COLEF.** No es una cautela legal de adorno: la app no conoce
 * el corte real del examen, y presentar «75 = pasarías» como si lo fuera sería
 * exactamente la clase de afirmación que §22 regla 11 prohíbe. Van con margen
 * de seguridad deliberado, y `NOTA_VEREDICTO` lo dice en pantalla — siempre,
 * junto al veredicto, no escondida en un pie.
 */
export function calcularVeredicto(puntaje: number): Veredicto {
  if (puntaje >= 85) {
    return {
      clave: 'solido',
      titulo: 'Sólido',
      mensaje:
        'Estás listo. Mantén con repaso diario y un simulacro cada 4 días para no perder filo.',
      color: 'exito',
    };
  }
  if (puntaje >= 75) {
    return {
      clave: 'listo',
      titulo: 'Listo',
      mensaje: 'Pasarías, pero sin margen. Cierra los 3 módulos más débiles antes de presentar.',
      color: 'primary',
    };
  }
  if (puntaje >= 60) {
    return {
      clave: 'camino',
      titulo: 'En camino',
      mensaje:
        'Todavía no. Tienes la base; te falta precisión en los datos. Necesitas 2 semanas más.',
      color: 'aviso',
    };
  }
  return {
    clave: 'riesgo',
    titulo: 'En riesgo',
    mensaje:
      'No presentes aún. Vuelve al plan por módulos: el simulacro es para medir, no para estudiar.',
    color: 'destructive',
  };
}

export const NOTA_VEREDICTO =
  'Estos cortes son criterios internos de Idóneo 2210, con margen de seguridad. ' +
  'No corresponden al puntaje oficial de aprobación de COLEF.';

function porcentaje(c: { correctas: number; total: number } | undefined): number {
  if (c === undefined || c.total === 0) return 0;
  return Math.round((c.correctas / c.total) * 100);
}

const SIN_DATOS = { correctas: 0, total: 0 } as const;

/**
 * Lectura defensiva de un conteo. **Segunda línea de defensa, y no sobra.**
 *
 * `esqIntento` ya exige las cuatro claves de bloque y las tres de nivel desde
 * ADR-023, así que un intento que entre por `importarJSON` no puede llegar
 * cojo. Pero el motor es público y lo llaman los tests, el Paso 13 y cualquier
 * código futuro con un desglose construido a mano: depender de que alguien más
 * haya validado es exactamente la clase de suposición que rompió `restantes()`
 * en ADR-019.
 *
 * El coste es una función de tres líneas; el fallo que evita es la pantalla de
 * resultados en blanco después de dos horas de examen.
 */
function conteoDe(
  registro: Record<string, { correctas: number; total: number }> | undefined,
  clave: string,
): { correctas: number; total: number } {
  return registro?.[clave] ?? SIN_DATOS;
}

/**
 * Los módulos con peor razón correctas/total y al menos 3 ítems evaluados.
 *
 * El mínimo no es arbitrario: con 1 o 2 ítems, un 0 % dice más sobre el
 * muestreo que sobre el usuario, y mandarlo a estudiar un módulo entero por
 * eso es malgastar su tiempo — que es el recurso escaso de alguien que estudia
 * de noche después de trabajar.
 *
 * Orden determinista: peor porcentaje primero, desempate por más ítems
 * evaluados (más evidencia) y luego por slug, para que dos informes del mismo
 * intento no se ordenen distinto.
 */
export function temasPrioritarios(
  desglose: DesgloseIntento,
  modulos: readonly ModuloDelInforme[],
  maximo = 5,
): TemaPrioritario[] {
  const porSlug = new Map(modulos.map((m) => [m.slug, m]));
  return Object.entries(desglose.porModulo ?? {})
    .filter(([, c]) => c.total >= MIN_ITEMS_TEMA_PRIORITARIO)
    .map(([slug, c]) => {
      const modulo = porSlug.get(slug);
      return {
        modulo: slug,
        titulo: modulo?.titulo ?? slug,
        bloque: (modulo?.bloque ?? 'A') as BloqueId,
        correctas: c.correctas,
        total: c.total,
        porcentaje: porcentaje(c),
      };
    })
    .sort(
      (a, b) => a.porcentaje - b.porcentaje || b.total - a.total || a.modulo.localeCompare(b.modulo),
    )
    .slice(0, maximo);
}

/**
 * Detección de patrón: mensajes **accionables**, no felicitaciones.
 *
 * Puede devolver un array vacío, y eso es una función, no una carencia: no se
 * inventa un patrón que no está en los datos. Un informe que siempre encuentra
 * algo que decir enseña al usuario a no leerlo.
 *
 * Los umbrales de tamaño de muestra (≥5 ítems por nivel) existen por lo mismo
 * que el mínimo del top-5: con 3 ítems de aplicación, un 33 % es ruido.
 */
export function detectarPatrones(desglose: DesgloseIntento): string[] {
  const mensajes: string[] = [];
  const rec = conteoDe(desglose.porNivel, 'recuerdo');
  const apl = conteoDe(desglose.porNivel, 'aplicacion');
  const com = conteoDe(desglose.porNivel, 'comprension');

  if (rec.total >= 5 && apl.total >= 5) {
    const dRec = porcentaje(rec);
    const dApl = porcentaje(apl);
    // El patrón que pidió el usuario, y el más común de los dos: sabe las
    // definiciones y no las está aplicando. El remedio no es releer la teoría
    // —ya se la sabe—, es hacer la Práctica, que es donde se aplica.
    if (dRec - dApl >= 25) {
      mensajes.push(
        'Te sabes las definiciones pero no las estás aplicando. Haz la Práctica de los módulos, no solo la teoría.',
      );
    }
    if (dApl - dRec >= 25) {
      mensajes.push(
        'Razonas bien pero se te escapan los datos exactos. Dedica las tarjetas y el modo Última noche a los valores numéricos.',
      );
    }
  }

  if (com.total >= 5 && porcentaje(com) < 50 && porcentaje(rec) >= 70) {
    mensajes.push(
      'Memorizas listas pero no distingues conceptos parecidos. Fíjate en las explicaciones de los distractores: ahí está la diferencia.',
    );
  }

  const flojos = Object.values(desglose.porBloque ?? {}).filter(
    (b) => b.total >= 5 && porcentaje(b) < 50,
  );
  if (flojos.length >= 3) {
    mensajes.push(
      'El bajo desempeño es parejo en todos los bloques: no es un tema puntual, es cobertura. Sigue el plan por días en vez de saltar entre módulos.',
    );
  }

  return mensajes;
}

/**
 * Delta en puntos porcentuales contra el intento anterior del mismo tipo.
 *
 * `null` por bloque cuando alguno de los dos intentos no lo evaluó: comparar
 * contra un bloque sin ítems daría «+0» o «−100» y las dos cifras serían
 * mentira. Preferimos no decir nada a decir algo falso.
 */
export function compararConAnterior(
  actual: DesgloseIntento,
  anterior: DesgloseIntento | null,
): Record<BloqueId, number | null> | null {
  if (!anterior) return null;
  const delta = {} as Record<BloqueId, number | null>;
  for (const b of BLOQUES) {
    const a = conteoDe(actual.porBloque, b);
    const p = conteoDe(anterior.porBloque, b);
    delta[b] = a.total === 0 || p.total === 0 ? null : porcentaje(a) - porcentaje(p);
  }
  return delta;
}

export function construirInforme(
  intento: IntentoSimulacro,
  modulos: readonly ModuloDelInforme[],
  bloques: readonly BloqueDelInforme[],
  intentoAnterior: IntentoSimulacro | null,
): Informe {
  const porSlug = new Map(modulos.map((m) => [m.slug, m]));

  return {
    intentoId: intento.id,
    tipo: intento.tipo,
    puntaje: intento.puntaje,
    veredicto: calcularVeredicto(intento.puntaje),
    segundosUsados: intento.segundosUsados,
    desglose: intento.desglose,
    // Solo los bloques con ítems: una barra a 0 % en un bloque que el intento
    // no evaluó se lee como «lo hiciste fatal», que es justo lo contrario de
    // lo que pasó.
    dominioPorBloque: bloques
      .map((b) => ({
        bloque: b.id,
        titulo: b.titulo,
        porcentaje: porcentaje(conteoDe(intento.desglose.porBloque, b.id)),
        total: conteoDe(intento.desglose.porBloque, b.id).total,
      }))
      .filter((b) => b.total > 0),
    dominioPorModulo: Object.entries(intento.desglose.porModulo ?? {})
      .map(([slug, c]) => ({
        modulo: slug,
        titulo: porSlug.get(slug)?.titulo ?? slug,
        porcentaje: porcentaje(c),
        total: c.total,
      }))
      .sort((a, b) => a.porcentaje - b.porcentaje || a.modulo.localeCompare(b.modulo)),
    temasPrioritarios: temasPrioritarios(intento.desglose, modulos),
    patrones: detectarPatrones(intento.desglose),
    deltaPorBloque: compararConAnterior(intento.desglose, intentoAnterior?.desglose ?? null),
    sinResponder: (intento.respuestas ?? []).filter((r) => sinResponder(r.respuesta)).length,
  };
}

/**
 * Arma el `IntentoSimulacro` que se persiste al cerrar una sesión cronometrada.
 *
 * Vive aquí y no en el controlador por dos razones, y la segunda es la que
 * importa: es una función pura y **su radio de daño es el estado entero**. Si
 * lo que produce dejara de satisfacer `esqIntento`, `esqEstadoProgreso` rechaza
 * el estado completo y se va a cuarentena (ADR-008) — el usuario perdería de
 * vista módulos, cola de repaso e historial, no un intento. El endurecimiento
 * de ADR-023 sube el precio de equivocarse aquí, así que esto necesita test
 * propio, y desde el controlador no lo tenía.
 *
 * `segundosUsados` es el tiempo REAL de reloj, no la suma de segundos por ítem:
 * en un examen cronometrado lo que cuenta es cuánto duró, incluidas las pausas
 * y el rato con la pestaña cerrada. La suma por ítem sigue guardada en cada
 * respuesta, que es donde sirve para la revisión.
 */
export function construirIntento(
  sesion: Pick<
    IntentoSimulacro,
    'tipo' | 'ambito' | 'semilla'
  > & { intentoId: string; iniciadoEnMs: number; itemIds: readonly string[] },
  detalle: readonly { item: Item; valor: unknown; correcta: boolean; segundos: number; marcada: boolean }[],
  total: number,
  terminadoEnMs: number,
): IntentoSimulacro {
  const respuestas: RespuestaItem[] = detalle.map((d) => ({
    itemId: d.item.id,
    respuesta: d.valor,
    correcta: d.correcta,
    segundos: d.segundos,
    marcada: d.marcada,
  }));

  return {
    id: sesion.intentoId,
    tipo: sesion.tipo,
    ambito: sesion.ambito,
    semilla: sesion.semilla,
    iniciadoEn: new Date(sesion.iniciadoEnMs).toISOString(),
    terminadoEn: new Date(terminadoEnMs).toISOString(),
    segundosUsados: Math.max(0, Math.round((terminadoEnMs - sesion.iniciadoEnMs) / 1000)),
    totalItems: total,
    itemIds: [...sesion.itemIds],
    respuestas,
    puntaje: calcularPuntaje(respuestas, total),
    desglose: calcularDesglose(detalle.map((d) => d.item), respuestas),
  };
}

/** Último intento del mismo tipo y ámbito, excluyendo el actual. */
export function intentoAnteriorComparable(
  intentos: readonly IntentoSimulacro[],
  actual: IntentoSimulacro,
): IntentoSimulacro | null {
  return (
    intentos.find(
      (i) => i.id !== actual.id && i.tipo === actual.tipo && i.ambito === actual.ambito,
    ) ?? null
  );
}
