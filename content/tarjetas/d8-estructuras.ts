// content/tarjetas/d8-estructuras.ts
// Bloque D · Paso 15. 15 tarjetas.
// Cubren: los 4 niveles de estructura con su duración y su nivel de decisión,
// los tipos de mesociclo y de microciclo, las partes de la sesión, el orden
// dentro de la parte principal y qué hace (y qué no hace) la vuelta a la calma.
import type { Tarjeta } from '@/lib/tipos';

export const TARJETAS_MODULO: Tarjeta[] = [
  {
    id: 'D8-T01',
    modulo: 'd8-estructuras',
    tipo: 'clasificacion',
    frente: 'Las 4 estructuras de la planificación, de mayor a menor',
    reverso:
      'Macroestructura (macrociclo) → mesoestructura (mesociclo) → microestructura (microciclo) → sesión de entrenamiento. Por encima está el ciclo plurianual; por debajo, el ejercicio.',
  },
  {
    id: 'D8-T02',
    modulo: 'd8-estructuras',
    tipo: 'dato',
    frente: 'Duración de cada estructura',
    reverso:
      'Macrociclo 3–12 meses. Mesociclo 2–6 semanas, lo normal 4. Microciclo 3–10 días, lo normal 7. Sesión 60–120 min. Son rangos con un valor habitual, no cifras fijas.',
  },
  {
    id: 'D8-T03',
    modulo: 'd8-estructuras',
    tipo: 'definicion',
    frente: '¿Qué es el macrociclo y qué se decide en él?',
    reverso:
      'La estructura mayor de la planificación, de 3 a 12 meses. Ahí se decide cuál es la competencia principal, en qué fecha cae y cómo se reparte el tiempo en períodos. Agrupa mesociclos.',
  },
  {
    id: 'D8-T04',
    modulo: 'd8-estructuras',
    tipo: 'definicion',
    frente: '¿Qué es el mesociclo y qué se decide en él?',
    reverso:
      'Una agrupación de microciclos con una orientación de carga común, de 2 a 6 semanas (lo normal 4). Ahí se decide la orientación de la carga del bloque: "estas cuatro semanas van de fuerza máxima".',
  },
  {
    id: 'D8-T05',
    modulo: 'd8-estructuras',
    tipo: 'definicion',
    frente: '¿Qué es el microciclo y qué se decide en él?',
    reverso:
      'El conjunto de sesiones de unos pocos días, de 3 a 10 (lo normal 7). Ahí se decide qué día es duro y qué día es suave: la alternancia entre carga y recuperación.',
  },
  {
    id: 'D8-T06',
    modulo: 'd8-estructuras',
    tipo: 'dato',
    frente: '¿Por qué el microciclo suele durar 7 días?',
    reverso:
      'Porque el calendario social y competitivo es semanal, no porque el organismo tenga un ciclo de siete días. Un microciclo de choque de 5 días o uno de aproximación de 10 son igual de legítimos.',
  },
  {
    id: 'D8-T07',
    modulo: 'd8-estructuras',
    tipo: 'clasificacion',
    frente: 'Los tipos de mesociclo',
    reverso:
      'Entrante (reincorporar), básico (donde se produce la adaptación), de control (comprobar con tests), precompetitivo (pulir), competitivo (sostener el rendimiento) y de recuperación (restablecer).',
  },
  {
    id: 'D8-T08',
    modulo: 'd8-estructuras',
    tipo: 'clasificacion',
    frente: '¿En qué se subdivide el mesociclo básico?',
    reverso:
      'En desarrollador, que sube la carga y busca adaptación nueva, y estabilizador, que mantiene la carga y consolida lo ganado.',
  },
  {
    id: 'D8-T09',
    modulo: 'd8-estructuras',
    tipo: 'clasificacion',
    frente: 'Los tipos de microciclo',
    reverso:
      'De ajuste o gradual (para entrar), de carga o choque (el que produce adaptación), de aproximación (la semana previa a competir, con descarga), competitivo y de recuperación.',
  },
  {
    id: 'D8-T10',
    modulo: 'd8-estructuras',
    tipo: 'clasificacion',
    frente: 'Las 3 partes de la sesión, en orden y con su duración',
    reverso:
      'Inicial o calentamiento (10–20 min), principal o fundamental (40–90 min) y final o vuelta a la calma (5–10 min). La sesión completa dura entre 60 y 120 min.',
  },
  {
    id: 'D8-T11',
    modulo: 'd8-estructuras',
    tipo: 'clasificacion',
    frente: '¿En qué dos mitades se divide el calentamiento?',
    reverso:
      'General, con movimiento global que eleva la temperatura, la frecuencia cardíaca y la ventilación; y específica, con gestos parecidos a los que vienen en la parte principal. En ese orden.',
  },
  {
    id: 'D8-T12',
    modulo: 'd8-estructuras',
    tipo: 'dato',
    frente: 'Orden de los contenidos dentro de la parte principal',
    reverso:
      'Técnica y velocidad → fuerza → resistencia. Lo que exige sistema nervioso fresco va primero. Poner el fondo largo antes del trabajo técnico hace que el gesto se aprenda mal y sube el riesgo de lesión.',
  },
  {
    id: 'D8-T13',
    modulo: 'd8-estructuras',
    tipo: 'definicion',
    frente: '¿Qué hace la vuelta a la calma?',
    reverso:
      'Devuelve progresivamente el organismo a valores de reposo, favorece la retirada de metabolitos y evita que la sangre se quede acumulada en las piernas al parar de golpe. Dura 5–10 min.',
  },
  {
    id: 'D8-T14',
    modulo: 'd8-estructuras',
    tipo: 'dato',
    frente: '¿La vuelta a la calma previene las agujetas?',
    reverso:
      'No. El dolor muscular de aparición tardía viene del daño microscópico de la fibra, sobre todo por trabajo excéntrico, y aparece igual con o sin vuelta a la calma. Lo que sí acelera es el retorno a valores basales.',
  },
  {
    id: 'D8-T15',
    modulo: 'd8-estructuras',
    tipo: 'formula',
    frente: '¿Cómo se cuentan los mesociclos de un macrociclo?',
    reverso:
      'Mesociclos = semanas del macrociclo ÷ semanas de cada mesociclo. Ejemplo: 28 semanas con mesociclos de 4 → 28 ÷ 4 = 7 mesociclos, y cada uno lleva 4 microciclos de 7 días.',
  },
];
