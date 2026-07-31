// src/components/informe/tabla-dominio.tsx
//
// Sin directiva de cliente: lo importa `barras-dominio.tsx`. No es un alta a §10.3.
//
// **Esta tabla es la FUENTE del dominio por bloque, no el pie de una gráfica.**
// Se carga siempre y de forma síncrona; la gráfica llega después y puede no
// llegar (ver `barras-dominio.tsx`). Por eso vive en su propio archivo: separar
// lo que el usuario necesita de lo que le viene bien es lo que permite que
// recharts sea diferido sin que falte información.
//
// Los porcentajes son el dato que se quiere comparar y anotar: una tabla los da
// exactos, una barra los da aproximados. Y el nombre del bloque va escrito,
// porque el color nunca es el único portador (DISENO.md §1.2).

import type { BloqueId } from '@/lib/tipos';
import { cn } from '@/lib/utils';

export interface DominioBloque {
  bloque: BloqueId;
  titulo: string;
  porcentaje: number;
  total: number;
}

export interface PropsDominio {
  datos: readonly DominioBloque[];
  /** Delta en puntos porcentuales contra el intento anterior. `null` = sin comparación. */
  delta: Record<BloqueId, number | null> | null;
}

const CLASE_TEXTO: Record<BloqueId, string> = {
  A: 'text-bloque-a',
  B: 'text-bloque-b',
  C: 'text-bloque-c',
  D: 'text-bloque-d',
};

/**
 * La tabla con los mismos números. Visible siempre, no `sr-only`: es la fuente
 * de la que sale la gráfica, no su subtítulo.
 */
export function TablaDominio({ datos, delta }: PropsDominio) {
  const hayDelta = delta !== null && datos.some((d) => delta[d.bloque] !== null);

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full border-collapse text-sm">
        <caption className="sr-only">
          Porcentaje de aciertos por bloque, con el número de ítems evaluados
          {hayDelta ? ' y el cambio respecto al intento anterior' : ''}
        </caption>
        <thead>
          <tr>
            <th scope="col" className="border-b-2 border-border px-3 py-2 text-left font-semibold">
              Bloque
            </th>
            <th scope="col" className="border-b-2 border-border px-3 py-2 text-right font-semibold">
              Aciertos
            </th>
            <th scope="col" className="border-b-2 border-border px-3 py-2 text-right font-semibold">
              Dominio
            </th>
            {hayDelta ? (
              <th
                scope="col"
                className="border-b-2 border-border px-3 py-2 text-right font-semibold"
              >
                Cambio
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {datos.map((d) => {
            const cambio = delta?.[d.bloque] ?? null;
            return (
              <tr key={d.bloque}>
                <th scope="row" className="border-b border-border px-3 py-2 text-left font-normal">
                  {/* La letra en el color del bloque, el nombre en texto: el
                      color acompaña y nunca informa solo. */}
                  <span className={cn('font-semibold', CLASE_TEXTO[d.bloque])}>{d.bloque}</span>{' '}
                  {d.titulo}
                </th>
                <td className="border-b border-border px-3 py-2 text-right font-mono tabular-nums">
                  {Math.round((d.porcentaje / 100) * d.total)}/{d.total}
                </td>
                <td className="border-b border-border px-3 py-2 text-right font-mono font-semibold tabular-nums">
                  {d.porcentaje}%
                </td>
                {hayDelta ? (
                  <td className="border-b border-border px-3 py-2 text-right font-mono tabular-nums">
                    {cambio === null ? (
                      // Guion largo, no un 0: «no comparable» y «no cambió» son
                      // cosas distintas y confundirlas sería inventar un dato.
                      <span className="text-muted-foreground">—</span>
                    ) : (
                      <span
                        className={cn(
                          cambio > 0 && 'text-exito',
                          cambio < 0 && 'text-destructive',
                          cambio === 0 && 'text-muted-foreground',
                        )}
                      >
                        {/* El signo va en el texto, no solo en el color. */}
                        {cambio > 0 ? '+' : ''}
                        {cambio}
                      </span>
                    )}
                  </td>
                ) : null}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
