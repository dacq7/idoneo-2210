'use client';

// src/components/informe/revision-items.tsx — Client Component (§10.3).
//
// La revisión ítem por ítem: qué respondiste, cuál era la correcta, por qué, y
// la referencia a la cartilla para ir a verificarlo.
//
// ══ SE REPRODUCE LA PANTALLA QUE VIO EL USUARIO, NO UNA EQUIVALENTE ══
// Las opciones se rebarajan con `presentarTanda(items, semilla)` sobre los
// ítems en el orden de `itemIds`. Es lo que hace que «elegiste la C» siga
// siendo cierto al revisar: la respuesta guardada es un índice **del array
// barajado**, así que sin reproducir el barajado exacto señalaríamos otra
// opción. Para eso el intento guarda su semilla (§2.2).
//
// ══ POR QUÉ `<details>` Y NO UN ACORDEÓN DE LIBRERÍA ══
// Cien ítems desplegados son una página inmanejable, así que van plegados. Se
// usa `<details>`/`<summary>` nativo: es accesible por defecto —estado,
// teclado y anuncio los da el navegador—, funciona sin JavaScript y no añade
// dependencia. El `Accordion` de shadcn aportaría animación, que aquí no hace
// falta.
//
// ══ FRONTERA (ADR-010) ══
// Los ítems entran con `import()` dinámico bajo interacción, igual que en
// `/repaso` y en el simulacro. El intento guarda ids, no contenido.

import { useEffect, useState } from 'react';
import { Check, X } from 'lucide-react';
import { EnvoltorioItem } from '@/components/items/envoltorio-item';
import { Retroalimentacion } from '@/components/items/retroalimentacion';
import { presentarTanda, sinResponder } from '@/lib/simulacro';
import type { Item, RespuestaItem } from '@/lib/tipos';
import { cn } from '@/lib/utils';

interface Props {
  itemIds: readonly string[];
  respuestas: readonly RespuestaItem[];
  semilla: number;
  /** Slugs de los módulos que este intento tocó. Acota qué se carga. */
  slugs: readonly string[];
}

type Estado =
  | { fase: 'cargando' }
  | { fase: 'listo'; items: Item[] }
  | { fase: 'error' }
  /** El contenido cambió y ya no están todos: se dice, no se disimula. */
  | { fase: 'incompleto'; items: Item[]; faltan: number };

