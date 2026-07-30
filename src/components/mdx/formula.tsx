// src/components/mdx/formula.tsx — Server Component. SIN "use client".
//
// Base: §12.2. Dos ajustes a la escala de DISENO.md §2.3: la fórmula pasa de
// `text-base` (16px, fuera de escala) a la fila «Dato / valor / fórmula»
// —JetBrains Mono 500 a 14px, que nombra la fórmula explícitamente— y la nota de
// `text-xs` a la fila «Auxiliar / metadato» (13px).

/**
 * Fórmula en bloque, con nota opcional debajo.
 *
 * `whitespace-nowrap` + `overflow-x-auto` es deliberado: una fórmula partida en
 * dos líneas se lee mal, así que a 375 px se desplaza dentro de su propia caja
 * en vez de romper el layout de la página.
 */
export function Formula({ children, nota }: { children: React.ReactNode; nota?: string }) {
  return (
    <figure className="my-5 overflow-x-auto rounded-lg border border-border bg-muted/50 px-4 py-3">
      <div className="whitespace-nowrap font-mono text-[0.875rem] font-medium text-foreground">
        {children}
      </div>
      {nota ? (
        <figcaption className="mt-2 text-[0.8125rem] text-muted-foreground">{nota}</figcaption>
      ) : null}
    </figure>
  );
}
