// src/app/simulacros/page.tsx — Server Component.
//
// El selector: los cuatro simulacros de bloque y el final, cada uno con su
// estado real. Es la pantalla que la barra de navegación apunta desde el Paso 5.
//
// ══ POR QUÉ EL VEREDICTO SE CALCULA AQUÍ Y NO EN EL CLIENTE ══
// `diagnosticarViabilidad` es una función pura sobre conteos, así que el
// servidor puede responderla en build y mandar el resultado ya resuelto. Esta
// ruta no tiene ni un Client Component: no hay estado, no hay reloj y no lee el
// progreso. Es HTML.
//
// NO monta `RotuloBloque`: DISENO.md §2.4 lo reserva a las pantallas con
// exactamente un bloque en contexto, y aquí se listan los cuatro.

import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Clock, ListChecks } from 'lucide-react';
import { blueprintBloque, FINAL } from '@/content/blueprint-examen';
import { BLOQUES, MODULOS, modulosDelBloque } from '@/content/estructura';
import { censarModulos } from '@/lib/censo';
import { diagnosticarViabilidad, type CensoModulo } from '@/lib/simulacro';
import type { BlueprintExamen, BloqueId } from '@/lib/tipos';
import { CLASES_BLOQUE, cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Simulacros',
  robots: { index: false },
};

interface Ficha {
  href: string;
  titulo: string;
  descripcion: string;
  blueprint: BlueprintExamen;
  bloque: BloqueId | null;
  faltan: number;
  viable: boolean;
}

export default async function PaginaSimulacros() {
  const censo = await censarModulos();
  const porSlug = new Map(censo.map((c) => [c.slug, c]));

  const acotar = (slugs: readonly string[]): CensoModulo[] =>
    slugs.map((slug) => porSlug.get(slug)).filter((c) => c !== undefined);

  const fichas: Ficha[] = BLOQUES.map((bloque) => {
    const bp = blueprintBloque(bloque.id);
    const v = diagnosticarViabilidad(bp, acotar(modulosDelBloque(bloque.id).map((m) => m.slug)));
    return {
      href: `/simulacros/bloque/${bloque.id}`,
      titulo: `Bloque ${bloque.id} · ${bloque.titulo}`,
      descripcion: `${bp.totalItems} ítems · ${bp.minutos} min`,
      blueprint: bp,
      bloque: bloque.id,
      faltan: v.faltan,
      viable: v.viable,
    };
  });

  const vFinal = diagnosticarViabilidad(FINAL, censo);
  const fichaFinal: Ficha = {
    href: '/simulacros/final',
    titulo: 'Simulacro final',
    descripcion: `${FINAL.totalItems} ítems · ${FINAL.minutos} min · los 4 bloques`,
    blueprint: FINAL,
    bloque: null,
    faltan: vFinal.faltan,
    viable: vFinal.viable,
  };

  const publicados = MODULOS.filter((m) => m.estadoContenido === 'completo').length;
  const listos = [...fichas, fichaFinal].filter((f) => f.viable).length;

  return (
    <div className="space-y-8 py-2">
      <header className="space-y-3">
        <h1>Simulacros</h1>
        <p className="text-muted-foreground">
          El escalón entre estudiar y presentar. El quiz mide un módulo; estos miden un bloque
          entero o el examen completo, con cronómetro y sin explicaciones por el camino.
        </p>
      </header>

      {/* Estado vacío honesto (§22 regla 11): con contenido de un solo módulo
          NINGÚN simulacro es armable, y decirlo aquí arriba evita que el usuario
          recorra las cinco fichas para descubrirlo una a una. */}
      {listos === 0 ? (
        <section
          aria-labelledby="sin-simulacros"
          className="space-y-3 rounded-md border-l-4 border-aviso bg-aviso/10 p-4"
        >
          <h2 id="sin-simulacros" className="text-base">
            Todavía no hay contenido para ningún simulacro
          </h2>
          <p className="text-[0.8125rem] leading-[1.45] text-muted-foreground">
            Hay {publicados} de {MODULOS.length}{' '}
            {publicados === 1 ? 'módulo publicado' : 'módulos publicados'}. Un simulacro necesita
            cubrir un bloque entero, así que se irán habilitando a medida que se publique el
            contenido. Cada ficha dice cuántos ítems le faltan.
          </p>
          <p className="text-[0.8125rem] leading-[1.45]">
            Mientras tanto, el quiz de cada módulo publicado sí está completo:{' '}
            <Link
              href="/modulos"
              className="inline-flex items-center font-medium text-primary underline underline-offset-2"
            >
              ver los módulos
            </Link>
            .
          </p>
        </section>
      ) : null}

      <section aria-labelledby="por-bloque" className="space-y-3">
        <h2 id="por-bloque">Por bloque</h2>
        <ul className="space-y-3">
          {fichas.map((ficha) => (
            <li key={ficha.href}>
              <FichaSimulacro ficha={ficha} />
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="completo" className="space-y-3">
        <h2 id="completo">El examen completo</h2>
        <FichaSimulacro ficha={fichaFinal} />
      </section>
    </div>
  );
}

function FichaSimulacro({ ficha }: { ficha: Ficha }) {
  return (
    <Link
      href={ficha.href}
      className={cn(
        'flex items-center gap-3 rounded-lg border border-border bg-card p-4 shadow-sm',
        'transition-colors duration-150 ease-out hover:bg-accent',
        // El texto sube a `text-foreground` sobre `bg-accent`: en tema oscuro
        // `text-muted-foreground` sobre `accent` mide 4.47:1 y no pasa AA.
        'hover:text-foreground',
      )}
    >
      {/* Barra de bloque: el color acompaña, nunca informa solo (DISENO.md
          §1.2). El bloque va escrito en el título de la ficha. */}
      <span
        aria-hidden="true"
        className={cn(
          'h-10 w-1 shrink-0 rounded-full',
          ficha.bloque === null ? 'bg-primary' : CLASES_BLOQUE[ficha.bloque].fondo,
        )}
      />

      <span className="min-w-0 grow space-y-1">
        <span className="block font-medium">{ficha.titulo}</span>
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.8125rem] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <ListChecks className="size-3.5" aria-hidden="true" />
            {ficha.blueprint.totalItems} ítems
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-3.5" aria-hidden="true" />
            {ficha.blueprint.minutos} min
          </span>
          {!ficha.viable ? (
            // El estado va en TEXTO, no en un color ni en un icono suelto: es
            // la información que decide si merece la pena entrar.
            //
            // [A-30 · 1.4.3] `[a:hover_&]:text-foreground` no es adorno:
            // `text-aviso` sobre `--accent` mide **4,01:1** en tema claro, por
            // debajo del 4,5 de AA. La ficha ya sube el texto apagado con
            // `hover:text-foreground`, pero este span fija su propio color y no
            // lo hereda, así que necesita su propia regla.
            <span className="font-medium text-aviso [a:hover_&]:text-foreground">
              faltan {ficha.faltan} {ficha.faltan === 1 ? 'ítem' : 'ítems'}
            </span>
          ) : null}
        </span>
      </span>

      <ArrowRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
    </Link>
  );
}
