// src/components/layout/encabezado.tsx — Server Component: sin directiva de cliente.
// Alta a la lista cerrada de §10.3 aprobada en ADR-009: no tiene estado ni
// eventos, solo compone dos piezas cliente (el riel y el interruptor de tema).
//
// El encabezado NO rotula la sección: el título de cada pantalla es el <h1> de
// su página, así que la jerarquía de encabezados empieza y termina en un solo
// sitio. Aquí solo vive la identidad de la app y el riel de bloques, que va a
// sangre completa en todas las rutas (DISENO.md §4.3).

import Link from 'next/link';
import { BLOQUES } from '@/content/estructura';
import { InterruptorTema } from './interruptor-tema';
import { RielBloques, type SegmentoRiel } from './riel-bloques';

/**
 * El riel es cliente (necesita `usePathname`), así que los datos de bloque se
 * le pasan por prop desde aquí en vez de que él importe `@/content/estructura`.
 * Sin esto, los 29 módulos completos viajan al bundle del navegador: 5,8 kB gz.
 * Ver ADR-010 — es regla del proyecto, no una optimización local.
 */
const SEGMENTOS: SegmentoRiel[] = BLOQUES.map((b) => ({
  id: b.id,
  peso: b.pesoExamen,
  titulo: b.titulo,
}));

export function Encabezado() {
  return (
    <header className="sticky top-0 z-40 bg-background">
      <div className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between gap-3 px-4 sm:px-6 lg:max-w-none">
        <Link
          href="/"
          className="flex items-center rounded-md font-titulo text-xl font-bold tracking-[-0.005em]"
        >
          Idóneo 2210
        </Link>
        <InterruptorTema />
      </div>
      <RielBloques segmentos={SEGMENTOS} />
    </header>
  );
}
