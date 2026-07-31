'use client';

// src/components/glosario/buscador-glosario.tsx — Client Component (§10.3).
//
// ══ CÓMO BUSCA, Y POR QUÉ ASÍ ══
// `normalizar` quita tildes y baja a minúsculas antes de comparar, así que
// «aerobico» encuentra «Umbral aeróbico» y «VO2» encuentra «VO₂máx». Es lo
// mínimo para que la búsqueda sirva en español desde un teclado de móvil, donde
// nadie escribe tildes.
//
// Busca en término, sinónimos y definición, en ese orden de prioridad: quien
// escribe «MLSS» quiere la entrada MLSS, no las cuatro que la mencionan. Sin la
// prioridad, el término exacto aparecía en cuarto lugar.
//
// ══ SIN DEBOUNCE, A PROPÓSITO ══
// Filtrar 123 entradas es trabajo de microsegundos. Un debounce añadiría
// latencia percibida y un temporizador que limpiar, para ahorrar un cómputo que
// no se nota. Se mide antes de optimizar, y aquí no hay nada que medir.
//
// ══ EL FILTRO POR BLOQUE NO ES UN SELECT ══
// Son cinco botones-píldora en una fila: a 375 px un `<select>` obliga a abrir
// un menú nativo para elegir entre cinco cosas, y el estado elegido deja de
// verse. Con píldoras, el filtro activo está siempre a la vista.

import { useDeferredValue, useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CLASES_BLOQUE, cn, normalizar } from '@/lib/utils';
import type { BloqueId } from '@/lib/tipos';

export interface EntradaBuscable {
  termino: string;
  definicion: string;
  sinonimos: string[];
  modulo: string;
  tituloModulo: string;
  bloque: BloqueId;
  publicado: boolean;
}

const BLOQUES_FILTRO: { id: BloqueId | 'todos'; etiqueta: string }[] = [
  { id: 'todos', etiqueta: 'Todos' },
  { id: 'A', etiqueta: 'Bloque A' },
  { id: 'B', etiqueta: 'Bloque B' },
  { id: 'C', etiqueta: 'Bloque C' },
  { id: 'D', etiqueta: 'Bloque D' },
];

/**
 * `normalizar` quita tildes y baja a minúsculas, pero no toca los subíndices.
 * Y el glosario está lleno de ellos: «VO₂máx», «CO₂». Nadie escribe «VO₂» en un
 * teclado de móvil —escribe «VO2»—, así que sin este mapeo la entrada más
 * buscada del bloque C es inencontrable.
 */
const SUBINDICES = '₀₁₂₃₄₅₆₇₈₉';

function normalizarBusqueda(texto: string): string {
  return normalizar(texto).replace(/[₀-₉]/g, (d) => String(SUBINDICES.indexOf(d)));
}

/** 0 = no coincide · 1 = coincide en la definición · 2 = en sinónimo · 3 = en el término. */
function relevancia(entrada: EntradaBuscable, consulta: string): number {
  if (normalizarBusqueda(entrada.termino).includes(consulta)) return 3;
  if (entrada.sinonimos.some((s) => normalizarBusqueda(s).includes(consulta))) return 2;
  if (normalizarBusqueda(entrada.definicion).includes(consulta)) return 1;
  return 0;
}

