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
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useEstado } from '@/hooks/usar-estado';
import { leerSesion, tocarRacha } from '@/lib/almacenamiento';
import { fechaLocalDe, sumarDias } from '@/lib/fechas';
import { generarPlan, type BloqueDelPlan, type ModuloDelPlan } from '@/lib/plan';
import { colaDelDia } from '@/lib/srs';
import type { SesionCronometro } from '@/lib/tipos';
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
}

export function PanelInicio({ modulos, bloques }: Props) {
  const estado = useEstado();
  const [hoy, setHoy] = useState<string | null>(null);
  const [sesionViva, setSesionViva] = useState<SesionCronometro | null>(null);

  // Efecto: aquí sí se lee el reloj (§10.4). `leerSesion()` NO es libre de
  // efectos —se autolimpia si el payload es ilegible—, así que tampoco podría
  // llamarse en el render aunque quisiéramos.
  useEffect(() => {
    const ahora = new Date();
    const fecha = fechaLocalDe(ahora);
    setHoy(fecha);
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

  const accion = useMemo<AccionPrincipal | null>(() => {
    if (hoy === null) return null;
    return elegirAccion({
      sesionViva,
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

  if (hoy === null || accion === null) return <Esqueleto />;

  const resumen: DatosResumen = {
    dominados: dominados.length,
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
        </ul>
      </section>
    </div>
  );
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
  // 1 · Un simulacro a medias: el reloj sigue corriendo.
  if (ctx.sesionViva !== null) {
    const destino =
      ctx.sesionViva.tipo === 'diagnostico'
        ? '/diagnostico'
        : ctx.sesionViva.tipo === 'final'
          ? '/simulacros/final'
          : `/simulacros/bloque/${ctx.sesionViva.ambito}`;
    return {
      href: destino,
      titulo: 'Tienes un examen a medias',
      porque: 'El cronómetro sigue corriendo desde que lo empezaste, también con la app cerrada.',
      accion: 'Retomarlo ahora',
      clase: 'simulacro',
    };
  }

  // 2 · El diagnóstico, que es lo que personaliza todo lo demás.
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

  // 3 · Lo que toca hoy según el plan. El plan ya resolvió el orden.
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

  // 4 · La cola de repaso: lo que estás a punto de olvidar vale más que lo nuevo.
  if (ctx.pendientesHoy > 0) {
    return {
      href: '/repaso',
      titulo: 'Toca repasar',
      porque: `Tienes ${ctx.pendientesHoy} ${ctx.pendientesHoy === 1 ? 'elemento' : 'elementos'} que estás a punto de olvidar. Cinco minutos y no se pierden.`,
      accion: 'Empezar el repaso',
      clase: 'repaso',
    };
  }

  // 5 · El siguiente módulo publicado sin dominar.
  const porDominar = ctx.publicados.find((m) => !ctx.dominados.includes(m.slug));
  if (porDominar !== undefined) {
    return {
      href: `/modulos/${porDominar.slug}`,
      titulo: porDominar.titulo,
      porque: `El siguiente que te falta por dominar · ${porDominar.minutosEstimados} min.`,
      accion: 'Estudiar este módulo',
      clase: 'modulo',
    };
  }

  // 6 · No hay nada publicado que no domine. Con 28 de 29 módulos en
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

function EnlaceDestino({
  href,
  titulo,
  detalle,
}: {
  href: string;
  titulo: string;
  detalle: string;
}) {
  return (
    <Link
      href={href}
      className="flex min-h-11 items-center gap-3 px-3 py-3 transition-colors duration-150 ease-out hover:bg-accent hover:text-foreground"
    >
      <span className="min-w-0 grow space-y-0.5">
        <span className="block font-medium">{titulo}</span>
        <span className="block text-[0.8125rem] text-muted-foreground">{detalle}</span>
      </span>
      <ArrowRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
    </Link>
  );
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
