'use client';

// src/components/informe/vista-informe.tsx — Client Component (§10.3).
//
// El informe de un intento. Es cliente entero por un motivo que no tiene vuelta:
// **el intento vive en `localStorage`**, así que el servidor no puede saber si
// existe ni qué contiene. La página es Server Component y aporta lo único que
// sabe —el catálogo de módulos y bloques, reducido (ADR-010)—; el resto se
// resuelve tras la hidratación.
//
// ══ EL ESTADO VACÍO NO ES UN 404 ══
// Un `intentoId` que no está en `localStorage` no significa «no existe»:
// significa «no está en ESTE navegador». Puede ser un enlace abierto en otro
// dispositivo, o un intento que salió por el tope de 30 (`MAX_INTENTOS`). Un
// «no encontrado» a secas sugeriría que el usuario perdió su progreso, y eso
// sería mentir sobre lo más delicado que guarda la app.

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useEstado } from '@/hooks/usar-estado';
import { obtenerIntento } from '@/lib/almacenamiento';
import { formatearDuracion } from '@/lib/fechas';
import {
  construirInforme,
  intentoAnteriorComparable,
  type BloqueDelInforme,
  type ModuloDelInforme,
} from '@/lib/informe';
import type { Informe } from '@/lib/tipos';
import { BarrasDominio } from './barras-dominio';
import { DominioPorModulo } from './dominio-modulo';
import { PatronesInforme } from './patrones-informe';
import { RevisionItems } from './revision-items';
import { TemasPrioritarios } from './temas-prioritarios';
import { VeredictoInforme } from './veredicto-informe';

interface Props {
  intentoId: string;
  modulos: readonly ModuloDelInforme[];
  bloques: readonly BloqueDelInforme[];
}

const NOMBRE_TIPO: Record<string, string> = {
  diagnostico: 'Diagnóstico inicial',
  quiz: 'Quiz de módulo',
  bloque: 'Simulacro de bloque',
  final: 'Simulacro final',
};

export function VistaInforme({ intentoId, modulos, bloques }: Props) {
  const estado = useEstado();

  // `useEstado()` devuelve `null` tanto en el primer render como cuando no hay
  // nada guardado, y confundirlos deja el esqueleto puesto para siempre. La
  // bandera de montaje distingue los dos casos (contrato en COMPONENTES.md).
  const [montado, setMontado] = useState(false);
  useEffect(() => {
    setMontado(true);
  }, []);

  const intento = estado === null ? null : obtenerIntento(estado, intentoId);

  // Los módulos que este intento tocó: acota qué banco carga la revisión.
  //
  // Memoizado porque es dependencia del efecto de carga de `RevisionItems`:
  // `Object.keys` da un array nuevo en cada render, y cada escritura en
  // `localStorage` —que hay varias al cerrar un simulacro— volvería a
  // descargar el banco entero sin necesidad.
  //
  // Va ANTES de los returns condicionales, con todos los demás hooks: un hook
  // después de un `return` cambia el número de hooks entre renders y React lo
  // rompe. Por eso tolera `intento === null` en vez de darlo por hecho.
  const slugs = useMemo(
    () => (intento === null ? [] : Object.keys(intento.desglose.porModulo)),
    [intento],
  );

  if (!montado) return <Esqueleto />;
  if (intento === null) return <SinIntento />;

  const informe: Informe = construirInforme(
    intento,
    modulos,
    bloques,
    intentoAnteriorComparable(estado?.intentos ?? [], intento),
  );

  return (
    <div className="space-y-8">
      <p className="text-[0.8125rem] text-muted-foreground">
        {NOMBRE_TIPO[informe.tipo] ?? 'Intento'} ·{' '}
        <span className="font-mono tabular-nums">{intento.totalItems}</span> ítems ·{' '}
        <span className="font-mono tabular-nums">{formatearDuracion(informe.segundosUsados)}</span>
      </p>

      <VeredictoInforme informe={informe} />

      <PatronesInforme patrones={informe.patrones} desglose={informe.desglose} />

      <section aria-labelledby="titulo-bloques" className="space-y-3">
        <h2 id="titulo-bloques">Dominio por bloque</h2>
        {informe.deltaPorBloque !== null ? (
          <p className="text-muted-foreground">
            Comparado con tu intento anterior del mismo tipo. Un guion significa que uno de los dos
            no evaluó ese bloque, no que no cambiaras.
          </p>
        ) : null}
        <BarrasDominio datos={informe.dominioPorBloque} delta={informe.deltaPorBloque} />
      </section>

      <TemasPrioritarios temas={informe.temasPrioritarios} />

      <DominioPorModulo modulos={informe.dominioPorModulo} />

      <RevisionItems
        itemIds={intento.itemIds}
        respuestas={intento.respuestas}
        semilla={intento.semilla}
        slugs={slugs}
      />

      <p className="text-[0.8125rem]">
        <Link
          href="/simulacros"
          className="inline-flex items-center text-muted-foreground underline underline-offset-2 hover:text-foreground"
        >
          Volver a los simulacros
        </Link>
      </p>
    </div>
  );
}

function Esqueleto() {
  return (
    <div className="space-y-4">
      <span className="sr-only">Cargando el informe</span>
      <span className="block h-32 w-full animate-pulse rounded-lg bg-accent" aria-hidden="true" />
      <span className="block h-40 w-full animate-pulse rounded-lg bg-accent" aria-hidden="true" />
    </div>
  );
}

/**
 * Estado vacío honesto (§22 regla 11). Dice la verdad completa: el intento no
 * está **en este navegador**, y explica las dos razones por las que puede
 * pasar. No dice «no existe» ni sugiere que se haya perdido progreso.
 */
function SinIntento() {
  return (
    <section
      aria-labelledby="titulo-sin-intento"
      className="space-y-3 rounded-lg border border-border bg-card p-4 shadow-sm sm:p-6"
    >
      <h2 id="titulo-sin-intento">Ese intento no está en este navegador</h2>
      <p className="text-muted-foreground">
        Los resultados se guardan solo en el dispositivo donde hiciste el simulacro: no hay
        cuentas ni servidor. Si lo hiciste en el celular, el enlace no funciona en el computador.
      </p>
      <p className="text-muted-foreground">
        También puede ser que sea muy antiguo: se conservan los 30 intentos más recientes.
      </p>
      <p className="flex flex-wrap gap-x-4 gap-y-1">
        <Link
          href="/progreso"
          className="inline-flex items-center text-sm font-medium text-primary underline underline-offset-2"
        >
          Ver tus intentos guardados
        </Link>
        <Link
          href="/simulacros"
          className="inline-flex items-center text-sm font-medium text-primary underline underline-offset-2"
        >
          Hacer un simulacro
        </Link>
      </p>
    </section>
  );
}
