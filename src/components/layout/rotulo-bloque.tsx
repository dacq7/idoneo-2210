// src/components/layout/rotulo-bloque.tsx
// Server Component, sin directiva de cliente: no añade una alta a la lista de §10.3.
//
// Implementa la REGLA DEL SISTEMA de DISENO.md §2.4, derivada de §1.2: el color
// de bloque nunca es el único portador de una información. El riel de §4.3
// comunica el bloque en contexto solo por color, así que toda pantalla con
// exactamente un bloque en contexto lleva este rótulo encima de su <h1>.
//
// Es responsabilidad de la PÁGINA, no del encabezado: la página ya resolvió su
// Modulo desde `params` y conoce el bloque con certeza, mientras que el
// encabezado tendría que pasar a cliente y deducirlo con usePathname — un dato
// que la página tiene exacto. Ver §2.4 para el razonamiento completo.

import { BLOQUES_POR_ID } from '@/content/estructura';
import { CLASES_BLOQUE, cn } from '@/lib/utils';
import type { BloqueId } from '@/lib/tipos';

/**
 * `BLOQUE C · CIENCIAS APLICADAS`, en el color del bloque.
 *
 * Es un `<p>` y no un encabezado: es el antetítulo del `<h1>`, y meterlo en la
 * jerarquía de encabezados produciría un salto. Nunca lleva `aria-hidden`: el
 * texto ES la alternativa al color.
 */
export function RotuloBloque({ bloque, className }: { bloque: BloqueId; className?: string }) {
  const titulo = BLOQUES_POR_ID.get(bloque)?.titulo;
  if (!titulo) return null;

  return (
    <p
      className={cn(
        'mb-1.5 text-[0.6875rem] font-semibold uppercase leading-[1.1] tracking-[0.08em]',
        CLASES_BLOQUE[bloque].texto,
        className,
      )}
    >
      Bloque {bloque} · {titulo}
    </p>
  );
}
