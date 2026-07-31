// content/tarjetas/b2-principios.ts
// B2 · Principios pedagógicos, infanto-juveniles y biológicos. 15 tarjetas.
// El mazo carga las tres listas y, sobre todo, las cuatro parejas que el examen
// cruza a propósito: sobrecarga/progresión, especificidad/especialización,
// supercompensación/adaptación y retornos en disminución/reversibilidad.
import type { Tarjeta } from '@/lib/tipos';

export const TARJETAS_MODULO: Tarjeta[] = [
  {
    id: 'B2-T01',
    modulo: 'b2-principios',
    tipo: 'clasificacion',
    frente: 'Los cuatro principios pedagógicos',
    reverso:
      'Participación activa y consciente · sistematicidad (de lo simple a lo complejo, de lo conocido a lo nuevo) · accesibilidad e individualización · solidez y permanencia de lo aprendido.',
  },
  {
    id: 'B2-T02',
    modulo: 'b2-principios',
    tipo: 'definicion',
    frente: '¿Qué exige el principio de accesibilidad?',
    reverso:
      'Que la tarea esté al alcance de quien la hace, CON esfuerzo. Accesible no es fácil: si nadie falla, el ejercicio no enseña nada; si nadie lo consigue, tampoco.',
  },
  {
    id: 'B2-T03',
    modulo: 'b2-principios',
    tipo: 'clasificacion',
    frente: 'Los ocho principios para niños y jóvenes',
    reverso:
      'Multilateralidad antes que especialización · adecuación a la edad biológica · individualización · progresión gradual de la carga · variedad y componente lúdico · participación activa del joven · prioridad de la salud y la seguridad · continuidad y paciencia.',
  },
  {
    id: 'B2-T04',
    modulo: 'b2-principios',
    tipo: 'dato',
    frente: '¿Por qué manda la edad biológica y no la cronológica?',
    reverso:
      'Porque dos deportistas de la misma categoría pueden llevarse años de maduración. Lo que en uno es estímulo adecuado, en otro es sobrecarga. El más grande de la categoría no suele ser el mejor: suele ser el que maduró antes.',
  },
  {
    id: 'B2-T05',
    modulo: 'b2-principios',
    tipo: 'definicion',
    frente: 'Principio de sobrecarga',
    reverso:
      'El estímulo debe superar el nivel al que el organismo ya está habituado para provocar adaptación. Responde a la pregunta «cuánto hoy». Sin sobrecarga no hay estímulo y no hay mejora.',
  },
  {
    id: 'B2-T06',
    modulo: 'b2-principios',
    tipo: 'definicion',
    frente: 'Principio de progresión, y en qué se diferencia de la sobrecarga',
    reverso:
      'La carga debe aumentarse de forma gradual a lo largo del tiempo. Responde a «cuánto más y cuándo». La sobrecarga es puntual; la progresión es temporal: lo que hoy sobrecarga, en seis semanas ya no.',
  },
  {
    id: 'B2-T07',
    modulo: 'b2-principios',
    tipo: 'definicion',
    frente: 'Principio de especificidad',
    reverso:
      'Las adaptaciones responden a las características concretas del estímulo aplicado: mejoras en lo que entrenas y en la forma en que lo entrenas. Es una ley fisiológica: se cumple quieras o no.',
  },
  {
    id: 'B2-T08',
    modulo: 'b2-principios',
    tipo: 'definicion',
    frente: 'Especialización: qué es y cuándo se aplica',
    reverso:
      'Concentrar el entrenamiento en una modalidad o prueba concreta. Es una DECISIÓN de carrera, no una ley, y se aplica después de haber desarrollado las cualidades básicas. Especializar pronto es el error clásico de la formación.',
  },
  {
    id: 'B2-T09',
    modulo: 'b2-principios',
    tipo: 'formula',
    frente: 'La secuencia de la supercompensación',
    reverso:
      'Carga → descenso por fatiga → recuperación → supercompensación → retorno al nivel inicial. El último eslabón es el que se olvida: si no llega un estímulo nuevo dentro de la ventana, lo ganado se pierde.',
  },
  {
    id: 'B2-T10',
    modulo: 'b2-principios',
    tipo: 'definicion',
    frente: '¿Qué es la supercompensación?',
    reverso:
      'El restablecimiento del organismo POR ENCIMA del nivel inicial tras el agotamiento provocado por una carga y su recuperación. Es el mecanismo que explica la mejora del rendimiento.',
  },
  {
    id: 'B2-T11',
    modulo: 'b2-principios',
    tipo: 'definicion',
    frente: 'Principio de retornos en disminución',
    reverso:
      'También llamado de rendimientos decrecientes: a medida que sube el nivel del deportista, la misma carga produce cada vez menos mejora. Es la entrenabilidad de B1 vista desde el otro lado.',
  },
  {
    id: 'B2-T12',
    modulo: 'b2-principios',
    tipo: 'definicion',
    frente: 'Principio de reversibilidad',
    reverso:
      'Lo que se gana con el entrenamiento se pierde al cesar el estímulo, y se pierde más rápido de lo que costó ganarlo. No confundir con retornos en disminución: aquel habla de cuánto cuesta mejorar, este de cuánto dura lo mejorado.',
  },
  {
    id: 'B2-T13',
    modulo: 'b2-principios',
    tipo: 'definicion',
    frente: 'Principio de multilateralidad',
    reverso:
      'Preparación multifacética, con variedad de conductas motrices, técnicas y métodos. Es especialmente pertinente en las primeras etapas de la vida deportiva y contrapesa la especialización temprana.',
  },
  {
    id: 'B2-T14',
    modulo: 'b2-principios',
    tipo: 'definicion',
    frente: 'Principio de variabilidad',
    reverso:
      'Variar los estímulos de entrenamiento para evitar el estancamiento. Es la respuesta operativa al principio de retornos en disminución: cuando la misma carga deja de rendir, se cambia el estímulo, no solo su magnitud.',
  },
  {
    id: 'B2-T15',
    modulo: 'b2-principios',
    tipo: 'clasificacion',
    frente: 'Los principios biológicos que cierran la lista',
    reverso:
      'Individualización (la carga se ajusta a cada deportista) · continuidad (el efecto exige sostenerse en el tiempo) · alternancia y recuperación (cargas y descansos ordenados; el descanso es parte del plan, no su interrupción).',
  },
];
