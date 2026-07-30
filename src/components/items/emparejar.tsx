'use client';

// src/components/items/emparejar.tsx — Client Component (§10.3).
//
// ══ ALTERNATIVA AL ARRASTRAR ══
// Aquí NO hay arrastrar y soltar. Emparejar es TOCAR A LA IZQUIERDA y luego
// TOCAR A LA DERECHA, que es lo que manda §13 y lo que funciona con el pulgar:
// arrastrar de una columna a otra dentro de una página que se desplaza es la
// interacción que más se falla en un teléfono, y con teclado o lector de
// pantalla sencillamente no existe. Dos toques son también dos tabulaciones y
// dos Enter: la misma vía sirve a todo el mundo, sin modo alternativo.
//
// ══ EL PORTADOR NO CROMÁTICO ══
// Cada pareja formada recibe un NÚMERO, y ese número aparece en los dos lados.
// El color acompaña; el número es el que dice qué está unido con qué
// (DISENO.md §1.2).
//
// ══ DOS PRESENTACIONES ══
//   · respondiendo / bloqueado → las dos listas, para formar parejas.
//   · revisión                 → una lista de «izquierda → lo que elegiste», con
//                                la correcta debajo cuando falló. Colorear las
//                                dos columnas en revisión obliga al usuario a
//                                reconstruir de memoria qué unió con qué; la
//                                lista se lo dice.

import { useState } from 'react';
import { Check, X } from 'lucide-react';
import type { ItemEmparejar } from '@/lib/tipos';
import { cn } from '@/lib/utils';
import { editable, enRevision, type PropsItem } from './contrato';

type Pares = [number, number][];

// `key` por ÍNDICE y no por texto, que es lo contrario de la regla habitual: el
// índice vale como identidad cuando la lista ni se reordena ni se filtra —estas
// no se mueven en toda la vida del componente— y el texto NO es identidad porque
// `esqItemEmparejar` no exige que `izquierda` ni `derecha` sean únicas. Dos filas
// con el mismo texto colapsarían en una sola instancia.
export function Emparejar({ item, valor, modo, onCambio, numero, total }: PropsItem<Pares, ItemEmparejar>) {
  const pares: Pares = valor ?? [];
  const puedeEmparejar = editable(modo);

  // Selección de la izquierda. `null` = «la que toque por orden»: siempre hay
  // una izquierda vigente, así que un toque en la derecha nunca cae en el vacío.
  const [seleccionManual, setSeleccionManual] = useState<number | null>(null);

  const parejaDe = (izq: number) => pares.find(([i]) => i === izq)?.[1] ?? null;
  const duenoDe = (der: number) => pares.find(([, d]) => d === der)?.[0] ?? null;
  const numeroDePareja = (izq: number) => {
    const posicion = pares.findIndex(([i]) => i === izq);
    return posicion === -1 ? null : posicion + 1;
  };

  const primeraSinPareja = item.izquierda.findIndex((_, i) => parejaDe(i) === null);
  const seleccion = seleccionManual ?? (primeraSinPareja === -1 ? null : primeraSinPareja);

  function elegirIzquierda(izq: number) {
    if (!puedeEmparejar) return;
    setSeleccionManual(izq);
  }

  function elegirDerecha(der: number) {
    if (!puedeEmparejar || seleccion === null) return;

    // Una derecha solo puede estar en una pareja: si ya estaba tomada, se la
    // quita a su dueño anterior en vez de duplicarla.
    const sinConflictos = pares.filter(([i, d]) => i !== seleccion && d !== der);
    const siguiente: Pares = [...sinConflictos, [seleccion, der]];
    // Se ordena por la izquierda para que el número de pareja sea estable: sin
    // esto, rehacer una pareja renumeraría las demás.
    siguiente.sort((a, b) => a[0] - b[0]);

    setSeleccionManual(null);
    onCambio(siguiente);
  }

  if (enRevision(modo)) {
    return <RevisionEmparejar item={item} pares={pares} numero={numero} total={total} />;
  }

  const restantes = item.izquierda.length - pares.length;

  return (
    <div className="space-y-4">
      <p className="text-[0.8125rem] text-muted-foreground" role="status">
        {seleccion === null
          ? puedeEmparejar
            ? `Ya formaste las ${item.izquierda.length} parejas. Toca un elemento de la izquierda si quieres cambiar alguna.`
            : `Formaste las ${item.izquierda.length} parejas.`
          : puedeEmparejar
            ? `Elegiste «${item.izquierda[seleccion]}». Ahora toca su pareja en la lista de abajo. ${
                restantes === 1 ? 'Queda 1 por emparejar.' : `Quedan ${restantes} por emparejar.`
              }`
            : 'Estas son las parejas que formaste.'}
      </p>

      <div className="space-y-4">
        <Columna titulo="Elemento">
          <div
            role="group"
            aria-label={`Elementos por emparejar. Ítem ${numero} de ${total}`}
            className="space-y-2"
          >
            {item.izquierda.map((texto, i) => {
              const suPareja = parejaDe(i);
              return (
                <FilaEmparejar
                  key={i}
                  texto={texto}
                  numeroPareja={numeroDePareja(i)}
                  seleccionada={seleccion === i}
                  inerte={!puedeEmparejar}
                  onElegir={() => elegirIzquierda(i)}
                  sufijoAccesible={
                    suPareja === null
                      ? '. Sin pareja.'
                      : `. Emparejado con: ${item.derecha[suPareja]}.`
                  }
                />
              );
            })}
          </div>
        </Columna>

        <Columna titulo="Su pareja">
          <div role="group" aria-label="Posibles parejas" className="space-y-2">
            {item.derecha.map((texto, d) => {
              const dueno = duenoDe(d);
              return (
                <FilaEmparejar
                  key={d}
                  texto={texto}
                  numeroPareja={dueno === null ? null : numeroDePareja(dueno)}
                  seleccionada={false}
                  inerte={!puedeEmparejar}
                  onElegir={() => elegirDerecha(d)}
                  sufijoAccesible={
                    dueno === null
                      ? '. Libre.'
                      : `. Ya emparejado con: ${item.izquierda[dueno]}.`
                  }
                />
              );
            })}
          </div>
        </Columna>
      </div>
    </div>
  );
}

