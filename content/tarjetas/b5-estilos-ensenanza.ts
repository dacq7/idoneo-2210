// content/tarjetas/b5-estilos-ensenanza.ts
// B5 · Estilos de enseñanza. 15 tarjetas.
// El eje del mazo es qué decisión cede el entrenador en cada estilo, porque es
// lo que ordena las cuatro categorías y lo que resuelve las dos confusiones
// caras: asignación de tareas frente a participación, y descubrimiento guiado
// frente a resolución de problemas.
import type { Tarjeta } from '@/lib/tipos';

export const TARJETAS_MODULO: Tarjeta[] = [
  {
    id: 'B5-T01',
    modulo: 'b5-estilos-ensenanza',
    tipo: 'clasificacion',
    frente: 'Las cuatro categorías de estilos y qué cede cada una',
    reverso:
      'Tradicionales: no ceden nada. De participación: ceden la EVALUACIÓN, corrige un compañero. De implicación cognitiva: ceden la RESPUESTA, el deportista la busca. De organización: ceden el RITMO y el itinerario.',
  },
  {
    id: 'B5-T02',
    modulo: 'b5-estilos-ensenanza',
    tipo: 'definicion',
    frente: 'Mando directo',
    reverso:
      'El entrenador decide todo: qué, cómo, cuándo se empieza, a qué ritmo y cuándo se para. La ejecución es simultánea y a su señal. El deportista solo ejecuta. Máximo control, mínima autonomía.',
  },
  {
    id: 'B5-T03',
    modulo: 'b5-estilos-ensenanza',
    tipo: 'definicion',
    frente: 'Mando directo modificado',
    reverso:
      'Igual que el mando directo, pero desaparece la señal de ejecución conjunta: cada deportista trabaja a su ritmo dentro de lo prescrito. Sigue siendo un estilo tradicional.',
  },
  {
    id: 'B5-T04',
    modulo: 'b5-estilos-ensenanza',
    tipo: 'definicion',
    frente: 'Asignación de tareas',
    reverso:
      'El entrenador decide QUÉ se hace y con qué criterios; el deportista decide cuándo empieza, a qué ritmo y cómo distribuye las repeticiones. Es la primera cesión real de decisiones, y sigue en la familia tradicional.',
  },
  {
    id: 'B5-T05',
    modulo: 'b5-estilos-ensenanza',
    tipo: 'dato',
    frente: '¿Qué separa la asignación de tareas de los estilos de participación?',
    reverso:
      'QUIÉN CORRIGE. En la asignación de tareas el deportista gestiona su ritmo, pero el feedback sigue viniendo del entrenador. En los de participación lo da un compañero. Ceder el ritmo no es ceder la evaluación.',
  },
  {
    id: 'B5-T06',
    modulo: 'b5-estilos-ensenanza',
    tipo: 'definicion',
    frente: 'Enseñanza recíproca',
    reverso:
      'Se trabaja por parejas: uno ejecuta y el otro observa y corrige apoyado en una ficha de criterios. El entrenador no corrige al ejecutante, corrige al observador.',
  },
  {
    id: 'B5-T07',
    modulo: 'b5-estilos-ensenanza',
    tipo: 'dato',
    frente: '¿Por qué la ficha de criterios no es opcional en la enseñanza recíproca?',
    reverso:
      'Porque sin ella el observador no sabe qué mirar y su corrección se convierte en una opinión. La ficha le dice qué tres cosas debe observar. No es burocracia: es el estilo.',
  },
  {
    id: 'B5-T08',
    modulo: 'b5-estilos-ensenanza',
    tipo: 'definicion',
    frente: 'Grupos reducidos',
    reverso:
      'La lógica de la enseñanza recíproca con más roles repartidos: ejecutante, observador, anotador y a veces responsable de material. Permite trabajar con grupos mayores que la pareja.',
  },
  {
    id: 'B5-T09',
    modulo: 'b5-estilos-ensenanza',
    tipo: 'definicion',
    frente: 'Microenseñanza',
    reverso:
      'El entrenador informa a un pequeño grupo de alumnos-monitores y cada uno enseña a su subgrupo. Es el estilo que más cede: no delega solo la corrección, delega la ENSEÑANZA.',
  },
  {
    id: 'B5-T10',
    modulo: 'b5-estilos-ensenanza',
    tipo: 'definicion',
    frente: 'Descubrimiento guiado',
    reverso:
      'El entrenador no da la respuesta: formula preguntas encadenadas que conducen a una solución concreta que él conoce de antemano. Si el deportista se desvía, la siguiente pregunta lo reorienta. Hay UNA respuesta buscada.',
  },
  {
    id: 'B5-T11',
    modulo: 'b5-estilos-ensenanza',
    tipo: 'definicion',
    frente: 'Resolución de problemas',
    reverso:
      'Se plantea un problema abierto y no se dirige la búsqueda: varias soluciones son válidas. «Encuentra tres formas de superar a un defensor que te espera de frente». El entrenador no reorienta, acompaña.',
  },
  {
    id: 'B5-T12',
    modulo: 'b5-estilos-ensenanza',
    tipo: 'clasificacion',
    frente: 'Descubrimiento guiado y resolución de problemas: ¿en qué se separan?',
    reverso:
      'En si hay una respuesta correcta. El descubrimiento guiado busca UNA solución concreta que el entrenador ya conoce; la resolución de problemas admite VARIAS y ninguna estaba decidida de antemano.',
  },
  {
    id: 'B5-T13',
    modulo: 'b5-estilos-ensenanza',
    tipo: 'definicion',
    frente: 'Enseñanza modular',
    reverso:
      'El contenido se divide en módulos con sus criterios de superación y el deportista avanza según su nivel y su ritmo, no según el calendario del grupo. Puede haber varios módulos abiertos a la vez en la misma sesión.',
  },
  {
    id: 'B5-T14',
    modulo: 'b5-estilos-ensenanza',
    tipo: 'clasificacion',
    frente: '¿Cuándo conviene cada estilo?',
    reverso:
      'Riesgo en el contenido o grupo muy numeroso → mando directo o asignación de tareas. Que aprendan a observar y corregir → recíproca o grupos reducidos. Objetivo de comprender → descubrimiento guiado o resolución de problemas. Grupo heterogéneo → enseñanza modular.',
  },
  {
    id: 'B5-T15',
    modulo: 'b5-estilos-ensenanza',
    tipo: 'dato',
    frente: '¿Hay un estilo mejor que los demás?',
    reverso:
      'No en abstracto. El mando directo tiene mala fama y es justo lo que hay que usar cuando un error de ejecución termina en lesión. El error no es usarlo: es usarlo SIEMPRE, incluido el día en que el objetivo era comprender.',
  },
];
