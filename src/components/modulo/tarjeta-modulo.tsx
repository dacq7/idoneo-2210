// src/components/modulo/tarjeta-modulo.tsx — Server Component, sin directiva de cliente.
//
// La ficha de un módulo en un índice. La comparten las dos rutas del Paso 6
// (/bloques/[bloqueId] y /modulos) para que un módulo se vea igual en las dos.
//
// Frontera: es servidor y no necesita `content/`, así que recibe el módulo ya
// proyectado a `ModuloEnLista`. Cumple ADR-010 por construcción y deja el
// componente reutilizable desde cualquier página sin arrastrar los 29 módulos.
//
// El estado del contenido NO se lee del progreso del usuario: sale de
// `estadoContenido` de content/estructura.ts. El progreso llega en el Paso 8.

import Link from 'next/link';
import { CLASES_BLOQUE, cn } from '@/lib/utils';
import type { BloqueId, Modulo } from '@/lib/tipos';

/** Lo mínimo que la ficha necesita de un `Modulo`. */
export interface ModuloEnLista {
  slug: string;
  titulo: string;
  subtitulo: string;
  minutosEstimados: number;
  /** `estadoContenido !== 'completo'`. Gobierna la insignia, no la navegación. */
  enPreparacion: boolean;
}

/**
 * Proyección de un `Modulo` de content/estructura.ts al subconjunto que se
 * muestra. Vive junto al tipo para que las dos rutas del Paso 6 deriven
 * `enPreparacion` de la misma forma: un solo módulo se marca «completo», y la
 * regla de cuándo no puede quedar escrita dos veces.
 *
 * Solo se llama desde Server Components.
 */
export function aModuloEnLista(modulo: Modulo): ModuloEnLista {
  return {
    slug: modulo.slug,
    titulo: modulo.titulo,
    subtitulo: modulo.subtitulo,
    minutosEstimados: modulo.minutosEstimados,
    enPreparacion: modulo.estadoContenido !== 'completo',
  };
}

/**
 * Código del módulo a partir del slug: `c5-umbrales-zonas` → `C5`.
 *
 * No es decoración numerada de las que prohíbe DISENO.md §5.2: es el
 * identificador real del módulo, el mismo prefijo que llevan los ids de los
 * ítems (`C5-014`) y con el que el usuario los va a ver en el informe.
 */
function codigoDeSlug(slug: string): string {
  return slug.split('-')[0].toUpperCase();
}

export function TarjetaModulo({ modulo, bloque }: { modulo: ModuloEnLista; bloque: BloqueId }) {
  return (
    // `group` + `relative`: el enlace del título se estira sobre toda la tarjeta
    // con `after:absolute inset-0`, así que el objetivo táctil es la tarjeta
    // completa pero el nombre accesible del enlace es solo el título del módulo.
    // Un <Link> envolviendo toda la ficha leería también subtítulo y metadatos.
    <article
      className={cn(
        'group relative flex items-start gap-3 rounded-lg border border-border bg-card p-4 shadow-sm',
        'transition-colors duration-150 hover:bg-accent sm:p-6',
      )}
    >
      {/* Color de bloque y letra de bloque en el mismo elemento: el código
          empieza por la letra, así que el color nunca es el único portador
          (DISENO.md §1.2). Contraste medido de --bloque-contraste sobre el
          bloque sólido: 4.84:1 en el peor caso (C). Mismo tratamiento que la
          letra de opción de un ítem (§2.1): JetBrains Mono, rounded-md. */}
      <span
        className={cn(
          'grid size-8 shrink-0 place-items-center rounded-md font-mono text-sm font-medium text-bloque-contraste',
          CLASES_BLOQUE[bloque].fondo,
        )}
      >
        {codigoDeSlug(modulo.slug)}
      </span>

      <div className="min-w-0 space-y-1">
        <h3>
          <Link
            href={`/modulos/${modulo.slug}`}
            className="after:absolute after:inset-0 after:rounded-lg after:content-['']"
          >
            {modulo.titulo}
          </Link>
        </h3>

        {/* `group-hover:text-foreground` no es adorno: text-muted-foreground
            sobre bg-accent mide 4.47:1 en tema oscuro y no es AA. Al cambiar el
            fondo en hover, el texto tiene que subir en el mismo estado. */}
        <p className="text-[0.8125rem] leading-relaxed text-muted-foreground transition-colors duration-150 group-hover:text-foreground">
          {modulo.subtitulo}
        </p>

        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 pt-0.5 text-[0.8125rem] text-muted-foreground transition-colors duration-150 group-hover:text-foreground">
          <span>{modulo.minutosEstimados} min</span>
          {modulo.enPreparacion ? (
            <>
              <span aria-hidden="true">·</span>
              {/* El estado va en palabras, no en color: la insignia se entiende
                  en escala de grises y la anuncia el lector de pantalla.
                  Marcado propio en vez de <Badge variant="secondary">, que es
                  idéntico visualmente pero importa `Slot` del barrel `radix-ui`
                  y mete 76 kB gz en la primera carga de las dos rutas del índice.
                  Medido: 183.4 → 106.2 kB gz. Ver COMPONENTES.md. */}
              <span className="inline-flex w-fit shrink-0 items-center whitespace-nowrap rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                En preparación
              </span>
            </>
          ) : null}
        </p>
      </div>
    </article>
  );
}
