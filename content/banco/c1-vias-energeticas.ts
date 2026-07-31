// content/banco/c1-vias-energeticas.ts
// C1 · Vías energéticas y fisiología del ejercicio. 28 ítems (bloque C, ADR-006).
//
// Reparto verificado contra verificarCuotas(cuotasDelBloque('C')):
//   Nivel      → 12 recuerdo (43 %) · 9 comprensión (32 %) · 7 aplicación (25 %)
//   Dificultad → 6 de nivel 1 · 16 de nivel 2 · 6 de nivel 3
//   Tipos      → 15 única · 3 caso · 3 cálculo · 3 múltiple · 2 emparejar
//                · 1 ordenar · 1 V/F
//
// ADR-014 — las tres cifras que este módulo enseña verificadas, no heredadas:
//   · ATP por glucosa: 30–32, y 30 en músculo esquelético. Los 36–38 salen de
//     razones P/O viejas (3 ATP/NADH, 2/FADH₂); las vigentes son 2,5 y 1,5.
//     Dentro del rango decide la lanzadera: malato-aspartato → 32 (corazón,
//     hígado, riñón), glicerol-3-fosfato → 30 (músculo esquelético y cerebro).
//   · Sistema fosfágeno: 5–15 s, y es un rango real — depende de la intensidad
//     y de las reservas basales de PCr. No hay número único que enseñar.
//   · ATP libre: 2–3 s. Magnitud distinta del sistema fosfágeno completo.
//
// Los ítems son datos literales: nunca se generan con map(), plantillas ni
// funciones auxiliares. 28 objetos a mano son legibles, revisables y diffeables.
import type { Item } from '@/lib/tipos';

