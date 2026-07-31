// content/tarjetas/a3-tejidos-organos-sistemas.ts
// A3 · Tejidos, órganos y sistemas. 15 tarjetas.
// El peso del mazo está donde lo tiene el examen: las tres células del hueso y
// las piezas de la articulación sinovial, con las dos confusiones que caen
// siempre —tendón contra ligamento y bursa contra menisco—.
import type { Tarjeta } from '@/lib/tipos';

export const TARJETAS_MODULO: Tarjeta[] = [
  {
    id: 'A3-T01',
    modulo: 'a3-tejidos-organos-sistemas',
    tipo: 'clasificacion',
    frente: 'Los cuatro tejidos y su función',
    reverso:
      'Epitelial: reviste, protege y secreta. Conjuntivo: une, sostiene, transporta y almacena. Muscular: se contrae y genera movimiento. Nervioso: recibe, procesa y transmite información.',
  },
  {
    id: 'A3-T02',
    modulo: 'a3-tejidos-organos-sistemas',
    tipo: 'dato',
    frente: '¿Qué estructuras pertenecen al tejido conjuntivo?',
    reverso:
      'Hueso, cartílago, tendón, ligamento, grasa y SANGRE. La sangre cumple la definición aunque sea líquida: células dispersas en una matriz extracelular abundante, que en su caso es el plasma.',
  },
  {
    id: 'A3-T03',
    modulo: 'a3-tejidos-organos-sistemas',
    tipo: 'definicion',
    frente: 'Osteoblasto, osteocito y osteoclasto',
    reverso:
      'Osteoblasto: FORMA hueso nuevo, sintetiza la matriz (blasto = build). Osteocito: MANTIENE el tejido y detecta la carga mecánica; es el osteoblasto atrapado en la matriz que él fabricó. Osteoclasto: REABSORBE hueso, degrada la matriz; es multinucleado.',
  },
  {
    id: 'A3-T04',
    modulo: 'a3-tejidos-organos-sistemas',
    tipo: 'dato',
    frente: '¿Qué es la remodelación ósea y qué la desplaza?',
    reverso:
      'El equilibrio permanente entre lo que forman los osteoblastos y lo que reabsorben los osteoclastos. La CARGA MECÁNICA lo desplaza hacia la formación: el trabajo de fuerza y los impactos controlados aumentan la densidad ósea, y la inmovilización la reduce.',
  },
  {
    id: 'A3-T05',
    modulo: 'a3-tejidos-organos-sistemas',
    tipo: 'clasificacion',
    frente: 'Hueso compacto y hueso esponjoso',
    reverso:
      'Compacto o cortical: denso, organizado en osteonas, en la diáfisis de los huesos largos y como capa externa de todos. Esponjoso o trabecular: red de trabéculas con huecos, en epífisis, huesos cortos y planos. Es el que aloja la médula ósea roja.',
  },
  {
    id: 'A3-T06',
    modulo: 'a3-tejidos-organos-sistemas',
    tipo: 'definicion',
    frente: '¿Qué es la hematopoyesis y dónde ocurre?',
    reverso:
      'La formación de las células de la sangre —glóbulos rojos, glóbulos blancos y plaquetas—. Ocurre en la médula ósea roja, alojada en el hueso esponjoso. Un hueso sostiene, protege, fabrica sangre y almacena calcio y fósforo.',
  },
  {
    id: 'A3-T07',
    modulo: 'a3-tejidos-organos-sistemas',
    tipo: 'dato',
    frente: '¿Por qué las trabéculas del hueso esponjoso no están puestas al azar?',
    reverso:
      'Porque se orientan siguiendo las líneas de fuerza que atraviesan el hueso. Es la remodelación vista a escala de estructura: el hueso construye material donde lo necesita y lo retira donde no.',
  },
  {
    id: 'A3-T08',
    modulo: 'a3-tejidos-organos-sistemas',
    tipo: 'clasificacion',
    frente: 'Las piezas de una articulación sinovial',
    reverso:
      'Cartílago articular sobre las superficies óseas · cápsula fibrosa que la cierra · membrana sinovial que produce el líquido · líquido sinovial que lubrica y nutre · ligamentos que dan estabilidad pasiva · meniscos que mejoran el encaje · bursas que reducen el roce.',
  },
  {
    id: 'A3-T09',
    modulo: 'a3-tejidos-organos-sistemas',
    tipo: 'dato',
    frente: 'Tendón y ligamento: ¿qué une cada uno?',
    reverso:
      'El TENDÓN une músculo con hueso: transmite la fuerza de la contracción. El LIGAMENTO une hueso con hueso: aporta estabilidad pasiva a la articulación.',
  },
  {
    id: 'A3-T10',
    modulo: 'a3-tejidos-organos-sistemas',
    tipo: 'definicion',
    frente: 'Bursa y menisco: ¿en qué se diferencian?',
    reverso:
      'La BURSA es un saco con líquido sinovial que reduce el roce donde un tendón pasa por encima de un hueso. El MENISCO es fibrocartílago macizo que mejora la congruencia entre superficies y reparte carga. Si el enunciado dice «saco con líquido sinovial», es bursa.',
  },
  {
    id: 'A3-T11',
    modulo: 'a3-tejidos-organos-sistemas',
    tipo: 'dato',
    frente: '¿Qué hace exactamente el cartílago articular?',
    reverso:
      'Ofrece una superficie de fricción bajísima y REPARTE la carga sobre un área mayor. Amortiguar el impacto es sobre todo trabajo del hueso subcondral que hay debajo y del trabajo excéntrico de la musculatura que frena el movimiento: por eso una musculatura fuerte protege la articulación.',
  },
  {
    id: 'A3-T12',
    modulo: 'a3-tejidos-organos-sistemas',
    tipo: 'dato',
    frente: '¿Cómo se nutre el cartílago articular?',
    reverso:
      'Por difusión desde el líquido sinovial: NO tiene vasos sanguíneos. Y esa difusión depende del movimiento, que lo comprime y descomprime como una esponja. De ahí que la inmovilización prolongada lo perjudique y el movimiento suave sea parte del tratamiento.',
  },
  {
    id: 'A3-T13',
    modulo: 'a3-tejidos-organos-sistemas',
    tipo: 'clasificacion',
    frente: 'Los tres tipos de articulación por movilidad',
    reverso:
      'Sinartrosis: inmóviles, como las suturas del cráneo. Anfiartrosis: semimóviles, como la sínfisis del pubis y las uniones entre vértebras. Diartrosis: móviles, que son las sinoviales — hombro, cadera, rodilla, codo.',
  },
  {
    id: 'A3-T14',
    modulo: 'a3-tejidos-organos-sistemas',
    tipo: 'clasificacion',
    frente: 'Los once sistemas del cuerpo humano',
    reverso:
      'Óseo · muscular · nervioso · endocrino · cardiovascular · respiratorio · digestivo · urinario · reproductor · tegumentario (piel, pelo y uñas) · linfático (vasos, ganglios, bazo y timo).',
  },
  {
    id: 'A3-T15',
    modulo: 'a3-tejidos-organos-sistemas',
    tipo: 'dato',
    frente: '¿Por qué el páncreas aparece en dos sistemas?',
    reverso:
      'Porque tiene una parte EXOCRINA que vierte enzimas al intestino, función digestiva, y una parte ENDOCRINA que produce insulina y glucagón, función hormonal. Es el ejemplo clásico de que un órgano puede pertenecer a dos sistemas.',
  },
];
