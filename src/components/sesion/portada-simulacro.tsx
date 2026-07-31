'use client';

// src/components/sesion/portada-simulacro.tsx — Client Component (§10.3).
//
// La pantalla previa al simulacro. Su trabajo real no es el botón «Empezar»:
// es **decir la verdad sobre si el banco alcanza**.
//
// ══════════════════════════════════════════════════════════════════════════
// POR QUÉ ESTA PANTALLA PUEDE NEGARSE A EMPEZAR
// ══════════════════════════════════════════════════════════════════════════
//
// `armarSimulacro` no falla cuando falta contenido: rellena desde el pool global
// y devuelve lo que haya. Eso es correcto mientras el contenido se escribe —un
// quiz de módulo con 8 ítems en vez de 10 sigue siendo útil— y es **inaceptable
// en un simulacro**, que es el instrumento de medida del producto.
//
// Con el banco de hoy (solo C5, 28 ítems), «simulacro final · 100 ítems · 120
// minutos» produciría 28 ítems del mismo módulo presentados como el examen
// completo, y un porcentaje sobre ellos presentado como el pronóstico del
// usuario. Eso no es un examen corto: es un examen que miente sobre lo que mide.
// §22 regla 11 —la app dice la verdad sobre sus veredictos— y el estado vacío
// honesto de §22 regla 11 mandan lo contrario: se explica qué falta y se ofrece
// lo que sí se puede hacer hoy.
//
// El veredicto lo calcula `diagnosticarViabilidad` (`src/lib/simulacro.ts`),
// función pura sobre un censo de conteos que el servidor pasa por prop. Aquí
// solo se presenta.

import { AlertTriangle, Clock, ListChecks } from 'lucide-react';
import Link from 'next/link';
import type { BlueprintExamen } from '@/lib/tipos';
import type { Viabilidad } from '@/lib/simulacro';
import { Boton } from './boton';

interface Props {
  blueprint: BlueprintExamen;
  viabilidad: Viabilidad;
  /** Módulo publicado al que mandar a quien no puede hacer el simulacro. */
  alternativa: { slug: string; titulo: string } | null;
  cargando: boolean;
  onEmpezar: () => void;
}

export function PortadaSimulacro({
  blueprint,
  viabilidad,
  alternativa,
  cargando,
  onEmpezar,
}: Props) {
  return (
    <section
      aria-labelledby="titulo-simulacro"
      className="space-y-4 rounded-lg border border-border bg-card p-4 shadow-sm sm:p-6"
    >
      <h2 id="titulo-simulacro">{blueprint.titulo}</h2>
      <p className="text-muted-foreground">{blueprint.descripcion}</p>

      <dl className="flex flex-wrap gap-x-6 gap-y-2 text-[0.8125rem]">
        <div className="flex items-center gap-2">
          <ListChecks className="size-4 text-muted-foreground" aria-hidden="true" />
          <dt className="sr-only">Ítems</dt>
          <dd>
            <span className="font-mono font-semibold tabular-nums">{blueprint.totalItems}</span>{' '}
            ítems
          </dd>
        </div>
        {blueprint.minutos !== null ? (
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-muted-foreground" aria-hidden="true" />
            <dt className="sr-only">Duración</dt>
            <dd>
              <span className="font-mono font-semibold tabular-nums">{blueprint.minutos}</span>{' '}
              minutos
            </dd>
          </div>
        ) : null}
      </dl>

      {viabilidad.viable && viabilidad.exacto ? (
        <>
          {viabilidad.repartoIncumplido ? (
            <p className="flex items-start gap-2 rounded-md border-l-4 border-aviso bg-aviso/10 p-3 text-[0.8125rem] leading-[1.45]">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-aviso" aria-hidden="true" />
              <span>
                Hay ítems suficientes para armarlo, pero{' '}
                {viabilidad.deficits.length === 1
                  ? 'un módulo no llega a su cuota'
                  : `${viabilidad.deficits.length} módulos no llegan a su cuota`}
                , así que el reparto por tema no será exactamente el del examen real. El resultado
                sirve para practicar; para medirte, espera a que el contenido esté completo.
              </span>
            </p>
          ) : null}

          <Boton
            onClick={onEmpezar}
            inactivo={cargando}
            className="min-h-[52px] w-full text-[0.9375rem]"
          >
            {cargando ? 'Preparando el simulacro…' : 'Empezar'}
          </Boton>

          {blueprint.minutos !== null ? (
            <p className="text-[0.8125rem] leading-[1.45] text-muted-foreground">
              El cronómetro arranca al pulsar y corre en tiempo real: si cierras la pestaña, sigue
              corriendo. Al llegar a cero se envía solo con lo que hayas respondido.
            </p>
          ) : null}
        </>
      ) : (
        <BancoInsuficiente
          blueprint={blueprint}
          viabilidad={viabilidad}
          alternativa={alternativa}
        />
      )}
    </section>
  );
}

