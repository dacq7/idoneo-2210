// src/app/simulacros/bloque/[bloqueId]/page.tsx — Server Component.
//
// Simulacro de bloque: 40 ítems en 50 minutos repartidos entre los módulos del
// bloque. Los cuatro se prerenderizan con generateStaticParams.
//
// Frontera (ADR-010): igual que el final — blueprint, slugs y censo se resuelven
// aquí; el banco lo carga el controlador con `import()` bajo interacción.
//
// DISENO.md §2.4 — REGLA DEL SISTEMA: esta ruta tiene exactamente un bloque en
// contexto, así que monta <RotuloBloque> encima de su <h1>. La regla nombra esta
// ruta expresamente.

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { blueprintBloque } from '@/content/blueprint-examen';
import { BLOQUES, BLOQUES_POR_ID, modulosDelBloque } from '@/content/estructura';
import { RotuloBloque } from '@/components/layout/rotulo-bloque';
import { ControladorSimulacro } from '@/components/sesion/controlador-simulacro';
import { censarModulos, moduloAlternativo } from '@/lib/censo';
import type { Bloque, BloqueId } from '@/lib/tipos';

interface Props {
  /** Next 15: los params son una promesa. Ver §10.1. */
  params: Promise<{ bloqueId: string }>;
}

export function generateStaticParams() {
  return BLOQUES.map((bloque) => ({ bloqueId: bloque.id }));
}

/** Tolera minúsculas en la URL, igual que `/bloques/[bloqueId]`. */
function buscarBloque(bloqueId: string): Bloque | undefined {
  return BLOQUES_POR_ID.get(bloqueId.toUpperCase() as BloqueId);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { bloqueId } = await params;
  const bloque = buscarBloque(bloqueId);

  return {
    title: bloque ? `Simulacro del bloque ${bloque.id}` : 'Bloque no encontrado',
    robots: { index: false },
  };
}

export default async function PaginaSimulacroBloque({ params }: Props) {
  const { bloqueId } = await params;
  const bloque = buscarBloque(bloqueId);
  if (!bloque) notFound();

  const slugs = modulosDelBloque(bloque.id).map((m) => m.slug);
  const [censo, alternativa] = await Promise.all([censarModulos(slugs), moduloAlternativo()]);

  return (
    <div className="space-y-8 py-2">
      <header className="space-y-3">
        <RotuloBloque bloque={bloque.id} />
        <h1>Simulacro del bloque {bloque.id}</h1>
        <p className="text-muted-foreground">
          40 ítems en 50 minutos, repartidos entre los {slugs.length} módulos de {bloque.titulo}.
          Es el paso intermedio entre el quiz de un módulo y el simulacro final.
        </p>
      </header>

      <ControladorSimulacro
        blueprint={blueprintBloque(bloque.id)}
        censo={censo}
        slugs={slugs}
        tipo="bloque"
        ambito={bloque.id}
        bloque={bloque.id}
        alternativa={alternativa}
        volver={{ href: '/simulacros', texto: 'Volver a los simulacros' }}
      />
    </div>
  );
}
