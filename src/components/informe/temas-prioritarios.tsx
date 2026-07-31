// src/components/informe/temas-prioritarios.tsx
//
// Sin directiva de cliente: lo importa `vista-informe.tsx`. No es un alta a §10.3.
//
// Los cinco módulos más flojos, cada uno con su botón «Estudiar esto» que lleva
// directo a la teoría del módulo.
//
// ══ ES LA PARTE ACCIONABLE DEL INFORME ══
// El resto del informe describe; esto dice qué hacer y da el enlace para
// hacerlo. Es la diferencia entre un diagnóstico y un plan, y la razón por la
// que el enlace va a `/modulos/[slug]` —la teoría, donde se empieza— y no al
// quiz: quien falló el 40 % de un módulo no necesita volver a medirse, necesita
// volver a leerlo.
//
// ══ POR QUÉ PUEDE VENIR VACÍO, Y POR QUÉ ESO NO ES UN ERROR ══
// `temasPrioritarios` exige ≥3 ítems evaluados por módulo (§7.5). Un simulacro
// de bloque con 40 ítems sobre 9 módulos deja varios con 2, y esos no entran:
// con esa muestra, un 0 % dice más del muestreo que del usuario. Cuando no hay
// ninguno con evidencia suficiente, se dice, en vez de rellenar con los peores
// de una muestra que no aguanta.

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { TemaPrioritario } from '@/lib/tipos';
import { CLASES_BLOQUE, cn } from '@/lib/utils';

export function TemasPrioritarios({ temas }: { temas: readonly TemaPrioritario[] }) {
  return (
    <section aria-labelledby="titulo-temas" className="space-y-3">
      <h2 id="titulo-temas">Por dónde empezar</h2>

      {temas.length === 0 ? (
        <p className="text-muted-foreground">
          Este intento no evaluó ningún módulo con preguntas suficientes para señalarlo con
          criterio — hacen falta al menos 3 por módulo. El desglose de arriba sí sirve para ver
          qué bloque va más flojo.
        </p>
      ) : (
        <>
          <p className="text-muted-foreground">
            {temas.length === 1
              ? 'El módulo donde más se te escapó, con la teoría a un toque.'
              : `Los ${temas.length} módulos donde más se te escapó, en orden. Empieza por el primero.`}
          </p>

          <ol className="space-y-2">
            {temas.map((tema, i) => (
              <li key={tema.modulo}>
                <Link
                  href={`/modulos/${tema.modulo}`}
                  className={cn(
                    'flex items-center gap-3 rounded-lg border border-border bg-card p-3 shadow-sm sm:p-4',
                    'transition-colors duration-150 ease-out hover:bg-accent hover:text-foreground',
                  )}
                >
                  {/* El orden en cifra: la lista ya está ordenada, pero el
                      número hace que «el primero» sea señalable en voz alta y
                      sobreviva a que el usuario vuelva mañana. */}
                  <span className="font-mono text-sm font-semibold tabular-nums text-muted-foreground">
                    {i + 1}
                  </span>

                  {/* Barra del bloque: acompaña, nunca informa sola. El bloque
                      va escrito en la línea de abajo. */}
                  <span
                    aria-hidden="true"
                    className={cn('h-10 w-1 shrink-0 rounded-full', CLASES_BLOQUE[tema.bloque].fondo)}
                  />

                  <span className="min-w-0 grow space-y-0.5">
                    <span className="block font-medium">{tema.titulo}</span>
                    <span className="block text-[0.8125rem] text-muted-foreground">
                      Bloque {tema.bloque} ·{' '}
                      <span className="font-mono tabular-nums">
                        {tema.correctas}/{tema.total}
                      </span>{' '}
                      · {tema.porcentaje}% de aciertos
                    </span>
                  </span>

                  {/* «Estudiar esto» es el texto que pide §17: dice la acción,
                      no el destino. Se oculta en pantallas estrechas porque la
                      fila entera ya es el enlace y su nombre accesible lo
                      incluye. */}
                  <span className="hidden shrink-0 items-center gap-1 text-[0.8125rem] font-medium text-primary sm:flex">
                    Estudiar esto
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </span>
                  <ArrowRight className="size-4 shrink-0 text-muted-foreground sm:hidden" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ol>
        </>
      )}
    </section>
  );
}
