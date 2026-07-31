// content/tarjetas/b4-componentes-didacticos.ts
// B4 · Componentes didácticos y principios de enseñanza. 15 tarjetas.
// Dos ejes: la escala objetivo → metodología → método → tarea, que el examen
// cruza a propósito, y los cinco elementos de la acción motora con la fórmula
// de densidad, que es lo único cuantitativo del módulo.
import type { Tarjeta } from '@/lib/tipos';

export const TARJETAS_MODULO: Tarjeta[] = [
  {
    id: 'B4-T01',
    modulo: 'b4-componentes-didacticos',
    tipo: 'definicion',
    frente: '¿Qué es la didáctica?',
    reverso:
      'La rama de la pedagogía que estudia el proceso de enseñanza y aprendizaje. No es un método ni un conjunto de métodos: es la disciplina que estudia cómo se enseña.',
  },
  {
    id: 'B4-T02',
    modulo: 'b4-componentes-didacticos',
    tipo: 'clasificacion',
    frente: 'La escala: objetivo, metodología, método y tarea',
    reverso:
      'Objetivo: para qué. Metodología: qué caminos hay y cuál conviene. Método: el camino concreto que se recorre (global, analítico, mixto). Tarea: qué hace el deportista ahora mismo. Siempre en ese orden, de lo abstracto a lo concreto.',
  },
  {
    id: 'B4-T03',
    modulo: 'b4-componentes-didacticos',
    tipo: 'definicion',
    frente: '¿Qué es un método?',
    reverso:
      'El camino concreto, el procedimiento ordenado que se aplica para alcanzar el objetivo. La metodología es el conjunto de métodos y el criterio para elegir entre ellos; el método es el que se escoge.',
  },
  {
    id: 'B4-T04',
    modulo: 'b4-componentes-didacticos',
    tipo: 'definicion',
    frente: '¿Qué necesita una tarea deportiva bien planteada?',
    reverso:
      'Cuatro cosas: un objetivo claro, un contenido, una organización (espacio, material, agrupamiento y tiempo) y unos criterios de éxito que digan cuándo está bien hecha. Si no puede justificarse por el objetivo, sobra.',
  },
  {
    id: 'B4-T05',
    modulo: 'b4-componentes-didacticos',
    tipo: 'clasificacion',
    frente: 'Tareas cerradas y tareas abiertas',
    reverso:
      'Cerradas: el entorno es estable y predecible, el gesto tiende a una solución única (lanzamiento de peso, salto de trampolín). Abiertas: el entorno cambia y hay que decidir (un regate, una recepción de saque).',
  },
  {
    id: 'B4-T06',
    modulo: 'b4-componentes-didacticos',
    tipo: 'formula',
    frente: 'Las cinco fases del proceso, en orden',
    reverso:
      'Planificación → programación → ejecución → control → evaluación. Cada fase produce el material con el que trabaja la siguiente.',
  },
  {
    id: 'B4-T07',
    modulo: 'b4-componentes-didacticos',
    tipo: 'dato',
    frente: 'Control y evaluación: ¿en qué se diferencian?',
    reverso:
      'Controlar es MEDIR: recoger el dato mientras el proceso corre (tiempos, pulso, tonelaje, sensación). Evaluar es JUZGAR: comparar ese dato con el objetivo y decidir si sirvió. Datos sin contrastar son registro, no información.',
  },
  {
    id: 'B4-T08',
    modulo: 'b4-componentes-didacticos',
    tipo: 'clasificacion',
    frente: 'Los cinco elementos de la acción motora',
    reverso:
      'Volumen (cantidad total de trabajo) · intensidad (esfuerzo por unidad de tiempo) · frecuencia (sesiones por semana) · duración (cuánto se prolonga el estímulo) · densidad (relación entre trabajo y descanso).',
  },
  {
    id: 'B4-T09',
    modulo: 'b4-componentes-didacticos',
    tipo: 'formula',
    frente: '¿Cómo se calcula la densidad?',
    reverso:
      'Densidad = tiempo de trabajo / tiempo total (trabajo + pausa). Ejemplo: 40 s de trabajo con 20 s de pausa → 40/60 = 0,67, es decir 67 %. Bajar la pausa a 10 s la sube a 0,80.',
  },
  {
    id: 'B4-T10',
    modulo: 'b4-componentes-didacticos',
    tipo: 'dato',
    frente: 'Volumen y duración: ¿por qué no son lo mismo?',
    reverso:
      'La duración es cuánto dura UN estímulo; el volumen es cuánto trabajo hay EN TOTAL. Diez series de un minuto y una serie de diez minutos tienen el mismo volumen, duraciones muy distintas y no producen la misma adaptación.',
  },
  {
    id: 'B4-T11',
    modulo: 'b4-componentes-didacticos',
    tipo: 'dato',
    frente: '¿Qué relación hay entre volumen e intensidad?',
    reverso:
      'Son inversamente proporcionales: se puede hacer mucho o se puede hacer fuerte, no las dos cosas a la vez. Subir la densidad es la tercera vía: más exigencia sin tocar el peso ni la cantidad, solo recortando el descanso.',
  },
  {
    id: 'B4-T12',
    modulo: 'b4-componentes-didacticos',
    tipo: 'clasificacion',
    frente: 'Los nueve principios de enseñanza (primeros cinco)',
    reverso:
      'De lo fácil a lo difícil · de lo simple a lo complejo · de lo conocido a lo desconocido · de lo general a lo específico · de lo poco a lo mucho, con el volumen creciendo antes que la intensidad.',
  },
  {
    id: 'B4-T13',
    modulo: 'b4-componentes-didacticos',
    tipo: 'clasificacion',
    frente: 'Los nueve principios de enseñanza (últimos cuatro)',
    reverso:
      'De lo lento a lo rápido · de lo global a lo analítico y de nuevo a lo global · individualización de la enseñanza · retroalimentación permanente sobre la ejecución.',
  },
  {
    id: 'B4-T14',
    modulo: 'b4-componentes-didacticos',
    tipo: 'dato',
    frente: '¿Qué parte del principio «de lo global a lo analítico» se suele olvidar?',
    reverso:
      'La vuelta a lo global. Se ve el gesto completo, se corrige la parte que falla y HAY QUE REINTEGRARLO al conjunto. Sin ese tercer paso el deportista ejecuta bien en el ejercicio y mal en el partido.',
  },
  {
    id: 'B4-T15',
    modulo: 'b4-componentes-didacticos',
    tipo: 'definicion',
    frente: 'Planificación y programación: ¿qué decide cada una?',
    reverso:
      'La planificación decide los objetivos y el orden en que se buscan; es la decisión grande, el destino. La programación los concreta en contenidos, sesiones y cargas; es la ruta. Primero el destino, después el camino.',
  },
];