export function BuscadorGlosario({ entradas }: { entradas: EntradaBuscable[] }) {
  const [consulta, setConsulta] = useState('');
  const [bloque, setBloque] = useState<BloqueId | 'todos'>('todos');
  // El input responde a cada tecla; la lista puede ir un frame por detrás sin
  // que se note. Es gratis y evita cualquier tirón en un móvil lento.
  const consultaDiferida = useDeferredValue(consulta);

  const resultados = useMemo(() => {
    const porBloque = bloque === 'todos' ? entradas : entradas.filter((e) => e.bloque === bloque);
    const q = normalizarBusqueda(consultaDiferida);
    if (q === '') return porBloque;
    return porBloque
      .map((e) => ({ e, r: relevancia(e, q) }))
      .filter(({ r }) => r > 0)
      .sort((a, b) => b.r - a.r || a.e.termino.localeCompare(b.e.termino, 'es'))
      .map(({ e }) => e);
  }, [entradas, consultaDiferida, bloque]);

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="relative">
          <Label htmlFor="buscar-glosario" className="sr-only">
            Buscar en el glosario
          </Label>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="buscar-glosario"
            type="search"
            value={consulta}
            onChange={(e) => setConsulta(e.target.value)}
            placeholder="Umbral, densidad, osteoblasto…"
            // Sin autocorrección: los términos técnicos los "corrige" mal.
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            className="h-11 pl-9 pr-10"
          />
          {consulta !== '' ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              // La X se solapa con el botón de limpiar nativo de `type="search"`
              // en algunos navegadores. Se conserva la propia porque en iOS ese
              // botón nativo no existe.
              className="absolute right-1 top-1/2 size-9 -translate-y-1/2"
              onClick={() => setConsulta('')}
              aria-label="Borrar la búsqueda"
            >
              <X className="size-4" aria-hidden="true" />
            </Button>
          ) : null}
        </div>

        <div
          role="group"
          aria-label="Filtrar por bloque"
          className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0"
        >
          {BLOQUES_FILTRO.map(({ id, etiqueta }) => (
            <button
              key={id}
              type="button"
              onClick={() => setBloque(id)}
              aria-pressed={bloque === id}
              className={cn(
                'shrink-0 rounded-full border px-3 py-1.5 text-[0.8125rem] font-medium transition-colors',
                bloque === id
                  ? 'border-primary bg-primary text-primary-foreground'
                  // [A-52] `--input` y no `--border`: la regla del proyecto dice
                  // que el borde que identifica un control usa el primero
                  // (3,03/3,30) y no el segundo (1,44), que es decoración.
                  : 'border-input text-muted-foreground hover:bg-accent hover:text-foreground',
              )}
            >
              {etiqueta}
            </button>
          ))}
        </div>
      </div>

      {/* El recuento se anuncia al escribir. `polite` y no `assertive`: no debe
          interrumpir a quien está tecleando. */}
      <p aria-live="polite" className="text-[0.8125rem] text-muted-foreground">
        {resultados.length === entradas.length
          ? `${entradas.length} términos`
          : `${resultados.length} de ${entradas.length} términos`}
      </p>

      {resultados.length === 0 ? (
        <SinResultados consulta={consulta} />
      ) : (
        <dl className="space-y-3">
          {resultados.map((e) => (
            <FichaTermino key={e.termino} entrada={e} />
          ))}
        </dl>
      )}
    </div>
  );
}

function FichaTermino({ entrada }: { entrada: EntradaBuscable }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <dt className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="font-titulo text-lg font-semibold">{entrada.termino}</span>
        {/* El bloque va en TEXTO además de en color: DISENO.md §1.2 prohíbe que
            el color sea el único portador. No se reutiliza `RotuloBloque`
            porque ese es el antetítulo de un <h1> y aquí hace de insignia. */}
        <span
          className={cn(
            'text-[0.6875rem] font-semibold uppercase leading-[1.1] tracking-[0.08em]',
            CLASES_BLOQUE[entrada.bloque].texto,
          )}
        >
          Bloque {entrada.bloque}
        </span>
      </dt>
      <dd className="mt-2 space-y-2">
        <p className="text-[0.9375rem] leading-relaxed">{entrada.definicion}</p>
        {entrada.sinonimos.length > 0 ? (
          <p className="text-[0.8125rem] text-muted-foreground">
            También: {entrada.sinonimos.join(' · ')}
          </p>
        ) : null}
        {/* El enlace lleva al módulo que lo explica. Si no está publicado no se
            enlaza: mandar a una pantalla vacía es peor que no ofrecer nada. */}
        {entrada.publicado ? (
          <Link
            href={`/modulos/${entrada.modulo}`}
            className="inline-flex min-h-11 items-center text-[0.8125rem] font-medium text-primary underline underline-offset-2"
          >
            Ver módulo: {entrada.tituloModulo}
          </Link>
        ) : (
          <p className="text-[0.8125rem] text-muted-foreground">
            Se explica en {entrada.tituloModulo}, todavía sin publicar.
          </p>
        )}
      </dd>
    </div>
  );
}

function SinResultados({ consulta }: { consulta: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border p-6 text-center">
      <p className="font-medium">No hay ningún término que coincida</p>
      <p className="mt-1 text-[0.8125rem] leading-[1.45] text-muted-foreground">
        {consulta.trim() === ''
          ? 'Prueba con otro bloque.'
          : `Nada para «${consulta.trim()}». La búsqueda ignora tildes y mayúsculas, así que prueba con menos letras o con otra palabra de la definición.`}
      </p>
    </div>
  );
}
