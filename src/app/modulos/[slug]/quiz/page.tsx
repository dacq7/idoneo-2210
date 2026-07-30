// src/app/modulos/[slug]/quiz/page.tsx — Server Component.
//
// Etapa 4 de un módulo · Quiz. 10 ítems, sin cronómetro y sin retroalimentación
// por ítem: el veredicto llega al final, con la revisión completa.
//
// Frontera (ADR-010) y forma de los datos: igual que la práctica — el banco y el
// blueprint se resuelven aquí, en el servidor, y viajan por prop. Ver la
// cabecera de `practica/page.tsx`, que lo explica en detalle.
//
// Lo que el quiz escribe en el progreso es `registrarQuiz(slug, puntaje, ahora)`
// y nada más. NO guarda un `IntentoSimulacro`: eso exige el desglose por bloque,
// módulo y nivel que calcula `src/lib/informe.ts`, que nace en el Paso 12 junto
// con `/resultados/[intentoId]`. Guardar un intento a medias hoy dejaría
// registros que ese paso tendría que migrar.

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cargarBancoModulo } from '@/content/banco/indice';
import { blueprintQuiz } from '@/content/blueprint-examen';
import { MODULOS, MODULOS_POR_SLUG } from '@/content/estructura';
import { cargarTarjetas } from '@/content/tarjetas/indice';
import { RotuloBloque } from '@/components/layout/rotulo-bloque';
import { EtapasModulo } from '@/components/modulo/etapas-modulo';
import { ControladorSesion } from '@/components/sesion/controlador-sesion';
import { UMBRAL_DOMINIO } from '@/lib/almacenamiento';
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
    title: modulo ? `Quiz · ${modulo.titulo}` : 'Módulo no encontrado',
    robots: { index: false },
  };
}

export default async function PaginaQuiz({ params }: Props) {
  const { slug } = await params;
  const modulo = MODULOS_POR_SLUG.get(slug);
  if (!modulo) notFound();

  const [items, tarjetas, hayTeoria] = await Promise.all([
    cargarBancoModulo(slug),
    cargarTarjetas(slug),
    existeTeoria(slug),
  ]);

  const disponible = MODULOS.find((m) => m.estadoContenido === 'completo' && m.slug !== slug);

  return (
    <div className="space-y-8 py-2">
      <header className="space-y-3">
        <RotuloBloque bloque={modulo.bloque} />
        <h1>Quiz</h1>
        <p className="text-muted-foreground">
          Etapa 4 de{' '}
          <Link
            href={`/modulos/${slug}`}
            className="font-medium text-primary underline underline-offset-2"
          >
            {modulo.titulo}
          </Link>
          . Sin cronómetro y sin explicaciones por el camino: respondes las diez y al final
          ves qué tal te fue. Con {UMBRAL_DOMINIO} o más, el módulo cuenta como dominado.
        </p>
      </header>

      {items.length > 0 ? (
        <ControladorSesion
          blueprint={blueprintQuiz(slug)}
          banco={items}
          registro={{ clase: 'quiz', slug }}
          bloque={modulo.bloque}
          volver={{ href: `/modulos/${slug}`, texto: 'Volver al módulo' }}
          siguiente={{ href: `/modulos/${slug}/practica`, texto: 'Volver a la práctica' }}
        />
      ) : (
        <section
          aria-labelledby="sin-items"
          className="space-y-3 rounded-lg border border-border bg-card p-4 sm:p-6"
        >
          <h2 id="sin-items">Este módulo todavía no tiene preguntas</h2>
          <p className="text-muted-foreground">
            Las preguntas de este módulo aún no se han escrito, así que no hay quiz que
            presentar. Tu progreso no se ha perdido ni se ha tocado: sencillamente todavía
            no hay contenido que registrar.
          </p>
          <p className="text-muted-foreground">
            {disponible ? (
              <>
                Mientras tanto,{' '}
                <Link
                  href={`/modulos/${disponible.slug}/quiz`}
                  className="font-medium text-primary underline underline-offset-2"
                >
                  el quiz de {disponible.titulo}
                </Link>{' '}
                sí está publicado.
              </>
            ) : (
              <>
                Ningún módulo tiene preguntas publicadas todavía: el contenido se irá
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
          totalTarjetas: tarjetas.length,
          totalItems: items.length,
        }}
        etapaActual={4}
      />
    </div>
  );
}