export function RevisionItems({ itemIds, respuestas, semilla, slugs }: Props) {
  const [estado, setEstado] = useState<Estado>({ fase: 'cargando' });
  const [soloFallados, setSoloFallados] = useState(true);

  useEffect(() => {
    let vivo = true;
    void (async () => {
      try {
        const indice = await import('@/content/banco/indice');
        const tandas = await Promise.all(slugs.map((s) => indice.cargarBancoModulo(s)));
        if (!vivo) return;
        const porId = new Map(tandas.flat().map((it) => [it.id, it]));
        const encontrados = itemIds.map((id) => porId.get(id)).filter((it) => it !== undefined);
        // El barajado se reproduce sobre lo que HAY, en el orden guardado.
        const items = presentarTanda(encontrados, semilla);
        setEstado(
          encontrados.length === itemIds.length
            ? { fase: 'listo', items }
            : { fase: 'incompleto', items, faltan: itemIds.length - encontrados.length },
        );
      } catch {
        if (vivo) setEstado({ fase: 'error' });
      }
    })();
    return () => {
      vivo = false;
    };
  }, [itemIds, semilla, slugs]);

  if (estado.fase === 'cargando') {
    return (
      <section aria-labelledby="titulo-revision" className="space-y-3">
        <h2 id="titulo-revision">Pregunta por pregunta</h2>
        <span className="sr-only">Cargando las preguntas de este intento</span>
        <span className="block h-24 w-full animate-pulse rounded-lg bg-accent" aria-hidden="true" />
      </section>
    );
  }

  if (estado.fase === 'error') {
    return (
      <section aria-labelledby="titulo-revision" className="space-y-3">
        <h2 id="titulo-revision">Pregunta por pregunta</h2>
        <p className="text-muted-foreground">
          No se pudieron cargar las preguntas de este intento. Tu resultado y el desglose de
          arriba están guardados y no dependen de esto: vuelve a intentarlo con conexión.
        </p>
      </section>
    );
  }

  const porId = new Map(respuestas.map((r) => [r.itemId, r]));
  const visibles = soloFallados
    ? estado.items.filter((it) => porId.get(it.id)?.correcta !== true)
    : estado.items;
  const falladas = estado.items.filter((it) => porId.get(it.id)?.correcta !== true).length;

  return (
    <section aria-labelledby="titulo-revision" className="space-y-3">
      <h2 id="titulo-revision">Pregunta por pregunta</h2>

      {estado.fase === 'incompleto' ? (
        <p className="rounded-md border-l-4 border-aviso bg-aviso/10 p-3 text-[0.8125rem] leading-[1.45]">
          {estado.faltan === 1
            ? 'Una pregunta de este intento ya no está publicada y no se puede mostrar.'
            : `${estado.faltan} preguntas de este intento ya no están publicadas y no se pueden mostrar.`}{' '}
          El resultado no cambia: se calculó cuando respondiste.
        </p>
      ) : null}

      <p className="text-muted-foreground">
        Aquí está lo que importa del informe: por qué la correcta lo era y por qué falló el
        distractor que elegiste. La referencia de cada una dice dónde verificarlo en la cartilla.
      </p>

      {falladas > 0 ? (
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setSoloFallados((v) => !v)}
            aria-pressed={soloFallados}
            className={cn(
              'inline-flex min-h-11 items-center gap-2 rounded-md border px-4 text-sm font-medium',
              'transition-colors duration-150 ease-out',
              soloFallados
                ? 'border-primary bg-primary/10 text-foreground'
                : 'border-input bg-background hover:bg-accent hover:text-foreground',
            )}
          >
            Ver solo las que fallé
          </button>
          <p className="text-[0.8125rem] text-muted-foreground">
            {soloFallados
              ? `Mostrando ${visibles.length} de ${estado.items.length}`
              : `Mostrando las ${estado.items.length}`}
          </p>
        </div>
      ) : null}

      <ol className="space-y-2">
        {visibles.map((item) => {
          const respuesta = porId.get(item.id);
          const correcta = respuesta?.correcta === true;
          const enBlanco = respuesta === undefined || sinResponder(respuesta.respuesta);
          const numero = estado.items.indexOf(item) + 1;

          return (
            <li key={item.id}>
              <details className="group rounded-lg border border-border bg-card shadow-sm">
                <summary
                  className={cn(
                    'flex min-h-11 cursor-pointer list-none items-center gap-3 p-3 sm:p-4',
                    'transition-colors duration-150 ease-out hover:bg-accent hover:text-foreground',
                  )}
                >
                  {/* El veredicto va en ICONO + TEXTO, no solo en color. */}
                  <span
                    className={cn(
                      'grid size-7 shrink-0 place-items-center rounded-md',
                      correcta ? 'bg-exito text-exito-foreground' : 'bg-destructive text-destructive-foreground',
                    )}
                  >
                    {correcta ? (
                      <Check className="size-4" aria-hidden="true" />
                    ) : (
                      <X className="size-4" aria-hidden="true" />
                    )}
                  </span>

                  <span className="min-w-0 grow">
                    <span className="block text-[0.8125rem] text-muted-foreground">
                      Ítem {numero} ·{' '}
                      {correcta ? 'la acertaste' : enBlanco ? 'la dejaste en blanco' : 'la fallaste'}
                    </span>
                    <span className="line-clamp-2 block text-[0.9375rem]">{item.enunciado}</span>
                  </span>

                  <span
                    aria-hidden="true"
                    className="shrink-0 text-[0.8125rem] text-muted-foreground group-open:hidden"
                  >
                    Ver
                  </span>
                </summary>

                <div className="space-y-4 border-t border-border p-3 sm:p-4">
                  <EnvoltorioItem
                    item={item}
                    valor={respuesta?.respuesta ?? null}
                    modo={correcta ? 'revision-correcta' : 'revision-incorrecta'}
                    onCambio={() => {
                      /* revisión: el ítem ya no admite respuesta */
                    }}
                    numero={numero}
                    total={estado.items.length}
                  />
                  <Retroalimentacion item={item} correcta={correcta} respondida={!enBlanco} />
                </div>
              </details>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