/**
 * Estado vacío honesto (§22 regla 11): dice **qué falta, con cifras**, por qué
 * no se ofrece un examen más corto, y qué se puede hacer hoy en su lugar. Nunca
 * una pantalla en blanco ni un botón que produzca un examen inválido.
 */
function BancoInsuficiente({
  blueprint,
  viabilidad,
  alternativa,
}: {
  blueprint: BlueprintExamen;
  viabilidad: Viabilidad;
  alternativa: { slug: string; titulo: string } | null;
}) {
  // `exacto: false` = el blueprint filtra por tipo o dificultad, y el censo
  // cuenta ítems publicados, no elegibles. El veredicto sería una cota superior,
  // así que no se ofrece el examen: decir «viable» sin poder sostenerlo es
  // justo lo que esta pantalla existe para no hacer.
  if (!viabilidad.exacto) {
    return (
      <div className="space-y-3 rounded-md border-l-4 border-aviso bg-aviso/10 p-4">
        <p className="flex items-start gap-2 font-medium">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-aviso" aria-hidden="true" />
          Este simulacro todavía no se puede preparar
        </p>
        <p className="text-[0.8125rem] leading-[1.45] text-muted-foreground">
          Selecciona sus preguntas por tipo y por dificultad, y con el contenido publicado hoy no
          se puede comprobar de antemano que salgan las cuentas. Se habilitará cuando haya
          preguntas suficientes de cada clase.
        </p>
        {alternativa !== null ? (
          <p className="text-[0.8125rem] leading-[1.45]">
            Mientras tanto,{' '}
            <Link
              href={`/modulos/${alternativa.slug}/quiz`}
              className="inline-flex items-center font-medium text-primary underline underline-offset-2"
            >
              el quiz de {alternativa.titulo}
            </Link>{' '}
            sí está completo.
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-md border-l-4 border-aviso bg-aviso/10 p-4">
      <p className="flex items-start gap-2 font-medium">
        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-aviso" aria-hidden="true" />
        Todavía no hay preguntas suficientes para este simulacro
      </p>

      <p className="text-[0.8125rem] leading-[1.45] text-muted-foreground">
        Hacen falta{' '}
        <span className="font-mono font-semibold tabular-nums text-foreground">
          {viabilidad.totalRequerido}
        </span>{' '}
        ítems y hay{' '}
        <span className="font-mono font-semibold tabular-nums text-foreground">
          {viabilidad.totalDisponible}
        </span>{' '}
        publicados: faltan{' '}
        <span className="font-mono font-semibold tabular-nums text-foreground">
          {viabilidad.faltan}
        </span>
        .
      </p>

      <p className="text-[0.8125rem] leading-[1.45] text-muted-foreground">
        Se podría armar uno con lo que hay, y no se hace a propósito: un examen de{' '}
        {viabilidad.totalDisponible}{' '}
        {viabilidad.totalDisponible === 1 ? 'ítem' : 'ítems'} presentado como el de{' '}
        {blueprint.totalItems} daría un porcentaje que no significa nada, y este simulacro existe
        para medirte de verdad. El contenido se publica módulo a módulo.
      </p>

      {alternativa !== null ? (
        <p className="text-[0.8125rem] leading-[1.45]">
          Mientras tanto,{' '}
          <Link
            href={`/modulos/${alternativa.slug}/quiz`}
            className="inline-flex items-center font-medium text-primary underline underline-offset-2"
          >
            el quiz de {alternativa.titulo}
          </Link>{' '}
          sí está completo, y sus 10 ítems sí se califican sobre lo que miden.
        </p>
      ) : null}
    </div>
  );
}
