'use client';

// src/components/ultima-noche/mazo-datos-duros.tsx — Client Component (§10.3).
//
// La lista de datos duros con sus dos filtros y el interruptor de ocultar
// valores.
//
// ══ «OCULTAR VALORES» ES LA FUNCIÓN, NO UN EXTRA ══
// Leer una lista de valores no es estudiar: reconocer el dato al verlo da una
// falsa sensación de saberlo. Con los valores ocultos, cada fila es una
// autoevaluación real, y descubrirlos uno a uno es lo que hace útil la pantalla.
//
// ══ LOS VALORES SE ENVUELVEN, NUNCA SE TRUNCAN ══
// Obligación heredada del Paso 17: DD-067 y DD-070 dejaron de ser cifras cortas
// y son frases con condiciones —tres cortes de riesgo el primero, una caída
// porcentual sobre el basal propio el segundo—. Un `truncate` los dejaría en
// «menos de 1 mg/L riesgo…», que es exactamente el dato a medias que ADR-014
// prohíbe. Por eso la fila apila concepto y valor en vertical y el valor usa
// `break-words`.

import { useMemo, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CLASES_BLOQUE, cn } from '@/lib/utils';
import type { BloqueId } from '@/lib/tipos';
import { RepasoDatos } from './repaso-datos';

/**
 * Lo MÍNIMO que la vista necesita. `modulo` y `publicado` estaban aquí y no los
 * usaba nadie: campos que cruzan la frontera servidor→cliente sin consumidor,
 * que es justo lo que ADR-026 midió que cuesta dinero por nada.
 */
export interface DatoVista {
  id: string;
  categoria: string;
  concepto: string;
  valor: string;
  bloque: BloqueId;
}

export function MazoDatosDuros({
  datos,
  categorias,
}: {
  datos: DatoVista[];
  categorias: string[];
}) {
  const [categoria, setCategoria] = useState<string>('todas');
  const [ocultos, setOcultos] = useState(false);
  const [revelados, setRevelados] = useState<Set<string>>(new Set());
  const [enRepaso, setEnRepaso] = useState(false);

  const visibles = useMemo(
    () => (categoria === 'todas' ? datos : datos.filter((d) => d.categoria === categoria)),
    [datos, categoria],
  );

  if (enRepaso) {
    return <RepasoDatos datos={visibles} onSalir={() => setEnRepaso(false)} />;
  }

  const alternarOcultos = () => {
    setOcultos((o) => !o);
    // Al volver a ocultar se olvida lo revelado: si no, reactivar el modo deja
    // media lista destapada y el repaso deja de ser un repaso.
    setRevelados(new Set());
  };

  const revelar = (id: string) => {
    setRevelados((prev) => {
      const siguiente = new Set(prev);
      siguiente.add(id);
      return siguiente;
    });
  };

  return (
    <div className="space-y-4">
      <div
        role="group"
        aria-label="Filtrar por categoría"
        className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0"
      >
        <Pildora activa={categoria === 'todas'} onClick={() => setCategoria('todas')}>
          Todas
        </Pildora>
        {categorias.map((c) => (
          <Pildora key={c} activa={categoria === c} onClick={() => setCategoria(c)}>
            {c}
          </Pildora>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" variant="outline" size="sm" onClick={alternarOcultos}>
          {ocultos ? (
            <Eye className="size-4" aria-hidden="true" />
          ) : (
            <EyeOff className="size-4" aria-hidden="true" />
          )}
          {ocultos ? 'Mostrar los valores' : 'Ocultar los valores'}
        </Button>
        <Button type="button" size="sm" onClick={() => setEnRepaso(true)}>
          Repasar uno a uno
        </Button>
        <span className="ml-auto text-[0.8125rem] text-muted-foreground">
          {visibles.length} {visibles.length === 1 ? 'dato' : 'datos'}
        </span>
      </div>

      <ul className="space-y-2">
        {visibles.map((d) => (
          <li key={d.id} className="rounded-lg border border-border bg-card p-3">
            <p className="flex flex-wrap items-baseline gap-x-2">
              <span className="font-medium">{d.concepto}</span>
              <span
                className={cn(
                  'text-[0.6875rem] font-semibold uppercase tracking-[0.08em]',
                  CLASES_BLOQUE[d.bloque].texto,
                )}
              >
                Bloque {d.bloque}
              </span>
            </p>
            {ocultos && !revelados.has(d.id) ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="mt-1 h-11 px-0 font-mono text-[0.875rem] text-muted-foreground hover:bg-transparent"
                onClick={() => revelar(d.id)}
              >
                Tocar para ver el valor
              </Button>
            ) : (
              // `break-words` y no `truncate`: los valores largos se envuelven.
              <p className="mt-1 break-words font-mono text-[0.875rem] leading-[1.5]">{d.valor}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Pildora({
  activa,
  onClick,
  children,
}: {
  activa: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={activa}
      className={cn(
        'shrink-0 rounded-full border px-3 py-1.5 text-[0.8125rem] font-medium transition-colors',
        activa
          ? 'border-primary bg-primary text-primary-foreground'
          // [A-52] `--input` y no `--border`: el borde que identifica un control
          // mide 3,03/3,30 con el primero y 1,44 con el segundo.
          : 'border-input text-muted-foreground hover:bg-accent hover:text-foreground',
      )}
    >
      {children}
    </button>
  );
}
