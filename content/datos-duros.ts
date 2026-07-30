// content/datos-duros.ts
// Los valores que se preguntan con número exacto. Cada uno DEBE existir
// también como tarjeta y como al menos un ítem del banco.
//
// Vacío a propósito: el paso 6 copia las entradas de §9.4.

import type { DatoDuro } from '@/lib/tipos';

export const DATOS_DUROS: DatoDuro[] = [];

export const CATEGORIAS_DATOS_DUROS = [...new Set(DATOS_DUROS.map((d) => d.categoria))];
