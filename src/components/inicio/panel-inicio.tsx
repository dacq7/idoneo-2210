'use client';

// src/components/inicio/panel-inicio.tsx — Client Component (§10.3).
//
// La portada real, que reemplaza la provisional del Paso 5. Decide **una** cosa:
// qué debería hacer el usuario ahora. Todo lo demás de esta pantalla existe para
// justificar esa recomendación.
//
// ══ ES CLIENTE ENTERO, Y NO HAY ALTERNATIVA ══
// Racha, progreso, cola de repaso, fecha de examen y simulacro a medias viven en
// `localStorage`. El servidor no puede saber nada de eso, así que aporta el
// catálogo —proyectado (ADR-010, ADR-026)— y el resto se resuelve tras hidratar.
//
// ══ AQUÍ SE TOCA LA RACHA, Y SOLO AQUÍ ══
// Una vez por visita, en un efecto. Es el único sitio de la app que la escribe:
// `tocarRacha` es idempotente dentro del mismo día —si `ultimoDiaActivo` ya es
// hoy, no hace nada—, así que volver a la portada diez veces no la infla.
//
// Se toca al **abrir la app**, no al terminar una sesión de estudio. Es
// deliberado: la conducta que la racha mide es *volver*, y quien abre la app y
// lee un módulo hizo lo que la racha premia aunque no responda nada.
//
// ══ /plan Y /diagnostico ENTRAN POR AQUÍ (§11.5 + A-01) ══
// La barra de navegación tiene **cinco** destinos y no puede tener seis: A-01
// midió que a 200 % de zoom las cinco celdas quedan en 38 px, todas visibles por
// poco. Una sexta las deja en ~31 px y reabre un fallo AA que costó arreglar.
//
// Así que el acceso a `/plan` y `/diagnostico` es esta pantalla, que **es** el
// destino «Inicio» de la barra. No es un rodeo: es la jerarquía correcta —el
// plan se consulta al empezar la sesión de estudio, no se salta entre pantallas—
// y deja la barra para lo que se usa a diario.
//
// Descartado sustituir un destino de la barra (Módulos es el catálogo y se usa
// más) y descartado añadirlos solo a la barra lateral de `lg`: COMPONENTES.md
// fija que las dos barras nunca llevan contenido distinto.

import { useEffect, useMemo, useState } from 'react';
import { useEstado } from '@/hooks/usar-estado';
import { leerSesion, tocarRacha } from '@/lib/almacenamiento';
import { diasEntre, fechaLocalDe, sumarDias } from '@/lib/fechas';
import { generarPlan, type BloqueDelPlan, type ModuloDelPlan } from '@/lib/plan';
import { restantes } from '@/lib/cronometro';
import { colaDelDia } from '@/lib/srs';
import type { SesionCronometro } from '@/lib/tipos';
import { AvisoInstalar } from '@/components/pwa/aviso-instalar';
import { ConsultaRapida } from './consulta-rapida';
import { EnlaceDestino } from './enlace-destino';
import { Racha } from './racha';
import { ResumenInicio, type DatosResumen } from './resumen-inicio';
import { TarjetaContinuar, type AccionPrincipal } from './tarjeta-continuar';

export interface ModuloDeInicio extends ModuloDelPlan {
  /** Para no ofrecer un módulo que todavía no tiene contenido. */
  publicado: boolean;
}

interface Props {
  modulos: readonly ModuloDeInicio[];
  bloques: readonly BloqueDelPlan[];
  /** Cuentas del catálogo para la sección de consulta rápida. Llegan por prop
   *  —dos números, no dos listas— porque esta ruta es cliente y no puede
   *  importar `content/` (ADR-010), y escribirlas a mano las deja caducar. */
  totalGlosario: number;
  totalDatosDuros: number;
}

