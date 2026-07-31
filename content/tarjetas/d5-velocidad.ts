// content/tarjetas/d5-velocidad.ts
// D5 · Capacidad física: velocidad. 15 tarjetas.
// Cubren los datos que el módulo pregunta con número exacto: los dos factores
// de la velocidad, las cinco etapas del tiempo de reacción, el umbral de salida
// falsa, la relación trabajo:descanso del trabajo aláctico y las fases sensibles.
import type { Tarjeta } from '@/lib/tipos';

export const TARJETAS_MODULO: Tarjeta[] = [
  {
    id: 'D5-T01',
    modulo: 'd5-velocidad',
    tipo: 'definicion',
    frente: '¿Qué es la velocidad como capacidad física?',
    reverso:
      'La capacidad de realizar una acción motora en el menor tiempo posible. En los desplazamientos cíclicos se descompone en dos factores: frecuencia y amplitud del movimiento.',
  },
  {
    id: 'D5-T02',
    modulo: 'd5-velocidad',
    tipo: 'formula',
    frente: '¿Cómo se descompone la velocidad de desplazamiento?',
    reverso:
      'Velocidad = frecuencia × amplitud. Frecuencia: ciclos por segundo (zancadas, brazadas). Amplitud: distancia recorrida en cada ciclo. Ejemplo: 4,4 zancadas/s × 2,15 m = 9,46 m/s = 34,1 km/h.',
  },
  {
    id: 'D5-T03',
    modulo: 'd5-velocidad',
    tipo: 'clasificacion',
    frente: 'Los 4 tipos de velocidad',
    reverso:
      '1) De reacción: del estímulo al inicio del movimiento. 2) De desplazamiento: recorrer distancia en el menor tiempo (cíclica). 3) Gestual: un gesto técnico único lo más rápido posible (acíclica). 4) Resistencia a la velocidad: sostener la velocidad máxima frente a la fatiga.',
  },
  {
    id: 'D5-T04',
    modulo: 'd5-velocidad',
    tipo: 'definicion',
    frente: '¿Qué es la velocidad de reacción y en qué se divide?',
    reverso:
      'El tiempo entre la aparición del estímulo y el inicio de la respuesta motora. Simple: un solo estímulo previsto y una sola respuesta (salida de tacos). Compleja o discriminativa: varios estímulos posibles, hay que elegir la respuesta (deportes de oposición).',
  },
  {
    id: 'D5-T05',
    modulo: 'd5-velocidad',
    tipo: 'clasificacion',
    frente: 'Las 5 etapas del tiempo de reacción',
    reverso:
      '1) Percepción del estímulo por el receptor. 2) Transmisión por la vía aferente. 3) Elaboración de la respuesta en el SNC. 4) Transmisión por la vía eferente. 5) Activación del músculo. La etapa 3 es la que más varía y la única que se entrena de verdad.',
  },
  {
    id: 'D5-T06',
    modulo: 'd5-velocidad',
    tipo: 'dato',
    frente: 'Tiempo de reacción: umbral de salida falsa y valores reales',
    reverso:
      'Por debajo de 0,100 s el reglamento de atletismo considera salida falsa: nadie procesa el estímulo y aplica fuerza en menos. Un velocista de élite reacciona en torno a 0,12–0,20 s.',
  },
  {
    id: 'D5-T07',
    modulo: 'd5-velocidad',
    tipo: 'formula',
    frente: 'Tiempo de reacción vs tiempo de respuesta',
    reverso:
      'Tiempo de respuesta = tiempo de reacción + tiempo de movimiento. El de reacción termina cuando el movimiento empieza; el de respuesta incluye el gesto completo. En campo casi siempre se mide el de respuesta.',
  },
  {
    id: 'D5-T08',
    modulo: 'd5-velocidad',
    tipo: 'definicion',
    frente: '¿Qué es la velocidad gestual?',
    reverso:
      'La capacidad de ejecutar un gesto técnico único en el menor tiempo posible: golpeo, remate, lanzamiento. También se llama acíclica o segmentaria, porque no repite un ciclo con todo el cuerpo.',
  },
  {
    id: 'D5-T09',
    modulo: 'd5-velocidad',
    tipo: 'definicion',
    frente: '¿Qué es la resistencia a la velocidad?',
    reverso:
      'La capacidad de sostener la velocidad máxima o casi máxima el mayor tiempo posible frente a la fatiga. Es el único trabajo de velocidad que se hace con recuperación incompleta y buscando fatiga; predomina la vía anaeróbica láctica.',
  },
  {
    id: 'D5-T10',
    modulo: 'd5-velocidad',
    tipo: 'dato',
    frente: 'Vía energética y descanso del entrenamiento de velocidad pura',
    reverso:
      'Sistema anaeróbico aláctico (ATP y fosfocreatina). Repeticiones de menos de 6 s, recuperación completa con relación trabajo:descanso de 1:12 a 1:20, volumen total bajo y siempre en estado de frescura.',
  },
  {
    id: 'D5-T11',
    modulo: 'd5-velocidad',
    tipo: 'dato',
    frente: 'Prescripción por objetivo: aceleración, velocidad máxima y resistencia a la velocidad',
    reverso:
      'Aceleración: 10–30 m, 2–4 s, 2–3 min de descanso. Velocidad máxima: 30–60 m, 4–6 s, 3–5 min. Resistencia a la velocidad: 60–150 m, 8–30 s, descanso incompleto.',
  },
  {
    id: 'D5-T12',
    modulo: 'd5-velocidad',
    tipo: 'definicion',
    frente: '¿Qué es la barrera de velocidad y cómo se rompe?',
    reverso:
      'El estancamiento que aparece al repetir siempre el mismo gesto a la misma velocidad máxima: el sistema nervioso automatiza un estereotipo dinámico. Se rompe variando ejercicio y distancias, con sobrevelocidad, y dejando de repetir el gesto un tiempo.',
  },
  {
    id: 'D5-T13',
    modulo: 'd5-velocidad',
    tipo: 'clasificacion',
    frente: 'Velocidad asistida y velocidad resistida: qué mejora cada una',
    reverso:
      'Asistida o sobrevelocidad (cuesta abajo, arrastre, remolque): ataca la frecuencia. Resistida (cuesta arriba, trineo, paracaídas): ataca la amplitud y la fuerza aplicada. En la resistida la carga no debe frenar más de un 10 % aproximado la velocidad normal.',
  },
  {
    id: 'D5-T14',
    modulo: 'd5-velocidad',
    tipo: 'dato',
    frente: 'Tests de velocidad y qué mide cada uno',
    reverso:
      '30 m lanzados: velocidad máxima (30 m de impulso previo). 20–40 m desde parado: aceleración. 10 × 5 m: velocidad con cambios de dirección. Tapping o golpeo de placas: velocidad gestual del miembro superior. RAST (6 × 35 m con 10 s): resistencia a la velocidad.',
  },
  {
    id: 'D5-T15',
    modulo: 'd5-velocidad',
    tipo: 'dato',
    frente: 'Fase sensible de la velocidad y conversión de unidades',
    reverso:
      'La frecuencia de movimiento y la velocidad de reacción tienen su periodo más favorable entre los 7 y los 12 años, porque dependen de la maduración nerviosa. La velocidad de desplazamiento máxima llega después, con la fuerza. Conversión: m/s × 3,6 = km/h.',
  },
];
