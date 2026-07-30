// src/components/mdx/tabla-clave.tsx — Server Component. SIN "use client".
//
// Base: §12.3, con una corrección obligada y una mecánica.
//
// 1. El título de §12.3 es `font-titulo text-sm` = Barlow Condensed a 14px, que
//    viola la regla dura 1 de DISENO.md §2.3 («Barlow Condensed nunca baja de
//    1.125rem»). Es exactamente la misma violación que §6.7 corrigió en el
//    rótulo de <AlertaContradiccion>, y se corrige igual: fila «Eyebrow /
//    etiqueta», Inter 600 a 11px con tracking +0.08em.
// 2. El desplazamiento horizontal de la tabla lo pone `.tabla-desliz`, el
//    envoltorio que `componentes.tsx` aplica a TODA tabla del MDX (también a las
//    sueltas). Aquí el marco solo recorta: `overflow-hidden` impide que el
//    contenido desplazado se salga de las esquinas redondeadas, y `.marco-tabla`
//    le cede el margen al envoltorio (regla en globals.css).

/**
 * Marco con título para una tabla de markdown. En MDX se escribe con líneas en
 * blanco alrededor de la tabla:
 *
 * ```mdx
 * <TablaClave titulo="Zonas de entrenamiento">
 *
 * | Zona | % FCmáx |
 * |---|---|
 * | R0 | < 65 % |
 *
 * </TablaClave>
 * ```
 */
export function TablaClave({ titulo, children }: { titulo?: string; children: React.ReactNode }) {
  return (
    <div className="my-6">
      {titulo ? (
        <p className="mb-2 mt-0 text-[0.6875rem] font-semibold uppercase leading-[1.1] tracking-[0.08em] text-muted-foreground">
          {titulo}
        </p>
      ) : null}
      <div className="marco-tabla overflow-hidden rounded-lg border border-border">{children}</div>
    </div>
  );
}
