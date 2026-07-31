'use client';

// src/components/informe/grafica-dominio.tsx — Client Component (§10.3).
//
// El SVG de recharts, y **nada más**. Aislado a propósito: es lo único que se
// carga de forma diferida en el informe.
//
// ══ POR QUÉ HORIZONTALES ══
// A 375 px, cuatro barras verticales dejan ~80 px por columna: no cabe
// «Ciencias Aplicadas» debajo sin girar el texto, y una etiqueta a 45° es
// ilegible en un celular sostenido con una mano. En horizontal el nombre va
// donde se lee y la barra crece a la derecha.
//
// ══ `aria-hidden`, Y NO ES UN DESCUIDO ══
// Un SVG de recharts es un árbol de `<path>` sin semántica: leído por un lector
// de pantalla es ruido, y ningún `aria-label` sobre el contenedor convierte
// cuatro barras en cuatro datos. La `TablaDominio` que va debajo lleva los
// mismos números, es visible para todo el mundo y **es la fuente**.

import { Bar, BarChart, Cell, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import type { BloqueId } from '@/lib/tipos';
import type { DominioBloque } from './tabla-dominio';

/** Los tokens de gráfica de `globals.css`, en el orden de los bloques. */
const COLOR_BLOQUE: Record<BloqueId, string> = {
  A: 'var(--color-chart-1)',
  B: 'var(--color-chart-2)',
  C: 'var(--color-chart-3)',
  D: 'var(--color-chart-4)',
};

export function GraficaDominio({ datos }: { datos: readonly DominioBloque[] }) {
  return (
    // Altura fija por barra y sin animación de entrada: una gráfica que se
    // dibuja sola cuesta atención y no añade información (DISENO.md §5.2).
    <div aria-hidden="true" style={{ height: datos.length * 44 + 24 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={datos.map((d) => ({ ...d, nombre: `${d.bloque}` }))}
          layout="vertical"
          margin={{ top: 4, right: 44, bottom: 4, left: 4 }}
          barCategoryGap={10}
        >
          <XAxis type="number" domain={[0, 100]} hide />
          <YAxis
            type="category"
            dataKey="nombre"
            width={24}
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
          />
          {/* Sin `radius`: DISENO.md §4.5 prohíbe las barras redondeadas, y el
              `radius={2}` que llevaba era una contradicción con el sistema de
              diseño que señaló el `accessibility-auditor` de pasada. La banda
              del instrumento de este proyecto es recta en todas partes —la de
              avance del simulacro, la del repaso— y esta no es la excepción.
              `isAnimationActive={false}` por §5.2: una gráfica que se dibuja
              sola cuesta atención y no añade información. */}
          <Bar dataKey="porcentaje" isAnimationActive={false} label={EtiquetaValor}>
            {datos.map((d) => (
              <Cell key={d.bloque} fill={COLOR_BLOQUE[d.bloque]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * El valor al final de la barra. Sin él hay que estimar contra un eje que no
 * está — y el eje no está porque a 375 px roba ancho a las barras.
 *
 * Devuelve `<g />` y no `null` cuando faltan coordenadas: el tipo de `label` de
 * recharts exige un `ReactElement`, no admite `null`. Un grupo vacío no pinta
 * nada y satisface la firma sin un cast.
 */
function EtiquetaValor(props: {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  value?: number;
}) {
  const { x, y, width, height, value } = props;
  if (x === undefined || y === undefined || width === undefined || height === undefined) {
    return <g />;
  }
  return (
    <text
      x={x + width + 6}
      y={y + height / 2}
      dominantBaseline="central"
      className="fill-foreground font-mono text-xs"
    >
      {value}%
    </text>
  );
}
