'use client';

// src/components/progreso/panel-progreso.tsx — Client Component (§10.3).
//
// El historial: qué has hecho, cómo te fue y a qué informe volver. Todo sale de
// `localStorage`, así que la ruta es cliente por la misma razón que el informe.
//
// ══ NO REPITE EL INFORME ══
// Aquí no hay desglose ni gráfica: eso es `/resultados/[intentoId]`, y cada
// fila enlaza al suyo. Esta pantalla responde otra pregunta —«¿voy mejorando?»—
// y para eso lo que hace falta es la SERIE, no el detalle de un intento.
//
// ══ EL ESTADO VACÍO ES EL CASO NORMAL ══
// Un usuario nuevo no tiene intentos, y `useEstado()` devuelve `null` también
// en el primer render: confundirlos deja el esqueleto puesto para siempre
// (contrato de `useEstado` en COMPONENTES.md). De ahí la bandera de montaje.

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useEstado } from '@/hooks/usar-estado';
import { calcularVeredicto, NOTA_VEREDICTO } from '@/lib/informe';
import { formatearDuracion } from '@/lib/fechas';
import { UMBRAL_DOMINIO } from '@/lib/almacenamiento';
import type { IntentoSimulacro } from '@/lib/tipos';
import { cn } from '@/lib/utils';

export interface ModuloDelProgreso {
  slug: string;
  titulo: string;
  bloque: string;
}

const NOMBRE_TIPO: Record<IntentoSimulacro['tipo'], string> = {
  diagnostico: 'Diagnóstico',
  quiz: 'Quiz',
  bloque: 'Simulacro de bloque',
  final: 'Simulacro final',
};

const CLASE_VEREDICTO: Record<string, string> = {
  exito: 'text-exito',
  primary: 'text-primary',
  aviso: 'text-aviso',
  destructive: 'text-destructive',
};

export function PanelProgreso({ modulos }: { modulos: readonly ModuloDelProgreso[] }) {
  const estado = useEstado();
  const [montado, setMontado] = useState(false);
  useEffect(() => {
    setMontado(true);
  }, []);

  if (!montado) {
    return (
      <div className="space-y-4">
        <span className="sr-only">Cargando tu progreso</span>
        <span className="block h-24 w-full animate-pulse rounded-lg bg-accent" aria-hidden="true" />
      </div>
    );
  }

  const intentos = estado?.intentos ?? [];
  const porSlug = estado?.modulos ?? {};
  const dominados = modulos.filter((m) => porSlug[m.slug]?.dominado);
  const empezados = modulos.filter((m) => porSlug[m.slug] !== undefined);

  return (
    <div className="space-y-8">
      <section aria-labelledby="titulo-modulos-progreso" className="space-y-3">
        <h2 id="titulo-modulos-progreso">Módulos</h2>
        <p className="text-muted-foreground">
          <span className="font-mono font-semibold tabular-nums text-foreground">
            {dominados.length}
          </span>{' '}
          de {modulos.length} dominados —{UMBRAL_DOMINIO} o más en el quiz— y{' '}
          <span className="font-mono tabular-nums">{empezados.length}</span> empezados.
        </p>

        {empezados.length === 0 ? (
          <p className="text-muted-foreground">
            Todavía no has abierto ningún módulo.{' '}
            <Link
              href="/modulos"
              className="inline-flex items-center font-medium text-primary underline underline-offset-2"
            >
              Empieza por aquí
            </Link>
            .
          </p>
        ) : (
          <ul className="divide-y divide-border rounded-lg border border-border">
            {empezados.map((m) => {
              const e = porSlug[m.slug];
              return (
                <li key={m.slug}>
                  <Link
                    href={`/modulos/${m.slug}`}
                    className="flex min-h-11 items-center gap-3 px-3 py-2.5 transition-colors duration-150 ease-out hover:bg-accent hover:text-foreground"
                  >
                    <span className="min-w-0 grow text-[0.9375rem]">{m.titulo}</span>
                    {/* El estado va en texto, no en un color ni un icono suelto. */}
                    <span
                      className={cn(
                        'shrink-0 text-[0.8125rem] font-medium',
                        e?.dominado ? 'text-exito' : 'text-muted-foreground',
                      )}
                    >
                      {e?.dominado
                        ? 'Dominado'
                        : e?.mejorQuiz !== null && e?.mejorQuiz !== undefined
                          ? `Mejor quiz: ${e.mejorQuiz}`
                          : 'En curso'}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section aria-labelledby="titulo-intentos" className="space-y-3">
        <h2 id="titulo-intentos">Historial de intentos</h2>

        {intentos.length === 0 ? (
          <p className="text-muted-foreground">
            Todavía no has terminado ningún simulacro. Cuando hagas uno, aquí queda su informe
            completo para volver a consultarlo.{' '}
            <Link
              href="/simulacros"
              className="inline-flex items-center font-medium text-primary underline underline-offset-2"
            >
              Ver los simulacros
            </Link>
            .
          </p>
        ) : (
          <>
            <p className="text-muted-foreground">
              Del más reciente al más antiguo. Se conservan los 30 últimos.
            </p>
            {/* La nota va también AQUÍ, y no solo en el informe. §22 regla 11
                dice que se muestra **siempre**, y esta pantalla está en la barra
                de navegación: se llega sin pasar por ningún informe y se leen
                hasta 30 filas seguidas diciendo «Sólido» o «Listo». Basta una
                vez por página; repetirla por fila sería ruido. */}
            <p className="text-[0.8125rem] leading-[1.45] text-muted-foreground">
              {NOTA_VEREDICTO}
            </p>
            <ul className="space-y-2">
              {intentos.map((intento) => {
                const veredicto = calcularVeredicto(intento.puntaje);
                return (
                  <li key={intento.id}>
                    <Link
                      href={`/resultados/${intento.id}`}
                      className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 shadow-sm transition-colors duration-150 ease-out hover:bg-accent hover:text-foreground sm:p-4"
                    >
                      <span
                        className={cn(
                          'shrink-0 font-mono text-2xl font-semibold tabular-nums',
                          CLASE_VEREDICTO[veredicto.color],
                        )}
                      >
                        {intento.puntaje}
                      </span>
                      <span className="min-w-0 grow space-y-0.5">
                        <span className="block font-medium">
                          {NOMBRE_TIPO[intento.tipo]}
                          {intento.ambito !== 'global' && intento.tipo === 'bloque'
                            ? ` ${intento.ambito}`
                            : ''}
                        </span>
                        <span className="block text-[0.8125rem] text-muted-foreground">
                          {/* La fecha viene del intento, no del reloj: el
                              componente no puede leer la hora en el render. */}
                          {intento.terminadoEn.slice(0, 10)} ·{' '}
                          <span className="font-mono tabular-nums">
                            {intento.respuestas.filter((r) => r.correcta).length}/
                            {intento.totalItems}
                          </span>{' '}
                          · {formatearDuracion(intento.segundosUsados)} ·{' '}
                          <span className={CLASE_VEREDICTO[veredicto.color]}>
                            {veredicto.titulo}
                          </span>
                        </span>
                      </span>
                      <ArrowRight
                        className="size-4 shrink-0 text-muted-foreground"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </section>
    </div>
  );
}
