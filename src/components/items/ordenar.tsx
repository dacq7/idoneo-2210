'use client';

// src/components/items/ordenar.tsx — Client Component (§10.3).
//
// ══ ALTERNATIVA AL ARRASTRAR ══
// Aquí NO hay arrastrar y soltar, ni como vía principal ni como añadido. Cada
// elemento lleva sus botones ↑ y ↓ de 44 px. Es el mecanismo completo, no una
// concesión de accesibilidad pegada al lado del bueno:
//   · con el pulgar, arrastrar en una lista dentro de una página que también se
//     desplaza es la interacción que más se falla en un teléfono;
//   · con teclado y con lector de pantalla, ↑/↓ funcionan igual de bien que con
//     el dedo, sin modo especial y sin instrucciones aparte;
//   · el orden se puede recorrer y corregir sin ver la pantalla.
//
// ══ EL VALOR ══
// `valor[k]` = índice, EN EL ARRAY YA BARAJADO que llega por props, del elemento
// que el usuario puso en el lugar k. Es exactamente lo que `calificar()` compara
// contra `item.ordenCorrecto`, que `presentarItem()` remapeó al mismo espacio.
//
// ══ POR QUÉ SE REGISTRA EL ORDEN INICIAL ══
// Un `ordenar` sin tocar tiene igualmente un orden en pantalla, y ese orden es
// una respuesta: si el barajado dejó los elementos ya bien puestos, el usuario
// que no toca nada está en lo cierto. Por eso se registra en un efecto al
// montar. La alternativa —tratar «no lo toqué» como sin responder— castiga por
// suerte y, peor, muestra en pantalla un orden distinto del que se califica.

import { useEffect, useRef } from 'react';
import { ArrowDown, ArrowUp, Check, X } from 'lucide-react';
import type { ItemOrdenar } from '@/lib/tipos';
import { cn } from '@/lib/utils';
import { editable, enRevision, type PropsItem } from './contrato';

type Direccion = 'arriba' | 'abajo';

