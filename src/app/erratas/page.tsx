// src/app/erratas/page.tsx — Server Component.
//
// El registro completo de erratas y contradicciones de las cuatro cartillas: el
// activo defendible del producto (§1). Ninguna otra app de preparación lo tiene,
// porque exige haber leído las cuatro cartillas con lápiz en mano.
//
// DISENO.md §2.4: esta ruta NO lleva <RotuloBloque> — las entradas tocan módulos
// de los cuatro bloques, y el rótulo solo aparece con exactamente uno en contexto.
//
// Agrupa por los TRES tipos de ADR-012, no por dos. Cada entrada conserva su
// ancla `id={errata.id}`: <AlertaContradiccion> enlaza a `/erratas#X-02` desde la
// teoría, y `DD-001` de datos-duros.ts llega a `#X-03` por ahí.
//
// El vocabulario visual —color, icono y rótulo por tipo— se importa de
// ESTILO_ERRATA en vez de repetirse: un solo sitio donde vive DISENO.md §6.2.
// Aquí las entradas son <article> y no <aside>: en esta ruta son el contenido
// principal, no una interrupción de la lectura.

import type { Metadata } from 'next';
import Link from 'next/link';
import { MODULOS_POR_SLUG } from '@/content/estructura';
import { ERRATAS } from '@/content/erratas';
import { CLASES_DT_ERRATA, ESTILO_ERRATA } from '@/components/mdx/alerta-contradiccion';
import { cn } from '@/lib/utils';
import type { Errata, TipoErrata } from '@/lib/tipos';

export const metadata: Metadata = {
  title: 'Erratas y contradicciones',
  // La app es privada de facto: solo la portada se indexa (§10.1).
  robots: { index: false },
};

/**
 * Orden de presentación. Las dos familias `X-*` van primero y juntas: nacen de
 * la misma divergencia entre cartillas y X-03 existe para desambiguar X-02, así
 * que separarlas con las once erratas en medio rompería la lectura.
 */
const GRUPOS: { tipo: TipoErrata; titulo: string; entrada: string }[] = [
  {
    tipo: 'contradiccion',
    titulo: 'Las cartillas se contradicen',
    entrada:
      'Dos cartillas oficiales dan valores distintos para el mismo dato. Ninguna de las dos es «la equivocada»: hay que responder según el bloque que te esté evaluando, y eso es exactamente lo que dice cada ficha.',
  },
  {
    tipo: 'aclaracion',
    titulo: 'No es un error, pero se confunde',
    entrada:
      'La cartilla no se equivoca. El dato se parece tanto a otro vecino que la confusión es la trampa, y por eso está fichado aquí.',
  },
  {
    tipo: 'errata',
    titulo: 'Erratas de la cartilla',
    entrada:
      'La cartilla afirma algo falso, o trae una tabla mal armada. Estudia lo correcto; si el examen oficial repite el error de la cartilla, la ficha te dice qué marcar.',
  },
];

