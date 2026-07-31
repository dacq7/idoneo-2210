// content/tarjetas/c9-dopaje.ts
// C9 · Prevención y control del dopaje. 15 tarjetas.
// Cubren los 3 datos duros del módulo: DD-102 (las 3 estrategias del programa),
// DD-103 (las 11 infracciones del Artículo 2) y DD-104 (los tres
// incumplimientos de localización en doce meses).
import type { Tarjeta } from '@/lib/tipos';

export const TARJETAS_MODULO: Tarjeta[] = [
  {
    id: 'C9-T01',
    modulo: 'c9-dopaje',
    tipo: 'clasificacion',
    frente: 'Las 3 estrategias del programa antidopaje',
    reverso:
      'Educación · disuasión · detección. En ese orden de prioridad: la detección es el último recurso, no el primero. La sanción no es una estrategia, es una consecuencia.',
  },
  {
    id: 'C9-T02',
    modulo: 'c9-dopaje',
    tipo: 'dato',
    frente: '¿Cuántas infracciones recoge el Artículo 2?',
    reverso:
      '11 infracciones. Y solo dos de ellas —presencia (2.1) y uso (2.2)— dependen de un resultado analítico. Las otras nueve son conductas: se puede acabar sancionado sin haber dado positivo nunca.',
  },
  {
    id: 'C9-T03',
    modulo: 'c9-dopaje',
    tipo: 'clasificacion',
    frente: 'Las 11 infracciones del Artículo 2',
    reverso:
      '2.1 Presencia · 2.2 Uso o intento · 2.3 Evasión, negativa o incomparecencia · 2.4 Incumplimiento de la localización · 2.5 Falsificación · 2.6 Posesión · 2.7 Tráfico · 2.8 Administración · 2.9 Complicidad · 2.10 Asociación prohibida · 2.11 Represalias contra quien denuncia.',
  },
  {
    id: 'C9-T04',
    modulo: 'c9-dopaje',
    tipo: 'definicion',
    frente: 'El principio de responsabilidad estricta',
    reverso:
      'El deportista responde por cualquier sustancia prohibida hallada en su muestra, sin que haga falta demostrar intención, culpa ni negligencia. Es responsable de todo lo que entra en su cuerpo, incluido lo que le dieron sin decírselo.',
  },
  {
    id: 'C9-T05',
    modulo: 'c9-dopaje',
    tipo: 'definicion',
    frente: '¿Qué papel juega la intención bajo responsabilidad estricta?',
    reverso:
      'Puede influir en la DURACIÓN de la sanción, nunca en que exista la infracción. Primero se establece que hay infracción; después se discute cuánto se sanciona, y ahí sí cabe alegar ausencia de culpa o negligencia significativa.',
  },
  {
    id: 'C9-T06',
    modulo: 'c9-dopaje',
    tipo: 'dato',
    frente: 'Localización fallida: ¿cuándo es infracción?',
    reverso:
      'Con cualquier combinación de TRES incumplimientos —controles fallidos o declaraciones de paradero no presentadas— dentro de un período de DOCE MESES. La ventana es móvil, no coincide con el año natural. Un fallo aislado se registra pero no sanciona.',
  },
  {
    id: 'C9-T07',
    modulo: 'c9-dopaje',
    tipo: 'definicion',
    frente: '¿Qué es la asociación prohibida (2.10)?',
    reverso:
      'Colaborar en el ámbito deportivo con personal de apoyo —entrenadores, médicos, preparadores— que cumple sanción por dopaje. Apunta a quién te asesora, no a quién comparte pista contigo, y da igual que la relación sea remunerada o no.',
  },
  {
    id: 'C9-T08',
    modulo: 'c9-dopaje',
    tipo: 'clasificacion',
    frente: 'AMA, TAD, AUT y Lista: cuatro funciones distintas',
    reverso:
      'AMA/WADA: elabora el Código y la Lista, y armoniza la lucha antidopaje. TAD/TAS: resuelve en última instancia los recursos. AUT: autoriza usar una sustancia prohibida por necesidad médica. Lista: relación de sustancias y métodos prohibidos, revisada cada año.',
  },
  {
    id: 'C9-T09',
    modulo: 'c9-dopaje',
    tipo: 'dato',
    frente: 'Criterios para incluir una sustancia en la Lista',
    reverso:
      'Debe cumplir al menos DOS de TRES: mejora del rendimiento · riesgo para la salud · contravención del espíritu deportivo. Por eso hay sustancias prohibidas que no mejoran nada pero enmascaran a otras.',
  },
  {
    id: 'C9-T10',
    modulo: 'c9-dopaje',
    tipo: 'definicion',
    frente: '¿Para qué sirve la muestra B?',
    reverso:
      'La muestra se reparte en dos frascos sellados en el momento de la toma. Si la A da resultado adverso, el deportista puede solicitar el análisis de la B. Si la B no confirma a la A, no se considera cometida la infracción por presencia.',
  },
  {
    id: 'C9-T11',
    modulo: 'c9-dopaje',
    tipo: 'definicion',
    frente: 'Artículo 3: ¿sobre quién recae la carga de la prueba?',
    reverso:
      'Sobre la organización antidopaje, que debe acreditar la infracción. Solo cuando el Código lo traslada expresamente —por ejemplo, para probar el origen de una sustancia y reducir la sanción— recae sobre el deportista. La responsabilidad estricta simplifica qué hay que probar, no quién.',
  },
  {
    id: 'C9-T12',
    modulo: 'c9-dopaje',
    tipo: 'definicion',
    frente: '¿Cuál es el estándar de prueba del Artículo 3?',
    reverso:
      'La «satisfacción confortable» del tribunal: más exigente que el balance de probabilidades y menos que la certeza penal. Cuando la carga se traslada al deportista, a él se le pide el balance de probabilidades.',
  },
  {
    id: 'C9-T13',
    modulo: 'c9-dopaje',
    tipo: 'definicion',
    frente: '¿Qué es una autorización de uso terapéutico (AUT)?',
    reverso:
      'El permiso que habilita a usar una sustancia de la Lista por una necesidad médica acreditada. Se pide ANTES, no se justifica después: declarar el medicamento en el formulario del control no autoriza nada. Y no exime de someterse a los controles.',
  },
  {
    id: 'C9-T14',
    modulo: 'c9-dopaje',
    tipo: 'clasificacion',
    frente: 'Fases de un control antidopaje',
    reverso:
      '1) Notificación, y el deportista queda supervisado. 2) Toma de muestra y reparto en frascos A y B sellados. 3) Análisis de la A en laboratorio acreditado. 4) Notificación del resultado adverso y opción de analizar la B. 5) Expediente disciplinario y, en su caso, apelación ante el TAD.',
  },
  {
    id: 'C9-T15',
    modulo: 'c9-dopaje',
    tipo: 'definicion',
    frente: '¿Alcanza el Código al entorno del deportista?',
    reverso:
      'Sí. Entrenadores, médicos, fisioterapeutas y directivos pueden ser sancionados por tráfico, administración, complicidad o represalias. Un entrenador puede acabar sancionado sin que su deportista lo esté y sin que nadie haya dado positivo.',
  },
];
