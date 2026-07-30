// src/app/modulos/[slug]/page.tsx — Server Component.
//
// Etapa 1 de un módulo · Esencial. El encabezado sale de content/estructura.ts y
// la teoría de content/teoria/<slug>.mdx, leída con `fs` desde el servidor
// (src/lib/contenido.ts, server-only). Los 29 slugs se prerenderizan.
//
// Frontera (§10.2): esta página es servidor de punta a punta, así que puede
// importar `content/` sin coste de bundle (ADR-010). Nada de lo que hay aquí
// llega al navegador salvo el HTML ya renderizado.
//
// DISENO.md §2.4 — REGLA DEL SISTEMA: hay exactamente un bloque en contexto, así
// que la página monta <RotuloBloque> encima de su <h1>.
//
// Jerarquía de encabezados: el <h1> es el título del módulo y el MDX empieza en
// `##` (§14.1), de modo que los h2 de la teoría son hermanos de los h2 de esta
// página. Sin salto de nivel y con un solo h1.

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BLOQUES_POR_ID, MODULOS, MODULOS_POR_SLUG } from '@/content/estructura';
import { erratasDelModulo } from '@/content/erratas';
import { RotuloBloque } from '@/components/layout/rotulo-bloque';
import { ESTILO_ERRATA } from '@/components/mdx/alerta-contradiccion';
import { RenderizadorMdx } from '@/components/mdx/renderizador';
import { leerTeoria } from '@/lib/contenido';
import { CLASES_BLOQUE, cn } from '@/lib/utils';

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
    title: modulo ? modulo.titulo : 'Módulo no encontrado',
    // La app es privada de facto: solo la portada se indexa (§10.1).
    robots: { index: false },
  };
}

