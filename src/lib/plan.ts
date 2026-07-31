// src/lib/plan.ts
// Reparte los módulos en los días disponibles hasta la fecha de examen.
// Funciones puras: reciben `hoy` como parámetro. Sin directiva de cliente.
//
// ══ QUÉ DECIDE ESTE MOTOR ══
// El ORDEN en que estudiar los 29 módulos y CUÁNTOS caben por día. Nada más:
// no lee el progreso —se lo pasan—, no conoce el reloj y no escribe.
//
// ══ LAS TRES RESTRICCIONES, EN ORDEN DE DUREZA ══
//  1. **Prerequisitos.** Un módulo NUNCA va antes que el suyo. Es una
//     restricción dura: violarla produce un plan que manda estudiar zonas de
//     entrenamiento antes que vías energéticas.
//  2. **Los 3 días finales están reservados** a simulacro, revisión de errores
//     y tarjetas. No entra materia nueva ahí.
//  3. **Prioridad** = debilidad × peso del bloque. Es la restricción blanda:
//     ordena lo que las dos anteriores dejan libre.

import { diasEntre, sumarDias } from './fechas';
import type { Bloque, DesgloseIntento, DiaPlan, Modulo, Plan, TareaPlan } from './tipos';

/**
 * Lo que el motor necesita saber de un módulo. **Seis campos, no los doce.**
 *
 * Igual que `ModuloDelInforme` en `informe.ts`, y por el mismo motivo (ADR-010):
 * este tipo cruza la frontera hacia el cliente. La primera versión de `/plan`
 * pasaba los `Modulo` completos con la excusa de que «proyectar ahorraría
 * poco», y **esa cifra nunca se midió**. Medida por el `code-reviewer`: 5 583 B
 * gz completos contra 1 126 B proyectados, **−75 %**. Viajaban `objetivos`,
 * `conceptosClave`, `subtitulo` y `estadoContenido`, que el motor no lee nunca.
 *
 * `Modulo` sigue siendo asignable a esto, así que el servidor y los tests
 * pueden pasar el objeto entero sin conversión.
 */
export type ModuloDelPlan = Pick<
  Modulo,
  'slug' | 'titulo' | 'bloque' | 'orden' | 'minutosEstimados' | 'prerequisitos'
>;

/** Lo que el motor necesita de un bloque: su id y cuánto pesa en el examen. */
export type BloqueDelPlan = Pick<Bloque, 'id' | 'pesoExamen'>;

/** Días finales reservados para simulacro + repaso. Brief §6.5. */
export const DIAS_RESERVADOS = 3;

/** Minutos diarios por encima de los cuales el plan avisa de que no es realista. */
export const MINUTOS_DIARIOS_EXIGENTES = 150;

/**
 * Horizonte que se usa cuando el usuario no ha puesto fecha de examen.
 *
 * **El plan sigue siendo útil sin fecha**, y eso es requisito, no cortesía: la
 * mayoría de los usuarios abren la app antes de tener fecha, y un plan que se
 * niega a existir hasta que le den un dato deja al usuario justo donde estaba.
 *
 * Seis semanas salen de la aritmética del propio contenido: 29 módulos suman
 * ~1000 minutos, que a un ritmo sostenible de ~30 min/día son ~34 días de
 * estudio más los 3 reservados. Es el horizonte más corto que no obliga a
 * emitir la advertencia de «esto no es realista» desde el primer día.
 */
export const DIAS_SIN_FECHA = 42;

export interface OpcionesPlan {
  /** 'YYYY-MM-DD'. */
  hoy: string;
  /** 'YYYY-MM-DD'. `undefined` = el usuario aún no la ha puesto. */
  fechaExamen?: string;
  modulos: readonly ModuloDelPlan[];
  bloques: readonly BloqueDelPlan[];
  /** Desglose del diagnóstico inicial. `null` si aún no se hizo. */
  diagnostico: DesgloseIntento | null;
  /** Módulos ya dominados: bajan de prioridad, no desaparecen. */
  dominados: readonly string[];
}

/**
 * Prioridad = debilidad × peso del bloque.
 *
 * - **debilidad**: 1 − (aciertos/total del diagnóstico). Sin dato ⇒ 0.6, que
 *   no es ni lo mejor ni lo peor: un módulo que el diagnóstico no midió no debe
 *   hundirse ni privilegiarse frente a los que sí tienen evidencia.
 * - **peso**: `pesoExamen` del bloque (A .20 · B .22 · C .33 · D .25). Fallar
 *   un módulo del bloque C cuesta más puntos que fallar uno del A, así que
 *   estudiarlo vale más.
 *
 * Un módulo dominado baja a la mitad, **no a cero**: repasar lo dominado sigue
 * valiendo algo, y sacarlo del plan del todo haría que el usuario lo olvidara
 * justo por haberlo aprendido pronto.
 */
