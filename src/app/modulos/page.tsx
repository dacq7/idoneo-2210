// src/app/modulos/page.tsx — Server Component.
//
// Índice global de la ruta de estudio: los 29 módulos agrupados por bloque, con
// el color de su bloque y la insignia «En preparación» en los que todavía no
// tienen contenido. Es el destino «Módulos» de las dos barras de navegación.
//
// DISENO.md §2.4: esta ruta NO lleva <RotuloBloque>. El rótulo aparece si y solo
// si hay exactamente un bloque en contexto, y aquí están los cuatro; el riel del
// encabezado, coherente con eso, muestra sus cuatro segmentos sin énfasis.
//
// La insignia sale de `estadoContenido` de content/estructura.ts, no del
// progreso del usuario: el progreso llega en el Paso 8.

import type { Metadata } from 'next';
import Link from 'next/link';
import { BLOQUES, MODULOS, modulosDelBloque } from '@/content/estructura';
import { ListaModulos } from '@/components/modulo/lista-modulos';
import { MetaBloque } from '@/components/modulo/meta-bloque';
import { aModuloEnLista } from '@/components/modulo/tarjeta-modulo';
import { CLASES_BLOQUE, cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Módulos',
  // La app es privada de facto: solo la portada se indexa (§10.1).
  robots: { index: false },
};

export default function PaginaModulos() {
  const publicados = MODULOS.filter((m) => m.estadoContenido === 'completo').length;

  const grupos = BLOQUES.map((bloque) => ({
    bloque,
    modulos: modulosDelBloque(bloque.id).map(aModuloEnLista),
  }));

  return (
    <div className="space-y-8 py-2">
      <section className="space-y-3">
        <p className="text-[0.6875rem] font-semibold uppercase leading-[1.1] tracking-[0.08em] text-muted-foreground">
          Ruta de estudio
        </p>
        <h1>Los {MODULOS.length} módulos</h1>
        <p className="text-muted-foreground">
          Cuatro bloques, uno por cartilla, en el mismo orden en que pesan en el examen. Cada módulo
          trae teoría, tarjetas, práctica y quiz.
        </p>
        <p className="text-[0.8125rem] text-muted-foreground">
          {publicados === 0
            ? `Todavía ningún módulo tiene su contenido publicado: los ${MODULOS.length} aparecen «En preparación». La estructura ya está fija, así que el contenido se irá publicando módulo por módulo.`
            : `${publicados} de ${MODULOS.length} módulos ya tienen su contenido publicado. Los demás aparecen «En preparación».`}
        </p>
      </section>

      {grupos.map(({ bloque, modulos }) => (
        <section key={bloque.id} aria-labelledby={`bloque-${bloque.id}`} className="space-y-3">
          <div className="space-y-1.5">
            {/* Banda de 4px del color del bloque, igual que la lengüeta del
                destino activo de la nav (DISENO.md §4.5) y que los segmentos del
                riel: rounded-none, relleno puro, sin tipografía encima. Decorativa
                porque el <h2> ya nombra la letra y el título del bloque. */}
            <span
              aria-hidden="true"
              className={cn('block h-1 w-8 rounded-none', CLASES_BLOQUE[bloque.id].fondo)}
            />
            <h2 id={`bloque-${bloque.id}`}>
              Bloque {bloque.id} · {bloque.titulo}
            </h2>
            <MetaBloque
              pesoExamen={bloque.pesoExamen}
              numeroCartilla={bloque.numeroCartilla}
              totalModulos={modulos.length}
            />
          </div>

          <ListaModulos modulos={modulos} bloque={bloque.id} />

          {/* `inline-flex` no es cosmético: el piso táctil de 44 px de
              globals.css no alcanza a las cajas `inline`, y este es un enlace de
              acción suelto, no un enlace dentro de un párrafo de prosa. Con
              `inline-flex` la regla base sí aplica y el objetivo llega a 44 px. */}
          <p>
            <Link
              href={`/bloques/${bloque.id}`}
              className="inline-flex items-center text-sm font-medium text-primary underline underline-offset-2"
            >
              Ver el bloque {bloque.id} completo
            </Link>
          </p>
        </section>
      ))}
    </div>
  );
}