function Columna({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <p className="text-xs font-semibold uppercase leading-[1.1] tracking-[0.08em] text-muted-foreground">
        {titulo}
      </p>
      {children}
    </section>
  );
}

function FilaEmparejar({
  texto,
  numeroPareja,
  seleccionada,
  inerte,
  onElegir,
  sufijoAccesible,
}: {
  texto: string;
  numeroPareja: number | null;
  seleccionada: boolean;
  inerte: boolean;
  onElegir: () => void;
  sufijoAccesible: string;
}) {
  return (
    <button
      type="button"
      aria-disabled={inerte ? true : undefined}
      aria-pressed={seleccionada}
      onClick={() => {
        if (!inerte) onElegir();
      }}
      className={cn(
        'flex w-full min-h-[52px] items-center gap-3 rounded-md border px-3 py-2.5 text-left',
        'text-[0.95rem] leading-[1.4] transition-colors duration-150 ease-out',
        seleccionada ? 'border-primary bg-primary/10' : 'border-border bg-card',
        !inerte && !seleccionada && 'hover:bg-accent hover:text-accent-foreground',
      )}
    >
      <span
        className={cn(
          'grid size-7 shrink-0 place-items-center rounded-md font-mono text-xs font-semibold',
          numeroPareja === null
            ? 'border border-dashed border-input text-muted-foreground'
            : 'bg-secondary text-secondary-foreground',
        )}
        aria-hidden="true"
      >
        {numeroPareja ?? '·'}
      </span>
      <span className="min-w-0 flex-1">
        {texto}
        <span className="sr-only">{sufijoAccesible}</span>
      </span>
    </button>
  );
}

function RevisionEmparejar({
  item,
  pares,
  numero,
  total,
}: {
  item: ItemEmparejar;
  pares: Pares;
  numero: number;
  total: number;
}) {
  const correctaDe = new Map(item.pares);

  return (
    <ul aria-label={`Tus parejas. Ítem ${numero} de ${total}`} className="space-y-2">
      {item.izquierda.map((texto, i) => {
        const elegida = pares.find(([izq]) => izq === i)?.[1] ?? null;
        const correcta = correctaDe.get(i);
        const acerto = elegida !== null && elegida === correcta;

        return (
          <li
            key={i}
            className={cn(
              'flex gap-3 rounded-md border p-3 text-[0.95rem] leading-[1.4]',
              acerto ? 'border-exito bg-exito/12' : 'border-destructive bg-destructive/12',
            )}
          >
            <span
              className={cn(
                'grid size-7 shrink-0 place-items-center rounded-md',
                acerto ? 'bg-exito text-exito-foreground' : 'bg-destructive text-destructive-foreground',
              )}
              aria-hidden="true"
            >
              {acerto ? <Check className="size-4" /> : <X className="size-4" />}
            </span>

            <span className="min-w-0 flex-1">
              <span className="font-medium">{texto}</span>
              <span className="mt-1 block text-[0.8125rem]">
                <span className="text-muted-foreground">Emparejaste con: </span>
                {elegida === null ? 'nada' : item.derecha[elegida]}
                <span className="sr-only">{acerto ? '. Correcto.' : '. Incorrecto.'}</span>
              </span>
              {!acerto && correcta !== undefined ? (
                <span className="mt-0.5 block text-[0.8125rem]">
                  <span className="text-muted-foreground">Era: </span>
                  <span className="font-medium">{item.derecha[correcta]}</span>
                </span>
              ) : null}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
