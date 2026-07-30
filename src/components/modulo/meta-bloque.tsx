// src/components/modulo/meta-bloque.tsx — Server Component, sin directiva de cliente.
//
// La línea de metadatos de un bloque: «33 % del examen · 9 módulos · Cartilla 3».
// La usan las dos rutas del Paso 6 —la cabecera de /bloques/[bloqueId] y cada
// grupo de /modulos—, así que el formato vive en un solo sitio y no puede
// divergir entre pantallas.
//
// El peso del examen también lo dibuja el riel del encabezado con el ancho de
// sus segmentos (DISENO.md §4.3), pero ahí es solo forma: aquí queda en palabras,
// que es lo que lo hace accesible y comparable.

/** Subconjunto serializable de `Bloque`: no se pasa el objeto entero. */
export interface DatosMetaBloque {
  /** Fracción del examen (0–1). Se muestra como porcentaje entero. */
  pesoExamen: number;
  numeroCartilla: number;
  totalModulos: number;
}

export function MetaBloque({ pesoExamen, numeroCartilla, totalModulos }: DatosMetaBloque) {
  const partes = [
    `${Math.round(pesoExamen * 100)} % del examen`,
    totalModulos === 1 ? '1 módulo' : `${totalModulos} módulos`,
    `Cartilla ${numeroCartilla}`,
  ];

  return <p className="text-[0.8125rem] text-muted-foreground">{partes.join(' · ')}</p>;
}
