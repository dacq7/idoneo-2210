// src/components/mdx/alerta-contradiccion.tsx — Server Component. SIN "use client".
//
// El diferenciador del producto: las cuatro cartillas se contradicen entre sí y
// traen erratas, y esta es la pantalla que lo dice y explica qué responder.
//
// Lógica de §12.4 tal cual —incluidas las TRES ramas de rótulo que entraron con
// la enmienda de ADR-012— y tratamiento visual de DISENO.md §6, que manda sobre
// §12.4 en todo lo visual. Lo que cambia respecto del JSX de §12.4:
//
//   · el cuadro deja de ser rojo para los tres tipos. `'aclaracion'` va en
//     `aviso` (ADR-012 fija que NO puede ser rojo; §6.2 elige el token);
//   · `TriangleAlert` se retira: un icono por tipo (§6.2);
//   · el rótulo y el id pasan a `foreground`. Es una decisión por medición, no
//     estética: `text-aviso` sobre `bg-aviso/10` da 4.09:1 y falla AA (§6.3);
//   · el rótulo deja `font-titulo` (Barlow Condensed a 14px viola §2.3 regla 1)
//     y los `text-sm`/`text-xs` se llevan a la escala de §2.3 (§6.7).
//
// No cambia nada más: ni el `<dl>` de tres campos, ni su orden, ni el enlace a
// `/erratas#{id}`, ni el `if (!errata) return null`.

import Link from 'next/link';
import { CircleAlert, CircleX, Scale } from 'lucide-react';
import { ERRATAS_POR_ID } from '@/content/erratas';
import { cn } from '@/lib/utils';
import type { TipoErrata } from '@/lib/tipos';

/**
 * Un tratamiento por tipo. Ver DISENO.md §6.2 y §6.7.
 *
 * Clases completas y literales: Tailwind no genera `border-${x}/60`, por el
 * mismo motivo por el que §1.2 obliga a `CLASES_BLOQUE`.
 *
 * `contradiccion` y `errata` comparten `destructive` a propósito (§6.4):
 * comparten el mensaje de fondo —«el material fuente falla aquí»— y su
 * diferencia la cargan el rótulo y el icono, que es donde debe estar.
 *
 * Se exporta porque `/erratas` presenta el mismo catálogo con el mismo
 * vocabulario: un solo sitio donde vive el mapeo tipo → color, icono y rótulo.
 */
export const ESTILO_ERRATA: Record<
  TipoErrata,
  { rotulo: string; Icono: typeof Scale; marco: string; fondo: string; tinte: string }
> = {
  contradiccion: {
    rotulo: 'Las cartillas se contradicen',
    Icono: Scale,
    marco: 'border-destructive/60',
    fondo: 'bg-destructive/10',
    tinte: 'text-destructive',
  },
  errata: {
    rotulo: 'Errata de la cartilla',
    Icono: CircleX,
    marco: 'border-destructive/60',
    fondo: 'bg-destructive/10',
    tinte: 'text-destructive',
  },
  aclaracion: {
    rotulo: 'Aclaración: no es un error',
    Icono: CircleAlert,
    marco: 'border-aviso/60',
    fondo: 'bg-aviso/10',
    tinte: 'text-aviso',
  },
};

/** Clases del `<dt>`: fila «Eyebrow / etiqueta» de DISENO.md §2.3, literal. */
export const CLASES_DT_ERRATA =
  // 12px y no 11 (A-16, DISENO.md §2.5): un antetítulo se lee una vez al
  // entrar, pero el <dt> es la clave de una lista de definición a la que el
  // lector VUELVE mientras compara campos, 42 veces en /erratas. El umbral de
  // contraste no se mueve —WCAG empieza «texto grande» en 24px— así que es
  // ganancia de legibilidad a coste cero: sigue en 4.71:1.
  'text-[0.75rem] font-semibold uppercase leading-[1.1] tracking-[0.08em] text-muted-foreground';

export function AlertaContradiccion({ id }: { id: string }) {
  const errata = ERRATAS_POR_ID.get(id);
  // Un id inexistente rompería el build vía el validador; en runtime no
  // se renderiza nada roto.
  if (!errata) return null;

  const { rotulo, Icono, marco, fondo, tinte } = ESTILO_ERRATA[errata.tipo];
  // Nombra el landmark `complementary`: sin esto un módulo con cinco recuadros
  // anuncia cinco «complementario» idénticos. Ver la nota de §6.7.
  const idRotulo = `alerta-${errata.id}`;

  return (
    // `leading-[1.5]` fija el interlineado de «Cuerpo de interfaz» (§2.3): sin él,
    // el cuadro heredaría el 1.65 de la teoría dentro de un módulo y el 1.5 del
    // body en /erratas, y el mismo componente se vería distinto en cada sitio.
    // role="note" (A-09): mismo motivo que el <Ojo>. Un <aside> es landmark
    // `complementary`, y estos recuadros no son contenido complementario sino
    // apartes dentro del hilo de lectura. `note` los saca de la lista del lector
    // conservando el nombre que da `aria-labelledby`.
    <aside
      role="note"
      aria-labelledby={idRotulo}
      className={cn('my-6 rounded-lg border p-4 leading-[1.5]', marco, fondo)}
    >
      <div className="flex items-center gap-2">
        <Icono className={cn('mt-0.5 size-4 shrink-0', tinte)} aria-hidden="true" />
        {/* `my-0` y `mb-0`: el cuadro vive dentro de `.prose-idoneo`, que da
            `margin-block: 1rem` a todo <p>. Estos dos son estructura, no prosa. */}
        <p id={idRotulo} className="my-0 text-[0.9375rem] font-semibold text-foreground">
          {rotulo} · <span className="font-mono text-[0.875rem] font-medium">{errata.id}</span>
        </p>
      </div>
      <p className="mb-0 mt-2 text-[0.9375rem] font-medium text-foreground">{errata.tema}</p>
      <dl className="mt-3 space-y-2">
        <div>
          <dt className={CLASES_DT_ERRATA}>Dice la cartilla</dt>
          <dd className="text-[0.9375rem] text-foreground">{errata.diceLaCartilla}</dd>
        </div>
        <div>
          <dt className={CLASES_DT_ERRATA}>Lo correcto</dt>
          <dd className="text-[0.9375rem] text-foreground">{errata.loCorrecto}</dd>
        </div>
        <div>
          <dt className={CLASES_DT_ERRATA}>Cómo responder</dt>
          <dd className="text-[0.9375rem] font-medium text-foreground">{errata.comoResponder}</dd>
        </div>
      </dl>
      <Link
        href={`/erratas#${errata.id}`}
        className="mt-3 inline-flex items-center text-[0.9375rem] font-medium text-primary underline underline-offset-2"
      >
        {/* A-13: varios recuadros en un módulo producían tres enlaces con el
            nombre «Ver todas las erratas» y tres destinos distintos. Cumple
            2.4.4 en contexto, pero en la lista de enlaces del lector eran
            indistinguibles. El sufijo sr-only los desambigua sin cambiar lo que
            se ve ni la longitud de línea del texto visible. */}
        Ver todas las erratas
        <span className="sr-only"> · ficha {errata.id}</span>
      </Link>
    </aside>
  );
}