export function PanelInicio({ modulos, bloques, totalGlosario, totalDatosDuros }: Props) {
  const estado = useEstado();
  const [hoy, setHoy] = useState<string | null>(null);
  // El instante del montaje. `elegirAccion` lo necesita para saber si la sesión
  // guardada **sigue viva**: sin él, el escalón 1 afirmaba que el cronómetro
  // corre sobre un examen cuyo tiempo se agotó hace tres días (B1).
  const [ahoraMs, setAhoraMs] = useState<number | null>(null);
  const [sesionViva, setSesionViva] = useState<SesionCronometro | null>(null);

  // Efecto: aquí sí se lee el reloj (§10.4). `leerSesion()` NO es libre de
  // efectos —se autolimpia si el payload es ilegible—, así que tampoco podría
  // llamarse en el render aunque quisiéramos.
  useEffect(() => {
    const ahora = new Date();
    const fecha = fechaLocalDe(ahora);
    setHoy(fecha);
    setAhoraMs(ahora.getTime());
    setSesionViva(leerSesion());
    tocarRacha(fecha, sumarDias(fecha, -1), ahora.toISOString());
  }, []);

  const publicados = useMemo(() => modulos.filter((m) => m.publicado), [modulos]);

  const diagnostico = useMemo(
    () => estado?.intentos.find((i) => i.tipo === 'diagnostico')?.desglose ?? null,
    [estado],
  );

  const dominados = useMemo(
    () =>
      Object.entries(estado?.modulos ?? {})
        .filter(([, m]) => m.dominado)
        .map(([slug]) => slug),
    [estado],
  );

  const pendientesHoy = useMemo(
    () => (hoy === null ? 0 : colaDelDia(estado?.colaRepaso ?? {}, hoy).length),
    [estado, hoy],
  );

  // Días que faltan para el examen, o null si no hay fecha puesta. Solo se usa
  // para elegir el texto de «Última noche»: no decide nada más.
  const diasHastaExamen = useMemo(
    () => (hoy === null || !estado?.fechaExamen ? null : diasEntre(hoy, estado.fechaExamen)),
    [hoy, estado?.fechaExamen],
  );

  const accion = useMemo<AccionPrincipal | null>(() => {
    if (hoy === null || ahoraMs === null) return null;
    return elegirAccion({
      sesionViva,
      ahoraMs,
      hizoDiagnostico: estado?.diagnosticoHecho === true,
      pendientesHoy,
      hoy,
      fechaExamen: estado?.fechaExamen,
      modulos,
      publicados,
      bloques,
      diagnostico,
      dominados,
    });
  }, [
    hoy,
    ahoraMs,
    sesionViva,
    estado?.diagnosticoHecho,
    estado?.fechaExamen,
    pendientesHoy,
    modulos,
    publicados,
    bloques,
    diagnostico,
    dominados,
  ]);

  if (hoy === null || ahoraMs === null || accion === null) return <Esqueleto />;

  const resumen: DatosResumen = {
    // [R3] Solo los dominados que además están PUBLICADOS. Sin el cruce, un
    // respaldo importado con progreso de módulos que aquí no existen producía
    // «3/1 módulos dominados» — un numerador mayor que su denominador.
    dominados: dominados.filter((slug) => publicados.some((m) => m.slug === slug)).length,
    publicados: publicados.length,
    totales: modulos.length,
    repasoPendiente: pendientesHoy,
    intentos: estado?.intentos.length ?? 0,
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-3">
        <Racha dias={estado?.racha.dias ?? 0} />
      </div>

      <TarjetaContinuar accion={accion} />

      {/* [18.1] El aviso de instalación vive aquí y no en `Shell`: montarlo en
          el armazón lo pondría en las 20 rutas y devolvería `almacenamiento.ts`
          al grafo del layout raíz, que es el coste de 16 kB gz que ADR-021
          quitó. Se muestra solo desde el tercer día de racha. */}
      <AvisoInstalar diasDeRacha={estado?.racha.dias ?? 0} />

      <ResumenInicio datos={resumen} />

      {/* Los dos destinos que no caben en la barra (A-01). Van juntos y con
          nombre completo: es su único acceso desde la navegación. */}
      <section aria-labelledby="titulo-otros" className="space-y-3">
        <h2 id="titulo-otros">Prepararte con método</h2>
        <ul className="divide-y divide-border rounded-lg border border-border">
          <li>
            <EnlaceDestino
              href="/plan"
              titulo="Tu plan de estudio"
              detalle={
                estado?.fechaExamen
                  ? 'Los módulos repartidos hasta tu examen, en el orden que más te conviene.'
                  : 'Reparte los módulos hasta tu examen. Pon la fecha y se ajusta a tus días.'
              }
            />
          </li>
          {/* [A-44] No se repite el diagnóstico en la lista cuando YA es la
              acción principal de arriba: para un usuario nuevo aparecía dos
              veces en la misma pantalla, y compite justo con el escalón que la
              portada quiere que se pulse. Cuando ya lo hizo, aquí es donde
              vive la opción de repetirlo. */}
          {accion.clase !== 'diagnostico' ? (
            <li>
              <EnlaceDestino
                href="/diagnostico"
                titulo={estado?.diagnosticoHecho ? 'Repetir el diagnóstico' : 'Diagnóstico inicial'}
                detalle={
                  estado?.diagnosticoHecho
                    ? 'Vuelve a medirte para ver cuánto has movido la aguja.'
                    : '30 preguntas para saber por dónde empezar. No cuenta como nota.'
                }
              />
            </li>
          ) : null}
        </ul>
      </section>

      {/* [18.2–18.4] Las tres rutas nuevas del Paso 18. Entran por aquí y no
          por la barra, que sigue teniendo cinco destinos (§11.5 · A-01). */}
      <ConsultaRapida
        diasHastaExamen={diasHastaExamen}
        totalGlosario={totalGlosario}
        totalDatosDuros={totalDatosDuros}
      />
    </div>
  );
}