export const ITEMS: Item[] = [
  {
    id: 'C1-001',
    modulo: 'c1-vias-energeticas',
    bloque: 'C',
    tipo: 'unica',
    nivel: 'recuerdo',
    dificultad: 1,
    enunciado:
      '¿Cuánto tiempo de esfuerzo máximo sostiene el ATP que ya está almacenado dentro de la fibra muscular, sin regenerar nada?',
    opciones: [
      '2–3 segundos',
      'Entre 5 y 15 segundos, según la intensidad y las reservas previas',
      'Entre 30 segundos y 2 minutos de trabajo continuo',
      'Alrededor de 45 segundos si el deportista está bien entrenado',
    ],
    correcta: 0,
    explicacion:
      'El ATP libre es el que ya está en la fibra listo para hidrolizarse, y alcanza para 2–3 segundos: literalmente el primer paso de un sprint. El distractor más tentador son los 5–15 segundos, que es la duración del sistema fosfágeno COMPLETO —el ATP libre más la fosfocreatina que lo regenera—: son dos magnitudes distintas y se citan como si fueran la misma. Dato para recordar: el ATP libre arranca el motor, la fosfocreatina es la que lo mantiene encendido.',
    referencia: 'Cartilla 3, Tema 1, Subtema 1.2 — Sistema fosfágeno (ATP-PCr)',
    etiquetas: ['ATP', 'sistema fosfágeno', 'duración'],
  },
  {
    id: 'C1-002',
    modulo: 'c1-vias-energeticas',
    bloque: 'C',
    tipo: 'unica',
    nivel: 'recuerdo',
    dificultad: 1,
    enunciado: '¿Cuál es la reacción de la fosfocreatina y qué enzima la cataliza?',
    opciones: [
      'PCr + ADP → Creatina + ATP, catalizada por la creatina quinasa',
      'PCr + ATP → Creatina + ADP, catalizada por la enzima adenilato ciclasa',
      'Creatina + ATP → PCr + ADP, catalizada por la lactato deshidrogenasa',
      'PCr + NAD⁺ → Creatina + NADH, catalizada por la creatina deshidrogenasa',
    ],
    correcta: 0,
    explicacion:
      'La fosfocreatina cede su grupo fosfato al ADP para regenerar ATP, y la enzima es la creatina quinasa. El distractor más tentador invierte los sustratos —Creatina + ATP → PCr + ADP—, que sí es la reacción real, pero en sentido de recarga durante la recuperación, no de aporte durante el esfuerzo: la reacción es reversible y por eso se confunde su dirección. Dato para recordar: durante el sprint se gasta PCr para fabricar ATP; en el descanso se gasta ATP para reponer PCr.',
    referencia: 'Cartilla 3, Tema 1, Subtema 1.2 — Sistema fosfágeno (ATP-PCr)',
    etiquetas: ['fosfocreatina', 'creatina quinasa', 'reacción'],
  },
  {
    id: 'C1-003',
    modulo: 'c1-vias-energeticas',
    bloque: 'C',
    tipo: 'unica',
    nivel: 'recuerdo',
    dificultad: 1,
    enunciado: '¿Cuánto tiempo de esfuerzo máximo sostiene el sistema fosfágeno completo?',
    opciones: [
      '5–15 segundos',
      'Exactamente 10 segundos en cualquier deportista, sea cual sea su nivel',
      'Entre 30 segundos y 2 minutos, con acumulación progresiva de lactato',
      'Entre 2 y 3 minutos, mientras el aporte de oxígeno todavía no alcanza',
    ],
    correcta: 0,
    explicacion:
      'El sistema fosfágeno sostiene entre 5 y 15 segundos de esfuerzo máximo, y ese rango es un rango de verdad: dónde caiga depende de la intensidad real y de cuánta fosfocreatina haya acumulada ese día. El distractor más tentador es el número redondo de 10 segundos, que circula porque es cómodo de memorizar y porque coincide con el 100 metros: un velocista descansado se acerca a los 15, y el mismo velocista en la cuarta repetición se apaga antes de los 10. Dato para recordar: es un rango, no una cifra.',
    referencia: 'Cartilla 3, Tema 1, Subtema 1.2 — Sistema fosfágeno (ATP-PCr)',
    etiquetas: ['sistema fosfágeno', 'duración', 'PCr'],
  },
  {
    id: 'C1-004',
    modulo: 'c1-vias-energeticas',
    bloque: 'C',
    tipo: 'unica',
    nivel: 'recuerdo',
    dificultad: 1,
    enunciado: '¿Cuál es el producto final de la glucólisis anaeróbica y cuánto dura su predominio?',
    opciones: [
      'Lactato, con predominio entre los 30 segundos y los 2 minutos',
      'Piruvato que entra íntegro a la mitocondria, entre los 2 y los 3 minutos',
      'Acetil-CoA que alimenta el ciclo de Krebs, más allá de los 3 minutos',
      'Creatina libre y fosfato inorgánico, durante los primeros 15 segundos',
    ],
    correcta: 0,
    explicacion:
      'Sin oxígeno suficiente, el piruvato se reduce a lactato por acción de la lactato deshidrogenasa, y esa vía manda entre los 30 segundos y los 2 minutos. El distractor más tentador es el piruvato: la glucólisis SÍ produce piruvato como paso previo, así que la frase suena bien, pero el producto final de la vía anaeróbica es el lactato — el piruvato solo se conserva como tal cuando hay oxígeno para llevarlo a la mitocondria. Dato para recordar: lo que decide el destino del piruvato es la disponibilidad de oxígeno.',
    referencia: 'Cartilla 3, Tema 1, Subtema 1.3 — Glucólisis anaeróbica',
    etiquetas: ['glucólisis anaeróbica', 'lactato', 'duración'],
  },
  {
    id: 'C1-005',
    modulo: 'c1-vias-energeticas',
    bloque: 'C',
    tipo: 'unica',
    nivel: 'recuerdo',
    dificultad: 2,
    enunciado: '¿En qué compartimento de la célula ocurre la glucólisis?',
    opciones: [
      'En el citoplasma',
      'En la matriz mitocondrial, junto con el ciclo de Krebs completo',
      'En la membrana interna de la mitocondria, junto a las cadenas de citocromos',
      'En el retículo sarcoplásmico, donde también se almacena el calcio muscular',
    ],
    correcta: 0,
    explicacion:
      'La glucólisis es citoplasmática, y esa localización es justamente lo que la hace independiente del oxígeno: no necesita entrar a ningún orgánulo para funcionar. El distractor más tentador es la matriz mitocondrial, que es donde ocurre el ciclo de Krebs: como las dos etapas se estudian seguidas, se juntan en un mismo sitio. Dato para recordar: glucólisis en el citoplasma, Krebs en la matriz, cadena de transporte en la membrana interna. Tres etapas, tres direcciones distintas.',
    referencia: 'Cartilla 3, Tema 1, Subtema 1.4 — Glucólisis aeróbica y ciclo de Krebs',
    etiquetas: ['glucólisis', 'citoplasma', 'localización'],
  },
  {
    id: 'C1-006',
    modulo: 'c1-vias-energeticas',
    bloque: 'C',
    tipo: 'unica',
    nivel: 'recuerdo',
    dificultad: 2,
    enunciado: '¿Dónde ocurre el ciclo de Krebs?',
    opciones: [
      'En la matriz mitocondrial',
      'En el citoplasma celular, en continuidad directa con la glucólisis',
      'En la membrana externa de la mitocondria, en contacto con el citosol',
      'En el aparato de Golgi, donde se procesan los metabolitos intermedios',
    ],
    correcta: 0,
    explicacion:
      'El ciclo de Krebs ocurre en la matriz mitocondrial, el espacio interior que delimita la membrana interna. El distractor más tentador es el citoplasma, porque el acetil-CoA llega desde la glucólisis, que sí es citoplasmática, y se asume continuidad física entre las dos etapas: lo que hay entre ellas es un transporte a través de dos membranas. Dato para recordar: si una etapa necesita oxígeno, ocurre dentro de la mitocondria; si no lo necesita, ocurre fuera.',
    referencia: 'Cartilla 3, Tema 1, Subtema 1.4 — Glucólisis aeróbica y ciclo de Krebs',
    etiquetas: ['ciclo de Krebs', 'matriz mitocondrial', 'localización'],
  },
  {
    id: 'C1-007',
    modulo: 'c1-vias-energeticas',
    bloque: 'C',
    tipo: 'unica',
    nivel: 'recuerdo',
    dificultad: 2,
    enunciado: '¿Dónde se ubica la cadena transportadora de electrones?',
    opciones: [
      'En la membrana interna de la mitocondria',
      'En la matriz mitocondrial, disuelta junto a las enzimas del ciclo de Krebs',
      'En el citoplasma, aprovechando el NADH que genera la fase de la glucólisis',
      'En la membrana plasmática de la fibra, junto a los transportadores de glucosa',
    ],
    correcta: 0,
    explicacion:
      'La cadena transportadora se ubica en la membrana interna mitocondrial, y tiene que estar en una membrana porque su trabajo es bombear protones a un lado para crear el gradiente que mueve la ATP sintasa. El distractor más tentador es la matriz, donde sí están las enzimas de Krebs que le entregan el NADH: comparten vecindario pero no compartimento. Dato para recordar: Krebs produce los transportadores reducidos en la matriz y la cadena los cobra en la membrana de al lado.',
    referencia: 'Cartilla 3, Tema 1, Subtema 1.4 — Glucólisis aeróbica y ciclo de Krebs',
    etiquetas: ['cadena transportadora', 'membrana interna', 'localización'],
  },
  {
    id: 'C1-008',
    modulo: 'c1-vias-energeticas',
    bloque: 'C',
    tipo: 'unica',
    nivel: 'recuerdo',
    dificultad: 2,
    enunciado:
      '¿Cuál es el rendimiento NETO de la fase citoplasmática de la glucólisis por cada molécula de glucosa?',
    opciones: [
      '2 ATP netos y 2 NADH',
      '4 ATP netos y 2 NADH, sin ningún consumo previo de energía',
      '30 ATP netos, que es todo el rendimiento de la molécula de glucosa',
      '36 ATP netos, contando el aporte de la cadena transportadora de electrones',
    ],
    correcta: 0,
    explicacion:
      'La glucólisis produce 4 ATP pero consume 2 para arrancar, así que el neto es de 2 ATP, más 2 NADH que se cobrarán después en la mitocondria. El distractor más tentador son los 4 ATP: es la producción bruta, y se convierte en error al olvidar la fase de inversión inicial, en la que la célula gasta energía para poder fabricarla. Dato para recordar: la glucólisis es una vía que invierte antes de cobrar, y lo que se pregunta casi siempre es el neto.',
    referencia: 'Cartilla 3, Tema 1, Subtema 1.3 — Glucólisis anaeróbica',
    etiquetas: ['glucólisis', 'ATP', 'balance'],
  },
  {
    id: 'C1-009',
    modulo: 'c1-vias-energeticas',
    bloque: 'C',
    tipo: 'unica',
    nivel: 'recuerdo',
    dificultad: 1,
    enunciado:
      '¿Cuánto ATP total rinde una molécula de glucosa oxidada por completo en presencia de oxígeno?',
    opciones: [
      '30–32 ATP, y 30 en el músculo esquelético',
      '36–38 ATP, que es el rendimiento máximo de la oxidación completa',
      '2 ATP, que son los que aporta la fase citoplasmática de la glucólisis',
      '129 ATP, igual que la oxidación completa de un ácido graso de cadena larga',
    ],
    correcta: 0,
    explicacion:
      'La oxidación completa de una glucosa rinde entre 30 y 32 ATP, y en el músculo esquelético son 30. El distractor más tentador son los 36–38, que es la cifra que todavía circula en muchos apuntes: sale de suponer que cada NADH paga 3 ATP y cada FADH₂ paga 2, cuando lo medido es 2,5 y 1,5. Dentro del rango, quien decide es la lanzadera que mete el NADH citoplasmático a la mitocondria. Dato para recordar: en el músculo esquelético la lanzadera es la del glicerol-3-fosfato, y por eso el número es 30.',
    referencia: 'Cartilla 3, Tema 1, Subtema 1.4 — Glucólisis aeróbica y ciclo de Krebs',
    etiquetas: ['ATP', 'balance energético', 'glucosa'],
  },
  {
    id: 'C1-010',
    modulo: 'c1-vias-energeticas',
    bloque: 'C',
    tipo: 'vf',
    nivel: 'comprension',
    dificultad: 2,
    enunciado:
      'El sistema fosfágeno necesita oxígeno para regenerar ATP durante los primeros segundos de un esfuerzo máximo.',
    correcta: false,
    explicacion:
      'Falso. La transferencia del fosfato de la fosfocreatina al ADP es una reacción directa, de un solo paso, que no requiere oxígeno: por eso es la vía más rápida del organismo y la única capaz de responder en el primer segundo. La confusión viene de que la RECUPERACIÓN de las reservas de fosfocreatina, ya terminado el esfuerzo, sí es un proceso aeróbico que consume oxígeno. Dato para recordar: gastar fosfocreatina es anaeróbico; reponerla es aeróbico, y ahí se explica buena parte del jadeo posterior al sprint.',
    referencia: 'Cartilla 3, Tema 1, Subtema 1.2 — Sistema fosfágeno (ATP-PCr)',
    etiquetas: ['sistema fosfágeno', 'anaeróbico', 'recuperación'],
  },
  {
    id: 'C1-011',
    modulo: 'c1-vias-energeticas',
    bloque: 'C',
    tipo: 'emparejar',
    nivel: 'recuerdo',
    dificultad: 2,
    enunciado: 'Relacione cada vía energética con la duración de esfuerzo en la que predomina.',
    izquierda: [
      'ATP libre almacenado en la fibra',
      'Sistema fosfágeno (ATP-PCr)',
      'Glucólisis anaeróbica',
      'Metabolismo aeróbico',
    ],
    derecha: [
      '2–3 segundos',
      '5–15 segundos de esfuerzo máximo',
      '30 segundos a 2 minutos',
      'Más de 2–3 minutos, sin límite mientras haya sustrato y oxígeno',
    ],
    pares: [
      [0, 0],
      [1, 1],
      [2, 2],
      [3, 3],
    ],
    explicacion:
      'La escala temporal completa va de los 2–3 segundos del ATP libre a los minutos u horas del metabolismo aeróbico, pasando por los 5–15 segundos del fosfágeno y los 30 s a 2 min de la glucólisis anaeróbica. El par que más se falla es el primero con el segundo: se asigna el rango de 5–15 segundos al ATP libre porque las dos cosas se agrupan bajo la etiqueta «anaeróbico aláctico». Dato para recordar: cuanto más rápida es la vía, menos dura y menos ATP total entrega.',
    referencia: 'Cartilla 3, Tema 1, Subtema 1.1 — Sistemas energéticos: visión general',
    etiquetas: ['vías energéticas', 'duración', 'clasificación'],
  },
  {
    id: 'C1-012',
    modulo: 'c1-vias-energeticas',
    bloque: 'C',
    tipo: 'emparejar',
    nivel: 'recuerdo',
    dificultad: 2,
    enunciado: 'Relacione cada etapa del metabolismo aeróbico con el lugar donde ocurre.',
    izquierda: ['Glucólisis', 'Ciclo de Krebs', 'Cadena transportadora de electrones', 'β-oxidación'],
    derecha: [
      'Citoplasma',
      'Matriz mitocondrial',
      'Membrana interna de la mitocondria',
      'Matriz mitocondrial, previa entrada del ácido graso por la carnitina',
    ],
    pares: [
      [0, 0],
      [1, 1],
      [2, 2],
      [3, 3],
    ],
    explicacion:
      'La secuencia atraviesa tres compartimentos: citoplasma, matriz y membrana interna. El par que más se falla es el de la β-oxidación, que se ubica en el citoplasma por analogía con la glucólisis: los ácidos grasos se activan fuera pero se degradan dentro de la matriz, y para entrar necesitan el transporte de la carnitina. Dato para recordar: todo lo que consume oxígeno ocurre dentro de la mitocondria, y solo la glucólisis se queda fuera.',
    referencia: 'Cartilla 3, Tema 1, Subtema 1.5 — Oxidación de lípidos',
    etiquetas: ['localización', 'metabolismo aeróbico', 'β-oxidación'],
  },
  {
    id: 'C1-013',
    modulo: 'c1-vias-energeticas',
    bloque: 'C',
    tipo: 'multiple',
    nivel: 'recuerdo',
    dificultad: 2,
    enunciado: 'Seleccione las DOS características del sistema anaeróbico aláctico.',
    opciones: [
      'Su combustible es la fosfocreatina almacenada en la propia fibra muscular',
      'No genera lactato como subproducto del proceso de resíntesis del ATP',
      'Produce lactato en cantidad creciente conforme se prolonga el esfuerzo máximo',
      'Es la vía con mayor rendimiento total de ATP por molécula de sustrato empleada',
      'Necesita oxígeno para transferir el fosfato desde la creatina hasta el ADP',
    ],
    correctas: [0, 1],
    explicacion:
      'El sistema aláctico usa la fosfocreatina del propio músculo y no genera lactato: eso es exactamente lo que significa «aláctico». El distractor más tentador es el del lactato creciente, porque un esfuerzo máximo prolongado sí acaba produciéndolo — pero para entonces ya mandó la vía láctica, no la aláctica. Y el del mayor rendimiento total invierte la realidad: es la vía más rápida y la de menor rendimiento acumulado. Dato para recordar: aláctico significa sin lactato, y es lo que lo separa de la glucólisis anaeróbica.',
    referencia: 'Cartilla 3, Tema 1, Subtema 1.2 — Sistema fosfágeno (ATP-PCr)',
    etiquetas: ['aláctico', 'fosfocreatina', 'clasificación'],
  },
  {
    id: 'C1-014',
    modulo: 'c1-vias-energeticas',
    bloque: 'C',
    tipo: 'unica',
    nivel: 'comprension',
    dificultad: 2,
    enunciado: '¿Por qué el sistema fosfágeno no puede sostener un esfuerzo máximo más allá de 15 segundos?',
    opciones: [
      'Porque las reservas musculares de fosfocreatina son muy pequeñas y se agotan a la velocidad a la que se consumen',
      'Porque la creatina quinasa se satura y deja de funcionar pasados unos segundos',
      'Porque el lactato acumulado bloquea la reacción de la fosfocreatina',
      'Porque el oxígeno que necesita la reacción tarda ese tiempo en llegar al músculo',
    ],
    correcta: 0,
    explicacion:
      'El límite es de depósito, no de maquinaria: la fibra almacena muy poca fosfocreatina y a intensidad máxima se consume en segundos. El distractor más tentador es la saturación enzimática, porque suena a explicación bioquímica seria; la creatina quinasa sigue perfectamente activa cuando el esfuerzo se detiene, lo que falta es sustrato. El del lactato tampoco funciona: la vía aláctica se agota antes de que el lactato sea relevante. Dato para recordar: lo que se acaba es el combustible, no el motor.',
    referencia: 'Cartilla 3, Tema 1, Subtema 1.2 — Sistema fosfágeno (ATP-PCr)',
    etiquetas: ['sistema fosfágeno', 'límite', 'reservas'],
  },
  {
    id: 'C1-015',
    modulo: 'c1-vias-energeticas',
    bloque: 'C',
    tipo: 'unica',
    nivel: 'comprension',
    dificultad: 2,
    enunciado:
      'El rendimiento aeróbico de una glucosa se expresa como un rango de 30 a 32 ATP. ¿Qué determina dónde cae dentro de ese rango?',
    opciones: [
      'La lanzadera que introduce el NADH citoplasmático en la mitocondria',
      'El nivel de entrenamiento del deportista y su densidad mitocondrial acumulada',
      'La intensidad del esfuerzo en el momento en que se degrada esa molécula',
      'La cantidad de oxígeno disponible en el tejido durante la oxidación completa',
    ],
    correcta: 0,
    explicacion:
      'El NADH producido en el citoplasma no atraviesa la membrana mitocondrial y entra por una lanzadera: la de malato-aspartato conserva su valor y rinde 32; la de glicerol-3-fosfato lo degrada a FADH₂ y rinde 30. El músculo esquelético y el cerebro usan la segunda, así que ahí son 30. El distractor más tentador es el entrenamiento: mejora cuántas moléculas se oxidan por minuto, no cuánto rinde cada una. Dato para recordar: el rango es una cuestión de tejido, no de forma física.',
    referencia: 'Cartilla 3, Tema 1, Subtema 1.4 — Glucólisis aeróbica y ciclo de Krebs',
    etiquetas: ['ATP', 'lanzadera', 'balance energético'],
  },
  {
    id: 'C1-016',
    modulo: 'c1-vias-energeticas',
    bloque: 'C',
    tipo: 'unica',
    nivel: 'comprension',
    dificultad: 3,
    enunciado: '¿Qué destino tiene el lactato producido durante un esfuerzo intenso?',
    opciones: [
      'Se reutiliza como combustible en otras fibras y se reconvierte en glucosa en el hígado',
      'Se elimina exclusivamente por la orina y por el sudor durante las horas siguientes',
      'Permanece almacenado en la fibra y provoca las agujetas de los días posteriores',
      'Se degrada de forma irreversible dentro del músculo donde fue producido',
    ],
    correcta: 0,
    explicacion:
      'El lactato no es un residuo terminal: sale de la fibra, otras fibras y el corazón lo oxidan como combustible, y el hígado lo reconvierte en glucosa por el ciclo de Cori. El distractor más tentador es el de las agujetas, porque es la explicación popular más extendida: el dolor tardío es daño mecánico de la fibra, sobre todo por trabajo excéntrico, y aparece cuando el lactato ya se retiró hace horas. Dato para recordar: el lactato es un sustrato que viaja, no basura que se acumula.',
    referencia: 'Cartilla 3, Tema 1, Subtema 1.3 — Glucólisis anaeróbica',
    etiquetas: ['lactato', 'ciclo de Cori', 'recuperación'],
  },
  {
    id: 'C1-017',
    modulo: 'c1-vias-energeticas',
    bloque: 'C',
    tipo: 'unica',
    nivel: 'comprension',
    dificultad: 2,
    enunciado: '¿Qué diferencia a la glucólisis anaeróbica de la aeróbica?',
    opciones: [
      'La secuencia de reacciones es la misma; lo que cambia es el destino del piruvato según haya oxígeno o no',
      'Son dos rutas metabólicas completamente distintas, con enzimas propias cada una',
      'La anaeróbica ocurre en el citoplasma y la aeróbica arranca ya dentro de la mitocondria',
      'La anaeróbica parte del glucógeno muscular y la aeróbica parte de la glucosa sanguínea',
    ],
    correcta: 0,
    explicacion:
      'La glucólisis es una sola vía, citoplasmática, que termina en piruvato: con oxígeno suficiente el piruvato entra a la mitocondria y con oxígeno insuficiente se reduce a lactato. El distractor más tentador es el de las localizaciones distintas, porque parece ordenado y es medio cierto: la parte aeróbica continúa dentro de la mitocondria, pero la glucólisis propiamente dicha es citoplasmática en ambos casos. Dato para recordar: no son dos vías, es una vía con dos finales.',
    referencia: 'Cartilla 3, Tema 1, Subtema 1.3 — Glucólisis anaeróbica',
    etiquetas: ['glucólisis', 'piruvato', 'comparación'],
  },
  {
    id: 'C1-018',
    modulo: 'c1-vias-energeticas',
    bloque: 'C',
    tipo: 'unica',
    nivel: 'comprension',
    dificultad: 3,
    enunciado:
      'La grasa almacena mucha más energía que el glucógeno y, aun así, no sirve para sostener un sprint. ¿Por qué?',
    opciones: [
      'Porque su oxidación es lenta y no entrega ATP al ritmo que exige la intensidad máxima',
      'Porque el músculo esquelético entrenado no dispone de enzimas capaces de oxidarla',
      'Porque los depósitos de grasa del organismo son demasiado pequeños para ese esfuerzo',
      'Porque su oxidación necesita más oxígeno del que llega en cualquier situación de reposo',
    ],
    correcta: 0,
    explicacion:
      'La grasa gana en cantidad total y pierde en velocidad: la β-oxidación tiene muchos más pasos y depende del transporte por carnitina, así que entrega ATP despacio. Un sprint exige potencia, no reservas. El distractor más tentador es el del oxígeno, que apunta a algo real —la oxidación lipídica es más costosa en oxígeno por ATP— pero no explica el sprint, donde el problema es que no da tiempo. Dato para recordar: la grasa es el depósito grande, la fosfocreatina es el grifo rápido.',
    referencia: 'Cartilla 3, Tema 1, Subtema 1.5 — Oxidación de lípidos',
    etiquetas: ['lípidos', 'potencia', 'β-oxidación'],
  },
  {
    id: 'C1-019',
    modulo: 'c1-vias-energeticas',
    bloque: 'C',
    tipo: 'multiple',
    nivel: 'comprension',
    dificultad: 2,
    enunciado: 'Seleccione las TRES afirmaciones correctas sobre las vías energéticas.',
    opciones: [
      'La reacción de la fosfocreatina es reversible y se recarga durante la recuperación',
      'La glucólisis rinde 2 ATP netos en su fase citoplasmática',
      'El ciclo de Krebs y la cadena transportadora dependen de la disponibilidad de oxígeno',
      'Las tres vías se activan en relevos, y cada una espera a que la anterior se agote del todo',
      'El sistema aeróbico es la vía capaz de entregar ATP a mayor velocidad por unidad de tiempo',
    ],
    correctas: [0, 1, 2],
    explicacion:
      'Las tres primeras describen bien el funcionamiento: reacción reversible, 2 ATP netos citoplasmáticos y dependencia de oxígeno de las etapas mitocondriales. La cuarta es el error conceptual más frecuente del módulo: las vías funcionan a la vez desde el primer segundo y lo que cambia es cuál predomina. Y la quinta invierte la escala de potencia: el sistema aeróbico es el de mayor capacidad total y el de menor velocidad de entrega. Dato para recordar: predominio no es exclusividad.',
    referencia: 'Cartilla 3, Tema 1, Subtema 1.1 — Sistemas energéticos: visión general',
    etiquetas: ['vías energéticas', 'simultaneidad', 'potencia'],
  },
  {
    id: 'C1-020',
    modulo: 'c1-vias-energeticas',
    bloque: 'C',
    tipo: 'ordenar',
    nivel: 'comprension',
    dificultad: 2,
    enunciado:
      'Ordene las vías energéticas según el momento en que predominan durante un esfuerzo máximo continuo, de la primera a la última.',
    elementos: [
      'ATP libre almacenado en la fibra (2–3 s)',
      'Sistema fosfágeno con fosfocreatina (5–15 s)',
      'Glucólisis anaeróbica con producción de lactato (30 s – 2 min)',
      'Metabolismo aeróbico con oxidación de glucógeno (más de 2–3 min)',
      'Metabolismo aeróbico con predominio de la oxidación de lípidos (esfuerzos largos)',
    ],
    ordenCorrecto: [0, 1, 2, 3, 4],
    explicacion:
      'El orden de predominio va de la vía más rápida y de menor capacidad a la más lenta y de mayor capacidad. El punto que más se confunde es el final: se coloca la oxidación de lípidos antes que la de glucógeno porque «la grasa es para lo suave», cuando dentro del trabajo aeróbico el glucógeno domina primero y el peso de la grasa crece conforme se alarga el esfuerzo. Dato para recordar: la secuencia es rápido y poco, lento y mucho; nunca al revés.',
    referencia: 'Cartilla 3, Tema 1, Subtema 1.1 — Sistemas energéticos: visión general',
    etiquetas: ['vías energéticas', 'secuencia', 'predominio'],
  },
  {
    id: 'C1-021',
    modulo: 'c1-vias-energeticas',
    bloque: 'C',
    tipo: 'unica',
    nivel: 'comprension',
    dificultad: 3,
    enunciado:
      'Un entrenador afirma que durante los primeros diez segundos de un sprint el metabolismo aeróbico está apagado. ¿Qué corrige esa afirmación?',
    opciones: [
      'Las tres vías funcionan simultáneamente desde el inicio y lo que varía es cuál aporta la mayor parte del ATP',
      'El metabolismo aeróbico se activa a partir del minuto tres, cuando ya se agotó la vía láctica',
      'El metabolismo aeróbico permanece inactivo hasta que el lactato alcanza su valor máximo',
      'Solo el sistema fosfágeno funciona en ese tramo, porque bloquea a las otras dos vías',
    ],
    correcta: 0,
    explicacion:
      'El organismo no cambia de vía como quien cambia de marcha: las tres funcionan desde el primer segundo y lo único que varía es la proporción con la que cada una aporta ATP. El distractor más tentador es el del minuto tres, porque es el tiempo real a partir del cual el aporte aeróbico se vuelve mayoritario: se convierte en error al leer «predomina» como «empieza». Dato para recordar: las vías se solapan, y las tablas de duración describen predominio, no encendido y apagado.',
    referencia: 'Cartilla 3, Tema 1, Subtema 1.1 — Sistemas energéticos: visión general',
    etiquetas: ['simultaneidad', 'predominio', 'concepto'],
  },
  {
    id: 'C1-022',
    modulo: 'c1-vias-energeticas',
    bloque: 'C',
    tipo: 'multiple',
    nivel: 'aplicacion',
    dificultad: 3,
    enunciado:
      'Un entrenador prepara a un lanzador de peso, cuyo gesto dura menos de 2 segundos. Seleccione las DOS decisiones coherentes con la vía energética implicada.',
    opciones: [
      'Programar descansos completos entre intentos, de 2 a 5 minutos',
      'Mantener las series muy cortas, de pocas repeticiones y a intensidad máxima',
      'Acortar los descansos a 30 segundos para acumular fatiga y ganar tolerancia',
      'Programar series de 15 repeticiones para mejorar la resistencia del gesto de lanzamiento',
      'Trabajar de forma continua durante 20 minutos por encima del umbral anaeróbico',
    ],
    correctas: [0, 1],
    explicacion:
      'Un gesto de menos de 2 segundos vive del ATP libre y de la fosfocreatina, así que el trabajo se organiza en series muy cortas a intensidad máxima con descansos largos, que es lo que permite reponer la fosfocreatina antes del intento siguiente. El distractor más tentador son los descansos de 30 segundos: es una decisión correcta para trabajo láctico, y aquí lo único que consigue es que el segundo intento salga con las reservas a medias. Dato para recordar: en trabajo aláctico el descanso es parte del estímulo.',
    referencia: 'Cartilla 3, Tema 1, Subtema 1.6 — %1RM y vía energética dominante',
    etiquetas: ['aláctico', 'prescripción', 'descanso'],
  },
  {
    id: 'C1-023',
    modulo: 'c1-vias-energeticas',
    bloque: 'C',
    tipo: 'calculo',
    nivel: 'aplicacion',
    dificultad: 1,
    enunciado:
      'Si una molécula de glucosa oxidada por completo en el músculo esquelético rinde 30 ATP, ¿cuánto ATP rinden 3 moléculas de glucosa en ese mismo tejido?',
    respuesta: 90,
    tolerancia: 1,
    unidad: 'ATP',
    pasos: [
      'En músculo esquelético, la lanzadera de glicerol-3-fosfato fija el rendimiento en 30 ATP por glucosa',
      'Rendimiento total = 30 ATP × 3 moléculas',
      'Rendimiento total = 90 ATP',
    ],
    explicacion:
      'El cálculo es directo, y lo que se evalúa es haber fijado el valor correcto de partida: con los 36 ATP que todavía circulan en muchos apuntes el resultado sería 108, y con los 32 de otros tejidos serían 96. El error más frecuente no está en la multiplicación sino en la cifra que se multiplica. Dato para recordar: en músculo esquelético son 30 por glucosa, porque la lanzadera del glicerol-3-fosfato degrada el NADH citoplasmático a FADH₂ antes de cobrarlo.',
    referencia: 'Cartilla 3, Tema 1, Subtema 1.4 — Glucólisis aeróbica y ciclo de Krebs',
    etiquetas: ['ATP', 'cálculo', 'balance energético'],
  },
  {
    id: 'C1-024',
    modulo: 'c1-vias-energeticas',
    bloque: 'C',
    tipo: 'calculo',
    nivel: 'aplicacion',
    dificultad: 2,
    enunciado:
      'Una fibra degrada 4 moléculas de glucosa por glucólisis y el piruvato se reduce a lactato. ¿Cuántos ATP netos obtiene la fibra de ese proceso?',
    respuesta: 8,
    tolerancia: 0.5,
    unidad: 'ATP',
    pasos: [
      'La glucólisis produce 4 ATP brutos y consume 2 en la fase de inversión: el neto es de 2 ATP por glucosa',
      'Sin oxígeno, el NADH se gasta en reducir el piruvato a lactato y no llega a la cadena transportadora',
      'ATP netos = 2 ATP × 4 moléculas',
      'ATP netos = 8 ATP',
    ],
    explicacion:
      'Sin oxígeno solo se cobra la fase citoplasmática, y son 2 ATP netos por glucosa: 8 en total. El error más frecuente es contar los 4 ATP brutos y responder 16, olvidando la inversión inicial. El segundo error es sumar el rendimiento de los 2 NADH: en anaerobiosis esos NADH se consumen en la propia reducción del piruvato a lactato y no llegan a la mitocondria. Dato para recordar: la vía láctica es rapidísima y paga malísimo, y por eso no puede sostener el esfuerzo mucho tiempo.',
    referencia: 'Cartilla 3, Tema 1, Subtema 1.3 — Glucólisis anaeróbica',
    etiquetas: ['glucólisis', 'cálculo', 'ATP'],
  },
  {
    id: 'C1-025',
    modulo: 'c1-vias-energeticas',
    bloque: 'C',
    tipo: 'calculo',
    nivel: 'aplicacion',
    dificultad: 3,
    enunciado:
      'De los 30 ATP que rinde una glucosa oxidada por completo en el músculo esquelético, ¿qué porcentaje aporta la fase citoplasmática de la glucólisis? Responda con un decimal.',
    respuesta: 6.7,
    tolerancia: 0.4,
    unidad: '%',
    pasos: [
      'La fase citoplasmática aporta 2 ATP netos',
      'El rendimiento total en músculo esquelético es de 30 ATP',
      'Porcentaje = (2 / 30) × 100',
      'Porcentaje = 6,67 ≈ 6,7 %',
    ],
    explicacion:
      'Menos del 7 % del ATP de una glucosa sale de la parte anaeróbica: el 93 % restante lo aportan las etapas mitocondriales. Ese número explica por qué un deportista de resistencia depende del oxígeno hasta ese punto, y por qué la glucólisis anaeróbica solo puede ser una solución de emergencia. El error más frecuente es dividir entre 32 en lugar de 30, que da 6,3 % y también entra en tolerancia. Dato para recordar: la mitocondria hace prácticamente todo el trabajo.',
    referencia: 'Cartilla 3, Tema 1, Subtema 1.4 — Glucólisis aeróbica y ciclo de Krebs',
    etiquetas: ['ATP', 'cálculo', 'porcentaje'],
  },
  {
    id: 'C1-026',
    modulo: 'c1-vias-energeticas',
    bloque: 'C',
    tipo: 'caso',
    nivel: 'aplicacion',
    dificultad: 2,
    viñeta:
      'Un velocista cubre los 100 metros lisos en poco menos de 11 segundos. Su entrenador quiere justificar por escrito, ante la federación, qué sistema energético sostiene la prueba y cómo se organiza el trabajo de pista en consecuencia.',
    enunciado: '¿Qué sistema predomina y qué organización del trabajo le corresponde?',
    opciones: [
      'El sistema fosfágeno; series muy cortas a intensidad máxima con descansos completos que permitan reponer la fosfocreatina',
      'La glucólisis anaeróbica; series de 90 segundos con descansos incompletos para tolerar el lactato',
      'El metabolismo aeróbico; rodajes continuos prolongados para elevar la densidad mitocondrial',
      'El ATP libre almacenado; repeticiones de 2 segundos con recuperación mínima entre ellas',
    ],
    correcta: 0,
    explicacion:
      'Once segundos caen de lleno en el rango de 5–15 segundos del sistema fosfágeno, y el trabajo que le corresponde son repeticiones máximas y cortas con descanso completo. El distractor más tentador es el del ATP libre: acierta en que es una vía aláctica, pero los 2–3 segundos del ATP libre no cubren la prueba, y prescribir repeticiones de 2 segundos entrenaría el arranque y nada más. Dato para recordar: la prueba dura 11 segundos, así que la unidad de trabajo también tiene que durar eso.',
    referencia: 'Cartilla 3, Tema 1, Subtema 1.6 — %1RM y vía energética dominante',
    etiquetas: ['sistema fosfágeno', 'velocidad', 'prescripción'],
  },
  {
    id: 'C1-027',
    modulo: 'c1-vias-energeticas',
    bloque: 'C',
    tipo: 'caso',
    nivel: 'aplicacion',
    dificultad: 2,
    viñeta:
      'Una atleta de 400 metros lisos termina la prueba en 58 segundos y describe una sensación de ardor intenso en los muslos en los últimos 100 metros, con pérdida evidente de velocidad pese a que sigue empujando con todo.',
    enunciado: '¿Qué explica fisiológicamente ese tramo final?',
    opciones: [
      'La glucólisis anaeróbica domina el esfuerzo y la acumulación de metabolitos deteriora la contracción',
      'Las reservas de fosfocreatina se agotaron y desde ese momento no queda ninguna vía disponible',
      'El metabolismo aeróbico ya cubre todo el esfuerzo y la fatiga es solo de origen nervioso central',
      'La atleta agotó por completo el glucógeno muscular de las piernas en menos de un minuto',
    ],
    correcta: 0,
    explicacion:
      'Una prueba de 58 segundos vive de la glucólisis anaeróbica, y el ardor con caída de velocidad corresponde a la acumulación de metabolitos que interfiere en la contracción. El distractor más tentador es el agotamiento del glucógeno: es una causa real de fatiga, pero en esfuerzos de horas, no de un minuto — en 400 metros no da tiempo a vaciar el depósito. Dato para recordar: en el medio fondo corto la fatiga es metabólica por acumulación, no por vaciado del depósito.',
    referencia: 'Cartilla 3, Tema 1, Subtema 1.3 — Glucólisis anaeróbica',
    etiquetas: ['glucólisis anaeróbica', 'fatiga', 'lactato'],
  },
  {
    id: 'C1-028',
    modulo: 'c1-vias-energeticas',
    bloque: 'C',
    tipo: 'caso',
    nivel: 'aplicacion',
    dificultad: 3,
    viñeta:
      'Un entrenador programa sentadillas al 90 % del 1RM, con 4 repeticiones por serie. Un compañero le sugiere bajar el descanso a 45 segundos «para que la sesión rinda más y no se pierda tiempo entre series».',
    enunciado: '¿Qué corresponde responder desde el punto de vista de la vía energética implicada?',
    opciones: [
      'Que un trabajo por encima del 85 % del 1RM es aláctico y exige de 2 a 5 minutos de descanso para reponer la fosfocreatina',
      'Que el descanso corto es correcto porque el trabajo pesado se sostiene con la vía aeróbica',
      'Que el descanso no influye en la calidad de la serie mientras la carga se mantenga alta',
      'Que 45 segundos son suficientes porque a esa intensidad no llega a producirse lactato alguno',
    ],
    correcta: 0,
    explicacion:
      'Por encima del 85 % del 1RM y con menos de 6 repeticiones la serie dura menos de 15 segundos y se paga con fosfocreatina, cuya reposición necesita minutos: con 45 segundos la serie siguiente arranca con el depósito a medias y la carga se convierte en trabajo láctico mal hecho. El distractor más tentador es el último, porque parte de algo cierto —el trabajo es aláctico— y concluye lo contrario: precisamente porque es aláctico hace falta el descanso largo. Dato para recordar: el descanso no es tiempo perdido, es parte de la prescripción.',
    referencia: 'Cartilla 3, Tema 1, Subtema 1.6 — %1RM y vía energética dominante',
    etiquetas: ['1RM', 'aláctico', 'descanso', 'prescripción'],
  },
];