export default async function PaginaModulo({ params }: Props) {
  const { slug } = await params;
  const modulo = MODULOS_POR_SLUG.get(slug);
  if (!modulo) notFound();

  const bloque = BLOQUES_POR_ID.get(modulo.bloque);
  const mdx = await leerTeoria(slug);
  const erratas = erratasDelModulo(slug);

  const prerequisitos = modulo.prerequisitos
    .map((pre) => MODULOS_POR_SLUG.get(pre))
    .filter((pre) => pre !== undefined);

  // Para el estado vacío: un módulo que sí se pueda leer hoy. Hoy no hay
  // ninguno —los 29 están en preparación— y el texto lo dice sin adornos. En
  // cuanto el Paso 8 publique C5, esta línea empieza a ofrecerlo sola.
  const disponible = MODULOS.find((m) => m.estadoContenido === 'completo' && m.slug !== slug);

  return (
    <div className="space-y-8 py-2">
      <header className="space-y-3">
        <RotuloBloque bloque={modulo.bloque} />
        <h1>{modulo.titulo}</h1>
        <p className="text-muted-foreground">{modulo.subtitulo}</p>

        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.8125rem] text-muted-foreground">
          <span
            className={cn(
              'grid size-8 shrink-0 place-items-center rounded-md font-mono text-[0.8125rem] font-medium',
              CLASES_BLOQUE[modulo.bloque].fondo,
              'text-bloque-contraste',
            )}
          >
            {modulo.bloque}
            {modulo.orden}
          </span>
          <span>
            Módulo {modulo.orden} de {bloque?.modulos.length ?? 0} del bloque {modulo.bloque}
          </span>
          {/* El separador viaja pegado a lo que separa: suelto en un `flex-wrap`
              se queda huérfano al final de la línea. */}
          <span>
            <span aria-hidden="true">· </span>
            {modulo.minutosEstimados} min estimados de lectura
          </span>
        </p>

        {prerequisitos.length > 0 ? (
          <p className="text-[0.8125rem] text-muted-foreground">
            Conviene estudiar antes:{' '}
            {prerequisitos.map((pre, i) => (
              <span key={pre.slug}>
                {i > 0 ? ', ' : ''}
                <Link
                  href={`/modulos/${pre.slug}`}
                  className="font-medium text-primary underline underline-offset-2"
                >
                  {pre.titulo}
                </Link>
              </span>
            ))}
            .
          </p>
        ) : null}
      </header>

      <section aria-labelledby="objetivos" className="space-y-3">
        <h2 id="objetivos">Al terminar este módulo vas a poder</h2>
        <ul className="list-disc space-y-1.5 pl-5 marker:text-muted-foreground">
          {modulo.objetivos.map((objetivo) => (
            <li key={objetivo}>{objetivo}</li>
          ))}
        </ul>
      </section>

      {mdx ? (
        <RenderizadorMdx fuente={mdx} />
      ) : (
        <section aria-labelledby="sin-teoria" className="space-y-3 rounded-lg border border-border bg-card p-4 sm:p-6">
          <h2 id="sin-teoria">La teoría todavía no está escrita</h2>
          <p className="text-muted-foreground">
            La estructura de este módulo ya está fija —los objetivos de arriba y los conceptos clave
            de abajo son definitivos— pero su texto, sus tarjetas y sus preguntas aún no se han
            publicado. No hay nada que leer aquí todavía, y preferimos decirlo a rellenar la página.
          </p>
          <p className="text-muted-foreground">
            {disponible ? (
              <>
                Mientras tanto,{' '}
                <Link
                  href={`/modulos/${disponible.slug}`}
                  className="font-medium text-primary underline underline-offset-2"
                >
                  {disponible.titulo}
                </Link>{' '}
                sí está publicado.
              </>
            ) : (
              <>Ningún módulo tiene su teoría publicada todavía: el contenido se irá subiendo módulo por módulo.</>
            )}
          </p>
          <p className="flex flex-wrap gap-x-4 gap-y-1">
            <Link
              href={`/bloques/${modulo.bloque}`}
              className="inline-flex items-center text-sm font-medium text-primary underline underline-offset-2"
            >
              Ver el bloque {modulo.bloque} completo
            </Link>
            <Link
              href="/modulos"
              className="inline-flex items-center text-sm font-medium text-primary underline underline-offset-2"
            >
              Ver los {MODULOS.length} módulos
            </Link>
          </p>
        </section>
      )}

      <section aria-labelledby="conceptos" className="space-y-3">
        <h2 id="conceptos">Conceptos clave</h2>
        <p className="text-[0.8125rem] text-muted-foreground">
          Los términos que este módulo tiene que dejarte definidos. Cada uno tendrá su entrada en el
          glosario.
        </p>
        <ul className="flex flex-wrap gap-2">
          {modulo.conceptosClave.map((concepto) => (
            <li
              key={concepto}
              className="rounded-md border border-border bg-card px-2.5 py-1 text-[0.8125rem]"
            >
              {concepto}
            </li>
          ))}
        </ul>
      </section>

      {erratas.length > 0 ? (
        <section aria-labelledby="erratas-modulo" className="space-y-3">
          <h2 id="erratas-modulo">Ojo con las cartillas en este módulo</h2>
          <p className="text-[0.8125rem] text-muted-foreground">
            {erratas.length === 1
              ? 'Hay una entrada del registro de erratas que toca este módulo.'
              : `Hay ${erratas.length} entradas del registro de erratas que tocan este módulo.`}{' '}
            Son puntos donde el material oficial falla o se presta a confusión, y suelen decidir dos
            o tres preguntas del examen.
          </p>
          <ul className="space-y-2">
            {erratas.map((errata) => {
              const { rotulo, Icono, tinte } = ESTILO_ERRATA[errata.tipo];
              return (
                <li key={errata.id}>
                  <Link
                    href={`/erratas#${errata.id}`}
                    className="flex items-center gap-2.5 rounded-md border border-border bg-card px-3 py-2 transition-colors duration-150 hover:bg-accent"
                  >
                    <Icono className={cn('size-4 shrink-0', tinte)} aria-hidden="true" />
                    <span className="min-w-0">
                      <span className="font-mono text-[0.8125rem] font-medium">{errata.id}</span>{' '}
                      <span className="text-[0.9375rem]">{errata.tema}</span>
                      <span className="sr-only"> — {rotulo}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