export default function PaginaErratas() {
  const grupos = GRUPOS.map((grupo) => ({
    ...grupo,
    entradas: ERRATAS.filter((errata) => errata.tipo === grupo.tipo),
  })).filter((grupo) => grupo.entradas.length > 0);

  // max-w-[38rem] · DISENO.md §3.1: /erratas no pasa por .prose-idoneo y son 14
  // fichas seguidas, o sea lectura sostenida. Sin el tope corría a ~93,7
  // caracteres por línea.
  return (
    <div className="max-w-[38rem] space-y-8 py-2">
      <header className="space-y-3">
        <p className="text-[0.6875rem] font-semibold uppercase leading-[1.1] tracking-[0.08em] text-muted-foreground">
          Registro
        </p>
        <h1>Erratas y contradicciones</h1>
        <p className="text-muted-foreground">
          Las cuatro cartillas de la <span className="italic">Guía básica del entrenador deportivo</span>{' '}
          se contradicen entre sí en algunos puntos y traen erratas en otros. Aquí están las{' '}
          {ERRATAS.length} que hemos verificado, con qué dice la cartilla, qué es lo correcto y —lo
          que de verdad importa— qué responder si te cae en el examen.
        </p>
        <p className="text-[0.8125rem] text-muted-foreground">
          Son tres o cuatro preguntas del examen real. Saberlas de memoria es barato y suele decidir
          el resultado.
        </p>
      </header>

      {grupos.map((grupo) => (
        <section key={grupo.tipo} aria-labelledby={`grupo-${grupo.tipo}`} className="space-y-3">
          <h2 id={`grupo-${grupo.tipo}`}>
            {grupo.titulo}{' '}
            <span className="font-sans text-[0.8125rem] font-normal text-muted-foreground">
              ({grupo.entradas.length}{' '}
              {grupo.entradas.length === 1 ? 'entrada' : 'entradas'})
            </span>
          </h2>
          <p className="text-[0.8125rem] text-muted-foreground">{grupo.entrada}</p>
          <ul className="space-y-3 sm:space-y-4">
            {grupo.entradas.map((errata) => (
              <li key={errata.id}>
                <FichaErrata errata={errata} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

/**
 * Una entrada del registro, con el mismo tratamiento por tipo que
 * <AlertaContradiccion> en la teoría (DISENO.md §6.7): marco completo, fondo al
 * 10 %, icono en el color del tipo y rótulo en `foreground`.
 *
 * `scroll-mt` compensa el encabezado pegajoso: sin él, saltar a `/erratas#E-09`
 * deja la ficha medio tapada. `--alto-encabezado` es la misma variable que usa
 * la barra lateral, así que si el encabezado cambia de alto las dos siguen
 * alineadas.
 */
function FichaErrata({ errata }: { errata: Errata }) {
  const { rotulo, Icono, marco, fondo, tinte } = ESTILO_ERRATA[errata.tipo];
  const modulos = errata.modulos
    .map((slug) => MODULOS_POR_SLUG.get(slug))
    .filter((modulo) => modulo !== undefined);

  return (
    <article
      id={errata.id}
      aria-labelledby={`titulo-${errata.id}`}
      className={cn(
        // max-w-[36rem] · DISENO.md §3.1: la ficha va a 15 px dentro de un marco
        // con padding, así que a 38rem corría a 79,6 caracteres por línea —
        // pasaba el 80 de 1.4.8 por menos de un carácter. A 36rem queda en ~75,
        // el mismo margen real que la teoría de 17 px. El envoltorio de la
        // página se queda en 38rem: lo gobiernan el h1 y la entradilla.
        'max-w-[36rem] scroll-mt-[calc(var(--alto-encabezado)+1rem)] rounded-lg border p-4 sm:p-6',
        marco,
        fondo,
      )}
    >
      <div className="flex items-center gap-2">
        <Icono className={cn('size-4 shrink-0', tinte)} aria-hidden="true" />
        <p className="text-[0.9375rem] font-semibold text-foreground">
          {rotulo} · <span className="font-mono text-[0.875rem] font-medium">{errata.id}</span>
        </p>
      </div>

      <h3 id={`titulo-${errata.id}`} className="mt-2">
        {errata.tema}
      </h3>
      <p className="mt-1 text-[0.8125rem] text-muted-foreground">{errata.ubicacion}</p>

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

      {modulos.length > 0 ? (
        <p className="mt-3 text-[0.8125rem] text-muted-foreground">
          Afecta a{' '}
          {modulos.map((modulo, i) => (
            <span key={modulo.slug}>
              {i > 0 ? ', ' : ''}
              <Link
                href={`/modulos/${modulo.slug}`}
                className="font-medium text-primary underline underline-offset-2"
              >
                {modulo.titulo}
              </Link>
            </span>
          ))}
          .
        </p>
      ) : null}
    </article>
  );
}
