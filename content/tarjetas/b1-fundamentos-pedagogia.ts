// content/tarjetas/b1-fundamentos-pedagogia.ts
// B1 · Fundamentos de la pedagogía del deporte. 15 tarjetas.
// El módulo es un diccionario: el mazo carga las definiciones que el examen
// pide distinguir entre sí, más el ciclo de los cinco fundamentos específicos,
// que se pregunta por su orden.
import type { Tarjeta } from '@/lib/tipos';

export const TARJETAS_MODULO: Tarjeta[] = [
  {
    id: 'B1-T01',
    modulo: 'b1-fundamentos-pedagogia',
    tipo: 'definicion',
    frente: '¿Qué es el deporte?',
    reverso:
      'Actividad física reglada, institucionalizada y de carácter competitivo. Las tres condiciones importan: sin reglas y sin institución que las sostenga hay actividad física, pero no deporte.',
  },
  {
    id: 'B1-T02',
    modulo: 'b1-fundamentos-pedagogia',
    tipo: 'definicion',
    frente: '¿Qué es el entrenamiento deportivo y con qué se confunde?',
    reverso:
      'Proceso pedagógico, planificado y sistemático que aplica cargas para provocar adaptaciones. Se confunde con la metodología del entrenamiento, que no es el proceso sino la disciplina que lo estudia.',
  },
  {
    id: 'B1-T03',
    modulo: 'b1-fundamentos-pedagogia',
    tipo: 'definicion',
    frente: '¿Qué es la entrenabilidad?',
    reverso:
      'El grado en que un deportista responde a un estímulo de entrenamiento. No es su nivel: un principiante tiene poca capacidad y MUCHA entrenabilidad; un élite tiene mucha capacidad y POCA entrenabilidad.',
  },
  {
    id: 'B1-T04',
    modulo: 'b1-fundamentos-pedagogia',
    tipo: 'dato',
    frente: '¿De qué depende la entrenabilidad?',
    reverso:
      'De la edad y el momento madurativo, del nivel de partida, de la carga genética y del estado de salud y descanso. Por eso dos deportistas con el mismo plan no progresan igual.',
  },
  {
    id: 'B1-T05',
    modulo: 'b1-fundamentos-pedagogia',
    tipo: 'clasificacion',
    frente: 'Las cuatro manifestaciones del deporte',
    reverso:
      'Vital (movimiento y juego, ligado a la salud), físico (la condición: fuerza, resistencia, velocidad, flexibilidad), técnico (el gesto, la ejecución) y táctico (la decisión ante el adversario).',
  },
  {
    id: 'B1-T06',
    modulo: 'b1-fundamentos-pedagogia',
    tipo: 'definicion',
    frente: 'Técnica y táctica: ¿cómo se separan?',
    reverso:
      'La técnica responde a CÓMO se ejecuta el movimiento; la táctica, a QUÉ se decide hacer. Ejecutar de forma impecable un pase al defensa mejor colocado es un problema táctico, no técnico.',
  },
  {
    id: 'B1-T07',
    modulo: 'b1-fundamentos-pedagogia',
    tipo: 'clasificacion',
    frente: 'Capacidades condicionales y coordinativas',
    reverso:
      'Condicionales: fuerza, resistencia, velocidad y flexibilidad; dependen del músculo y del metabolismo. Coordinativas: equilibrio, ritmo, orientación, reacción, diferenciación, acoplamiento y adaptación; dependen del sistema nervioso.',
  },
  {
    id: 'B1-T08',
    modulo: 'b1-fundamentos-pedagogia',
    tipo: 'dato',
    frente: '¿Por qué las capacidades coordinativas se trabajan en la infancia?',
    reverso:
      'Porque dependen del sistema nervioso, que madura antes que la estructura muscular: se ganan pronto y se conservan casi toda la vida. Lo que no se coordina entre los 7 y los 12 años cuesta mucho más después.',
  },
  {
    id: 'B1-T09',
    modulo: 'b1-fundamentos-pedagogia',
    tipo: 'formula',
    frente: 'El ciclo de los cinco fundamentos específicos, en orden',
    reverso:
      'Carga → fatiga → recuperación → adaptación → forma deportiva. Si se rompe un eslabón no hay mejora: sin carga no hay estímulo y sin recuperación no hay adaptación.',
  },
  {
    id: 'B1-T10',
    modulo: 'b1-fundamentos-pedagogia',
    tipo: 'definicion',
    frente: '¿Qué es la fatiga y por qué no es un fallo del plan?',
    reverso:
      'El descenso transitorio del rendimiento que provoca la carga. Es la prueba de que el estímulo llegó: una sesión que no fatiga en absoluto no ha aplicado carga suficiente para producir adaptación.',
  },
  {
    id: 'B1-T11',
    modulo: 'b1-fundamentos-pedagogia',
    tipo: 'definicion',
    frente: '¿Qué es la adaptación y dónde ocurre la mejora?',
    reverso:
      'El cambio estable del organismo en respuesta a cargas repetidas, específico del estímulo aplicado. La mejora ocurre durante la recuperación, no durante la sesión: entrenar es aplicar el estímulo, adaptarse es descansar.',
  },
  {
    id: 'B1-T12',
    modulo: 'b1-fundamentos-pedagogia',
    tipo: 'definicion',
    frente: '¿Qué es la forma deportiva y qué la hace especial?',
    reverso:
      'El estado de disposición óptima para rendir. Es TEMPORAL: se construye, se alcanza y se pierde, y no puede sostenerse todo el año. Esa caducidad es la razón de que exista la planificación.',
  },
  {
    id: 'B1-T13',
    modulo: 'b1-fundamentos-pedagogia',
    tipo: 'clasificacion',
    frente: 'Las tres clases de entrenador y su efecto',
    reverso:
      'Autocrático: decide todo, produce obediencia y poca autonomía. Democrático: decide con el grupo y explica el porqué, produce adherencia y responsabilidad. Permisivo: deja hacer, sin objetivos claros el progreso se detiene.',
  },
  {
    id: 'B1-T14',
    modulo: 'b1-fundamentos-pedagogia',
    tipo: 'definicion',
    frente: '¿Qué papel tiene la competición en el entrenamiento?',
    reverso:
      'Además de ser el fin, es medio de entrenamiento y herramienta de control: aplica una carga que no se reproduce en sesión y mide el estado real del deportista frente a un adversario.',
  },
  {
    id: 'B1-T15',
    modulo: 'b1-fundamentos-pedagogia',
    tipo: 'dato',
    frente: 'Ley 2210: fecha, niveles y requisitos',
    reverso:
      'Sancionada el 23 de mayo de 2022. Fija tres niveles de ejercicio —formación, perfeccionamiento y altos logros— y exige ser mayor de edad, acreditar al menos doce meses de experiencia y aprobar la evaluación de idoneidad en la categoría correspondiente.',
  },
];
