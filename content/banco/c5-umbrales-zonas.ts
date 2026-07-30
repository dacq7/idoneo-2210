// content/banco/c5-umbrales-zonas.ts
// Módulo piloto. PLANTILLA DE ORO para los otros 28 módulos.
//
// C5-001 … C5-025: transcripción literal de §14.3 del blueprint.
// C5-026 … C5-028: escritos en el Paso 8 por ADR-006 — el bloque C exige 28
//   ítems, no 25, y al subir n de 25 a 28 los umbrales de `verificarCuotas`
//   se mueven. El nivel de cada uno viene forzado por ese cálculo:
//   +1 recuerdo (11/28 = 39,3 % < 40 %), +1 comprensión (8/28 = 28,6 % < 30 %)
//   y el tercero a aplicación para dejar holgura en vez de rozar el umbral.
//   Reparto final: 12 recuerdo · 9 comprensión · 7 aplicación.
//
// Los ítems son datos literales: nunca se generan con map(), plantillas ni
// funciones auxiliares. 28 objetos a mano son legibles, revisables y diffeables.
import type { Item } from '@/lib/tipos';

export const ITEMS: Item[] = [
  {
    id: 'C5-001',
    modulo: 'c5-umbrales-zonas',
    bloque: 'C',
    tipo: 'unica',
    nivel: 'recuerdo',
    dificultad: 1,
    enunciado: '¿Cuál es el objetivo del trabajo en la zona R0?',
    opciones: [
      'Calentamiento, recuperación activa y eliminación de desechos metabólicos',
      'Optimizar la oxidación de las grasas como sustrato principal',
      'Aumentar la tolerancia a la acumulación de lactato',
      'Desarrollar la potencia aeróbica máxima',
    ],
    correcta: 0,
    explicacion:
      'R0 es la zona por debajo del 65 %: no busca adaptación, busca recuperación. Se usa en el calentamiento, en la vuelta a la calma y en la sesión regenerativa del día siguiente a competir. El distractor más tentador es la oxidación de grasas, que corresponde a R1 (65–75 %): mucha gente asume que "más suave = más grasa", pero la máxima oxidación de lípidos exige una intensidad mínima que R0 no alcanza. Dato para recordar: R0 no entrena, prepara y recupera.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.6 — Zonas de entrenamiento',
    etiquetas: ['R0', 'recuperación activa', 'zonas'],
  },
  {
    id: 'C5-002',
    modulo: 'c5-umbrales-zonas',
    bloque: 'C',
    tipo: 'unica',
    nivel: 'recuerdo',
    dificultad: 1,
    enunciado: '¿En qué rango porcentual se ubica la zona R1, correspondiente al umbral aeróbico o VT1?',
    opciones: ['65–75 %', 'Por debajo del 65 %', '80–90 %', '90–95 %'],
    correcta: 0,
    explicacion:
      'R1 corresponde al umbral aeróbico (VT1) y se ubica entre el 65 y el 75 %. Los tres distractores son los rangos de las otras tres zonas: por debajo del 65 % es R0, el 80–90 % de la FCmáx es R2 y el 90–95 % es R3. El error más común es confundir R1 con R0 porque las dos se perciben como "suaves"; la diferencia es que R1 sí produce adaptación aeróbica y R0 no. Dato para recordar: R1 es la zona del fondo largo del maratonista.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.6.1 — Umbral Ventilatorio 1',
    etiquetas: ['R1', 'VT1', 'umbral aeróbico'],
  },
  {
    id: 'C5-003',
    modulo: 'c5-umbrales-zonas',
    bloque: 'C',
    tipo: 'unica',
    nivel: 'recuerdo',
    dificultad: 1,
    enunciado: '¿Cuál es el sustrato energético dominante en el trabajo de zona R3?',
    opciones: [
      'El glucógeno',
      'Los triglicéridos intramusculares',
      'Los ácidos grasos libres del tejido adiposo',
      'La fosfocreatina muscular',
    ],
    correcta: 0,
    explicacion:
      'En R3 (90–95 %) el sustrato dominante es el glucógeno: la intensidad es demasiado alta para que la oxidación de lípidos, que es un proceso lento, aporte energía al ritmo requerido. Los triglicéridos intramusculares son el distractor más tentador porque son grasa dentro del músculo, pero su uso es característico de R1, no de R3. La fosfocreatina cubre esfuerzos máximos de segundos, no series de minutos cerca del VO₂máx. Dato para recordar: a más intensidad, más peso del hidrato de carbono.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.6.3 — Zona R3',
    etiquetas: ['R3', 'glucógeno', 'sustrato'],
  },
  {
    id: 'C5-004',
    modulo: 'c5-umbrales-zonas',
    bloque: 'C',
    tipo: 'vf',
    nivel: 'recuerdo',
    dificultad: 1,
    enunciado:
      'El máximo estado estable de lactato (MLSS) se ubica dentro de la zona R1, por debajo del umbral aeróbico.',
    correcta: false,
    explicacion:
      'Falso. El MLSS está en R2, en el entorno del umbral anaeróbico (VT2), no en R1. Es la intensidad más alta a la que el lactato en sangre se mantiene constante en el tiempo; por debajo del VT1 el lactato ni siquiera se eleva sobre los valores de reposo, así que hablar de "estado estable máximo" ahí no tiene sentido. La confusión nace de asociar "estable" con "suave". Dato para recordar: MLSS y VT2 viven en la misma vecindad, en R2.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.6.2 — Umbral Ventilatorio 2',
    etiquetas: ['MLSS', 'R2', 'VT2'],
  },
  {
    id: 'C5-005',
    modulo: 'c5-umbrales-zonas',
    bloque: 'C',
    tipo: 'unica',
    nivel: 'recuerdo',
    dificultad: 2,
    enunciado:
      '¿Cuál es la participación aeróbica y anaeróbica aproximada del trabajo realizado en la zona R2?',
    opciones: [
      '95 % aeróbico / 5 % anaeróbico',
      '99 % aeróbico / 1 % anaeróbico',
      '80 % aeróbico / 20 % anaeróbico',
      '65 % aeróbico / 35 % anaeróbico',
    ],
    correcta: 0,
    explicacion:
      'En R2 la participación es de 95 % aeróbica y 5 % anaeróbica. El distractor más tentador es 99 % / 1 %, que corresponde a R1: la diferencia parece mínima pero marca el paso del trabajo puramente aeróbico al trabajo que ya genera lactato de forma apreciable. El 65 % / 35 % corresponde a R3. Dato para recordar: la serie de participación anaeróbica sube 1 % → 5 % → 35 % al pasar de R1 a R2 y a R3; el salto grande está entre R2 y R3.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.6.2 — Umbral Ventilatorio 2',
    etiquetas: ['R2', 'participación aeróbica', 'VT2'],
  },
  {
    id: 'C5-006',
    modulo: 'c5-umbrales-zonas',
    bloque: 'C',
    tipo: 'emparejar',
    nivel: 'recuerdo',
    dificultad: 2,
    enunciado: 'Relacione cada zona de entrenamiento con su objetivo principal.',
    izquierda: ['R0', 'R1 (VT1)', 'R2 (VT2)', 'R3'],
    derecha: [
      'Recuperación activa y eliminación de desechos metabólicos',
      'Eficiencia aeróbica y máxima oxidación de lípidos',
      'Oxidación del glucógeno y mejora de las adaptaciones cardíacas centrales',
      'Potencia aeróbica: densidad capilar, mitocondrial y enzimas oxidativas',
    ],
    pares: [
      [0, 0],
      [1, 1],
      [2, 2],
      [3, 3],
    ],
    explicacion:
      'La confusión más frecuente es intercambiar R1 y R2: se asume que "quemar grasa" es lo mismo que "trabajo aeróbico duro", cuando la máxima oxidación de lípidos ocurre en R1 y R2 pasa a depender casi exclusivamente del hidrato de carbono. La otra confusión es asignar a R0 alguna adaptación: R0 no adapta nada, solo facilita la recuperación. Dato para recordar: la progresión de objetivos es recuperar → oxidar grasa → oxidar glucógeno → elevar el techo aeróbico.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.6 — Zonas de entrenamiento',
    etiquetas: ['zonas', 'objetivos', 'clasificación'],
  },
  {
    id: 'C5-007',
    modulo: 'c5-umbrales-zonas',
    bloque: 'C',
    tipo: 'unica',
    nivel: 'aplicacion',
    dificultad: 2,
    enunciado:
      'Un fondista entrena de forma continua al 70 % de su VO₂máx. ¿Qué adaptación busca prioritariamente ese trabajo?',
    opciones: [
      'Optimizar la oxidación de grasas y aumentar los triglicéridos intramusculares',
      'Aumentar la tolerancia al lactato por encima del MLSS',
      'Incrementar la potencia aeróbica máxima trabajando cerca del VO₂máx',
      'Reponer los depósitos de fosfocreatina tras esfuerzos explosivos',
    ],
    correcta: 0,
    explicacion:
      'El 70 % del VO₂máx cae en R1, la zona del umbral aeróbico (VT1), donde el uso de lípidos como sustrato es máximo. El entrenamiento continuo en esta intensidad mejora la eficiencia aeróbica y aumenta el depósito de triglicéridos intramusculares (IMTG). La opción de tolerancia al lactato corresponde a R2 (75–85 % del VO₂máx), y la de potencia aeróbica a R3 (90–95 %). La fosfocreatina no es la vía dominante en trabajo continuo.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.6.1 — Umbral Ventilatorio 1',
    etiquetas: ['R1', 'VT1', 'umbral aeróbico', 'IMTG'],
  },
  {
    id: 'C5-008',
    modulo: 'c5-umbrales-zonas',
    bloque: 'C',
    tipo: 'unica',
    nivel: 'comprension',
    dificultad: 2,
    enunciado:
      'Un entrenador anota que la zona R2 va del 75 al 85 % y otro que va del 80 al 90 %. Ninguno se equivocó. ¿Cómo se explica la diferencia?',
    opciones: [
      'El primer rango está expresado en porcentaje del VO₂máx y el segundo en porcentaje de la FCmáx',
      'El primer rango corresponde al umbral aeróbico y el segundo al umbral anaeróbico',
      'El primer rango se aplica a deportistas entrenados y el segundo a personas sedentarias',
      'El segundo rango incluye parte de la zona R3 dentro del cálculo',
    ],
    correcta: 0,
    explicacion:
      'R2 se expresa como 75–85 % del VO₂máx y como 80–90 % de la FCmáx: son dos escalas distintas para la misma zona, no dos versiones en conflicto. La frecuencia cardíaca y el consumo de oxígeno no crecen en paralelo perfecto, así que un mismo esfuerzo ocupa posiciones distintas en cada escala. El distractor de "entrenados vs sedentarios" es tentador porque sí existen diferencias individuales, pero no explican este par concreto de rangos. Dato para recordar: antes de aplicar un porcentaje, pregunta siempre porcentaje de qué.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.6.2 — Umbral Ventilatorio 2',
    etiquetas: ['R2', 'FCmáx', 'VO₂máx', 'prescripción'],
  },
  {
    id: 'C5-009',
    modulo: 'c5-umbrales-zonas',
    bloque: 'C',
    tipo: 'unica',
    nivel: 'recuerdo',
    dificultad: 1,
    enunciado: '¿En qué zona de entrenamiento se ubican el HIIT y el SIT?',
    opciones: ['R3 / R3+', 'R0', 'R1', 'R2'],
    correcta: 0,
    explicacion:
      'Tanto el HIIT como el SIT se ubican en R3/R3+ (90–95 %), la zona de la potencia aeróbica. El distractor más tentador es R2, porque el trabajo interválico duro "se siente" como un esfuerzo sostenido de umbral; la diferencia está en que el HIIT busca acercarse al VO₂máx, no sostenerse por debajo del MLSS. Dato para recordar: R2 es el techo de lo sostenible, R3 es donde se rompe ese techo a intervalos.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.6.3 — Zona R3',
    etiquetas: ['HIIT', 'SIT', 'R3'],
  },
  {
    id: 'C5-010',
    modulo: 'c5-umbrales-zonas',
    bloque: 'C',
    tipo: 'multiple',
    nivel: 'recuerdo',
    dificultad: 2,
    enunciado: 'Seleccione las DOS adaptaciones que corresponden al trabajo en la zona R3.',
    opciones: [
      'Aumento de la densidad capilar',
      'Aumento de la densidad mitocondrial y de la actividad de las enzimas oxidativas',
      'Aumento de los triglicéridos intramusculares',
      'Aumento de la volemia y del volumen sistólico',
      'Eliminación acelerada de desechos metabólicos tras el esfuerzo',
    ],
    correctas: [0, 1],
    explicacion:
      'R3 produce adaptaciones periféricas y enzimáticas: más capilares, más mitocondrias y más actividad de las enzimas oxidativas, que son las que permiten elevar el VO₂máx. Los tres distractores son adaptaciones reales pero de otras zonas: los IMTG corresponden a R1, la volemia y el volumen sistólico a R2, y la eliminación de desechos a R0. Ese es justamente el patrón que hay que dominar. Dato para recordar: R2 adapta el centro (el corazón), R3 adapta la periferia (el músculo).',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.6.3 — Zona R3',
    etiquetas: ['R3', 'adaptaciones', 'densidad mitocondrial'],
  },
  {
    id: 'C5-011',
    modulo: 'c5-umbrales-zonas',
    bloque: 'C',
    tipo: 'calculo',
    nivel: 'aplicacion',
    dificultad: 1,
    enunciado:
      'Un entrenador de 40 años quiere trabajar en el límite inferior de la zona R1, es decir al 65 % de su frecuencia cardíaca máxima. Calcule esa frecuencia usando la fórmula de Fox et al. (1971).',
    respuesta: 117,
    tolerancia: 1,
    unidad: 'lpm',
    pasos: [
      'Fox et al. (1971): FCmáx = 220 − edad',
      'FCmáx = 220 − 40 = 180 lpm',
      'Límite inferior de R1 = 65 % de la FCmáx',
      'FC objetivo = 180 × 0,65 = 117 lpm',
    ],
    explicacion:
      'La fórmula de Fox es la más conocida y la más simple: 220 menos la edad. El error habitual es aplicar el porcentaje sobre la frecuencia de reserva en lugar de sobre la FCmáx: eso sería el método de Karvonen y daría un valor distinto, más alto. Aquí el enunciado pide explícitamente porcentaje de la FCmáx. Dato para recordar: 65 % de la FCmáx es el piso de R1 y a la vez el techo de R0.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.1 — Tabla 2',
    etiquetas: ['FCmáx', 'Fox', 'R1', 'prescripción'],
  },
  {
    id: 'C5-012',
    modulo: 'c5-umbrales-zonas',
    bloque: 'C',
    tipo: 'unica',
    nivel: 'comprension',
    dificultad: 2,
    enunciado: '¿Qué distingue al modelo de distribución polarizado del modelo "entre umbrales"?',
    opciones: [
      'El polarizado concentra el volumen por debajo del VT1 y el resto por encima del VT2, evitando la zona intermedia',
      'El polarizado reparte el volumen de forma pareja entre las cuatro zonas de entrenamiento',
      'El polarizado concentra el trabajo justamente en la zona situada entre VT1 y VT2',
      'El polarizado prioriza el volumen total sobre la intensidad en todas las sesiones',
    ],
    correcta: 0,
    explicacion:
      'El modelo polarizado evita deliberadamente la zona intermedia: mucho volumen por debajo de VT1 y el resto por encima de VT2. El distractor más tentador es el tercero, que describe exactamente el modelo contrario ("entre umbrales", el clásico trabajo de tempo): son opuestos, y el examen los presenta juntos precisamente por eso. El cuarto describe el modelo de baja intensidad y alto volumen. Dato para recordar: si la pregunta dice "evita la zona 2", la respuesta es polarizado.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.6.4 — Modelos de distribución',
    etiquetas: ['polarizado', 'entre umbrales', 'distribución'],
  },
  {
    id: 'C5-013',
    modulo: 'c5-umbrales-zonas',
    bloque: 'C',
    tipo: 'caso',
    nivel: 'aplicacion',
    dificultad: 2,
    viñeta:
      'Una corredora prepara su primer maratón. Su entrenador le programa cinco sesiones semanales, todas a un ritmo exigente en el que ella solo puede decir frases cortas. A las tres semanas llega fatigada a cada sesión y no logra completar los fondos largos. El objetivo declarado del bloque era mejorar el uso de las grasas como combustible.',
    enunciado: '¿Qué ajuste corresponde hacer al plan?',
    opciones: [
      'Bajar la mayoría de las sesiones a R1, la zona donde la oxidación de lípidos es máxima',
      'Subir las sesiones a R3 para elevar la potencia aeróbica y así mejorar el uso de grasas',
      'Mantener la intensidad pero reducir el número de sesiones semanales a tres',
      'Cambiar los fondos largos por series cortas a intensidad máxima con recuperación completa',
    ],
    correcta: 0,
    explicacion:
      'El ritmo descrito, en el que solo caben frases cortas, es propio de R2. Si el objetivo del bloque es mejorar la oxidación de lípidos, la zona correcta es R1 (65–75 %), donde el aporte de grasa como sustrato alcanza su máximo y la fatiga acumulada es baja. El distractor más tentador es reducir el número de sesiones manteniendo la intensidad: resolvería la fatiga pero no el objetivo, porque en R2 el sustrato sigue siendo casi exclusivamente hidrato de carbono. Dato para recordar: el problema no era el volumen, era la zona.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.6.1 — Umbral Ventilatorio 1',
    etiquetas: ['R1', 'prescripción', 'oxidación de lípidos', 'fondo'],
  },
  {
    id: 'C5-014',
    modulo: 'c5-umbrales-zonas',
    bloque: 'C',
    tipo: 'unica',
    nivel: 'recuerdo',
    dificultad: 2,
    enunciado: '¿Qué describe el máximo estado estable de lactato (MLSS)?',
    opciones: [
      'La intensidad más alta a la que la concentración de lactato en sangre se mantiene constante en el tiempo',
      'La concentración de lactato que se alcanza al final de un esfuerzo máximo',
      'La intensidad a la que el lactato en sangre vuelve a los valores de reposo tras el esfuerzo',
      'La cantidad de lactato que el hígado puede reconvertir en glucosa por minuto',
    ],
    correcta: 0,
    explicacion:
      'El MLSS es una intensidad, no una concentración: la más alta a la que producción y eliminación de lactato se equilibran y la cifra en sangre deja de subir. El distractor más tentador es el segundo, que confunde el MLSS con el lactato pico de un test máximo; ese valor puede ser muy alto y no dice nada sobre sostenibilidad. Dato para recordar: MLSS responde a "hasta dónde puedo sostener", no a "cuánto lactato tengo".',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.6.2 — Umbral Ventilatorio 2',
    etiquetas: ['MLSS', 'lactato', 'VT2'],
  },
  {
    id: 'C5-015',
    modulo: 'c5-umbrales-zonas',
    bloque: 'C',
    tipo: 'ordenar',
    nivel: 'comprension',
    dificultad: 2,
    enunciado: 'Ordene las siguientes intensidades de trabajo de menor a mayor.',
    elementos: [
      'R0 — por debajo del 65 %: recuperación activa y eliminación de desechos',
      'R1 (VT1) — 65–75 %: máxima oxidación de lípidos',
      'R2 (VT2) — 80–90 % de la FCmáx: contiene el MLSS',
      'R3 — 90–95 %: potencia aeróbica, HIIT y SIT',
      'Esfuerzo supramáximo — por encima del VO₂máx: predominio anaeróbico',
    ],
    ordenCorrecto: [0, 1, 2, 3, 4],
    explicacion:
      'La secuencia de intensidad es R0 → R1 → R2 → R3 → supramáximo. El punto que más se confunde es la posición de R2 respecto a R1: como R2 se expresa a veces en porcentaje del VO₂máx (75–85 %) y R1 en porcentaje de la FCmáx, hay quien los cruza al compararlos sin fijarse en la escala. Otro error es colocar el trabajo supramáximo dentro de R3: R3 es potencia aeróbica, por encima ya no se sostiene el consumo de oxígeno. Dato para recordar: la participación anaeróbica crece 1 %, 5 %, 35 % a lo largo de la escala.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.6 — Zonas de entrenamiento',
    etiquetas: ['zonas', 'intensidad', 'secuencia'],
  },
  {
    id: 'C5-016',
    modulo: 'c5-umbrales-zonas',
    bloque: 'C',
    tipo: 'unica',
    nivel: 'comprension',
    dificultad: 3,
    enunciado: '¿Por qué la zona R1 es donde la oxidación de lípidos alcanza su máximo?',
    opciones: [
      'Porque la intensidad basta para movilizar ácidos grasos y sigue siendo baja para que el oxígeno disponible alcance a oxidarlos',
      'Porque a esa intensidad el músculo agota primero el glucógeno y se ve obligado a recurrir a la grasa',
      'Porque por debajo del 65 % los ácidos grasos no se pueden movilizar desde el tejido adiposo',
      'Porque la producción de lactato bloquea la entrada de glucosa a la fibra muscular',
    ],
    correcta: 0,
    explicacion:
      'La oxidación de grasas requiere oxígeno y es un proceso lento. En R1 se cumplen las dos condiciones: la intensidad es suficiente para movilizar ácidos grasos y todavía lo bastante baja para que el aporte de oxígeno cubra su oxidación. Por encima, el sistema recurre al hidrato porque produce ATP más rápido. El distractor del agotamiento de glucógeno es tentador porque describe algo real en esfuerzos de varias horas, pero no explica por qué la grasa domina desde el minuto uno en R1. Dato para recordar: en R1 la grasa aporta 20–40 % y el hidrato 60–80 %.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.6.1 — Umbral Ventilatorio 1',
    etiquetas: ['R1', 'oxidación de lípidos', 'sustrato'],
  },
  {
    id: 'C5-017',
    modulo: 'c5-umbrales-zonas',
    bloque: 'C',
    tipo: 'calculo',
    nivel: 'aplicacion',
    dificultad: 2,
    enunciado:
      'Un futbolista de 28 años debe trabajar en el límite superior de la zona R2, es decir al 90 % de su frecuencia cardíaca máxima. Calcule esa frecuencia usando la fórmula de Tanaka et al. (2001).',
    respuesta: 169.6,
    tolerancia: 0.6,
    unidad: 'lpm',
    pasos: [
      'Tanaka et al. (2001): FCmáx = 208 − (0,7 × edad)',
      'FCmáx = 208 − (0,7 × 28) = 208 − 19,6 = 188,4 lpm',
      'Límite superior de R2 = 90 % de la FCmáx',
      'FC objetivo = 188,4 × 0,90 = 169,56 ≈ 169,6 lpm',
    ],
    explicacion:
      'Tanaka se validó en hombres y mujeres sanos y da valores más altos que Fox a partir de los 40 años, más bajos antes. Aquí el error más frecuente es aplicar Fox por costumbre: 220 − 28 = 192, y el 90 % daría 172,8 lpm, tres latidos por encima. Tres latidos parecen poco, pero en el límite superior de R2 marcan la diferencia entre sostener la serie y romperla. Dato para recordar: cada fórmula tiene autor y población; usa la que pida el enunciado.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.1 — Tabla 2',
    etiquetas: ['FCmáx', 'Tanaka', 'R2', 'prescripción'],
  },
  {
    id: 'C5-018',
    modulo: 'c5-umbrales-zonas',
    bloque: 'C',
    tipo: 'emparejar',
    nivel: 'recuerdo',
    dificultad: 2,
    enunciado: 'Relacione cada modelo de distribución de la intensidad con su descripción.',
    izquierda: [
      'Baja intensidad / alto volumen',
      'Alta intensidad / bajo volumen',
      'Entre umbrales',
      'Polarizado',
    ],
    derecha: [
      'Cerca del 90 % del volumen por debajo del VT1',
      'Prioriza el trabajo por encima del VT2 con volumen total reducido',
      'Concentra el trabajo en la zona intermedia entre VT1 y VT2',
      'Mucho volumen bajo VT1 y el resto sobre VT2, evitando la zona intermedia',
    ],
    pares: [
      [0, 0],
      [1, 1],
      [2, 2],
      [3, 3],
    ],
    explicacion:
      'El par que más se falla es "entre umbrales" con "polarizado": son estrategias opuestas respecto a la misma zona. El modelo entre umbrales vive en la zona intermedia; el polarizado la evita a propósito. También se confunde "baja intensidad / alto volumen" con "polarizado", porque los dos acumulan mucho volumen suave; la diferencia es que el polarizado añade deliberadamente trabajo por encima del VT2. Dato para recordar: los cuatro modelos se distinguen por qué hacen con la zona intermedia.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.6.4 — Modelos de distribución',
    etiquetas: ['modelos de distribución', 'polarizado', 'clasificación'],
  },
  {
    id: 'C5-019',
    modulo: 'c5-umbrales-zonas',
    bloque: 'C',
    tipo: 'unica',
    nivel: 'comprension',
    dificultad: 3,
    enunciado:
      'El trabajo sostenido en R2 se asocia con aumento de la volemia, del volumen sistólico y del gasto cardíaco máximo. ¿Qué explica que esas tres adaptaciones aparezcan juntas?',
    opciones: [
      'Más volumen de sangre permite un mayor llenado ventricular, que eleva el volumen sistólico y con él el gasto cardíaco máximo',
      'El aumento del gasto cardíaco máximo obliga al corazón a hipertrofiarse, y esa hipertrofia eleva la volemia',
      'La acumulación de lactato estimula la producción de glóbulos rojos, lo que eleva directamente el volumen sistólico',
      'El entrenamiento eleva la frecuencia cardíaca máxima y esta arrastra al gasto cardíaco y al volumen sistólico',
    ],
    correcta: 0,
    explicacion:
      'La cadena va del volumen de sangre al llenado ventricular, de ahí al volumen sistólico y finalmente al gasto cardíaco máximo, que es el producto de frecuencia por volumen sistólico. El distractor más tentador es el último, porque suena razonable que "el corazón entrenado llegue más alto": en realidad la frecuencia cardíaca máxima no aumenta con el entrenamiento, es la frecuencia de reposo la que baja. Dato para recordar: con entrenamiento de resistencia baja la FC de reposo y suben el volumen sistólico y el gasto cardíaco máximo.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.6.2 — Umbral Ventilatorio 2',
    etiquetas: ['R2', 'volumen sistólico', 'gasto cardíaco', 'adaptaciones'],
  },
  {
    id: 'C5-020',
    modulo: 'c5-umbrales-zonas',
    bloque: 'C',
    tipo: 'caso',
    nivel: 'aplicacion',
    dificultad: 3,
    viñeta:
      'Un ciclista de fondo entrena 12 horas semanales. Su entrenador quiere pasarlo a un modelo polarizado. Actualmente reparte el volumen así: 3 h en R1, 8 h en la zona intermedia entre VT1 y VT2, y 1 h en R3.',
    enunciado: '¿Qué reparto semanal es coherente con el modelo polarizado?',
    opciones: [
      'Alrededor de 9,5 h por debajo de VT1 y 2,5 h por encima de VT2, sin trabajo en la zona intermedia',
      'Alrededor de 6 h por debajo de VT1, 4 h en la zona intermedia y 2 h por encima de VT2',
      'Reducir el volumen total a 6 h y concentrarlas todas por encima del VT2',
      'Mantener las 12 h repartidas por igual entre las cuatro zonas de entrenamiento',
    ],
    correcta: 0,
    explicacion:
      'El modelo polarizado concentra la mayor parte del volumen por debajo del VT1 y destina el resto a trabajo por encima del VT2, dejando vacía la zona intermedia. La primera opción hace exactamente eso. El distractor más tentador es el segundo reparto, que sí aumenta el volumen suave pero conserva 4 h en la zona intermedia: eso ya no es polarizado, es una distribución piramidal. La tercera opción describe el modelo de alta intensidad y bajo volumen. Dato para recordar: lo que define al polarizado es lo que NO tiene, no lo que tiene.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.6.4 — Modelos de distribución',
    etiquetas: ['polarizado', 'distribución', 'planificación'],
  },
  {
    id: 'C5-021',
    modulo: 'c5-umbrales-zonas',
    bloque: 'C',
    tipo: 'unica',
    nivel: 'recuerdo',
    dificultad: 1,
    enunciado: '¿Qué es la velocidad aeróbica máxima (VAM)?',
    opciones: [
      'La velocidad de desplazamiento más baja a la que ya se alcanza el VO₂máx',
      'La velocidad máxima que un deportista puede sostener durante una hora',
      'La velocidad a la que se sitúa el umbral aeróbico o VT1',
      'La velocidad punta alcanzada en un sprint de 30 metros lanzados',
    ],
    correcta: 0,
    explicacion:
      'La VAM es la velocidad más baja a la que ya se alcanza el consumo máximo de oxígeno. Sirve para prescribir intervalos en porcentaje de velocidad, más práctico que el porcentaje de frecuencia cardíaca en esfuerzos cortos, donde la FC responde con retraso. El distractor más tentador es "la velocidad sostenible durante una hora", que corresponde aproximadamente al umbral anaeróbico, no a la VAM. Dato para recordar: VAM es el punto donde se toca el techo aeróbico, no donde se sostiene.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.6.5 — Velocidad aeróbica máxima',
    etiquetas: ['VAM', 'VO₂máx', 'prescripción'],
  },
  {
    id: 'C5-022',
    modulo: 'c5-umbrales-zonas',
    bloque: 'C',
    tipo: 'multiple',
    nivel: 'comprension',
    dificultad: 3,
    enunciado: 'Seleccione las TRES afirmaciones correctas sobre los umbrales ventilatorios.',
    opciones: [
      'El VT1 marca el punto en que la ventilación empieza a crecer más rápido que el consumo de oxígeno',
      'Por encima del VT2 el lactato se acumula más rápido de lo que el organismo lo elimina',
      'El MLSS se sitúa en el entorno del VT2',
      'En deportistas entrenados el VT2 se ubica por debajo del VT1',
      'Por debajo del VT1 el sustrato dominante es el glucógeno muscular',
    ],
    correctas: [0, 1, 2],
    explicacion:
      'Las tres primeras describen correctamente el comportamiento de los umbrales. La cuarta invierte el orden: el VT2 siempre está por encima del VT1, en cualquier nivel de entrenamiento; lo que cambia con el entrenamiento es a qué porcentaje del VO₂máx aparecen, no su orden. La quinta confunde las zonas: por debajo del VT1 el aporte de grasas es máximo, y es en R2, por encima del VT1, donde el hidrato pasa a ser casi exclusivo. Dato para recordar: VT1 siempre antes que VT2; el MLSS acompaña al VT2.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.6.2 — Umbral Ventilatorio 2',
    etiquetas: ['VT1', 'VT2', 'MLSS', 'umbrales'],
  },
  {
    id: 'C5-023',
    modulo: 'c5-umbrales-zonas',
    bloque: 'C',
    tipo: 'calculo',
    nivel: 'aplicacion',
    dificultad: 3,
    enunciado:
      'Una corredora tiene una velocidad aeróbica máxima (VAM) de 18 km/h. El plan indica repeticiones de 3 minutos al 90 % de su VAM. ¿Qué distancia recorre en cada repetición?',
    respuesta: 810,
    tolerancia: 10,
    unidad: 'm',
    pasos: [
      'Velocidad de trabajo = 90 % de la VAM = 18 × 0,90 = 16,2 km/h',
      'Convertir a metros por minuto: 16,2 km/h = 16 200 m / 60 min = 270 m/min',
      'Distancia = velocidad × tiempo = 270 m/min × 3 min',
      'Distancia = 810 m',
    ],
    explicacion:
      'El paso que más se falla es la conversión de km/h a m/min: hay que multiplicar por 1000 y dividir entre 60, no dividir entre 3,6 (eso da m/s, y con 4,5 m/s × 180 s se llega igual a 810 m, pero mezclando unidades es fácil equivocarse). Prescribir en porcentaje de VAM tiene la ventaja de que la distancia sale directamente, sin esperar a que la frecuencia cardíaca se estabilice. Dato para recordar: al 100 % de VAM, 1 minuto equivale a la VAM en km/h dividida entre 0,06 metros.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.6.5 — Velocidad aeróbica máxima',
    etiquetas: ['VAM', 'cálculo', 'intervalos'],
  },
  {
    id: 'C5-024',
    modulo: 'c5-umbrales-zonas',
    bloque: 'C',
    tipo: 'unica',
    nivel: 'comprension',
    dificultad: 3,
    enunciado:
      'El SIT emplea repeticiones muy cortas a intensidad máxima, y sin embargo se ubica junto al HIIT en el trabajo de R3/R3+. ¿Cuál es la razón?',
    opciones: [
      'Su objetivo adaptativo es la potencia aeróbica: la repetición del estímulo con recuperaciones largas lleva el consumo de oxígeno cerca del VO₂máx',
      'Cada repetición se sostiene con el sistema anaeróbico aláctico, que también forma parte del metabolismo aeróbico',
      'Durante el sprint la frecuencia cardíaca se mantiene entre el 65 y el 75 % de la máxima',
      'El sustrato dominante durante cada sprint son los triglicéridos intramusculares',
    ],
    correcta: 0,
    explicacion:
      'Las zonas se definen por el objetivo adaptativo, no por la sensación del esfuerzo aislado. Aunque cada repetición de SIT sea supramáxima, la sesión completa acumula tiempo cerca del VO₂máx y produce las adaptaciones propias de R3: densidad capilar, densidad mitocondrial y enzimas oxidativas. El distractor más tentador afirma que el sistema aláctico forma parte del metabolismo aeróbico, lo cual es falso: es anaeróbico por definición. Dato para recordar: clasifica por adaptación buscada, no por cuánto duele la repetición.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.6.3 — Zona R3',
    etiquetas: ['SIT', 'HIIT', 'R3', 'potencia aeróbica'],
  },
  {
    id: 'C5-025',
    modulo: 'c5-umbrales-zonas',
    bloque: 'C',
    tipo: 'caso',
    nivel: 'comprension',
    dificultad: 3,
    viñeta:
      'Un corredor de 5000 m lleva ocho meses entrenando casi todas las sesiones a un ritmo cómodamente duro, entre su VT1 y su VT2. Ha mejorado en los primeros meses pero lleva doce semanas estancado en la misma marca, y llega a las series de calidad sin frescura.',
    enunciado:
      '¿Qué explica mejor el estancamiento desde el punto de vista de la distribución de la intensidad?',
    opciones: [
      'Acumula fatiga suficiente para comprometer las sesiones duras, pero no estímulo suficiente para elevar el techo aeróbico',
      'Trabaja por debajo del VT1, de modo que el estímulo es demasiado suave para producir adaptación',
      'La zona intermedia impide por completo la oxidación de grasas y agota las reservas de glucógeno',
      'Al no superar nunca el 65 % de su FCmáx no llega a activar las adaptaciones cardiovasculares',
    ],
    correcta: 0,
    explicacion:
      'Vivir en la zona intermedia deja al deportista en la peor combinación posible: acumula fatiga como si entrenara duro, pero no llega a la intensidad que eleva el VO₂máx ni descansa lo suficiente para asimilar. Es justamente el problema que el modelo polarizado busca resolver. Los otros tres distractores describen mal el escenario: el corredor no trabaja bajo el VT1 ni por debajo del 65 %, y la oxidación de grasas se reduce en esa zona pero no se anula. Dato para recordar: entre umbrales es una zona útil, no un lugar donde vivir.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.6.4 — Modelos de distribución',
    etiquetas: ['entre umbrales', 'polarizado', 'estancamiento', 'distribución'],
  },

  /* ══════════════════════════════════════════════════════════════════
     C5-026 … C5-028 — los tres ítems que exige ADR-006.
     Nivel y dificultad forzados por el cálculo de cuotas con n = 28.
     ══════════════════════════════════════════════════════════════════ */

  {
    id: 'C5-026',
    modulo: 'c5-umbrales-zonas',
    bloque: 'C',
    tipo: 'unica',
    nivel: 'recuerdo',
    dificultad: 1,
    enunciado:
      'En la zona R1, ¿cómo se reparte el aporte de sustrato entre grasas e hidratos de carbono?',
    opciones: [
      '20–40 % de grasas y 60–80 % de hidratos de carbono',
      '60–80 % de grasas y 20–40 % de hidratos de carbono',
      '50–60 % de grasas y 40–50 % de hidratos de carbono',
      '5–10 % de grasas y 90–95 % de hidratos de carbono',
    ],
    correcta: 0,
    explicacion:
      'En R1 la grasa aporta entre el 20 y el 40 % y el hidrato de carbono entre el 60 y el 80 %: es el reparto con mayor participación lipídica de todas las zonas, aunque el hidrato siga siendo mayoritario. El distractor más tentador es el reparto invertido, 60–80 % de grasas, porque a R1 se le llama "la zona de quemar grasa" y se asume que la grasa manda; lo que R1 maximiza es el aporte lipídico, no que supere al hidrato. El cuarto reparto no corresponde a ninguna zona con cifra propia: en R2 el sustrato es casi exclusivamente hidrato de carbono y no se le asigna un porcentaje de reparto. Dato para recordar: en ninguna zona la grasa llega a ser el sustrato mayoritario.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.6.1 — Umbral Ventilatorio 1',
    etiquetas: ['R1', 'sustrato', 'grasas', 'hidratos de carbono'],
  },
  {
    id: 'C5-027',
    modulo: 'c5-umbrales-zonas',
    bloque: 'C',
    tipo: 'multiple',
    nivel: 'comprension',
    dificultad: 2,
    enunciado: 'Seleccione las DOS afirmaciones correctas sobre la diferencia entre R0 y R1.',
    opciones: [
      'R0 no persigue adaptación fisiológica, mientras que R1 sí produce adaptación aeróbica',
      'La máxima oxidación de lípidos ocurre en R1 y no en R0, pese a que R0 es más suave',
      'R0 usa las grasas en mayor proporción que R1 justamente por ser la zona más suave',
      'R0 se sitúa entre el 65 y el 75 %, y R1 queda por debajo del 65 % de la FCmáx',
      'R0 contiene el MLSS porque en esa zona el lactato se mantiene en valores de reposo',
    ],
    correctas: [0, 1],
    explicacion:
      'R0 y R1 se parecen en la sensación —las dos son cómodas— y se diferencian en lo que producen: R0 solo facilita la recuperación y R1 sí genera adaptación aeróbica, con la máxima oxidación de lípidos. El distractor más tentador es el tercero, "más suave, más grasa": movilizar y oxidar ácidos grasos exige una intensidad mínima que R0 no alcanza, así que bajar el ritmo por debajo de R1 reduce el uso de grasa en lugar de aumentarlo. El cuarto invierte los rangos y el quinto sitúa el MLSS en R0, cuando vive en R2. Dato para recordar: R0 está por debajo del 65 % y R1 entre 65 y 75 %.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.6 — Zonas de entrenamiento',
    etiquetas: ['R0', 'R1', 'oxidación de lípidos', 'zonas'],
  },
  {
    id: 'C5-028',
    modulo: 'c5-umbrales-zonas',
    bloque: 'C',
    tipo: 'calculo',
    nivel: 'aplicacion',
    dificultad: 3,
    enunciado:
      'Una deportista de 35 años tiene 55 lpm de frecuencia cardíaca en reposo. Su entrenador quiere prescribirle una intensidad del 75 % de la frecuencia cardíaca de reserva con el método de Karvonen, estimando la FCmáx con la fórmula de Fox et al. (1971). Calcule esa frecuencia objetivo.',
    respuesta: 152.5,
    tolerancia: 1,
    unidad: 'lpm',
    pasos: [
      'Fox et al. (1971): FCmáx = 220 − edad = 220 − 35 = 185 lpm',
      'Frecuencia cardíaca de reserva = FCmáx − FC en reposo = 185 − 55 = 130 lpm',
      'Karvonen: FC objetivo = FC en reposo + (FC de reserva × intensidad)',
      'FC objetivo = 55 + (130 × 0,75) = 55 + 97,5 = 152,5 lpm',
    ],
    explicacion:
      'Karvonen no aplica el porcentaje sobre la FCmáx sino sobre la frecuencia de reserva, y devuelve el resultado al terreno real sumando otra vez la frecuencia de reposo: por eso son cuatro pasos y no dos. El error más frecuente es olvidar esa suma final y quedarse en 97,5 lpm, un valor por debajo del propio reposo de la deportista y por tanto imposible. El otro error es aplicar el 75 % directo sobre la FCmáx: 185 × 0,75 = 138,75 lpm, catorce latidos menos, porque ignora que el margen de trabajo del corazón empieza en 55 y no en cero. Dato para recordar: con Karvonen la FC objetivo nunca puede salir por debajo de la FC de reposo.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.1 — Tabla 2',
    etiquetas: ['Karvonen', 'FC de reserva', 'prescripción', 'Fox'],
  },
];
