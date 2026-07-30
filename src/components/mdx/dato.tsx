// src/components/mdx/dato.tsx — Server Component. SIN "use client".
//
// Base: §12.2. Los tres tamaños se llevan a la escala de DISENO.md §2.3, que es
// la fuente de verdad tipográfica: `text-xs tracking-wide` y `text-sm` no
// existen en esa escala. Nada más cambia de §12.2.

/**
 * Valor exacto en línea dentro de la teoría: `<Dato etiqueta="R1" valor="65–75 %" />`.
 * El etiquetado va en versalitas (fila «Eyebrow / etiqueta») y el valor en
 * JetBrains Mono (fila «Dato / valor / fórmula»), que es donde vive todo número
 * que el examen pregunta con precisión.
 */
export function Dato({
  etiqueta,
  valor,
  nota,
}: {
  etiqueta: string;
  valor: string;
  nota?: string;
}) {
  return (
    <span className="my-1 inline-flex flex-wrap items-baseline gap-x-2 rounded-md border border-primary/25 bg-primary/5 px-2.5 py-1">
      <span className="text-[0.6875rem] font-semibold uppercase leading-[1.1] tracking-[0.08em] text-muted-foreground">
        {etiqueta}
      </span>
      <span className="font-mono text-[0.875rem] font-medium text-foreground">{valor}</span>
      {nota ? <span className="text-[0.8125rem] text-muted-foreground">{nota}</span> : null}
    </span>
  );
}
