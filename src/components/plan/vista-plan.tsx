'use client';

// src/components/plan/vista-plan.tsx — Client Component (§10.3).
//
// El plan de estudio, día a día. Es cliente entero por lo mismo que el informe:
// **la fecha de examen, el diagnóstico y los módulos dominados viven en
// `localStorage`**, así que el servidor no puede generar el plan. La página
// aporta el catálogo reducido (ADR-010) y el resto se resuelve tras hidratar.
//
// ══ EL PLAN EXISTE AUNQUE FALTE LA FECHA DE EXAMEN ══
// Requisito del paso, y la decisión de fondo del componente. Sin fecha,
// `generarPlan` asume seis semanas y **lo dice** en sus advertencias; aquí
// además se ofrece ponerla. Lo que no se hace es negarse a mostrar nada hasta
// que el usuario aporte un dato: la mayoría abre la app antes de tener fecha, y
// un plan vacío lo deja donde estaba.
//
// ══ EL RELOJ (§22 regla 6) ══
// `generarPlan` recibe `hoy` y no lo lee. Aquí se obtiene en un efecto —nunca
// en el render— y es la FECHA LOCAL (`fechaLocalDe`): con UTC, el plan cambiaría
// de día a las 7 de la tarde en Colombia.

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { CalendarDays, TriangleAlert } from 'lucide-react';
import { useEstado } from '@/hooks/usar-estado';
import { etiquetaCorta, fechaLocalDe } from '@/lib/fechas';
import { diaVigente, generarPlan } from '@/lib/plan';
import type { BloqueDelPlan, ModuloDelPlan } from '@/lib/plan';
import type { TareaPlan } from '@/lib/tipos';
import { cn } from '@/lib/utils';
import { CampoFechaExamen } from './campo-fecha-examen';

interface Props {
  /** Proyectados a los seis campos que el motor lee (ADR-026). */
  modulos: readonly ModuloDelPlan[];
  bloques: readonly BloqueDelPlan[];
}

