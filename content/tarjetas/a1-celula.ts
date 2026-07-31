// content/tarjetas/a1-celula.ts
// A1 · Célula: estructura, tipos y división. 15 tarjetas.
// Tres bloques: la división procariota/eucariota con los organismos que caen en
// cada lado —donde está el error más repetido del módulo—, la lista de
// orgánulos con su función, y las etapas de la mitosis frente a la meiosis.
import type { Tarjeta } from '@/lib/tipos';

export const TARJETAS_MODULO: Tarjeta[] = [
  {
    id: 'A1-T01',
    modulo: 'a1-celula',
    tipo: 'clasificacion',
    frente: 'Célula procariota y célula eucariota: las cuatro diferencias',
    reverso:
      'Procariota: sin núcleo (ADN libre en el citoplasma), sin orgánulos con membrana, ADN circular sin histonas, 1–5 µm. Eucariota: con núcleo y envoltura nuclear, con orgánulos membranosos, ADN lineal en cromosomas con histonas, 10–100 µm.',
  },
  {
    id: 'A1-T02',
    modulo: 'a1-celula',
    tipo: 'dato',
    frente: '¿Qué organismos son procariotas?',
    reverso:
      'Solo BACTERIAS y ARQUEAS. Los protozoos son eucariotas y los hongos también, incluida la levadura. «Alga» no es un grupo biológico: las algas verdes y pardas son eucariotas, y las cianobacterias (antiguas algas verdeazuladas) son bacterias, o sea procariotas.',
  },
  {
    id: 'A1-T03',
    modulo: 'a1-celula',
    tipo: 'definicion',
    frente: '¿Qué es un orgánulo?',
    reverso:
      'Una estructura especializada del interior celular que cumple una función concreta. Casi todos están delimitados por membrana; el ribosoma es la excepción notable, porque no la tiene.',
  },
  {
    id: 'A1-T04',
    modulo: 'a1-celula',
    tipo: 'dato',
    frente: 'Mitocondria: función y tres rasgos que la identifican',
    reverso:
      'Realiza la respiración celular y produce ATP. Tiene doble membrana, crestas en la interna y ADN propio. Es el orgánulo que falta por completo en las células procariotas.',
  },
  {
    id: 'A1-T05',
    modulo: 'a1-celula',
    tipo: 'clasificacion',
    frente: 'Retículo endoplasmático rugoso y liso',
    reverso:
      'Rugoso: lleva ribosomas adheridos y procesa proteínas. Liso: sintetiza lípidos, detoxifica y almacena calcio. En la fibra muscular el liso se llama retículo sarcoplásmico, y su calcio es el que dispara la contracción.',
  },
  {
    id: 'A1-T06',
    modulo: 'a1-celula',
    tipo: 'dato',
    frente: 'Aparato de Golgi y lisosoma: ¿qué hace cada uno?',
    reverso:
      'Golgi: modifica, empaqueta y distribuye lo que llega del retículo, y forma vesículas. Lisosoma: contiene enzimas digestivas que degradan material celular. El Golgi envía, el lisosoma destruye.',
  },
  {
    id: 'A1-T07',
    modulo: 'a1-celula',
    tipo: 'dato',
    frente: '¿Qué orgánulo no tiene membrana?',
    reverso:
      'El ribosoma. Es el encargado de la síntesis de proteínas y puede estar libre en el citoplasma o adherido al retículo endoplasmático rugoso. Los fabrica el nucléolo.',
  },
  {
    id: 'A1-T08',
    modulo: 'a1-celula',
    tipo: 'clasificacion',
    frente: '¿Qué tiene la célula vegetal que no tiene la animal?',
    reverso:
      'Tres cosas: pared celular de celulosa, cloroplastos y una vacuola central grande. Tienen sentido juntas: la planta no se mueve, así que necesita sostén rígido, fábrica de alimento y depósito de agua.',
  },
  {
    id: 'A1-T09',
    modulo: 'a1-celula',
    tipo: 'clasificacion',
    frente: '¿Qué tiene la célula animal que no tiene la vegetal?',
    reverso:
      'Centriolos, ausentes en las plantas superiores, y lisosomas como orgánulo característico: en la célula vegetal la función digestiva la asume la vacuola.',
  },
  {
    id: 'A1-T10',
    modulo: 'a1-celula',
    tipo: 'formula',
    frente: 'Las cuatro etapas de la mitosis, en orden',
    reverso:
      'Profase → metafase → anafase → telofase (P-M-A-T). Después llega la citocinesis, que reparte el citoplasma y es un proceso aparte de la mitosis.',
  },
  {
    id: 'A1-T11',
    modulo: 'a1-celula',
    tipo: 'dato',
    frente: '¿Qué ocurre en cada etapa de la mitosis?',
    reverso:
      'Profase: la cromatina se condensa, desaparece la envoltura nuclear y se forma el huso. Metafase: los cromosomas se alinean en el plano ecuatorial. Anafase: las cromátidas hermanas se separan hacia los polos. Telofase: se reconstruye la envoltura nuclear y los cromosomas se descondensan.',
  },
  {
    id: 'A1-T12',
    modulo: 'a1-celula',
    tipo: 'dato',
    frente: '¿Qué pasa en la interfase?',
    reverso:
      'No es una pausa: la célula crece y DUPLICA SU ADN antes de dividirse. Sin interfase no habría material genético que repartir entre las dos células hijas.',
  },
  {
    id: 'A1-T13',
    modulo: 'a1-celula',
    tipo: 'clasificacion',
    frente: 'Mitosis y meiosis: la comparación completa',
    reverso:
      'Mitosis: una división, 2 células hijas, dotación igual a la madre, sin variabilidad, en células somáticas, para crecer y reparar. Meiosis: dos divisiones, 4 células hijas, la mitad de cromosomas (haploides), con variabilidad por entrecruzamiento y reparto al azar, en células germinales, para formar gametos.',
  },
  {
    id: 'A1-T14',
    modulo: 'a1-celula',
    tipo: 'dato',
    frente: '¿Por qué le importa la mitosis a un entrenador?',
    reverso:
      'Porque es la que repara. El daño muscular de una sesión de trabajo excéntrico se resuelve con células satélite que se dividen por mitosis y se fusionan con la fibra dañada. Sin ese proceso no habría adaptación, solo daño acumulado.',
  },
  {
    id: 'A1-T15',
    modulo: 'a1-celula',
    tipo: 'definicion',
    frente: 'Tipos celulares con nombre propio, y qué NO es una célula',
    reverso:
      'La célula muscular es la fibra muscular o miocito; el SARCÓMERO no es una célula, es su unidad contráctil. La célula pulmonar es el neumocito; el ALVÉOLO tampoco, es la estructura que los neumocitos tapizan. La del hueso es el osteocito y la del sistema nervioso, la neurona.',
  },
];
