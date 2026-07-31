// content/tarjetas/c2-cardiovascular.ts
// C2 · Sistema cardiovascular. 15 tarjetas.
// Cubren los 10 datos duros del módulo: DD-020 (FC en reposo), DD-021 a DD-025
// (las 5 fórmulas de FCmáx), DD-026 (FC de reserva), DD-027 (gasto cardíaco),
// DD-028 (conversión de pulso) y DD-029 (adaptación por tipo de esfuerzo).
import type { Tarjeta } from '@/lib/tipos';

export const TARJETAS_MODULO: Tarjeta[] = [
  {
    id: 'C2-T01',
    modulo: 'c2-cardiovascular',
    tipo: 'formula',
    frente: 'Fox et al. (1971): fórmula y población',
    reverso:
      'FCmáx = 220 − edad. Población general. Es la más difundida y la única que no lleva coeficiente delante de la edad: si no hay multiplicador, es Fox.',
  },
  {
    id: 'C2-T02',
    modulo: 'c2-cardiovascular',
    tipo: 'formula',
    frente: 'Astrand (1952): fórmula y población',
    reverso: 'FCmáx = 216,6 − (0,84 × edad). Población general. Es la más antigua de las cinco.',
  },
  {
    id: 'C2-T03',
    modulo: 'c2-cardiovascular',
    tipo: 'formula',
    frente: 'Tanaka et al. (2001): fórmula y población',
    reverso:
      'FCmáx = 208 − (0,7 × edad). Hombres y mujeres sanos. A partir de los 40 años da valores más altos que Fox; por debajo, más bajos.',
  },
  {
    id: 'C2-T04',
    modulo: 'c2-cardiovascular',
    tipo: 'formula',
    frente: 'Gellish et al. (2007): fórmula y población',
    reverso:
      'FCmáx = 207 − (0,7 × edad). Adultos físicamente activos. Comparte coeficiente con Tanaka y se separa de ella en un solo punto de la constante: 207 frente a 208.',
  },
  {
    id: 'C2-T05',
    modulo: 'c2-cardiovascular',
    tipo: 'formula',
    frente: 'Gulati et al. (2010): fórmula y población',
    reverso:
      'FCmáx = 206 − (0,88 × edad). Mujeres asintomáticas de mediana edad. Es la única de las cinco validada exclusivamente en población femenina.',
  },
  {
    id: 'C2-T06',
    modulo: 'c2-cardiovascular',
    tipo: 'clasificacion',
    frente: 'Las 5 constantes de FCmáx, en orden',
    reverso:
      '220 Fox · 216,6 Astrand · 208 Tanaka · 207 Gellish · 206 Gulati. La constante baja según avanza el año de publicación, y la más reciente es la de mujeres.',
  },
  {
    id: 'C2-T07',
    modulo: 'c2-cardiovascular',
    tipo: 'formula',
    frente: '¿Qué es la frecuencia cardíaca de reserva?',
    reverso:
      'FC de reserva = FCmáx − FC en reposo. Es el margen de trabajo cardíaco disponible y la base del método de Karvonen.',
  },
  {
    id: 'C2-T08',
    modulo: 'c2-cardiovascular',
    tipo: 'formula',
    frente: 'El método de Karvonen',
    reverso:
      'FC objetivo = FC en reposo + (FC de reserva × intensidad). El porcentaje se aplica sobre la RESERVA y después se devuelve la FC de reposo. Da valores más altos que aplicar el porcentaje directo sobre la FCmáx.',
  },
  {
    id: 'C2-T09',
    modulo: 'c2-cardiovascular',
    tipo: 'formula',
    frente: '¿Cómo se calcula el gasto cardíaco?',
    reverso:
      'GC = frecuencia cardíaca × volumen sistólico. Se expresa en litros por minuto: en reposo ronda los 5 L/min. Ojo con la unidad, porque el producto sale en ml/min.',
  },
  {
    id: 'C2-T10',
    modulo: 'c2-cardiovascular',
    tipo: 'definicion',
    frente: 'Volumen sistólico, gasto cardíaco y volemia',
    reverso:
      'Volumen sistólico: lo que expulsa el ventrículo en un latido (~70 ml en reposo). Gasto cardíaco: lo que bombea en un minuto. Volemia: la sangre total del organismo. Por latido, por minuto y en total.',
  },
  {
    id: 'C2-T11',
    modulo: 'c2-cardiovascular',
    tipo: 'dato',
    frente: 'Conversión de una toma de pulso a lpm',
    reverso:
      '×4 si la toma es de 15 s · ×6 si es de 10 s · ×10 si es de 6 s. El factor siempre es 60 dividido entre los segundos de la toma, así que se reconstruye sin memorizar la tabla.',
  },
  {
    id: 'C2-T12',
    modulo: 'c2-cardiovascular',
    tipo: 'dato',
    frente: 'FC en reposo: valor normal y el caso del deportista',
    reverso:
      '60–100 lpm en el adulto sano; por debajo de 60 es bradicardia. En el deportista de resistencia entrenado son habituales 40–60 lpm, y eso es adaptación, no enfermedad.',
  },
  {
    id: 'C2-T13',
    modulo: 'c2-cardiovascular',
    tipo: 'clasificacion',
    frente: 'Adaptaciones al entrenamiento de resistencia',
    reverso:
      '↓FC en reposo · ↑volemia · ↑volumen sistólico · ↑gasto cardíaco máximo. La FCmáx NO cambia: depende de la edad, no del estado de forma.',
  },
  {
    id: 'C2-T14',
    modulo: 'c2-cardiovascular',
    tipo: 'clasificacion',
    frente: 'Dilatación frente a hipertrofia: ¿qué esfuerzo produce cada una?',
    reverso:
      'Dinámico o de resistencia → sobrecarga de VOLUMEN → dilata la cavidad → ↑volumen sistólico. Isométrico o de fuerza → sobrecarga de PRESIÓN → engrosa la pared → ↑fuerza de contracción. Volumen dilata, presión engrosa.',
  },
  {
    id: 'C2-T15',
    modulo: 'c2-cardiovascular',
    tipo: 'definicion',
    frente: 'Circulación menor y circulación mayor',
    reverso:
      'Menor o pulmonar: ventrículo derecho → pulmón → aurícula izquierda. Mayor o sistémica: ventrículo izquierdo → organismo → aurícula derecha. En la menor la arteria lleva sangre pobre en oxígeno: arteria significa que sale del corazón, no que vaya oxigenada.',
  },
];
