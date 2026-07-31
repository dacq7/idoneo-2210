// content/tarjetas/d4-resistencia.ts
// D4 · Capacidad física: resistencia. 15 tarjetas.
// El módulo no tiene entradas propias en content/datos-duros.ts; los valores
// que se preguntan con número exacto —cortes de duración, constantes de
// Cooper y protocolo de la Course Navette— llevan tarjeta de dato dedicada.
import type { Tarjeta } from '@/lib/tipos';

export const TARJETAS_MODULO: Tarjeta[] = [
  {
    id: 'D4-T01',
    modulo: 'd4-resistencia',
    tipo: 'definicion',
    frente: '¿Qué es la resistencia como capacidad física?',
    reverso:
      'La capacidad de sostener un esfuerzo el mayor tiempo posible, retrasar la aparición de la fatiga, soportarla cuando aparece y recuperarse rápido al terminar. La recuperación forma parte de la definición, no es un añadido.',
  },
  {
    id: 'D4-T02',
    modulo: 'd4-resistencia',
    tipo: 'clasificacion',
    frente: 'Los tres criterios para clasificar la resistencia',
    reverso:
      'Por la masa muscular implicada (local o general), por la vía energética (aeróbica, anaeróbica láctica o anaeróbica aláctica) y por la duración del esfuerzo (corta, media y las cuatro de larga duración).',
  },
  {
    id: 'D4-T03',
    modulo: 'd4-resistencia',
    tipo: 'dato',
    frente: '¿Cuándo una resistencia es local y cuándo general?',
    reverso:
      'Local: interviene menos de un sexto o un séptimo de la masa muscular total, en la práctica la musculatura de un solo miembro. General: por encima de esa fracción; ahí el límite lo pone el sistema cardiorrespiratorio.',
  },
  {
    id: 'D4-T04',
    modulo: 'd4-resistencia',
    tipo: 'dato',
    frente: 'Resistencia de duración corta y de duración media: sus rangos',
    reverso:
      'Corta: 35 s a 2 min, con predominio anaeróbico láctico. Media: 2 a 10 min, mixta y ya con el peso aeróbico mayoritario. Por debajo de los 35 s no se habla de resistencia.',
  },
  {
    id: 'D4-T05',
    modulo: 'd4-resistencia',
    tipo: 'dato',
    frente: 'Las cuatro resistencias de larga duración',
    reverso:
      'Larga I: 10 a 35 min. Larga II: 35 a 90 min. Larga III: 90 min a 6 h. Larga IV: más de 6 h. Cuanto más largo el esfuerzo, más peso tienen las grasas como sustrato.',
  },
  {
    id: 'D4-T06',
    modulo: 'd4-resistencia',
    tipo: 'clasificacion',
    frente: '¿Qué separa a los métodos continuos de los fraccionados?',
    reverso:
      'La pausa. Los métodos continuos no la tienen: el esfuerzo va de principio a fin sin detenerse. Los fraccionados dividen el trabajo en series separadas por pausas.',
  },
  {
    id: 'D4-T07',
    modulo: 'd4-resistencia',
    tipo: 'definicion',
    frente: '¿Por qué el fartlek es un método continuo si cambia de ritmo?',
    reverso:
      'Porque nunca se detiene: la recuperación de los tramos rápidos se hace corriendo suave, no parado. Cambiar de intensidad no lo convierte en fraccionado; lo que lo convertiría es introducir pausas.',
  },
  {
    id: 'D4-T08',
    modulo: 'd4-resistencia',
    tipo: 'definicion',
    frente: 'Interválico frente a repeticiones: ¿qué los diferencia?',
    reverso:
      'El tipo de pausa. Interválico: pausa incompleta o útil, se arranca la siguiente serie sin estar recuperado. Repeticiones: pausa completa, se espera la recuperación para repetir a la misma velocidad alta.',
  },
  {
    id: 'D4-T09',
    modulo: 'd4-resistencia',
    tipo: 'definicion',
    frente: '¿Por qué la pausa del interválico se llama pausa útil?',
    reverso:
      'Porque la adaptación se produce ahí. Al cortar el esfuerzo la frecuencia cardíaca baja antes que el retorno venoso, el ventrículo se llena mejor y el volumen sistólico alcanza su valor más alto justo en los primeros segundos de pausa.',
  },
  {
    id: 'D4-T10',
    modulo: 'd4-resistencia',
    tipo: 'dato',
    frente: 'Las cinco variables de un entrenamiento interválico',
    reverso:
      'Distancia o duración de la serie, intensidad, número de repeticiones, duración de la pausa y tipo de pausa (parado o en movimiento). Cambiar cualquiera de ellas cambia la sesión.',
  },
  {
    id: 'D4-T11',
    modulo: 'd4-resistencia',
    tipo: 'clasificacion',
    frente: 'Continuo extensivo y continuo intensivo: en qué se distinguen',
    reverso:
      'Extensivo: intensidad baja, por debajo del umbral aeróbico, mucho tiempo; construye base y oxidación de grasas. Intensivo: intensidad media-alta en torno al umbral anaeróbico, menos tiempo; eleva el umbral.',
  },
  {
    id: 'D4-T12',
    modulo: 'd4-resistencia',
    tipo: 'dato',
    frente: 'Test de Cooper: en qué consiste',
    reverso:
      'Recorrer la mayor distancia posible en 12 minutos. Es un test indirecto, se aplica a un grupo entero a la vez y solo necesita pista y cronómetro.',
  },
  {
    id: 'D4-T13',
    modulo: 'd4-resistencia',
    tipo: 'formula',
    frente: 'Fórmula del test de Cooper',
    reverso:
      'VO₂máx = (distancia en metros − 504,9) / 44,73. Ejemplo: 2600 m → (2600 − 504,9) / 44,73 = 46,8 ml/kg/min.',
  },
  {
    id: 'D4-T14',
    modulo: 'd4-resistencia',
    tipo: 'dato',
    frente: 'Course Navette: protocolo',
    reverso:
      'Ida y vuelta entre dos líneas separadas 20 m al ritmo de una señal sonora. Arranca a 8,5 km/h y sube 0,5 km/h en cada palier de un minuto. Termina cuando el deportista no llega a la línea a tiempo dos veces seguidas.',
  },
  {
    id: 'D4-T15',
    modulo: 'd4-resistencia',
    tipo: 'formula',
    frente: '¿A qué velocidad corresponde un palier de la Course Navette?',
    reverso:
      'Velocidad = 8,5 + 0,5 × (palier − 1) km/h. Ejemplo: el palier 7 corresponde a 8,5 + 0,5 × 6 = 11,5 km/h.',
  },
];
