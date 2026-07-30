// src/app/bloques/[bloqueId]/page.tsx — Server Component.
//
// Índice de un bloque: su descripción, cuánto pesa en el examen y sus módulos en
// orden de estudio. Los cuatro bloques se prerenderizan con generateStaticParams.
//
// Frontera (§10.2): la página lee `content/estructura.ts` en el servidor y pasa
// a los componentes solo el subconjunto que muestran (ADR-010). Nada de esto
// llega al bundle del navegador.
//
// DISENO.md §2.4 — REGLA DEL SISTEMA: esta ruta tiene exactamente un bloque en
// contexto, así que monta <RotuloBloque> encima de su <h1>. El riel del
// encabezado marca el bloque solo por color y §1.2 prohíbe que el color sea el
// único portador: el rótulo es lo que cierra ese hueco.

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BLOQUES, BLOQUES_POR_ID, modulosDelBloque } from '@/content/estructura';
import { RotuloBloque } from '@/components/layout/rotulo-bloque';
import { ListaModulos } from '@/components/modulo/lista-modulos';
import { MetaBloque } from '@/components/modulo/meta-bloque';
import { aModuloEnLista } from '@/components/modulo/tarjeta-modulo';
import { CLASES_BLOQUE, cn } from '@/lib/utils';
import type { Bloque, BloqueId } from '@/lib/tipos';

interface Props {
  /** Next 15: los params son una promesa. Ver §10.1. */
  params: Promise<{ bloqueId: string }>;
}

export function generateStaticParams() {
  return BLOQUES.map((bloque) => ({ bloqueId: bloque.id }));
}

/**
 * Busca el bloque tolerando minúsculas en la URL (`/bloques/c`), igual que hace
 * `bloqueDeRuta` para el riel: así la página y el riel nunca se contradicen.
 * El cast es seguro porque un id inválido devuelve `undefined` y se resuelve con
 * `notFound()`; no hay forma de que una letra ajena entre al render.
 */
function buscarBloque(bloqueId: string): Bloque | undefined {
  return BLOQUES_POR_ID.get(bloqueId.toUpperCase() as BloqueId);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { bloqueId } = await params;
  const bloque = buscarBloque(bloqueId);

  return {
    title: bloque ? `Bloque ${bloque.id} · ${bloque.titulo}` : 'Bloque no encontrado',
    // La app es privada de facto: solo la portada se indexa (§10.1).
    robots: { index: false },
  };
}

export default async function PaginaBloque({ params }: Props) {
  const { bloqueId } = await params;
  const bloque = buscarBloque(bloqueId);
  if (!bloque) notFound();

  const modulos = modulosDelBloque(bloque.id).map(aModuloEnLista);
  const otros = BLOQUES.filter((b) => b.id !== bloque.id);

  return (
    <div className="space-y-8 py-2">
      <section className="space-y-3">
        <RotuloBloque bloque={bloque.id} />
        <h1>{bloque.titulo}</h1>
        <p className="text-muted-foreground">{bloque.descripcion}</p>
        <MetaBloque
          pesoExamen={bloque.pesoExamen}
          numeroCartilla={bloque.numeroCartilla}
          totalModulos={modulos.length}
        />
      </section>

      <section className="space-y-3">
        <h2>Módulos, en orden de estudio</h2>
        <p className="text-[0.8125rem] text-muted-foreground">
          El orden respeta los prerequisitos: cada módulo se apoya en los anteriores. Se puede
          estudiar en otro orden, pero este es el que menos huecos deja.
        </p>
        <ListaModulos modulos={modulos} bloque={bloque.id} />
      </section>

      <nav aria-labelledby="otros-bloques" className="space-y-3">
        <h2 id="otros-bloques">Los otros bloques</h2>
        <ul className="grid gap-3 sm:grid-cols-3 sm:gap-4">
          {otros.map((otro) => (
            <li key={otro.id}>
              <Link
                href={`/bloques/${otro.id}`}
                className="flex h-full items-center gap-2.5 rounded-md border border-border bg-card px-3 py-2 text-sm transition-colors duration-150 hover:bg-accent"
              >
                {/* Marca de color; la letra y el título del bloque van en el
                    texto del enlace, así que el color no informa por sí solo. */}
                <span
                  aria-hidden="true"
                  className={cn('h-5 w-1 shrink-0 rounded-none', CLASES_BLOQUE[otro.id].fondo)}
                />
                <span className="min-w-0">
                  Bloque {otro.id} · {otro.titulo}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
