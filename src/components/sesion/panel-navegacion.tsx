'use client';

// src/components/sesion/panel-navegacion.tsx — Client Component (§10.3).
//
// La cuadrícula de ítems del simulacro, con los tres estados de §11:
// sin responder · respondida · marcada para revisar.
//
// ══════════════════════════════════════════════════════════════════════════
// AQUÍ ES DONDE SE USA LA VÁLVULA `data-compacto` (DISENO.md D-8)
// ══════════════════════════════════════════════════════════════════════════
//
// D-8 se decidió en el Paso 5 **para esta pantalla concreta**, y conviene
// justificar el gasto porque el piso táctil de 44 px no se relaja en ningún
// otro sitio de la app.
//
// Con 100 ítems, una cuadrícula de celdas de 44 px mide 100 × (44 + 8) px de
// alto repartidos en filas de 6 columnas a 375 px: ~17 filas, casi 900 px, dos
// pantallas y media de celular solo para el índice. El usuario tendría que
// desplazarse por el panel para encontrar el ítem 73, que es exactamente lo que
// el panel existe para evitar.
//
// La celda mide **36 px medidos** con `gap-2` (8 px) en los dos ejes, así que el
// objetivo efectivo —celda más la mitad del hueco a cada lado— queda en **44 px**,
// que es el criterio con el que D-8 se aprobó: *«el objetivo táctil se garantiza
// con `gap` suficiente entre celdas»*.
//
// Sobre WCAG 2.5.8 (AA) conviene ser precisos, porque el comentario anterior
// invocaba una excepción que **no hace falta**: el umbral de 2.5.8 son 24×24 px
// y **36×36 los pasa directamente**. La separación por `gap` es lo que sostiene
// la desviación respecto al piso de 44 px del PROYECTO (DISENO.md §3), que es
// más exigente que la norma. No se está gastando ninguna excepción.
//
// La navegación NO depende de este panel: los botones «Anterior» y «Siguiente»
// del controlador miden 44 px y llevan a cualquier ítem recorriendo la tanda.
// El panel es un atajo, no la única vía — que es la otra condición de D-8.
//
// ══ POR QUÉ NO ES `<nav>` ══
// Es una lista de controles que saltan dentro de la misma vista, no navegación
// entre páginas. Se marca como `role="group"` con nombre accesible, y el estado
// de cada celda viaja en su `aria-label`, no solo en el color (DISENO.md §1.2:
// el color nunca es el único portador). El ítem en pantalla lleva
// `aria-current="true"`.

import type { EstadoItemNav } from '@/lib/cronometro';
import { cn } from '@/lib/utils';

export interface CeldaNavegacion {
  itemId: string;
  estado: EstadoItemNav;
}

interface Props {
  celdas: readonly CeldaNavegacion[];
  indiceActual: number;
  onIr: (indice: number) => void;
}

const DESCRIPCION: Record<EstadoItemNav, string> = {
  'sin-responder': 'sin responder',
  respondida: 'respondida',
  marcada: 'marcada para revisar',
};

export function PanelNavegacion({ celdas, indiceActual, onIr }: Props) {
  const respondidas = celdas.filter((c) => c.estado === 'respondida').length;
  const marcadas = celdas.filter((c) => c.estado === 'marcada').length;
  const sinResponder = celdas.length - respondidas - marcadas;

  return (
    <section aria-labelledby="titulo-panel" className="space-y-3">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h2 id="titulo-panel" className="text-[0.8125rem] font-semibold">
          Tus respuestas
        </h2>
        {/* El recuento en texto es lo que hace que el panel sirva sin ver los
            colores. `role="status"` no: cambia con cada respuesta y no es una
            novedad que merezca anuncio — el usuario acaba de provocarla. */}
        <p className="text-[0.8125rem] text-muted-foreground">
          {respondidas} respondidas · {marcadas} marcadas · {sinResponder} sin responder
        </p>
      </div>

      <div
        role="group"
        aria-label="Ir a un ítem"
        className="flex flex-wrap gap-2"
      >
        {celdas.map((celda, i) => {
          const actual = i === indiceActual;
          return (
            <button
              key={celda.itemId}
              type="button"
              // Válvula D-8: releva a esta celda del piso de 44 px. El objetivo
              // efectivo son 36 px + 8 px de `gap` = 44 px. Ver la cabecera.
              data-compacto=""
              aria-current={actual ? 'true' : undefined}
              aria-label={`Ítem ${i + 1}, ${DESCRIPCION[celda.estado]}`}
              onClick={() => onIr(i)}
              className={cn(
                'relative grid size-9 shrink-0 place-items-center rounded-md border font-mono text-xs tabular-nums',
                'transition-colors duration-150 ease-out',
                // Los tres estados se distinguen por RELLENO además de por
                // matiz: vacío · relleno · relleno con punto. Con eso siguen
                // siendo tres estados distintos en escala de grises y para
                // cualquier daltonismo (DISENO.md §1.2).
                celda.estado === 'sin-responder' &&
                  'border-input bg-background text-muted-foreground',
                celda.estado === 'respondida' && 'border-primary bg-primary/15 text-foreground',
                celda.estado === 'marcada' && 'border-aviso bg-aviso/20 text-foreground',
                actual && 'ring-2 ring-ring ring-offset-2 ring-offset-background',
              )}
            >
              <span aria-hidden="true">{i + 1}</span>
              {/* [A-34] «respondida» y «marcada» miden 1,04:1 ENTRE SÍ en tema
                  claro: en escala de grises son el mismo relleno, y lo único
                  que las separaba era este punto. Con 4 px era una promesa más
                  grande que la marca. Ahora es una barra de 10×3 px a lo ancho
                  de la celda, que se distingue de un vistazo y a un brazo de
                  distancia. El `aria-label` sigue diciéndolo en palabras. */}
              {celda.estado === 'marcada' ? (
                <span
                  aria-hidden="true"
                  className="absolute bottom-[3px] left-1/2 h-[3px] w-2.5 -translate-x-1/2 rounded-full bg-aviso"
                />
              ) : null}
            </button>
          );
        })}
      </div>
    </section>
  );
}