export function Ordenar({ item, valor, modo, onCambio, numero, total }: PropsItem<number[], ItemOrdenar>) {
  const revision = enRevision(modo);
  const puedeMover = editable(modo);

  const identidad = item.elementos.map((_, i) => i);
  const orden = valor ?? identidad;

  // Registro del orden inicial: en un efecto, nunca en el cuerpo del render.
  useEffect(() => {
    // `puedeMover` en la guarda, no solo `valor`: en `bloqueado` la respuesta ya
    // está fijada y escribirla otra vez la sobreescribiría con el orden inicial.
    // Hoy nadie produce ese modo —nace con el simulacro del Paso 11—, y por eso
    // se cierra ahora: cuando el productor exista, el fallo sería una respuesta
    // machacada en silencio.
    if (puedeMover && (valor === null || valor === undefined)) onCambio(identidad);
    // Solo al montar y solo si nadie ha respondido todavía: el envoltorio
    // remonta el componente por ítem, así que «montar» y «entrar al ítem» son
    // el mismo momento.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Foco tras un movimiento: el botón desaparece bajo el dedo si no se repone. */
  const focoPendiente = useRef<{ elemento: number; direccion: Direccion } | null>(null);
  const botones = useRef(new Map<string, HTMLButtonElement | null>());

  useEffect(() => {
    const objetivo = focoPendiente.current;
    if (objetivo === null) return;
    focoPendiente.current = null;

    const posicion = orden.indexOf(objetivo.elemento);
    // Si el elemento quedó en un extremo, su botón de esa dirección ya no
    // existe: el foco pasa al de la dirección contraria, que sí está.
    const direccion: Direccion =
      objetivo.direccion === 'arriba' && posicion === 0
        ? 'abajo'
        : objetivo.direccion === 'abajo' && posicion === orden.length - 1
          ? 'arriba'
          : objetivo.direccion;

    botones.current.get(`${objetivo.elemento}-${direccion}`)?.focus();
  });

  function mover(posicion: number, direccion: Direccion) {
    if (!puedeMover) return;
    const destino = direccion === 'arriba' ? posicion - 1 : posicion + 1;
    if (destino < 0 || destino >= orden.length) return;

    const siguiente = [...orden];
    const movido = siguiente[posicion];
    siguiente[posicion] = siguiente[destino];
    siguiente[destino] = movido;

    focoPendiente.current = { elemento: movido, direccion };
    onCambio(siguiente);
  }

  const ordenCorrecto = item.ordenCorrecto;

  return (
    <div className="space-y-3">
      {puedeMover ? (
        <p className="text-[0.8125rem] text-muted-foreground">
          Usa las flechas para dejarlos en orden. El de arriba es el primero.
        </p>
      ) : null}

      <ol
        aria-label={`Elementos por ordenar. Ítem ${numero} de ${total}`}
        className="space-y-2"
      >
        {orden.map((elemento, posicion) => {
          const acertada = revision && ordenCorrecto[posicion] === elemento;
          const fallada = revision && !acertada;
          const posicionCorrecta = ordenCorrecto.indexOf(elemento) + 1;

          return (
            <li
              key={elemento}
              className={cn(
                'flex min-h-[52px] items-center gap-2 rounded-md border bg-card p-2',
                'transition-colors duration-150 ease-out',
                acertada && 'border-exito bg-exito/12',
                fallada && 'border-destructive bg-destructive/12',
                !revision && 'border-border',
              )}
            >
              <span
                className={cn(
                  'grid size-7 shrink-0 place-items-center rounded-md font-mono text-xs font-semibold',
                  acertada && 'bg-exito text-exito-foreground',
                  fallada && 'bg-destructive text-destructive-foreground',
                  !revision && 'bg-secondary text-secondary-foreground',
                )}
                aria-hidden="true"
              >
                {acertada ? <Check className="size-4" /> : fallada ? <X className="size-4" /> : posicion + 1}
              </span>

              <span className="min-w-0 flex-1 text-[0.95rem] leading-[1.4]">
                <span className="sr-only">Posición {posicion + 1} de {orden.length}: </span>
                {item.elementos[elemento]}
                {/* Portador no cromático de la fila ACERTADA (§1.2). El chip de
                    arriba lleva el ✓ pero es `aria-hidden`, así que sin esto la
                    fila correcta no decía nada y solo se distinguía por el verde:
                    quien no ve el color tenía que deducir «acerté» de que NO
                    apareciera «Su lugar era el N». Deducir por ausencia no es
                    informar. La fallada ya lo dice con su propia nota (A-25). */}
                {acertada ? <span className="sr-only">. Bien puesta.</span> : null}
                {fallada ? (
                  <span className="mt-1 block text-[0.8125rem] text-muted-foreground">
                    Su lugar era el {posicionCorrecta}.
                  </span>
                ) : null}
              </span>

              {puedeMover ? (
                // Los dos botones van EN LÍNEA, no apilados: apilados forzarían
                // 88 px de alto por fila (44 + 44) y una lista de 5 elementos
                // pasaría de una pantalla de teléfono sin que el texto lo pida.
                <span className="flex shrink-0 gap-1">
                  {posicion > 0 ? (
                    <BotonMover
                      ref={(nodo) => {
                        botones.current.set(`${elemento}-arriba`, nodo);
                      }}
                      direccion="arriba"
                      etiqueta={`Subir: ${item.elementos[elemento]}`}
                      onClick={() => mover(posicion, 'arriba')}
                    />
                  ) : null}
                  {posicion < orden.length - 1 ? (
                    <BotonMover
                      ref={(nodo) => {
                        botones.current.set(`${elemento}-abajo`, nodo);
                      }}
                      direccion="abajo"
                      etiqueta={`Bajar: ${item.elementos[elemento]}`}
                      onClick={() => mover(posicion, 'abajo')}
                    />
                  ) : null}
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function BotonMover({
  ref,
  direccion,
  etiqueta,
  onClick,
}: {
  ref: React.Ref<HTMLButtonElement>;
  direccion: Direccion;
  etiqueta: string;
  onClick: () => void;
}) {
  const Icono = direccion === 'arriba' ? ArrowUp : ArrowDown;
  return (
    <button
      ref={ref}
      type="button"
      // 44 × 44 exactos, sin `data-compacto`: D-8 solo autoriza esa válvula en
      // la cuadrícula del simulacro y en los TabsTrigger de /herramientas. Aquí
      // el objetivo táctil se paga con ancho de fila, que es lo que sobra.
      onClick={onClick}
      aria-label={etiqueta}
      className="grid min-h-11 w-11 place-items-center rounded-md border border-input bg-background text-muted-foreground transition-colors duration-150 ease-out hover:bg-accent hover:text-accent-foreground"
    >
      <Icono className="size-4" aria-hidden="true" />
    </button>
  );
}