/**
 * A dónde lleva una sesión guardada.
 *
 * `TipoIntento` incluye `'quiz'` aunque hoy nadie escriba sesiones de ese tipo
 * —solo `final`, `bloque` y `diagnostico`—. El ternario original caía al ámbito
 * de bloque con un slug de módulo y producía `/simulacros/bloque/c5-…`, que es
 * un 404 silencioso. Mejor mandarlo a su quiz.
 */
function destinoDeSesion(sesion: SesionCronometro): string {
  switch (sesion.tipo) {
    case 'diagnostico':
      return '/diagnostico';
    case 'final':
      return '/simulacros/final';
    case 'quiz':
      return `/modulos/${sesion.ambito}/quiz`;
    case 'bloque':
      return `/simulacros/bloque/${sesion.ambito}`;
  }
}

/**
 * La prioridad, en un solo sitio y como función pura del estado.
 *
 * Está separada del render a propósito: es la regla de producto de la pantalla
 * —qué gana a qué— y merece leerse de corrido, sin JSX en medio. El orden y su
 * razón están en la cabecera de `tarjeta-continuar.tsx`.
 */
function elegirAccion(ctx: {
  sesionViva: SesionCronometro | null;
  /** Epoch ms del montaje. Sin él no se puede saber si la sesión sigue viva. */
  ahoraMs: number;
  hizoDiagnostico: boolean;
  pendientesHoy: number;
  hoy: string;
  fechaExamen?: string;
  modulos: readonly ModuloDeInicio[];
  publicados: readonly ModuloDeInicio[];
  bloques: readonly BloqueDelPlan[];
  diagnostico: Parameters<typeof generarPlan>[0]['diagnostico'];
  dominados: readonly string[];
}): AccionPrincipal {
  // 1 · Un examen a medias. Gana a todo, pero **el copy depende del reloj**.
  //
  // [B1] La primera versión decía «el cronómetro sigue corriendo» sin mirar la
  // hora, así que con una sesión de hace tres días afirmaba algo falso —§22
  // regla 10— y además **secuestraba la portada para siempre**: nada limpia la
  // clave salvo visitar la ruta del simulacro, así que los escalones 2 a 7
  // quedaban inalcanzables indefinidamente.
  if (ctx.sesionViva !== null) {
    const destino = destinoDeSesion(ctx.sesionViva);
    const quedan = restantes(ctx.sesionViva, ctx.ahoraMs);
    const vencido = quedan !== null && quedan <= 0;
    return {
      href: destino,
      titulo: vencido ? 'Se te acabó el tiempo de un examen' : 'Tienes un examen a medias',
      porque: vencido
        ? 'El cronómetro llegó a cero mientras tenías la app cerrada. Entra a cerrarlo y ver cómo quedó.'
        : 'El cronómetro sigue corriendo desde que lo empezaste, también con la app cerrada.',
      accion: vencido ? 'Ver cómo quedó' : 'Retomarlo ahora',
      clase: 'simulacro',
    };
  }

  // 2 · El examen es hoy o ya pasó.
  //
  // [B2] Va aquí arriba porque `generarPlan` degenera a propósito cuando no
  // quedan días (§7.6) y devuelve un único día SIN tareas de módulo. Sin este
  // escalón, la portada caía hasta el «siguiente sin dominar» y ofrecía 45
  // minutos de teoría nueva la mañana del examen —contradiciendo a `/plan`, que
  // en la misma pantalla dice «nada de teoría nueva»—. Y con el examen ya
  // pasado decía exactamente lo mismo.
  if (ctx.fechaExamen !== undefined && ctx.fechaExamen <= ctx.hoy) {
    const yaPaso = ctx.fechaExamen < ctx.hoy;
    return {
      href: '/repaso',
      titulo: yaPaso ? 'Tu examen ya pasó' : 'Tu examen es hoy',
      porque: yaPaso
        ? 'Si vas a volver a presentarte, cambia la fecha en tu plan y el estudio se reorganiza. Mientras tanto, mantén el repaso.'
        : 'Hoy no se estudia materia nueva: solo repaso de lo que ya viste y los datos duros.',
      accion: yaPaso ? 'Repasar lo que llevas' : 'Repasar antes del examen',
      clase: 'repaso',
    };
  }

  // 3 · El diagnóstico, que es lo que personaliza todo lo demás.
  if (!ctx.hizoDiagnostico) {
    return {
      href: '/diagnostico',
      titulo: 'Empieza por el diagnóstico',
      porque:
        '30 preguntas en 35 minutos para saber qué sabes y qué no. De ahí sale tu plan de estudio.',
      accion: 'Hacer el diagnóstico',
      clase: 'diagnostico',
    };
  }

  // 4 · Lo que toca hoy según el plan. El plan ya resolvió el orden.
  const plan = generarPlan({
    hoy: ctx.hoy,
    fechaExamen: ctx.fechaExamen,
    modulos: ctx.publicados,
    bloques: ctx.bloques,
    diagnostico: ctx.diagnostico,
    dominados: ctx.dominados,
  });
  const deHoy = plan.dias.find((d) => d.fecha === ctx.hoy)?.tareas ?? [];
  // Se salta el módulo del día si YA está dominado. El plan lo sigue incluyendo
  // a propósito —un dominado baja de prioridad pero no desaparece (Paso 13),
  // porque repasarlo vale algo—, pero ofrecerlo como acción principal cuando
  // hay cola de repaso vencida es peor uso de los quince minutos que el usuario
  // tiene: lo que está a punto de olvidar gana a lo que ya sabe.
  const moduloDeHoy = deHoy.find(
    (t) => t.clase === 'modulo' && !ctx.dominados.includes(t.slug),
  );
  if (moduloDeHoy !== undefined && moduloDeHoy.clase === 'modulo') {
    return {
      href: `/modulos/${moduloDeHoy.slug}`,
      titulo: moduloDeHoy.titulo,
      porque: `Es lo que te toca hoy según tu plan · ${moduloDeHoy.minutos} min.`,
      accion: 'Estudiar este módulo',
      clase: 'plan',
    };
  }

  // 5 · La cola de repaso: lo que estás a punto de olvidar vale más que materia nueva.
  if (ctx.pendientesHoy > 0) {
    return {
      href: '/repaso',
      titulo: 'Toca repasar',
      porque: `Tienes ${ctx.pendientesHoy} ${ctx.pendientesHoy === 1 ? 'elemento' : 'elementos'} que estás a punto de olvidar. Cinco minutos y no se pierden.`,
      accion: 'Empezar el repaso',
      clase: 'repaso',
    };
  }

  // 6 · El siguiente módulo publicado sin dominar, EN EL ORDEN DEL PLAN.
  // Se recorre el PLAN, no el array del catálogo: el escalón 4 presume que «el
  // plan ya resolvió el orden» y este usaba `MODULOS.find`, que devuelve el
  // primero por número de módulo. Dos escalones de la misma pantalla no pueden
  // ordenar con criterios distintos.
  const enOrdenDelPlan = plan.dias
    .flatMap((d) => d.tareas)
    .filter((t) => t.clase === 'modulo')
    .map((t) => (t.clase === 'modulo' ? t.slug : ''))
    .filter((slug) => !ctx.dominados.includes(slug));
  const slugPorDominar = enOrdenDelPlan[0];
  const porDominar =
    slugPorDominar !== undefined
      ? ctx.publicados.find((m) => m.slug === slugPorDominar)
      : ctx.publicados.find((m) => !ctx.dominados.includes(m.slug));
  if (porDominar !== undefined) {
    return {
      href: `/modulos/${porDominar.slug}`,
      titulo: porDominar.titulo,
      porque: `El siguiente que te falta por dominar · ${porDominar.minutosEstimados} min.`,
      accion: 'Estudiar este módulo',
      clase: 'modulo',
    };
  }

  // 7 · No hay nada publicado que no domine. Con 28 de 29 módulos en
  // preparación, este escalón es real y no teórico, así que dice la verdad en
  // vez de fingir que hay trabajo.
  return {
    href: '/repaso',
    titulo: 'Vas al día con lo que hay publicado',
    porque:
      ctx.publicados.length === 0
        ? 'Todavía no hay ningún módulo publicado. En cuanto suba el primero, aparecerá aquí.'
        : 'Dominas todo el contenido disponible. Mantén el repaso mientras suben los módulos que faltan.',
    accion: 'Ver la cola de repaso',
    clase: 'vacio',
  };
}

function Esqueleto() {
  return (
    <div className="space-y-6">
      <span className="sr-only">Cargando tu progreso</span>
      <span className="block h-32 w-full animate-pulse rounded-lg bg-accent" aria-hidden="true" />
      <span className="block h-20 w-full animate-pulse rounded-lg bg-accent" aria-hidden="true" />
    </div>
  );
}
