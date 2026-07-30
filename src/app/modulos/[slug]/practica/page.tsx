// src/app/modulos/[slug]/practica/page.tsx — Server Component.
//
// Etapa 3 de un módulo · Práctica. 8 ítems con explicación inmediata: aquí se
// aprende, no se mide.
//
// Frontera (ADR-010): el banco lo carga ESTA PÁGINA, en el servidor, con
// `cargarBancoModulo(slug)`, y se lo pasa al controlador por prop. Ningún Client
// Component importa `content/`. Lo mismo con el blueprint: `blueprintPractica`
// se evalúa aquí y viaja como objeto plano.
//
// Los ítems viajan enteros —no proyectados a un subconjunto, como sí se hace con
// las tarjetas— y es deliberado: `armarSimulacro`, `presentarItem` y `calificar`
// consumen `Item` completo, y recortarle campos obligaría a mantener un segundo
// tipo en paralelo al del blueprint. El único campo que no usa nadie en la
// interfaz es `etiquetas`. Coste: el banco del módulo viaja en la carga útil RSC
// (no en los chunks JS), que es donde tiene que estar para que el muestreo lo
// haga el cliente con una semilla nacida en un handler (§22 reglas 5 y 6).
//
// DISENO.md §2.4 — REGLA DEL SISTEMA: un solo bloque en contexto, así que la
// página monta <RotuloBloque> encima de su <h1>.

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cargarBancoModulo } from '@/content/banco/indice';
import { blueprintPractica } from '@/content/blueprint-examen';
import { MODULOS, MODULOS_POR_SLUG } from '@/content/estructura';
import { cargarTarjetas } from '@/content/tarjetas/indice';
import { RotuloBloque } from '@/components/layout/rotulo-bloque';
import { EtapasModulo } from '@/components/modulo/etapas-modulo';
import { ControladorSesion } from '@/components/sesion/controlador-sesion';
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
    title: modulo ? `Práctica · ${modulo.titulo}` : 'Módulo no encontrado',
    // La app es privada de facto: solo la portada se indexa (§10.1).
    robots: { index: false },
  };
}

export default async function PaginaPractica({ params }: Props) {
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
        <h1>Práctica</h1>
        <p className="text-muted-foreground">
          Etapa 3 de{' '}
          <Link
            href={`/modulos/${slug}`}
            className="font-medium text-primary underline underline-offset-2"
          >
            {modulo.titulo}
          </Link>
          . Cada respuesta viene con su explicación al instante. Aquí se aprende; medir es
          el quiz.
        </p>
      </header>

      {items.length > 0 ? (
        <ControladorSesion
          blueprint={blueprintPractica(slug)}
          banco={items}
          registro={{ clase: 'practica', slug }}
          bloque={modulo.bloque}
          volver={{ href: `/modulos/${slug}`, texto: 'Volver al módulo' }}
          siguiente={{ href: `/modulos/${slug}/quiz`, texto: 'Pasar al quiz' }}
        />
      ) : (
        <section
          aria-labelledby="sin-items"
          className="space-y-3 rounded-lg border border-border bg-card p-4 sm:p-6"
        >
          <h2 id="sin-items">Este módulo todavía no tiene preguntas</h2>
          <p className="text-muted-foreground">
            Las preguntas de este módulo aún no se han escrito, así que no hay nada que
            practicar aquí. Tu progreso no se ha perdido ni se ha tocado: sencillamente
            todavía no hay contenido que registrar.
          </p>
          <p className="text-muted-foreground">
            {disponible ? (
              <>
                Mientras tanto,{' '}
                <Link
                  href={`/modulos/${disponible.slug}/practica`}
                  className="font-medium text-primary underline underline-offset-2"
                >
                  la práctica de {disponible.titulo}
                </Link>{' '}
                sí está publicada.
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
        etapaActual={3}
      />
    </div>
  );
}