export function VistaPlan({ modulos, bloques }: Props) {
  const estado = useEstado();
  const [hoy, setHoy] = useState<string | null>(null);

  // Efecto: aquí sí se puede leer el reloj (§10.4). `null` en el primer render
  // evita que servidor y cliente pinten fechas distintas.
  useEffect(() => {
    setHoy(fechaLocalDe(new Date()));
  }, []);

  const diagnostico = useMemo(() => {
    const ultimo = estado?.intentos.find((i) => i.tipo === 'diagnostico');
    return ultimo?.desglose ?? null;
  }, [estado]);

  const dominados = useMemo(
    () =>
      Object.entries(estado?.modulos ?? {})
        .filter(([, m]) => m.dominado)
        .map(([slug]) => slug),
    [estado],
  );

  const plan = useMemo(() => {
    if (hoy === null) return null;
    return generarPlan({
      hoy,
      fechaExamen: estado?.fechaExamen,
      modulos,
      bloques,
      diagnostico,
      dominados,
    });
  }, [hoy, estado?.fechaExamen, modulos, bloques, diagnostico, dominados]);

  if (plan === null || hoy === null) {
    return (
      <div className="space-y-4">
        <span className="sr-only">Preparando tu plan</span>
        <span className="block h-32 w-full animate-pulse rounded-lg bg-accent" aria-hidden="true" />
      </div>
    );
  }

  const vigente = diaVigente(plan, hoy);
  const sinDiagnostico = diagnostico === null;

  return (
    <div className="space-y-8">
      {/* El campo va ARRIBA cuando falta la fecha —es lo que desbloquea el
          resto— y abajo del todo cuando ya está puesta, donde no estorba. */}
      {!estado?.fechaExamen ? <CampoFechaExamen /> : null}

      {sinDiagnostico ? (
        <section
          aria-labelledby="sin-diagnostico"
          className="space-y-3 rounded-lg border border-border bg-card p-4 shadow-sm sm:p-6"
        >
          <h2 id="sin-diagnostico">Este plan mejora mucho con el diagnóstico</h2>
          <p className="text-muted-foreground">
            Ahora mismo el orden sale del peso de cada bloque en el examen y de los prerequisitos
            entre módulos, que es un criterio razonable pero genérico. Con el diagnóstico hecho, el
            plan prioriza además <strong className="font-semibold">lo que de verdad fallas</strong>.
          </p>
          <p>
            <Link
              href="/diagnostico"
              className="inline-flex min-h-11 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors duration-150 ease-out hover:bg-primary/90"
            >
              Hacer el diagnóstico
            </Link>
          </p>
        </section>
      ) : null}

      {plan.advertencias.length > 0 ? (
        <section aria-labelledby="advertencias" className="space-y-2">
          <h2 id="advertencias" className="sr-only">
            Advertencias sobre este plan
          </h2>
          <ul className="space-y-2">
            {plan.advertencias.map((a) => (
              <li
                key={a}
                className="flex items-start gap-3 rounded-md border-l-4 border-aviso bg-aviso/10 p-3 text-[0.8125rem] leading-[1.45]"
              >
                <TriangleAlert className="mt-0.5 size-4 shrink-0 text-aviso" aria-hidden="true" />
                {/* Ya no se enlaza a `/ajustes`: esa ruta se construye en el
                    paso 18.5 y hasta entonces devuelve 404 — el remedio de la
                    advertencia era un enlace roto. El campo para poner la fecha
                    está arriba, en esta misma pantalla. */}
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section aria-labelledby="resumen-plan" className="space-y-3">
        <h2 id="resumen-plan">
          {estado?.fechaExamen ? 'Hasta tu examen' : 'Las próximas seis semanas'}
        </h2>
        <dl className="flex flex-wrap gap-x-6 gap-y-2 text-[0.9375rem]">
          <div className="flex items-center gap-2">
            <CalendarDays className="size-4 text-muted-foreground" aria-hidden="true" />
            <dt className="sr-only">Días disponibles</dt>
            <dd>
              <span className="font-mono font-semibold tabular-nums">{plan.diasDisponibles}</span>{' '}
              días
            </dd>
          </div>
          <div>
            <dt className="sr-only">Módulos</dt>
            <dd>
              <span className="font-mono font-semibold tabular-nums">{modulos.length}</span> módulos
            </dd>
          </div>
        </dl>
      </section>

      {vigente !== null ? (
        <section aria-labelledby="hoy" className="space-y-3">
          <h2 id="hoy">{vigente.fecha === hoy ? 'Hoy toca' : 'Por aquí ibas'}</h2>
          {vigente.fecha !== hoy ? (
            <p className="text-muted-foreground">
              Tu plan empezaba el {etiquetaCorta(vigente.fecha)}. No pasa nada por retomarlo aquí:
              el orden sigue siendo el correcto.
            </p>
          ) : null}
          <DiaDelPlan tareas={vigente.tareas} minutos={vigente.minutosTotales} destacado />
        </section>
      ) : null}

      <section aria-labelledby="calendario" className="space-y-3">
        <h2 id="calendario">El plan completo</h2>
        <ol className="space-y-3">
          {plan.dias.map((dia) => (
            <li key={dia.fecha} className="space-y-1.5">
              <p className="flex flex-wrap items-baseline gap-x-2 text-[0.8125rem]">
                <span className="font-semibold">
                  Día {dia.indice} · {etiquetaCorta(dia.fecha)}
                </span>
                <span className="text-muted-foreground">
                  {dia.minutosTotales} min
                  {dia.fecha === hoy ? ' · hoy' : ''}
                </span>
              </p>
              <DiaDelPlan tareas={dia.tareas} minutos={dia.minutosTotales} />
            </li>
          ))}
        </ol>
      </section>

      {estado?.fechaExamen ? <CampoFechaExamen fechaActual={estado.fechaExamen} /> : null}
    </div>
  );
}

function DiaDelPlan({
  tareas,
  minutos,
  destacado = false,
}: {
  tareas: readonly TareaPlan[];
  minutos: number;
  destacado?: boolean;
}) {
  return (
    <ul
      className={cn(
        'divide-y divide-border rounded-lg border',
        destacado ? 'border-primary bg-primary/5' : 'border-border',
      )}
    >
      {tareas.map((tarea, i) => (
        <li key={i}>
          {tarea.clase === 'modulo' ? (
            <Link
              href={`/modulos/${tarea.slug}`}
              className="flex min-h-11 items-center gap-3 px-3 py-2.5 transition-colors duration-150 ease-out hover:bg-accent hover:text-foreground"
            >
              <span className="min-w-0 grow text-[0.9375rem]">{tarea.titulo}</span>
              <span className="shrink-0 font-mono text-[0.8125rem] tabular-nums text-muted-foreground">
                {tarea.minutos} min
              </span>
            </Link>
          ) : tarea.clase === 'simulacro' ? (
            <Link
              href="/simulacros/final"
              className="flex min-h-11 items-center gap-3 px-3 py-2.5 transition-colors duration-150 ease-out hover:bg-accent hover:text-foreground"
            >
              <span className="min-w-0 grow text-[0.9375rem]">{tarea.descripcion}</span>
              <span className="shrink-0 font-mono text-[0.8125rem] tabular-nums text-muted-foreground">
                {tarea.minutos} min
              </span>
            </Link>
          ) : (
            <Link
              href="/repaso"
              className="flex min-h-11 items-center gap-3 px-3 py-2.5 transition-colors duration-150 ease-out hover:bg-accent hover:text-foreground"
            >
              <span className="min-w-0 grow text-[0.9375rem]">{tarea.descripcion}</span>
              <span className="shrink-0 font-mono text-[0.8125rem] tabular-nums text-muted-foreground">
                {tarea.minutos} min
              </span>
            </Link>
          )}
        </li>
      ))}
      {/* El total del día solo se repite si hay más de una tarea: con una sola,
          el minutaje ya está en su fila y repetirlo es ruido. */}
      {tareas.length > 1 ? (
        <li className="px-3 py-2 text-[0.8125rem] text-muted-foreground">
          Total del día:{' '}
          <span className="font-mono font-semibold tabular-nums text-foreground">{minutos}</span>{' '}
          min
        </li>
      ) : null}
    </ul>
  );
}
