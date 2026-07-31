// content/tarjetas/d3-fuerza.ts
// D3 · Capacidad física: fuerza. 15 tarjetas.
// Cubren los 3 datos duros del módulo: DD-010 (fuerza máxima),
// DD-011 (hipertrofia) y DD-012 (resistencia muscular), cada uno con su
// tarjeta de fila completa (T03, T04, T05) más las de contraste.
import type { Tarjeta } from '@/lib/tipos';

export const TARJETAS_MODULO: Tarjeta[] = [
  {
    id: 'D3-T01',
    modulo: 'd3-fuerza',
    tipo: 'definicion',
    frente: '¿Qué es la fuerza como capacidad física?',
    reverso:
      'La capacidad de generar tensión muscular para vencer o contrarrestar una resistencia externa. La palabra clave es tensión, no movimiento: un isométrico, en el que nada se desplaza, es trabajo de fuerza pleno.',
  },
  {
    id: 'D3-T02',
    modulo: 'd3-fuerza',
    tipo: 'clasificacion',
    frente: 'Las tres manifestaciones de la fuerza',
    reverso:
      'Fuerza máxima: la mayor tensión posible en una contracción voluntaria. Fuerza explosiva o rápida: la mayor tensión posible en el menor tiempo posible. Fuerza resistencia: sostener o repetir una tensión submáxima sin que caiga.',
  },
  {
    id: 'D3-T03',
    modulo: 'd3-fuerza',
    tipo: 'dato',
    frente: 'Fuerza máxima: carga, repeticiones, duración y descanso',
    reverso:
      'Más del 85 % del 1RM · menos de 6 repeticiones · menos de 15 s de serie · 2 a 5 min de descanso. Vía anaeróbica aláctica.',
  },
  {
    id: 'D3-T04',
    modulo: 'd3-fuerza',
    tipo: 'dato',
    frente: 'Hipertrofia: carga, repeticiones, duración y descanso',
    reverso:
      '70–85 % del 1RM · 6 a 12 repeticiones · 20 a 40 s de serie · 30 s a 1 min 30 s de descanso. Vía anaeróbica láctica.',
  },
  {
    id: 'D3-T05',
    modulo: 'd3-fuerza',
    tipo: 'dato',
    frente: 'Resistencia muscular: carga, repeticiones, duración y descanso',
    reverso:
      'Por debajo del 70 % del 1RM · 15 repeticiones o más · 45 s de serie o más · hasta 30 s de descanso. Vía aeróbica.',
  },
  {
    id: 'D3-T06',
    modulo: 'd3-fuerza',
    tipo: 'dato',
    frente: '¿Por qué la fuerza máxima necesita 2 a 5 minutos de descanso?',
    reverso:
      'Porque lo que se agota con cargas de más del 85 % es la fosfocreatina y el sistema nervioso, y la fosfocreatina tarda minutos en reponerse. Con menos descanso la siguiente serie ya no se hace a intensidad máxima y el estímulo se pierde.',
  },
  {
    id: 'D3-T07',
    modulo: 'd3-fuerza',
    tipo: 'definicion',
    frente: '¿Qué es el 1RM?',
    reverso:
      'La carga máxima que se puede movilizar una sola vez con técnica correcta en un ejercicio concreto. Es un dato por ejercicio: el 1RM de sentadilla no dice nada del 1RM de press de banca.',
  },
  {
    id: 'D3-T08',
    modulo: 'd3-fuerza',
    tipo: 'formula',
    frente: 'Fórmula de Epley para estimar el 1RM',
    reverso:
      '1RM = peso × (1 + repeticiones / 30). Ejemplo: 80 kg movidos 8 veces → 80 × (1 + 8/30) = 80 × 1,267 = 101,3 kg.',
  },
  {
    id: 'D3-T09',
    modulo: 'd3-fuerza',
    tipo: 'formula',
    frente: 'Fórmula de Brzycki para estimar el 1RM',
    reverso:
      '1RM = peso / (1,0278 − 0,0278 × repeticiones). Ejemplo: 60 kg movidos 12 veces → 60 / 0,6942 = 86,4 kg.',
  },
  {
    id: 'D3-T10',
    modulo: 'd3-fuerza',
    tipo: 'dato',
    frente: '¿Hasta cuántas repeticiones es fiable un 1RM estimado?',
    reverso:
      'Hasta unas 10 repeticiones. Por encima de ahí las fórmulas se separan entre sí y el error crece: más repeticiones dan menos precisión, no más. La serie de estimación se hace corta y al máximo esfuerzo.',
  },
  {
    id: 'D3-T11',
    modulo: 'd3-fuerza',
    tipo: 'formula',
    frente: '¿Cómo se relacionan fuerza, velocidad y potencia?',
    reverso:
      'P = F × v. Como con la carga máxima la velocidad se desploma y con la carga ligera falta fuerza, la potencia máxima se produce con cargas medias, no con el 1RM.',
  },
  {
    id: 'D3-T12',
    modulo: 'd3-fuerza',
    tipo: 'definicion',
    frente: '¿Qué es el ciclo de estiramiento-acortamiento (CEA)?',
    reverso:
      'El músculo se estira justo antes de acortarse y devuelve energía elástica sumada al reflejo miotático. Es lo que hace que el salto con contramovimiento supere al salto sin él, y es el fundamento de la pliometría.',
  },
  {
    id: 'D3-T13',
    modulo: 'd3-fuerza',
    tipo: 'clasificacion',
    frente: '¿Qué produce el método de intensidades máximas?',
    reverso:
      'Ganancia de fuerza por adaptación nerviosa: más unidades motoras reclutadas, mejor sincronización y mayor frecuencia de descarga. Aumenta poco el tamaño del músculo porque el volumen total de trabajo es bajo.',
  },
  {
    id: 'D3-T14',
    modulo: 'd3-fuerza',
    tipo: 'clasificacion',
    frente: 'Qué valora cada test de fuerza',
    reverso:
      '1RM → fuerza máxima dinámica. Salto vertical (CMJ, Abalakov, Sargent) → fuerza explosiva del tren inferior. Lanzamiento de balón medicinal → fuerza explosiva del tren superior. Dinamometría manual → fuerza máxima isométrica de prensión.',
  },
  {
    id: 'D3-T15',
    modulo: 'd3-fuerza',
    tipo: 'dato',
    frente: '¿En cuántos intentos máximos debe resolverse un test de 1RM?',
    reverso:
      'En 3 a 5 intentos máximos, con 3 a 5 minutos de descanso entre ellos, después de dos series de aproximación. Si aparece en el séptimo u octavo intento ya no es un 1RM: la fatiga acumulada lo convirtió en un test de resistencia.',
  },
];