function prioridad(
  modulo: ModuloDelPlan,
  bloques: readonly BloqueDelPlan[],
  diagnostico: DesgloseIntento | null,
  dominados: ReadonlySet<string>,
): number {
  const peso = bloques.find((b) => b.id === modulo.bloque)?.pesoExamen ?? 0.25;
  const conteo = diagnostico?.porModulo?.[modulo.slug];
  const debilidad = conteo && conteo.total > 0 ? 1 - conteo.correctas / conteo.total : 0.6;
  const factor = dominados.has(modulo.slug) ? 0.5 : 1;
  return debilidad * peso * factor;
}

/**
 * Orden respetando prerequisitos: un módulo nunca va antes que el suyo.
 *
 * Es un orden topológico con desempate por prioridad. Si hubiera un **ciclo**
 * de prerequisitos —error de contenido, no de código— se desbloquea tomando el
 * de mayor prioridad en vez de colgarse: un plan subóptimo es preferible a una
 * página que no carga. El validador de banco ya comprueba que no haya ciclos,
 * así que esto es la red de seguridad de la red de seguridad.
 */
function ordenarPorPrioridadYPrerequisitos(
  modulos: readonly ModuloDelPlan[],
  puntajes: Map<string, number>,
): ModuloDelPlan[] {
  const pendientes = new Map(modulos.map((m) => [m.slug, m]));
  const colocados = new Set<string>();
  const resultado: ModuloDelPlan[] = [];

  while (pendientes.size > 0) {
    // «Listo» = todos sus prerequisitos ya colocados, o fuera de este plan.
    const listos = [...pendientes.values()].filter((m) =>
      m.prerequisitos.every((p) => colocados.has(p) || !pendientes.has(p)),
    );
    const candidatos = listos.length > 0 ? listos : [...pendientes.values()];
    candidatos.sort(
      (a, b) =>
        (puntajes.get(b.slug) ?? 0) - (puntajes.get(a.slug) ?? 0) ||
        a.bloque.localeCompare(b.bloque) ||
        a.orden - b.orden,
    );
    const elegido = candidatos[0];
    resultado.push(elegido);
    colocados.add(elegido.slug);
    pendientes.delete(elegido.slug);
  }

  return resultado;
}

/** Las tareas de los 3 días finales, en orden fijo. */
function diasReservados(): TareaPlan[][] {
  return [
    [
      {
        clase: 'simulacro',
        ambito: 'global',
        descripcion: 'Simulacro final: 100 ítems, 120 min, sin pausas.',
        minutos: 120,
      },
    ],
    [
      {
        clase: 'repaso',
        descripcion: 'Revisión ítem por ítem de los errores del simulacro final.',
        minutos: 60,
      },
      { clase: 'repaso', descripcion: 'Los 5 temas prioritarios del informe.', minutos: 60 },
    ],
    [
      {
        clase: 'repaso',
        descripcion: 'Tarjetas de toda la cola + modo Última noche.',
        minutos: 60,
      },
    ],
  ];
}

