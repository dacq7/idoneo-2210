// src/app/modulos/[slug]/tarjetas/page.tsx — Server Component.
//
// Etapa 2 de un módulo · Tarjetas. La página resuelve el módulo desde `params`,
// carga las tarjetas EN EL SERVIDOR con `cargarTarjetas(slug)` y se las pasa al
// mazo ya proyectadas (ADR-010: ningún Client Component importa `content/`).
//
// DISENO.md §2.4 — REGLA DEL SISTEMA: hay exactamente un bloque en contexto, así
// que la página monta <RotuloBloque> encima de su <h1>.
//
// Jerarquía: un solo <h1> («Tarjetas») y un <h2> («Las cuatro etapas»). El
// frente de la tarjeta NO es un encabezado: es una pregunta, y meterlo en la
// jerarquía metería un h3 antes del primer h2.

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MODULOS, MODULOS_POR_SLUG } from '@/content/estructura';
import { cargarTarjetas } from '@/content/tarjetas/indice';
import { RotuloBloque } from '@/components/layout/rotulo-bloque';
import { EtapasModulo } from '@/components/modulo/etapas-modulo';
import { MazoTarjetas, type TarjetaEnMazo } from '@/components/modulo/mazo-tarjetas';
import { existeTeoria } from '@/lib/contenido';

interface Props {
  /** Next 15: los params son una promesa. Ver §10.1. */
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return MODULOS.map((modulo) => ({ slug: modulo.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const modulo = MODULOS_POR_SLUG.get(slug);

  return {
    title: modulo ? `Tarjetas · ${modulo.titulo}` : 'Módulo no encontrado',
    // La app es privada de facto: solo la portada se indexa (§10.1).
    robots: { index: false },
  };
}

export default async function PaginaTarjetas({ params }: Props) {
  const { slug } = await params;
  const modulo = MODULOS_POR_SLUG.get(slug);
  if (!modulo) notFound();

  const [tarjetas, hayTeoria] = await Promise.all([cargarTarjetas(slug), existeTeoria(slug)]);

  // Proyección al subconjunto serializable que el mazo necesita: `modulo` es
  // redundante —ya lo sabe la ruta— y no tiene por qué viajar al navegador.
  const paraElMazo: TarjetaEnMazo[] = tarjetas.map((tarjeta) => ({
    id: tarjeta.id,
    frente: tarjeta.frente,
    reverso: tarjeta.reverso,
    tipo: tarjeta.tipo,
  }));

  // Estado vacío honesto: un módulo con tarjetas publicadas, si lo hay.
  const disponible = MODULOS.find((m) => m.estadoContenido === 'completo' && m.slug !== slug);

  return (
    <div className="space-y-8 py-2">
      <header className="space-y-3">
        <RotuloBloque bloque={modulo.bloque} />
        <h1>Tarjetas</h1>
        <p className="text-muted-foreground">
          Etapa 2 de{' '}
          <Link
            href={`/modulos/${slug}`}
            className="font-medium text-primary underline underline-offset-2"
          >
            {modulo.titulo}
          </Link>
          . Son los datos exactos del módulo: los que el examen pregunta con número.
        </p>
      </header>

      {paraElMazo.length > 0 ? (
        <MazoTarjetas slug={slug} bloque={modulo.bloque} tarjetas={paraElMazo} />
      ) : (
        <section
          aria-labelledby="sin-tarjetas"
          className="space-y-3 rounded-lg border border-border bg-card p-4 sm:p-6"
        >
          <h2 id="sin-tarjetas">Este módulo todavía no tiene tarjetas</h2>
          <p className="text-muted-foreground">
            Las tarjetas de este módulo aún no se han escrito, así que no hay nada que
            repasar aquí. Tu progreso no se ha perdido ni se ha tocado: sencillamente
            todavía no hay contenido que registrar.
          </p>
          <p className="text-muted-foreground">
            {disponible ? (
              <>
                Mientras tanto,{' '}
                <Link
                  href={`/modulos/${disponible.slug}/tarjetas`}
                  className="font-medium text-primary underline underline-offset-2"
                >
                  las tarjetas de {disponible.titulo}
                </Link>{' '}
                sí están publicadas.
              </>
            ) : (
              <>
                Ningún módulo tiene tarjetas publicadas todavía: el contenido se irá
                subiendo módulo por módulo.
              </>
            )}
          </p>
          <p className="flex flex-wrap gap-x-4 gap-y-1">
            <Link
              href={`/modulos/${slug}`}
              className="inline-flex items-center text-sm font-medium text-primary underline underline-offset-2"
            >
              Volver al módulo
            </Link>
            <Link
              href={`/bloques/${modulo.bloque}`}
              className="inline-flex items-center text-sm font-medium text-primary underline underline-offset-2"
            >
              Ver el bloque {modulo.bloque} completo
            </Link>
          </p>
        </section>
      )}

      <EtapasModulo
        datos={{
          slug,
          bloque: modulo.bloque,
          hayTeoria,
          totalTarjetas: paraElMazo.length,
        }}
        etapaActual={2}
      />
    </div>
  );
}
