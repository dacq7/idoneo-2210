// src/components/mdx/componentes.tsx — Server Components, sin directiva de cliente.
//
// El mapa que <MDXRemote> recibe. Base: §12.4 final, más el marcado de tabla que
// exige DISENO.md §3.2 (la ficha por fila en móvil).
//
// Por qué se mapea `table`: una tabla de la Cartilla 3 (5 columnas) no cabe en
// 375 px, y sin envoltorio desplaza la PÁGINA entera. Aplica a toda tabla del
// MDX, también a las que no van dentro de <TablaClave>: el autor de los pasos
// 15–17 no debería tener que acordarse de envolverlas.

import { Children, isValidElement, type ReactElement, type ReactNode } from 'react';
import type { MDXComponents } from 'mdx/types';
import { AlertaContradiccion } from './alerta-contradiccion';
import { Dato } from './dato';
import { Formula } from './formula';
import { Ojo } from './ojo';
import { TablaClave } from './tabla-clave';

/* Roles explícitos. NO son redundantes: la vista de ficha de DISENO.md §3.2
   cambia el `display` de `table`, `tbody`, `tr` y `td`, y todo navegador retira
   la semántica de tabla del árbol de accesibilidad en cuanto el display deja de
   ser `table-*`. Con los roles escritos, la semántica deja de depender de la
   presentación, y A-10 y A-12 siguen en pie en los dos viewports. */
const Thead = (props: React.ComponentProps<'thead'>) => <thead role="rowgroup" {...props} />;
const Tbody = (props: React.ComponentProps<'tbody'>) => <tbody role="rowgroup" {...props} />;
const Tr = (props: React.ComponentProps<'tr'>) => <tr role="row" {...props} />;
// A-12: remark-gfm genera <th> pelado. Sin `scope` el lector no ata cada celda a
// su columna. GFM no puede expresar encabezados de FILA, así que «95 % / 5 %»
// llega con su columna pero sin decir de qué zona es: es límite del formato, no
// del marcado, y se acepta documentado.
const Th = (props: React.ComponentProps<'th'>) => <th scope="col" role="columnheader" {...props} />;
const Td = (props: React.ComponentProps<'td'>) => <td role="cell" {...props} />;

/** Texto plano de un subárbol de React: un <th> puede traer <strong> o <code>. */
function textoPlano(nodo: ReactNode): string {
  if (typeof nodo === 'string' || typeof nodo === 'number') return String(nodo);
  if (Array.isArray(nodo)) return nodo.map(textoPlano).join('');
  if (isValidElement(nodo)) return textoPlano((nodo.props as { children?: ReactNode }).children);
  return '';
}

function primerHijo(nodo: ReactNode, tipo: unknown): ReactElement | undefined {
  return Children.toArray(nodo).find(
    (hijo): hijo is ReactElement => isValidElement(hijo) && hijo.type === tipo,
  );
}

/** Los encabezados de columna, en orden. [] si la tabla no trae <thead>: en ese
 *  caso la ficha sale sin claves, que es una degradación, no una rotura. */
function clavesDeColumna(children: ReactNode): string[] {
  const thead = primerHijo(children, Thead);
  const fila = thead && primerHijo((thead.props as { children?: ReactNode }).children, Tr);
  if (!fila) return [];
  return Children.toArray((fila.props as { children?: ReactNode }).children)
    .filter((hijo): hijo is ReactElement => isValidElement(hijo) && hijo.type === Th)
    .map((th) => textoPlano((th.props as { children?: ReactNode }).children).trim());
}

/**
 * Id estable para el nombre accesible del grupo, derivado de las claves de
 * columna. No se puede usar `useId`: esto es un Server Component y `useId` es un
 * hook. Un contador de módulo tampoco sirve — se compartiría entre peticiones.
 *
 * Dos tablas con encabezados idénticos en la misma página colisionarían; la
 * consecuencia sería que las dos comparten nombre, no una página rota, y en el
 * contenido real de las cartillas no ocurre.
 */
function idDeTabla(claves: string[]): string {
  let h = 0;
  for (const car of claves.join('|')) h = (Math.imul(h, 31) + car.charCodeAt(0)) | 0;
  return `tabla-${(h >>> 0).toString(36)}`;
}

export const componentesMdx: MDXComponents = {
  Dato,
  Formula,
  TablaClave,
  Ojo,
  AlertaContradiccion,

  // `tabIndex={0}` no es opcional: un contenedor con `overflow-x: auto` no es
  // alcanzable con el teclado en Chromium (WCAG 2.1.1).
  // A-10: `role="group"` + nombre, porque el contenedor era enfocable y anónimo.
  // Se usa `group` y NO `region`: `region` es landmark y volvería a llenar la
  // lista que A-09 despejó.
  table: ({ children, ...props }) => {
    const claves = clavesDeColumna(children);
    const idNombre = idDeTabla(claves);
    // Las claves de columna viajan como custom properties; el CSS de §3.2 las
    // pinta con `content: var(--et-N)` en la vista de ficha. Se leen una sola
    // vez, en el servidor: sin atributo por celda, sin JS de cliente, sin
    // estado. `JSON.stringify` las entrega ya entrecomilladas y escapadas, que
    // es exactamente lo que `content` pide.
    const estilo = Object.fromEntries(
      claves.map((clave, i) => [`--et-${i + 1}`, JSON.stringify(clave)]),
    ) as React.CSSProperties;

    return (
      // A-19: el nombre no puede ser un `aria-label` fijo. Bajo `sm` la tabla
      // ancha se apila en fichas (§3.2) y deja de desplazarse — lo confirma el
      // propio axe, cuya regla `scrollable-region-focusable` pasa a
      // `inapplicable` ahí—, así que «desplazable en horizontal» mentiría justo
      // en el viewport donde la app se usa de verdad.
      //
      // CSS no reescribe un `aria-label`, pero no hace falta: el algoritmo de
      // nombre accesible EXCLUYE los descendientes ocultos del elemento
      // referenciado por `aria-labelledby`. Con el sufijo en su propio <span> y
      // apagado por la misma media query que crea la ficha, el nombre queda
      // «Tabla» a 375 px y «Tabla · se desplaza en horizontal» a 1280.
      <div
        className="tabla-desliz"
        tabIndex={0}
        role="group"
        aria-labelledby={idNombre}
        style={estilo}
      >
        <p id={idNombre} className="sr-only">
          Tabla<span className="pista-desliz"> · se desplaza en horizontal</span>
        </p>
        <table role="table" {...props}>
          {children}
        </table>
      </div>
    );
  },

  thead: Thead,
  tbody: Tbody,
  tr: Tr,
  th: Th,
  td: Td,
};
