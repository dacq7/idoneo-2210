// content/erratas.ts
// Contradicciones entre cartillas (X-*) y erratas de contenido (E-*).
// El prefijo marca la familia, no el `tipo`: X-03 es una `aclaracion` (la
// cartilla no se equivoca, el dato se confunde con X-02). Ver ADR-012.
// Alimenta la ruta /erratas y el componente <AlertaContradiccion />.
// Regla de producto: si un ítem toca un punto de aquí, se redacta evitando la
// ambigüedad y la explicación enlaza la entrada correspondiente.

import type { Errata } from '@/lib/tipos';

export const ERRATAS: Errata[] = [
  {
    id: 'X-01',
    tipo: 'contradiccion',
    tema: 'ATP por molécula de glucosa en aerobiosis',
    ubicacion: 'Cartilla 1, Subtema 1.4.1 · Cartilla 3, Subtema 1.3.1',
    diceLaCartilla: 'Cartilla 1: 36–38 ATP. Cartilla 3: 30–32 ATP.',
    loCorrecto:
      '30–32 ATP es el valor bioquímico actualizado y el que usa la cartilla más específica en fisiología.',
    comoResponder:
      'Si la pregunta viene del bloque de Ciencias Básicas, responde 36–38. Si viene de Ciencias Aplicadas, responde 30–32. Ante duda sin contexto de bloque, elige 30–32.',
    modulos: ['a5-sistemas-energeticos-biomarcadores', 'c1-vias-energeticas'],
  },
  {
    id: 'X-02',
    tipo: 'contradiccion',
    tema: 'Duración del sistema anaeróbico aláctico',
    ubicacion: 'Cartilla 1, Subtema 1.4.2 · Cartilla 3, Subtema 1.1.1',
    diceLaCartilla: 'Cartilla 1: 5–10 s. Cartilla 3: 10–15 s.',
    loCorrecto:
      'La Cartilla 3 es la fuente específica de fisiología: 10–15 s de esfuerzo máximo. La Cartilla 1 se refiere al esfuerzo máximo absoluto.',
    comoResponder:
      'Si aparecen las dos opciones, elige la del bloque evaluado: 5–10 s en Ciencias Básicas, 10–15 s en Ciencias Aplicadas.',
    modulos: ['a5-sistemas-energeticos-biomarcadores', 'c1-vias-energeticas', 'c5-umbrales-zonas'],
  },
  {
    id: 'X-03',
    // No es contradicción ni errata: su propio loCorrecto dice "no hay conflicto".
    // Existe para desambiguar frente a X-02. Ver ADR-012.
    tipo: 'aclaracion',
    tema: 'Reservas de ATP libre',
    ubicacion: 'Cartilla 3',
    diceLaCartilla: 'El ATP almacenado en el músculo alcanza para 2–3 s.',
    loCorrecto: 'No hay conflicto: 2–3 s es correcto. El problema es que se confunde con X-02.',
    comoResponder:
      'ATP libre (2–3 s) ≠ sistema fosfágeno completo (10–15 s). Si la pregunta dice "ATP almacenado", son 2–3 s; si dice "sistema fosfágeno" o "aláctico", aplica X-02.',
    modulos: ['a5-sistemas-energeticos-biomarcadores', 'c1-vias-energeticas'],
  },
  {
    id: 'E-01',
    tipo: 'errata',
    tema: 'Qué organismos son procariotas',
    ubicacion: 'Cartilla 1, Subtema 1.1.1',
    diceLaCartilla:
      '"Los organismos con células procariotas son las bacterias, arqueas, protozoos y algunos hongos y algas".',
    loCorrecto:
      'Protozoos, hongos y algas son eucariotas. Procariotas son solo bacterias y arqueas.',
    comoResponder:
      'Estudia lo correcto: bacterias y arqueas. Si un ítem del examen oficial repite el error de la cartilla, marca la opción de la cartilla — pero sabiendo que es un error.',
    modulos: ['a1-celula'],
  },
  {
    id: 'E-02',
    tipo: 'errata',
    tema: 'Nombre de la célula muscular y de la pulmonar',
    ubicacion: 'Cartilla 1, Subtema 1.1.2',
    diceLaCartilla: '"la célula muscular (sarcómero)"; "la célula pulmonar (alvéolo)".',
    loCorrecto:
      'La célula muscular es la fibra muscular o miocito; el sarcómero es su unidad contráctil. El alvéolo es una estructura, no una célula: la célula es el neumocito.',
    comoResponder:
      'Memoriza fibra muscular y neumocito. Reconoce el error para no dudar si aparece la versión de la cartilla.',
    modulos: ['a1-celula', 'c4-nervioso-digestivo-osteomuscular'],
  },
  {
    id: 'E-03',
    tipo: 'errata',
    tema: 'Función del cartílago articular',
    ubicacion: 'Cartilla 1, Tabla 2',
    diceLaCartilla: 'La fila "Cartílago articular" repite la descripción en la columna Función.',
    loCorrecto: 'Su función es reducir la fricción entre superficies óseas y absorber impactos.',
    comoResponder: 'Responde "reducir fricción y absorber impactos".',
    modulos: ['a3-tejidos-organos-sistemas'],
  },
  {
    id: 'E-04',
    tipo: 'errata',
    tema: 'Fila duplicada de "meniscos o discos"',
    ubicacion: 'Cartilla 1, Tabla 2',
    diceLaCartilla:
      '"Meniscos o discos" aparece dos veces; la segunda fila describe bolsas llenas de líquido sinovial.',
    loCorrecto: 'Esa segunda fila corresponde a las bolsas sinoviales (bursas).',
    comoResponder:
      'Si la descripción menciona bolsas con líquido sinovial que reducen el roce entre tendón y hueso, la respuesta es bursa, no menisco.',
    modulos: ['a3-tejidos-organos-sistemas'],
  },
  {
    id: 'E-05',
    tipo: 'errata',
    tema: 'Porcentaje de aumento',
    ubicacion: 'Cartilla 1, Subtema 2.4.3',
    diceLaCartilla:
      '"Si un precio sube de $50 a $75… da como resultado 150 %. Es decir, que 50 % es el valor… del porcentaje de aumento".',
    loCorrecto:
      '$75 es el 150 % de $50; el aumento es del 50 %. La redacción confunde el valor relativo con el incremento.',
    comoResponder:
      'Usa siempre ((nuevo − viejo) / viejo) × 100 para el porcentaje de aumento.',
    modulos: ['a6-estadistica'],
  },
  {
    id: 'E-06',
    tipo: 'errata',
    tema: 'Ejemplo de mediana con n par',
    ubicacion: 'Cartilla 1, Subtema 2.1.2',
    diceLaCartilla: 'La lista ordenada aparece truncada ("5 6 7 8 9 12").',
    loCorrecto: 'Con la lista 5, 6, 7, 8, 9, 12 la mediana es (7 + 8) / 2 = 7,5.',
    comoResponder:
      'Con n par, promedia las posiciones N/2 y (N/2)+1 de la lista ORDENADA. Ordenar primero es el paso que más se olvida.',
    modulos: ['a6-estadistica'],
  },
  {
    id: 'E-07',
    tipo: 'errata',
    tema: 'Fila de vitamina sin rótulo',
    ubicacion: 'Cartilla 1, Tabla 9',
    diceLaCartilla: 'Una fila aparece rotulada "Nota: Para profundizar…" en vez del nombre de la vitamina.',
    loCorrecto:
      'Esa fila corresponde a la Vitamina B2 (riboflavina): leche, huevos, vegetales de hoja verde, carne magra, almendras.',
    comoResponder: 'Asocia esas fuentes con riboflavina / B2.',
    modulos: ['a4-nutrientes'],
  },
  {
    id: 'E-08',
    tipo: 'errata',
    tema: 'Errata tipográfica: "viaraza"',
    ubicacion: 'Cartilla 1, varios',
    diceLaCartilla: '"viaraza".',
    loCorrecto: 'Debe leerse varianza.',
    comoResponder: 'Sin efecto en la respuesta; solo evita la confusión al leer.',
    modulos: ['a6-estadistica'],
  },
  {
    id: 'E-09',
    tipo: 'errata',
    tema: 'Tabla de respuesta al entrenamiento desalineada',
    ubicacion: 'Cartilla 3, Tabla 3',
    diceLaCartilla:
      'La tabla "Respuesta al entrenamiento de los diferentes sistemas" está desalineada: las flechas no corresponden a sus filas.',
    loCorrecto:
      'No uses esa tabla como fuente. Sí el texto: con entrenamiento de resistencia la FC en reposo baja, y el volumen sistólico y el gasto cardíaco máximo suben.',
    comoResponder:
      'Ante una pregunta sobre adaptaciones cardiovasculares, responde desde el texto: ↓FC reposo, ↑volumen sistólico, ↑gasto cardíaco máximo.',
    modulos: ['c2-cardiovascular', 'c3-respiratorio-vo2', 'c5-umbrales-zonas'],
  },
  {
    id: 'E-10',
    tipo: 'errata',
    tema: 'Cabecera equivocada en la tabla de minerales',
    ubicacion: 'Cartilla 1, Tabla 10',
    diceLaCartilla: 'La cabecera dice "VITAMINA".',
    loCorrecto: 'La tabla es de minerales.',
    comoResponder: 'Si el contenido de la fila es hierro, calcio, zinc o magnesio, es un mineral.',
    modulos: ['a4-nutrientes'],
  },
  {
    id: 'E-11',
    tipo: 'errata',
    tema: 'Fecha y número de la Ley 2210',
    ubicacion: 'Cartilla 2, referencias',
    diceLaCartilla: '"Ley 2210 de 2022… (2003, 13 de Junio)" y "Ley 2210 de 2023, artículo 8º".',
    loCorrecto: 'Es la Ley 2210 del 23 de mayo de 2022.',
    comoResponder: 'Ley 2210 de 2022. Ninguna otra fecha es correcta.',
    modulos: ['d1-conceptualizacion', 'b1-fundamentos-pedagogia'],
  },
];

export const ERRATAS_POR_ID = new Map(ERRATAS.map((e) => [e.id, e]));

export function erratasDelModulo(slug: string): Errata[] {
  return ERRATAS.filter((e) => e.modulos.includes(slug));
}
