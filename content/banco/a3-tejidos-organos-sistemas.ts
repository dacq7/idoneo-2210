// content/banco/a3-tejidos-organos-sistemas.ts
// Bloque A · Módulo 3 — Tejidos, órganos y sistemas.
//
// 25 ítems. Reparto exigido por verificarCuotas con n = 25:
//   nivel      → 11 recuerdo (44 %) · 8 comprensión (32 %) · 6 aplicación (24 %)
//   dificultad → 6 de nivel 1 · 13 de nivel 2 · 6 de nivel 3
//   tipos      → 12 única · 4 emparejar · 3 múltiple · 2 caso · 2 ordenar · 2 V/F
//
// Sin ítems de cálculo: el módulo es anatomía descriptiva. Cuatro emparejar
// porque tiene cuatro listas cerradas —tejidos, células óseas, piezas de la
// articulación y sistemas— y es el tipo que mejor las mide.
//
// ADR-014 · los dos puntos verificados: el cartílago articular reduce fricción
// y reparte carga, pero no es el amortiguador principal de la articulación; y
// la bursa es el saco con líquido sinovial, no el menisco.
//
// Los ítems son datos literales: nunca se generan con map(), plantillas ni
// funciones auxiliares.
import type { Item } from '@/lib/tipos';

export const ITEMS: Item[] = [
  {
    id: 'A3-001',
    modulo: 'a3-tejidos-organos-sistemas',
    bloque: 'A',
    tipo: 'unica',
    nivel: 'recuerdo',
    dificultad: 1,
    enunciado: '¿Cuáles son los cuatro tejidos básicos del organismo?',
    opciones: [
      'Epitelial, conjuntivo, muscular y nervioso',
      'Óseo, cartilaginoso, muscular y adiposo, según su composición',
      'Epitelial, óseo, sanguíneo y nervioso, según su función principal',
      'Conjuntivo, muscular, glandular y linfático, según su localización',
    ],
    correcta: 0,
    explicacion:
      'Los cuatro tejidos básicos son epitelial, conjuntivo, muscular y nervioso, y todos los demás son variedades dentro de ellos. El distractor más tentador es el segundo, porque nombra cuatro tejidos que existen de verdad: óseo, cartilaginoso y adiposo son subtipos de conjuntivo, así que la lista mezcla niveles. Dato para recordar: el conjuntivo es la familia más amplia, y la sangre también está dentro.',
    referencia: 'Cartilla 1, Tema 2, Subtema 2.4 — Los cuatro tejidos',
    etiquetas: ['tejidos', 'clasificación', 'histología'],
  },
  {
    id: 'A3-002',
    modulo: 'a3-tejidos-organos-sistemas',
    bloque: 'A',
    tipo: 'unica',
    nivel: 'recuerdo',
    dificultad: 1,
    enunciado: '¿Qué célula del tejido óseo se encarga de formar hueso nuevo?',
    opciones: [
      'El osteoblasto',
      'El osteoclasto, que además es multinucleado',
      'El osteocito, que vive atrapado dentro de la matriz',
      'El condrocito, que también produce matriz mineralizada',
    ],
    correcta: 0,
    explicacion:
      'El osteoblasto sintetiza la matriz que después se mineraliza, y su nombre lo delata: blasto viene de construir. El distractor más tentador es el segundo, porque los dos nombres se parecen y hacen lo contrario: el osteoclasto reabsorbe. El osteocito es el osteoblasto que quedó atrapado en la matriz que él mismo fabricó y pasa a mantener el tejido. Dato para recordar: blasto construye, clasto rompe.',
    referencia: 'Cartilla 1, Tema 2, Subtema 2.5 — Sistema óseo y células del hueso',
    etiquetas: ['osteoblasto', 'osteoclasto', 'tejido óseo'],
  },
  {
    id: 'A3-003',
    modulo: 'a3-tejidos-organos-sistemas',
    bloque: 'A',
    tipo: 'emparejar',
    nivel: 'recuerdo',
    dificultad: 1,
    enunciado: 'Relacione cada tejido con su función principal.',
    izquierda: ['Epitelial', 'Conjuntivo', 'Muscular', 'Nervioso'],
    derecha: [
      'Reviste superficies, protege y secreta',
      'Une, sostiene, transporta y almacena',
      'Se contrae y genera movimiento',
      'Recibe, procesa y transmite información',
    ],
    pares: [
      [0, 0],
      [1, 1],
      [2, 2],
      [3, 3],
    ],
    explicacion:
      'Los cuatro se distinguen sin dificultad salvo el conjuntivo, que es el que más variedades tiene y por eso el que peor se reconoce: hueso, cartílago, tendón, grasa y sangre pertenecen a él. Su rasgo común es la abundancia de matriz extracelular entre las células, y esa matriz puede ser mineralizada, fibrosa o líquida. Dato para recordar: si hay mucha matriz entre células, es conjuntivo.',
    referencia: 'Cartilla 1, Tema 2, Subtema 2.4 — Los cuatro tejidos',
    etiquetas: ['tejidos', 'conjuntivo', 'clasificación'],
  },
  {
    id: 'A3-004',
    modulo: 'a3-tejidos-organos-sistemas',
    bloque: 'A',
    tipo: 'vf',
    nivel: 'recuerdo',
    dificultad: 1,
    enunciado: 'El tendón une un hueso con otro hueso y el ligamento une el músculo al hueso.',
    correcta: false,
    explicacion:
      'Falso: está invertido. El tendón une el músculo con el hueso y transmite la fuerza de la contracción; el ligamento une hueso con hueso y aporta estabilidad pasiva a la articulación. La confusión es constante porque los dos son tejido conjuntivo fibroso y se parecen al tacto y al microscopio. Dato para recordar: el tendón sale de un músculo, así que si en un extremo hay músculo, es tendón.',
    referencia: 'Cartilla 1, Tema 2, Subtema 2.6 — Articulaciones',
    etiquetas: ['tendón', 'ligamento', 'articulación'],
  },
  {
    id: 'A3-005',
    modulo: 'a3-tejidos-organos-sistemas',
    bloque: 'A',
    tipo: 'unica',
    nivel: 'recuerdo',
    dificultad: 1,
    enunciado: '¿Qué es la hematopoyesis?',
    opciones: [
      'La formación de las células de la sangre',
      'La reabsorción de la matriz ósea por parte de los osteoclastos',
      'La mineralización de la matriz osteoide recién sintetizada',
      'La producción del líquido sinovial por la membrana articular',
    ],
    correcta: 0,
    explicacion:
      'La hematopoyesis es la formación de glóbulos rojos, glóbulos blancos y plaquetas, y ocurre en la médula ósea roja, que se aloja en el hueso esponjoso. Los tres distractores describen procesos reales del módulo y ninguno es este: reabsorción, mineralización y secreción sinovial. El más tentador es el tercero, porque también ocurre dentro del hueso. Dato para recordar: el hueso sostiene, protege y además fabrica sangre.',
    referencia: 'Cartilla 1, Tema 2, Subtema 2.5 — Sistema óseo y células del hueso',
    etiquetas: ['hematopoyesis', 'médula ósea', 'hueso esponjoso'],
  },
  {
    id: 'A3-006',
    modulo: 'a3-tejidos-organos-sistemas',
    bloque: 'A',
    tipo: 'unica',
    nivel: 'recuerdo',
    dificultad: 1,
    enunciado: '¿Dónde se localiza principalmente el hueso esponjoso?',
    opciones: [
      'En las epífisis de los huesos largos y en los huesos cortos y planos',
      'En la diáfisis de los huesos largos, formando su pared cilíndrica',
      'En la superficie articular, justo por debajo del cartílago hialino',
      'En el periostio, la capa que recubre externamente todo el hueso',
    ],
    correcta: 0,
    explicacion:
      'El hueso esponjoso ocupa las epífisis de los huesos largos y el interior de los cortos y planos, y es el que aloja la médula ósea roja. El distractor más tentador es el segundo, que corresponde al hueso compacto: la diáfisis es un cilindro de cortical con la cavidad medular dentro. Dato para recordar: compacto en la caña, esponjoso en los extremos, y en los extremos vive la médula roja.',
    referencia: 'Cartilla 1, Tema 2, Subtema 2.5 — Sistema óseo y células del hueso',
    etiquetas: ['hueso esponjoso', 'hueso compacto', 'anatomía ósea'],
  },
  {
    id: 'A3-007',
    modulo: 'a3-tejidos-organos-sistemas',
    bloque: 'A',
    tipo: 'emparejar',
    nivel: 'recuerdo',
    dificultad: 2,
    enunciado: 'Relacione cada célula ósea con su función.',
    izquierda: ['Osteoblasto', 'Osteocito', 'Osteoclasto', 'Condrocito'],
    derecha: [
      'Sintetiza la matriz del hueso nuevo',
      'Mantiene el tejido y detecta la carga mecánica',
      'Reabsorbe la matriz ósea; es multinucleado',
      'Es la célula propia del tejido cartilaginoso',
    ],
    pares: [
      [0, 0],
      [1, 1],
      [2, 2],
      [3, 3],
    ],
    explicacion:
      'Los tres primeros nombres se cruzan porque comparten raíz, y el que más se falla es el osteocito, al que suele atribuirse la formación: forma quien construye la matriz, que es el osteoblasto, y el osteocito es ese mismo osteoblasto ya atrapado dentro, dedicado a mantener y a detectar carga. El condrocito entra en la lista para separar hueso de cartílago, que son tejidos distintos.',
    referencia: 'Cartilla 1, Tema 2, Subtema 2.5 — Sistema óseo y células del hueso',
    etiquetas: ['osteoblasto', 'osteocito', 'osteoclasto', 'clasificación'],
  },
  {
    id: 'A3-008',
    modulo: 'a3-tejidos-organos-sistemas',
    bloque: 'A',
    tipo: 'unica',
    nivel: 'recuerdo',
    dificultad: 2,
    enunciado: '¿Qué estructura produce el líquido sinovial?',
    opciones: [
      'La membrana sinovial, que tapiza el interior de la cápsula articular',
      'El cartílago articular, que lo libera al comprimirse durante el movimiento',
      'La bursa, que lo fabrica y lo distribuye hacia el interior de la articulación',
      'El menisco, cuyo fibrocartílago segrega el líquido que lubrica la rodilla',
    ],
    correcta: 0,
    explicacion:
      'El líquido sinovial lo produce la membrana sinovial, que tapiza el interior de la cápsula, y su función es lubricar y nutrir el cartílago. El distractor más tentador es el tercero, porque la bursa contiene líquido sinovial y es fácil suponer que también lo fabrica: la bursa es un saco que lo aloja para reducir el roce, no una glándula. Dato para recordar: la membrana produce, la bursa contiene.',
    referencia: 'Cartilla 1, Tema 2, Subtema 2.6 — Articulaciones',
    etiquetas: ['membrana sinovial', 'líquido sinovial', 'articulación'],
  },
  {
    id: 'A3-009',
    modulo: 'a3-tejidos-organos-sistemas',
    bloque: 'A',
    tipo: 'multiple',
    nivel: 'recuerdo',
    dificultad: 2,
    enunciado: 'Seleccione los TRES elementos que forman parte de una articulación sinovial.',
    opciones: [
      'Cápsula articular fibrosa que cierra la articulación',
      'Cartílago articular que recubre las superficies óseas',
      'Ligamentos que unen los huesos entre sí y dan estabilidad',
      'Placa motora que transmite el impulso nervioso al músculo',
      'Vasos sanguíneos que irrigan directamente el cartílago articular',
    ],
    correctas: [0, 1, 2],
    explicacion:
      'Cápsula, cartílago y ligamentos son piezas de la articulación sinovial, junto con la membrana sinovial, el líquido y, en algunas, meniscos y bursas. La placa motora pertenece a la unión entre nervio y músculo, no a la articulación. Y el quinto distractor afirma algo falso que además es clave del módulo: el cartílago no tiene vasos y se nutre por difusión desde el líquido sinovial. Dato para recordar: cartílago avascular, nutrición por movimiento.',
    referencia: 'Cartilla 1, Tema 2, Subtema 2.6 — Articulaciones',
    etiquetas: ['articulación sinovial', 'cartílago', 'ligamentos'],
  },
  {
    id: 'A3-010',
    modulo: 'a3-tejidos-organos-sistemas',
    bloque: 'A',
    tipo: 'unica',
    nivel: 'recuerdo',
    dificultad: 2,
    enunciado: '¿Qué tipo de articulación son las suturas del cráneo?',
    opciones: [
      'Sinartrosis, es decir articulaciones inmóviles',
      'Anfiartrosis, es decir articulaciones semimóviles como la sínfisis del pubis',
      'Diartrosis, es decir articulaciones móviles con cápsula y líquido sinovial',
      'Sindesmosis móviles, propias de los huesos planos del esqueleto axial',
    ],
    correcta: 0,
    explicacion:
      'Las suturas del cráneo son sinartrosis: articulaciones inmóviles en las que los huesos quedan prácticamente fusionados. El distractor más tentador es el segundo, porque las anfiartrosis también permiten muy poco movimiento; la diferencia es que estas sí lo permiten, como la sínfisis del pubis o las uniones entre vértebras. Dato para recordar: sin movimiento sinartrosis, poco movimiento anfiartrosis, movimiento libre diartrosis.',
    referencia: 'Cartilla 1, Tema 2, Subtema 2.6 — Articulaciones',
    etiquetas: ['sinartrosis', 'anfiartrosis', 'diartrosis', 'clasificación'],
  },
  {
    id: 'A3-011',
    modulo: 'a3-tejidos-organos-sistemas',
    bloque: 'A',
    tipo: 'emparejar',
    nivel: 'recuerdo',
    dificultad: 2,
    enunciado: 'Relacione cada sistema con sus órganos principales.',
    izquierda: ['Cardiovascular', 'Urinario', 'Linfático', 'Tegumentario'],
    derecha: [
      'Corazón, arterias, venas y capilares',
      'Riñones, uréteres, vejiga y uretra',
      'Vasos linfáticos, ganglios, bazo y timo',
      'Piel, pelo y uñas',
    ],
    pares: [
      [0, 0],
      [1, 1],
      [2, 2],
      [3, 3],
    ],
    explicacion:
      'El sistema que peor se identifica es el linfático, porque sus órganos son menos familiares y el bazo se atribuye con frecuencia al cardiovascular por su relación con la sangre. El tegumentario también se olvida al enumerar los once, pese a ser el de mayor superficie del cuerpo. Dato para recordar: si aparecen ganglios, bazo o timo, es linfático.',
    referencia: 'Cartilla 1, Tema 2, Subtema 2.8 — Los once sistemas',
    etiquetas: ['sistemas', 'linfático', 'tegumentario', 'clasificación'],
  },
  {
    id: 'A3-012',
    modulo: 'a3-tejidos-organos-sistemas',
    bloque: 'A',
    tipo: 'unica',
    nivel: 'comprension',
    dificultad: 2,
    enunciado:
      '¿Por qué el trabajo de fuerza aumenta la densidad ósea de un deportista?',
    opciones: [
      'Porque la carga mecánica desplaza la remodelación hacia la formación de hueso',
      'Porque el aumento de masa muscular obliga al hueso a crecer en longitud',
      'Porque la contracción muscular libera calcio que se deposita en la matriz ósea',
      'Porque el trabajo de fuerza reduce el número total de osteocitos del tejido',
    ],
    correcta: 0,
    explicacion:
      'La remodelación ósea es un equilibrio entre formación y reabsorción, y la carga mecánica lo desplaza hacia la formación: el osteocito detecta esa carga y el hueso construye material donde lo necesita. El distractor más tentador es el segundo, porque relaciona músculo y hueso de forma plausible; lo que la carga modifica es la densidad, no el crecimiento en longitud, que depende del cartílago de crecimiento. Dato para recordar: la inmovilización produce el efecto contrario.',
    referencia: 'Cartilla 1, Tema 2, Subtema 2.5 — Sistema óseo y células del hueso',
    etiquetas: ['remodelación ósea', 'densidad ósea', 'carga mecánica'],
  },
  {
    id: 'A3-013',
    modulo: 'a3-tejidos-organos-sistemas',
    bloque: 'A',
    tipo: 'unica',
    nivel: 'comprension',
    dificultad: 2,
    enunciado:
      'Un enunciado describe «un saco relleno de líquido sinovial situado donde un tendón pasa sobre un hueso». ¿A qué estructura se refiere?',
    opciones: [
      'A una bursa',
      'A un menisco, que es fibrocartílago y también contiene líquido en su interior',
      'A un rodete articular, que amplía la cavidad donde se aloja la cabeza del hueso',
      'A la cápsula articular, que envuelve la articulación y retiene el líquido dentro',
    ],
    correcta: 0,
    explicacion:
      'La descripción es literalmente la definición de bursa: una bolsa con líquido sinovial que reduce el roce donde un tendón pasa por encima de un hueso. El distractor más tentador es el segundo, porque bursa y menisco se confunden todo el tiempo: el menisco es fibrocartílago macizo, no un saco de líquido, y su función es mejorar la congruencia y repartir carga. Dato para recordar: si dice saco con líquido, es bursa.',
    referencia: 'Cartilla 1, Tema 2, Subtema 2.6 — Articulaciones',
    etiquetas: ['bursa', 'menisco', 'articulación'],
  },
  {
    id: 'A3-014',
    modulo: 'a3-tejidos-organos-sistemas',
    bloque: 'A',
    tipo: 'unica',
    nivel: 'comprension',
    dificultad: 2,
    enunciado:
      '¿Por qué la inmovilización prolongada de una articulación perjudica a su cartílago?',
    opciones: [
      'Porque el cartílago se nutre por difusión desde el líquido sinovial, y esa difusión depende del movimiento',
      'Porque el cartílago pierde su irrigación sanguínea cuando la articulación deja de moverse',
      'Porque la membrana sinovial deja de producir líquido si no recibe estímulo mecánico alguno',
      'Porque los osteoclastos reabsorben el cartílago cuando la articulación permanece en reposo',
    ],
    correcta: 0,
    explicacion:
      'El cartílago no tiene vasos y se nutre por difusión desde el líquido sinovial, y esa difusión funciona porque el movimiento lo comprime y lo descomprime como una esponja: sin movimiento, el intercambio se detiene. El distractor más tentador es el segundo, porque suena razonable y contradice el dato clave del módulo, ya que el cartílago no tenía irrigación que perder. Dato para recordar: el movimiento suave es parte del tratamiento, no un riesgo.',
    referencia: 'Cartilla 1, Tema 2, Subtema 2.6 — Articulaciones',
    etiquetas: ['cartílago articular', 'líquido sinovial', 'inmovilización'],
  },
  {
    id: 'A3-015',
    modulo: 'a3-tejidos-organos-sistemas',
    bloque: 'A',
    tipo: 'vf',
    nivel: 'comprension',
    dificultad: 2,
    enunciado:
      'El cartílago articular es la estructura que absorbe la mayor parte de la energía de un impacto sobre la articulación.',
    correcta: false,
    explicacion:
      'Falso. Lo que el cartílago hace de forma indiscutible es ofrecer una superficie de fricción bajísima y repartir la carga sobre un área mayor. La energía de un impacto la disipan sobre todo el hueso subcondral que hay debajo y el trabajo excéntrico de la musculatura que frena el movimiento. De ahí una consecuencia práctica: una musculatura fuerte protege la articulación, y el cartílago solo no basta.',
    referencia: 'Cartilla 1, Tema 2, Subtema 2.6 — Articulaciones',
    etiquetas: ['cartílago articular', 'impacto', 'musculatura excéntrica'],
  },
  {
    id: 'A3-016',
    modulo: 'a3-tejidos-organos-sistemas',
    bloque: 'A',
    tipo: 'multiple',
    nivel: 'comprension',
    dificultad: 2,
    enunciado: 'Seleccione las DOS afirmaciones correctas sobre la sangre.',
    opciones: [
      'Es un tejido conjuntivo, con células dispersas en una matriz abundante',
      'Su matriz extracelular es el plasma, de naturaleza líquida',
      'Es un tejido epitelial, porque tapiza el interior de los vasos sanguíneos',
      'Se forma en el hueso compacto de la diáfisis de los huesos largos',
      'Carece de matriz extracelular, lo que la excluye de los cuatro tejidos básicos',
    ],
    correctas: [0, 1],
    explicacion:
      'La sangre es tejido conjuntivo porque cumple su definición —células dispersas en abundante matriz— y su matriz es el plasma. La tercera confunde la sangre con el endotelio, que sí es epitelial y es lo que tapiza el vaso. La cuarta se equivoca de sitio, porque la hematopoyesis ocurre en la médula roja del hueso esponjoso. Y la quinta niega el rasgo que precisamente la clasifica. Dato para recordar: líquida no significa sin matriz.',
    referencia: 'Cartilla 1, Tema 2, Subtema 2.4 — Los cuatro tejidos',
    etiquetas: ['sangre', 'tejido conjuntivo', 'hematopoyesis'],
  },
  {
    id: 'A3-017',
    modulo: 'a3-tejidos-organos-sistemas',
    bloque: 'A',
    tipo: 'unica',
    nivel: 'comprension',
    dificultad: 3,
    enunciado:
      '¿Por qué las trabéculas del hueso esponjoso presentan una orientación definida y no aleatoria?',
    opciones: [
      'Porque se disponen siguiendo las líneas de fuerza que atraviesan el hueso',
      'Porque su orientación viene fijada genéticamente y no cambia a lo largo de la vida',
      'Porque siguen el recorrido de los vasos sanguíneos que irrigan la médula ósea',
      'Porque se alinean con el eje longitudinal de cada hueso, sea cual sea su forma',
    ],
    correcta: 0,
    explicacion:
      'Las trabéculas se orientan según las líneas de fuerza que soporta el hueso, que es la misma lógica de la remodelación vista a escala de estructura: se construye material donde hace falta y se retira donde no. El distractor más tentador es el segundo, porque hay un componente genético en la forma del hueso; lo que la orientación demuestra es precisamente que responde a la carga y por tanto puede cambiar. Dato para recordar: el hueso es un tejido en obra permanente.',
    referencia: 'Cartilla 1, Tema 2, Subtema 2.5 — Sistema óseo y células del hueso',
    etiquetas: ['hueso esponjoso', 'trabéculas', 'remodelación ósea'],
  },
  {
    id: 'A3-018',
    modulo: 'a3-tejidos-organos-sistemas',
    bloque: 'A',
    tipo: 'emparejar',
    nivel: 'comprension',
    dificultad: 3,
    enunciado: 'Relacione cada estructura articular con su función.',
    izquierda: ['Ligamento', 'Bursa', 'Menisco', 'Líquido sinovial'],
    derecha: [
      'Une hueso con hueso y aporta estabilidad pasiva',
      'Saco con líquido que reduce el roce entre tendón y hueso',
      'Fibrocartílago que mejora el encaje y reparte la carga',
      'Lubrica la articulación y nutre el cartílago, que no tiene vasos',
    ],
    pares: [
      [0, 0],
      [1, 1],
      [2, 2],
      [3, 3],
    ],
    explicacion:
      'El par que más se falla es bursa con menisco, porque los dos aparecen en la rodilla y los dos amortiguan algo: la bursa es una bolsa de líquido situada donde un tendón roza un hueso, y el menisco es fibrocartílago macizo que mejora la congruencia entre superficies. El ligamento también se cruza con el tendón, que une músculo con hueso y no forma parte de esta lista. Dato para recordar: saco con líquido es bursa; fibrocartílago macizo es menisco.',
    referencia: 'Cartilla 1, Tema 2, Subtema 2.6 — Articulaciones',
    etiquetas: ['bursa', 'menisco', 'ligamento', 'clasificación'],
  },
  {
    id: 'A3-019',
    modulo: 'a3-tejidos-organos-sistemas',
    bloque: 'A',
    tipo: 'unica',
    nivel: 'comprension',
    dificultad: 3,
    enunciado:
      '¿Por qué el páncreas se cita como órgano de dos sistemas distintos?',
    opciones: [
      'Porque tiene una parte exocrina que vierte enzimas al intestino y otra endocrina que produce hormonas',
      'Porque su localización anatómica queda entre el estómago y el intestino delgado',
      'Porque recibe irrigación tanto del sistema cardiovascular como del linfático',
      'Porque su tejido es a la vez conjuntivo por la matriz y epitelial por el revestimiento',
    ],
    correcta: 0,
    explicacion:
      'El páncreas pertenece al sistema digestivo por su parte exocrina, que vierte enzimas al intestino, y al endocrino por su parte endocrina, que produce insulina y glucagón: son dos funciones distintas en un mismo órgano. El distractor más tentador es el segundo, porque la vecindad anatómica parece una explicación suficiente; estar cerca del intestino no convierte a un órgano en digestivo. Dato para recordar: la clasificación por sistemas es funcional, no topográfica.',
    referencia: 'Cartilla 1, Tema 2, Subtema 2.8 — Los once sistemas',
    etiquetas: ['páncreas', 'sistema endocrino', 'sistema digestivo'],
  },
  {
    id: 'A3-020',
    modulo: 'a3-tejidos-organos-sistemas',
    bloque: 'A',
    tipo: 'caso',
    nivel: 'aplicacion',
    dificultad: 2,
    viñeta:
      'Una corredora veterana quiere prevenir la pérdida de densidad ósea. Su plan actual son seis horas semanales de bicicleta estática y natación, sin ningún trabajo con cargas ni impactos, y quiere saber si eso basta.',
    enunciado: '¿Qué recomendación corresponde y con qué fundamento?',
    opciones: [
      'Añadir trabajo de fuerza e impactos controlados, porque la carga mecánica desplaza la remodelación hacia la formación',
      'Mantener el plan actual, porque cualquier actividad aeróbica estimula por igual la formación de hueso',
      'Sustituir la natación por más bicicleta, porque el pedaleo transmite carga axial al esqueleto',
      'Añadir suplementos de calcio como única medida, porque el estímulo mecánico no interviene en la densidad',
    ],
    correcta: 0,
    explicacion:
      'La remodelación se inclina hacia la formación cuando el hueso recibe carga, y el osteocito es el sensor de esa carga: bicicleta y natación son actividades de bajo impacto y aportan poco estímulo osteogénico. El distractor más tentador es el tercero, porque el pedaleo sí genera fuerza; la transmite sobre todo al pedal y no en forma de impacto axial. Dato para recordar: sin carga no hay señal, y sin señal el hueso no construye.',
    referencia: 'Cartilla 1, Tema 2, Subtema 2.5 — Sistema óseo y células del hueso',
    etiquetas: ['densidad ósea', 'remodelación ósea', 'prescripción', 'aplicación'],
  },
  {
    id: 'A3-021',
    modulo: 'a3-tejidos-organos-sistemas',
    bloque: 'A',
    tipo: 'unica',
    nivel: 'aplicacion',
    dificultad: 2,
    enunciado:
      'Un deportista sufre una torsión de rodilla y el informe señala «lesión del ligamento cruzado anterior». ¿Qué función queda comprometida?',
    opciones: [
      'La estabilidad pasiva de la articulación, porque el ligamento une hueso con hueso',
      'La transmisión de la fuerza del cuádriceps, porque el ligamento parte del músculo',
      'La lubricación de la articulación, porque el ligamento distribuye el líquido sinovial',
      'El reparto de la carga entre fémur y tibia, que es la función propia del ligamento',
    ],
    correcta: 0,
    explicacion:
      'El ligamento une hueso con hueso y aporta estabilidad pasiva, así que su lesión compromete el control del desplazamiento entre fémur y tibia. El distractor más tentador es el segundo, porque confunde ligamento con tendón, que es el que une músculo con hueso y transmite la fuerza de la contracción. El cuarto atribuye al ligamento la función del menisco. Dato para recordar: pasiva significa que estabiliza sin contraerse.',
    referencia: 'Cartilla 1, Tema 2, Subtema 2.6 — Articulaciones',
    etiquetas: ['ligamento', 'tendón', 'estabilidad', 'aplicación'],
  },
  {
    id: 'A3-022',
    modulo: 'a3-tejidos-organos-sistemas',
    bloque: 'A',
    tipo: 'caso',
    nivel: 'aplicacion',
    dificultad: 3,
    viñeta:
      'Un jugador lleva tres semanas con la rodilla inmovilizada tras una lesión menor. El médico autoriza movilidad pasiva suave desde el primer día, aunque todavía no permite apoyo ni carga. El jugador no entiende para qué mover una rodilla que no puede usar.',
    enunciado: '¿Cuál es el fundamento de esa indicación?',
    opciones: [
      'El cartílago se nutre por difusión desde el líquido sinovial, y esa difusión necesita movimiento',
      'El movimiento pasivo mantiene la fuerza del cuádriceps mientras dura la inmovilización',
      'La membrana sinovial deja de existir si la articulación permanece inmóvil varias semanas',
      'El movimiento pasivo acelera la remodelación ósea al aplicar carga mecánica al hueso',
    ],
    correcta: 0,
    explicacion:
      'El cartílago no tiene vasos y depende de la difusión desde el líquido sinovial, que funciona porque el movimiento lo comprime y lo descomprime: sin movimiento, la nutrición se detiene aunque no haya carga. El distractor más tentador es el último, porque también invoca un mecanismo real; la remodelación ósea necesita carga, y el enunciado dice expresamente que no la hay. Dato para recordar: movilidad y carga son estímulos distintos, con efectos distintos.',
    referencia: 'Cartilla 1, Tema 2, Subtema 2.6 — Articulaciones',
    etiquetas: ['cartílago articular', 'líquido sinovial', 'rehabilitación', 'aplicación'],
  },
  {
    id: 'A3-023',
    modulo: 'a3-tejidos-organos-sistemas',
    bloque: 'A',
    tipo: 'ordenar',
    nivel: 'aplicacion',
    dificultad: 3,
    enunciado: 'Ordene los niveles de organización del cuerpo humano, de menor a mayor complejidad.',
    elementos: ['Célula', 'Tejido', 'Órgano', 'Sistema', 'Organismo'],
    ordenCorrecto: [0, 1, 2, 3, 4],
    explicacion:
      'La secuencia es célula, tejido, órgano, sistema y organismo, y cada nivel se define por agrupación del anterior: las células iguales forman un tejido, varios tejidos forman un órgano y varios órganos coordinados forman un sistema. El error habitual es colocar el órgano antes que el tejido, porque el órgano es más reconocible; un órgano contiene varios tejidos distintos, y por eso va después. Dato para recordar: el corazón es órgano y tiene tejido muscular, conjuntivo, epitelial y nervioso a la vez.',
    referencia: 'Cartilla 1, Tema 2, Subtema 2.8 — Los once sistemas',
    etiquetas: ['niveles de organización', 'tejidos', 'sistemas', 'secuencia'],
  },
  {
    id: 'A3-024',
    modulo: 'a3-tejidos-organos-sistemas',
    bloque: 'A',
    tipo: 'ordenar',
    nivel: 'aplicacion',
    dificultad: 3,
    enunciado:
      'Ordene lo que ocurre en un ciclo de remodelación ósea tras un estímulo de carga.',
    elementos: [
      'El osteocito detecta la deformación que la carga produce en la matriz',
      'Los osteoclastos reabsorben la matriz de la zona que debe renovarse',
      'Los osteoblastos acuden y sintetizan matriz osteoide nueva',
      'La matriz recién formada se mineraliza y gana resistencia',
      'Algunos osteoblastos quedan atrapados en la matriz y pasan a ser osteocitos',
    ],
    ordenCorrecto: [0, 1, 2, 3, 4],
    explicacion:
      'El ciclo empieza por la detección y no por la construcción: el osteocito es el sensor de la carga y quien desencadena el proceso. Después llega la reabsorción, que suele sorprender porque parece contraproducente: el hueso viejo se retira antes de poner el nuevo. Y cierra el círculo el paso final, donde los osteoblastos que quedan sepultados en su propia matriz se convierten en osteocitos. Dato para recordar: primero se detecta, después se demuele y solo entonces se construye.',
    referencia: 'Cartilla 1, Tema 2, Subtema 2.5 — Sistema óseo y células del hueso',
    etiquetas: ['remodelación ósea', 'osteocito', 'osteoblasto', 'secuencia'],
  },
  {
    id: 'A3-025',
    modulo: 'a3-tejidos-organos-sistemas',
    bloque: 'A',
    tipo: 'multiple',
    nivel: 'aplicacion',
    dificultad: 2,
    enunciado:
      'Un informe menciona daño en «el fibrocartílago que mejora la congruencia entre fémur y tibia». Seleccione las DOS afirmaciones correctas sobre esa estructura.',
    opciones: [
      'Se trata del menisco, no de una bursa',
      'Su función es mejorar el encaje entre superficies y repartir la carga',
      'Es un saco lleno de líquido sinovial situado bajo el tendón rotuliano',
      'Une el fémur con la tibia y aporta la estabilidad pasiva de la rodilla',
      'Produce el líquido sinovial que lubrica y nutre el cartílago articular',
    ],
    correctas: [0, 1],
    explicacion:
      'La descripción corresponde al menisco: fibrocartílago que mejora la congruencia y reparte carga. Los tres distractores atribuyen a esa estructura las funciones de la bursa, del ligamento y de la membrana sinovial, que son las tres piezas con las que más se confunde. El más tentador es el tercero, porque bursa y menisco conviven en la rodilla y los dos se relacionan con el rozamiento. Dato para recordar: fibrocartílago macizo es menisco; saco con líquido es bursa.',
    referencia: 'Cartilla 1, Tema 2, Subtema 2.6 — Articulaciones',
    etiquetas: ['menisco', 'bursa', 'rodilla', 'aplicación'],
  },
];
