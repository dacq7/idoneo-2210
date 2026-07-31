// content/tarjetas/c7-nutricion-deportiva.ts
// C7 · Nutrición deportiva. 15 tarjetas.
// Cubren los 8 datos duros del módulo: DD-050 (hidratación previa), DD-051 y
// DD-052 (la frontera de los 60 min), DD-053 (comida previa), DD-054
// (reposición de glucógeno), DD-055 (proteína post), DD-056 (proporción de
// recuperación) y DD-057 (proteína en ultra-resistencia).
import type { Tarjeta } from '@/lib/tipos';

export const TARJETAS_MODULO: Tarjeta[] = [
  {
    id: 'C7-T01',
    modulo: 'c7-nutricion-deportiva',
    tipo: 'dato',
    frente: 'Hidratación antes del esfuerzo',
    reverso:
      '250–500 ml de agua en los minutos previos. Ni más ni menos: un litro no se absorbe a tiempo, se queda en el estómago y acaba en la vejiga. La hidratación de verdad se prepara en las horas anteriores.',
  },
  {
    id: 'C7-T02',
    modulo: 'c7-nutricion-deportiva',
    tipo: 'dato',
    frente: 'La frontera de los 60 minutos',
    reverso:
      'Sesión de menos de 60 min: agua. Sesión de más de 60 min: bebida deportiva con hidratos de carbono y electrolitos. Es la frontera que decide qué se bebe durante el esfuerzo.',
  },
  {
    id: 'C7-T03',
    modulo: 'c7-nutricion-deportiva',
    tipo: 'dato',
    frente: '¿Cuándo se toma la comida rica en hidratos previa?',
    reverso:
      '2–4 horas antes, y con hidratos de bajo índice glucémico. Cuanto más grande es la comida, más lejos de la hora de competir: hace falta que el estómago esté vacío cuando la sangre se vaya al músculo.',
  },
  {
    id: 'C7-T04',
    modulo: 'c7-nutricion-deportiva',
    tipo: 'dato',
    frente: 'Reposición de glucógeno tras el esfuerzo',
    reverso:
      'Hidratos de ALTO índice glucémico en los 30–60 min posteriores, cuando el músculo capta glucosa con más avidez. Bajo índice antes, alto índice después.',
  },
  {
    id: 'C7-T05',
    modulo: 'c7-nutricion-deportiva',
    tipo: 'dato',
    frente: 'Proteína después del entrenamiento',
    reverso:
      '20–40 g de proteína de alta calidad. Por debajo el estímulo es insuficiente; por encima el excedente se oxida. La síntesis proteica tiene techo por toma, así que conviene repartir a lo largo del día.',
  },
  {
    id: 'C7-T06',
    modulo: 'c7-nutricion-deportiva',
    tipo: 'formula',
    frente: 'Proporción de recuperación',
    reverso:
      'CHO : proteína = 3:1 o 4:1. Con 30 g de proteína y proporción 4:1 salen 120 g de hidratos. Manda el hidrato y acompaña la proteína, nunca al revés.',
  },
  {
    id: 'C7-T07',
    modulo: 'c7-nutricion-deportiva',
    tipo: 'dato',
    frente: '¿Cuándo se consume proteína DURANTE el esfuerzo?',
    reverso:
      'Solo en ultra-resistencia de más de 4 horas. Es el único escenario en que se recomienda, porque el esfuerzo prolongado empieza a comprometer la masa muscular. En el resto, durante el esfuerzo mandan los hidratos.',
  },
  {
    id: 'C7-T08',
    modulo: 'c7-nutricion-deportiva',
    tipo: 'definicion',
    frente: '¿Qué mide el índice glucémico?',
    reverso:
      'La VELOCIDAD con la que un alimento eleva la glucosa en sangre respecto a un patrón. No la cantidad: hay alimentos con mucho azúcar y bajo índice glucémico. El índice glucémico responde a «qué tan rápido»; la carga glucémica, a «cuánto en total».',
  },
  {
    id: 'C7-T09',
    modulo: 'c7-nutricion-deportiva',
    tipo: 'definicion',
    frente: '¿Qué justifica la ventana de recuperación?',
    reverso:
      'Que en los 30–60 min posteriores el músculo capta glucosa con más facilidad, así que reponer pronto acelera la recarga. No es un plazo absoluto: pasada la hora se sigue reponiendo, solo que más despacio. Importa mucho si compites otra vez en pocas horas.',
  },
  {
    id: 'C7-T10',
    modulo: 'c7-nutricion-deportiva',
    tipo: 'clasificacion',
    frente: 'Bebida isotónica, hipertónica e hipotónica',
    reverso:
      'Se clasifican por su concentración de solutos frente al plasma: la isotónica la iguala, la hipertónica la supera y la hipotónica queda por debajo. La hipertónica enlentece el vaciado gástrico, así que no sirve para rehidratar rápido.',
  },
  {
    id: 'C7-T11',
    modulo: 'c7-nutricion-deportiva',
    tipo: 'definicion',
    frente: '¿Es la sed un buen indicador para hidratarse?',
    reverso:
      'No en esfuerzos largos ni en calor: la sed aparece cuando ya hay déficit instalado. Por eso se pauta un plan de ingesta por tiempo y se controla la pérdida pesando antes y después. En competición la hidratación se programa.',
  },
  {
    id: 'C7-T12',
    modulo: 'c7-nutricion-deportiva',
    tipo: 'formula',
    frente: 'Reposición tras el esfuerzo por pérdida de peso',
    reverso:
      '≈1,5 litros por cada kilogramo perdido. Se repone más de lo perdido porque parte se elimina por la orina antes de rehidratar del todo. El rendimiento ya cae con una pérdida del 2 % del peso corporal.',
  },
  {
    id: 'C7-T13',
    modulo: 'c7-nutricion-deportiva',
    tipo: 'formula',
    frente: 'Índice de masa corporal e índice cintura-cadera',
    reverso:
      'IMC = peso (kg) ÷ estatura (m)². ICC = perímetro de cintura ÷ perímetro de cadera, sin unidades. El IMC no distingue músculo de grasa: es cribado poblacional, no diagnóstico individual.',
  },
  {
    id: 'C7-T14',
    modulo: 'c7-nutricion-deportiva',
    tipo: 'clasificacion',
    frente: 'Componentes del gasto energético total',
    reverso:
      'Metabolismo basal (el mayor con diferencia) + efecto térmico de los alimentos (~10 %) + gasto por actividad física (el único modificable a corto plazo). El efecto térmico es el que más se olvida.',
  },
  {
    id: 'C7-T15',
    modulo: 'c7-nutricion-deportiva',
    tipo: 'definicion',
    frente: '¿Por qué se evitan grasa y fibra antes de competir?',
    reverso:
      'Porque retrasan el vaciado gástrico: la comida sigue en el estómago cuando la sangre se desvía al músculo, y aparecen las molestias. La comida previa se elige por lo rápido que sale del estómago, no por lo nutritiva que sea.',
  },
];