export function generarPlan(opciones: OpcionesPlan): Plan {
  const { hoy, modulos, bloques, diagnostico } = opciones;
  const dominados = new Set(opciones.dominados);
  const advertencias: string[] = [];

  // Sin fecha, el plan usa un horizonte por defecto y lo dice. Ver DIAS_SIN_FECHA.
  const sinFecha = opciones.fechaExamen === undefined;
  const fechaExamen = opciones.fechaExamen ?? sumarDias(hoy, DIAS_SIN_FECHA);
  const diasDisponibles = Math.max(0, diasEntre(hoy, fechaExamen));

  if (sinFecha) {
    advertencias.push(
      'Todavía no has puesto la fecha del examen, así que este plan asume seis semanas desde hoy. ' +
        'Ponla arriba y se recalcula con tus días reales.',
    );
  }

  // El examen es hoy o ya pasó: no hay plan que hacer, hay una noche que salvar.
  if (diasDisponibles === 0) {
    return {
      generadoEn: hoy,
      fechaExamen,
      diasDisponibles: 0,
      dias: [
        {
          fecha: hoy,
          indice: 1,
          tareas: [
            {
              clase: 'repaso',
              descripcion: 'Modo Última noche: solo los datos duros. Nada de teoría nueva.',
              minutos: 60,
            },
          ],
          minutosTotales: 60,
        },
      ],
      advertencias: ['El examen es hoy o ya pasó. Solo alcanza a repasar los datos duros.'],
    };
  }

  const puntajes = new Map(
    modulos.map((m) => [m.slug, prioridad(m, bloques, diagnostico, dominados)]),
  );
  const orden = ordenarPorPrioridadYPrerequisitos(modulos, puntajes);

  const diasEstudio = Math.max(1, diasDisponibles - DIAS_RESERVADOS);
  const minutosTotales = orden.reduce((s, m) => s + m.minutosEstimados, 0);
  const objetivoDiario = Math.ceil(minutosTotales / diasEstudio);

  if (objetivoDiario > MINUTOS_DIARIOS_EXIGENTES) {
    advertencias.push(
      `Quedan ${diasDisponibles} días para ${orden.length} módulos: son ~${objetivoDiario} min diarios. ` +
        'Considera mover la fecha del examen o aceptar que llegarás con los bloques de menor peso sin cubrir.',
    );
  }
  if (diasDisponibles <= DIAS_RESERVADOS) {
    advertencias.push(
      'No alcanzan los días para reservar los 3 finales de repaso. El plan concentra el estudio y deja solo el último día para el simulacro.',
    );
  }

  const dias: DiaPlan[] = [];
  let indice = 1;
  let acumulado = 0;
  let tareasDia: TareaPlan[] = [];

  const cerrarDia = () => {
    dias.push({
      fecha: sumarDias(hoy, indice - 1),
      indice,
      tareas: tareasDia,
      minutosTotales: acumulado,
    });
    indice += 1;
    acumulado = 0;
    tareasDia = [];
  };

  for (const modulo of orden) {
    // Se cierra el día cuando ya se pasó del objetivo y quedan días por usar.
    // El módulo NO se parte: es la unidad mínima del plan, y media teoría no
    // sirve de nada.
    if (acumulado >= objetivoDiario && indice < diasEstudio) cerrarDia();
    tareasDia.push({
      clase: 'modulo',
      slug: modulo.slug,
      titulo: modulo.titulo,
      minutos: modulo.minutosEstimados,
    });
    acumulado += modulo.minutosEstimados;
  }
  if (tareasDia.length > 0) cerrarDia();

  // Los días de estudio que sobraron se llenan con repaso espaciado. Pasa
  // cuando hay mucho tiempo: es correcto, y es lo que el SRS necesita para
  // funcionar.
  while (indice <= diasEstudio) {
    tareasDia = [
      {
        clase: 'repaso',
        descripcion: 'Cola de repaso espaciado del día + tarjetas de los módulos flojos.',
        minutos: 30,
      },
    ];
    acumulado = 30;
    cerrarDia();
  }

  for (const tareas of diasReservados()) {
    if (indice > diasDisponibles) break;
    dias.push({
      fecha: sumarDias(hoy, indice - 1),
      indice,
      tareas,
      minutosTotales: tareas.reduce((s, t) => s + t.minutos, 0),
    });
    indice += 1;
  }

  return { generadoEn: hoy, fechaExamen, diasDisponibles, dias, advertencias };
}

/** Tareas de hoy. Alimenta la tarjeta «Continuar donde ibas» de la portada. */
export function tareasDeHoy(plan: Plan, hoy: string): TareaPlan[] {
  return plan.dias.find((d) => d.fecha === hoy)?.tareas ?? [];
}

/**
 * El primer día del plan que no ha pasado.
 *
 * Casi siempre coincide con `tareasDeHoy`, porque el plan se **regenera con
 * `hoy` en cada visita** y entonces su día 1 es hoy. Existe para el caso en que
 * no coincide: un `Plan` ya construido que se consulta con una fecha distinta
 * de la que lo generó —al serializarlo, en un test, o si algún día se cachea—.
 * Ahí `tareasDeHoy` devuelve vacío y la pantalla se queda sin nada que ofrecer.
 *
 * Es una guarda, no un caso de uso frecuente, y conviene no venderla como más
 * de lo que es: el primer test que se escribió para ella daba por hecho un
 * escenario —«el usuario se saltó una semana»— que con la regeneración por
 * visita **no ocurre**.
 */
export function diaVigente(plan: Plan, hoy: string): DiaPlan | null {
  return plan.dias.find((d) => d.fecha >= hoy) ?? null;
}
