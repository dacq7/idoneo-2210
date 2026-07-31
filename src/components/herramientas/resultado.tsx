'use client';

// src/components/herramientas/resultado.tsx — Client Component.
//
// El bloque de resultado de cada panel de la calculadora.
//
// ══ LA FÓRMULA VA DEBAJO DEL NÚMERO, SIEMPRE ══
// §15.1 lo fija y es la decisión que separa esta herramienta de cualquier
// calculadora: enseña **cómo** se llegó al número. Un entrenador que se está
// examinando necesita reproducir la operación en un papel, y el examen le va a
// pedir la fórmula, no el resultado.
//
// ══ `aria-live` EN EL VALOR, NO EN EL CONTENEDOR ══
// El resultado cambia con cada tecla. Si la región viva envolviera también la
// fórmula y el enlace, cada pulsación reanunciaría el bloque entero. Solo el
// número es `polite`.
//
// ══ EL ESTADO VACÍO NO ES UN CERO ══
// Con los campos sin rellenar se pinta «—», no «0». Un cero es una respuesta y
// esto es la ausencia de respuesta; enseñar 0 lpm invita a creer que la
// calculadora falló.

import Link from 'next/link';

export function Resultado({
  rotulo,
  valor,
  unidad,
  formula,
  modulo,
  tituloModulo,
  nota,
}: {
  rotulo: string;
  /** Ya formateado. `null` cuando faltan datos: se pinta «—». */
  valor: string | null;
  unidad?: string;
  /** La operación con los números del usuario ya sustituidos. */
  formula: string;
  /** Slug del módulo que la explica. La herramienta es puerta al estudio (§15.1). */
  modulo: string;
  tituloModulo: string;
  nota?: string;
}) {
  return (
    <div className="space-y-3 rounded-lg border border-primary/25 bg-primary/5 p-4">
      <div>
        <p className="text-[0.75rem] font-medium uppercase tracking-wide text-muted-foreground">
          {rotulo}
        </p>
        <p aria-live="polite" className="font-mono text-3xl font-semibold tabular-nums">
          {valor ?? '—'}
          {valor !== null && unidad ? (
            <span className="ml-1.5 text-lg font-normal text-muted-foreground">{unidad}</span>
          ) : null}
        </p>
      </div>

      <p className="overflow-x-auto whitespace-nowrap rounded border border-border bg-card px-2.5 py-1.5 font-mono text-[0.8125rem] text-muted-foreground">
        {formula}
      </p>

      {nota ? <p className="text-[0.75rem] leading-[1.45] text-muted-foreground">{nota}</p> : null}

      <Link
        href={`/modulos/${modulo}`}
        className="inline-flex min-h-11 items-center text-[0.8125rem] font-medium text-primary underline underline-offset-2"
      >
        Dónde se explica: {tituloModulo}
      </Link>
    </div>
  );
}
