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
// Y **con nombre**: `aria-label={rotulo}`. En la pestaña Cardio hay TRES
// regiones vivas a la vez, y sin nombre rellenar «FC máxima» disparaba dos
// anuncios seguidos —«144 lpm»… «12,60 L/min»— sin decir cuál era Karvonen y
// cuál el gasto cardíaco. La regla ya estaba escrita en ACCESIBILIDAD.md: si
// hay más de un `status` en pantalla, todos llevan etiqueta. Ver A-47.
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
        <p
          aria-live="polite"
          aria-atomic="true"
          aria-label={rotulo}
          className="font-mono text-3xl font-semibold tabular-nums"
        >
          {valor ?? '—'}
          {valor !== null && unidad ? (
            <span className="ml-1.5 text-lg font-normal text-muted-foreground">{unidad}</span>
          ) : null}
        </p>
      </div>

      {/* [A-50] `overflow-x-auto` + `whitespace-nowrap` hacen que Chromium
          vuelva este bloque enfocable por desbordamiento, y lo era sin rol,
          sin nombre y —lo peor— con el contorno del navegador: la regla de
          foco de `globals.css` solo lista controles, así que una `<p>`
          enfocable caía al `outline-ring/50` de 1 px, que mide 2,26:1. Con
          `tabIndex` explícito recupera el contorno de 2 px del proyecto, y con
          rol y nombre deja de ser una parada anónima. Recurrencia de A-10. */}
      <p
        role="group"
        aria-label={`Fórmula de ${rotulo.toLowerCase()}`}
        tabIndex={0}
        className="overflow-x-auto whitespace-nowrap rounded border border-border bg-card px-2.5 py-1.5 font-mono text-[0.8125rem] text-muted-foreground"
      >
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
