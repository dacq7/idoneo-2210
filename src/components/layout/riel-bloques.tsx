'use client';

// src/components/layout/riel-bloques.tsx
// Primera manifestación del elemento firma — el instrumento de umbral
// (DISENO.md §4.3). Cliente porque deriva el bloque activo de la ruta.
// Alta a la lista cerrada de §10.3 aprobada en ADR-009.
//
// Las siete reglas de §4.2 que aplican aquí:
//   · la banda es relleno puro: JAMÁS tipografía encima
//   · esquinas rectas (rounded-none): es un aparato de medida
//   · accesible sin el dibujo: role="img" + aria-label en palabras
//   · un solo movimiento o ninguno: aquí ninguno
//
// El ancho de cada segmento es proporcional a `pesoExamen`, no uniforme. Eso es
// lo que lo separa de una barra de colores decorativa: su forma dice cuánto
// pesa cada bloque en el examen (A 20 · B 22 · C 33 · D 25), que es el dato más
// accionable para quien decide qué estudiar hoy.

import { usePathname } from 'next/navigation';
import { bloqueDeRuta, CLASES_BLOQUE, cn } from '@/lib/utils';
import type { BloqueId } from '@/lib/tipos';

/**
 * Subconjunto serializable de `Bloque` — lo único que el riel necesita.
 *
 * No se importa `BLOQUES` de `@/content/estructura` aquí, y no es un detalle:
 * este componente es cliente, y ese módulo evalúa
 * `MODULOS_POR_SLUG = new Map(MODULOS.map(...))` en el ámbito del módulo, lo que
 * ancla `MODULOS` y arrastra los 29 módulos completos al bundle del navegador
 * —con objetivos, conceptosClave y subtítulos— aunque solo se importe `BLOQUES`.
 * Medido: 5,8 kB gz. Ver ADR-010. Los datos entran por prop desde `Encabezado`,
 * que es Server Component.
 */
export interface SegmentoRiel {
  id: BloqueId;
  /** Fracción del examen: gobierna el ancho del segmento. */
  peso: number;
  titulo: string;
}

export function RielBloques({ segmentos }: { segmentos: readonly SegmentoRiel[] }) {
  const pathname = usePathname();
  const activo = bloqueDeRuta(pathname);

  const pesos = segmentos.map((b) => `${b.id} ${Math.round(b.peso * 100)} %`).join(', ');
  const bloqueActivo = activo ? segmentos.find((b) => b.id === activo) : undefined;
  const etiqueta = bloqueActivo
    ? `Peso de cada bloque en el examen: ${pesos}. Estás en el bloque ${bloqueActivo.id}, ${bloqueActivo.titulo}.`
    : `Peso de cada bloque en el examen: ${pesos}. No estás dentro de un bloque.`;

  return (
    <div
      role="img"
      aria-label={etiqueta}
      className="flex h-1 w-full border-b border-border"
    >
      {segmentos.map((bloque) => (
        <div
          key={bloque.id}
          // flexGrow proporcional en vez de un ancho en porcentaje: los cuatro
          // segmentos suman exactamente el ancho disponible sin depender del
          // redondeo de 0.33 × 100.
          style={{ flexGrow: bloque.peso, flexBasis: 0 }}
          className={cn(
            'min-w-0 rounded-none border-r border-background last:border-r-0',
            CLASES_BLOQUE[bloque.id].fondo,
            activo === bloque.id ? 'opacity-100' : 'opacity-25',
          )}
        />
      ))}
    </div>
  );
}
