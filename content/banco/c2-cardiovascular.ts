// content/banco/c2-cardiovascular.ts
// C2 · Sistema cardiovascular. 28 ítems (bloque C, ADR-006).
//
// Reparto verificado contra verificarCuotas(cuotasDelBloque('C')):
//   Nivel      → 12 recuerdo (43 %) · 9 comprensión (32 %) · 7 aplicación (25 %)
//   Dificultad → 5 de nivel 1 · 18 de nivel 2 · 5 de nivel 3
//   Tipos      → 14 única · 4 cálculo · 3 múltiple · 3 caso · 2 emparejar
//                · 1 ordenar · 1 V/F
//
// ADR-014 — lo verificado que este módulo enseña:
//   · Las adaptaciones cardiovasculares al entrenamiento de resistencia son
//     ↓FC en reposo · ↑volemia · ↑volumen sistólico · ↑gasto cardíaco máximo.
//     La FCmáx NO cambia con el entrenamiento: depende de la edad.
//   · FC en reposo normal del adulto: 60–100 lpm. Por debajo de 60 es
//     bradicardia, y en el deportista entrenado es adaptación, no enfermedad.
//   · Las 5 fórmulas de FCmáx son estimaciones poblacionales con error
//     estándar de ±10–12 lpm, no medidas individuales.
//
// Los ítems son datos literales: nunca se generan con map(), plantillas ni
// funciones auxiliares. 28 objetos a mano son legibles, revisables y diffeables.
import type { Item } from '@/lib/tipos';

export const ITEMS: Item[] = [
  {
    id: 'C2-001',
    modulo: 'c2-cardiovascular',
    bloque: 'C',
    tipo: 'unica',
    nivel: 'recuerdo',
    dificultad: 1,
    enunciado: '¿Cuál es la fórmula de frecuencia cardíaca máxima de Fox et al. (1971)?',
    opciones: [
      'FCmáx = 220 − edad',
      'FCmáx = 208 − (0,7 × edad), validada en hombres y mujeres sanos',
      'FCmáx = 206 − (0,88 × edad), obtenida en mujeres asintomáticas',
      'FCmáx = 216,6 − (0,84 × edad), la más antigua de las cinco fórmulas',
    ],
    correcta: 0,
    explicacion:
      'Fox es la más conocida y la más simple de las cinco: 220 menos la edad, sin coeficientes. El distractor más tentador es Astrand (216,6 − 0,84 × edad), porque también arranca de una constante alta y porque las dos son las fórmulas clásicas del grupo: se distinguen en que Fox no multiplica la edad por nada. Dato para recordar: si la fórmula no lleva coeficiente delante de la edad, es Fox.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.1 — Frecuencia cardíaca y fórmulas de FCmáx',
    etiquetas: ['FCmáx', 'Fox', 'fórmulas'],
  },
  {
    id: 'C2-002',
    modulo: 'c2-cardiovascular',
    bloque: 'C',
    tipo: 'unica',
    nivel: 'recuerdo',
    dificultad: 1,
    enunciado: '¿Cuál es la fórmula de Tanaka et al. (2001)?',
    opciones: [
      'FCmáx = 208 − (0,7 × edad)',
      'FCmáx = 207 − (0,7 × edad), la propuesta para adultos activos',
      'FCmáx = 220 − edad, la más difundida y la más simple de todas',
      'FCmáx = 206 − (0,88 × edad), la validada en población femenina',
    ],
    correcta: 0,
    explicacion:
      'Tanaka es 208 menos 0,7 por la edad, validada en hombres y mujeres sanos. El distractor más tentador es Gellish (207 − 0,7 × edad): comparten el mismo coeficiente y se separan en un solo punto de la constante, así que es el par que más se cruza del grupo. La forma de fijarlos es por parejas: Tanaka 208, Gellish 207, los dos con 0,7. Dato para recordar: a partir de los 40 años Tanaka da valores más altos que Fox, y por debajo más bajos.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.1 — Frecuencia cardíaca y fórmulas de FCmáx',
    etiquetas: ['FCmáx', 'Tanaka', 'fórmulas'],
  },
  {
    id: 'C2-003',
    modulo: 'c2-cardiovascular',
    bloque: 'C',
    tipo: 'unica',
    nivel: 'recuerdo',
    dificultad: 2,
    enunciado: '¿Qué fórmula de FCmáx se validó específicamente en población femenina?',
    opciones: [
      'Gulati et al. (2010): FCmáx = 206 − (0,88 × edad)',
      'Tanaka et al. (2001): FCmáx = 208 − (0,7 × edad), en hombres y mujeres sanos',
      'Gellish et al. (2007): FCmáx = 207 − (0,7 × edad), en adultos físicamente activos',
      'Astrand (1952): FCmáx = 216,6 − (0,84 × edad), en población general adulta',
    ],
    correcta: 0,
    explicacion:
      'Gulati se obtuvo en mujeres asintomáticas de mediana edad y es la única de las cinco pensada para esa población. El distractor más tentador es Tanaka, que también incluyó mujeres en su muestra: la diferencia está en que Tanaka se validó en población mixta y Gulati exclusivamente en mujeres, y aplicar Fox a una mujer de 50 años sobreestima su FCmáx en varios latidos. Dato para recordar: cada fórmula lleva su población de origen, y elegirla mal desplaza todas las zonas.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.1 — Frecuencia cardíaca y fórmulas de FCmáx',
    etiquetas: ['FCmáx', 'Gulati', 'población'],
  },
  {
    id: 'C2-004',
    modulo: 'c2-cardiovascular',
    bloque: 'C',
    tipo: 'unica',
    nivel: 'recuerdo',
    dificultad: 1,
    enunciado: '¿Cómo se calcula la frecuencia cardíaca de reserva?',
    opciones: [
      'FCmáx − FC en reposo',
      'FCmáx dividida entre la frecuencia cardíaca de reposo del sujeto',
      'FC en reposo multiplicada por el volumen sistólico de eyección',
      'La suma de la FC en reposo y el 60 % de la frecuencia máxima estimada',
    ],
    correcta: 0,
    explicacion:
      'La frecuencia cardíaca de reserva es la diferencia entre la máxima y la de reposo: representa el margen de trabajo cardíaco disponible. El distractor más tentador es el cociente, porque también combina las dos mismas cifras y produce un número de aspecto razonable; lo que se busca es un margen en latidos, no una proporción. Dato para recordar: la FC de reserva es la base del método de Karvonen, que aplica el porcentaje sobre ese margen y luego le suma la FC de reposo.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.1 — Frecuencia cardíaca y fórmulas de FCmáx',
    etiquetas: ['FC de reserva', 'Karvonen', 'prescripción'],
  },
  {
    id: 'C2-005',
    modulo: 'c2-cardiovascular',
    bloque: 'C',
    tipo: 'unica',
    nivel: 'recuerdo',
    dificultad: 1,
    enunciado: '¿Cómo se calcula el gasto cardíaco?',
    opciones: [
      'GC = frecuencia cardíaca × volumen sistólico',
      'GC = frecuencia cardíaca × diferencia arteriovenosa de oxígeno',
      'GC = volumen sistólico ÷ frecuencia cardíaca en reposo del sujeto',
      'GC = volumen sistólico × la superficie corporal total del deportista',
    ],
    correcta: 0,
    explicacion:
      'El gasto cardíaco es el volumen de sangre que el corazón expulsa por minuto, y sale de multiplicar los latidos por minuto por lo que se expulsa en cada uno. El distractor más tentador usa la diferencia arteriovenosa, que aparece en la ecuación de Fick del VO₂ (VO₂ = GC × dif a-v): las dos fórmulas se estudian juntas y se mezclan sus factores. Dato para recordar: el gasto cardíaco es cuánta sangre se mueve; la diferencia arteriovenosa es cuánto oxígeno se le extrae.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.3 — Gasto cardíaco y volumen sistólico',
    etiquetas: ['gasto cardíaco', 'volumen sistólico', 'fórmula'],
  },
  {
    id: 'C2-006',
    modulo: 'c2-cardiovascular',
    bloque: 'C',
    tipo: 'unica',
    nivel: 'recuerdo',
    dificultad: 2,
    enunciado:
      'Un entrenador toma el pulso durante 15 segundos. ¿Por cuánto debe multiplicar para obtener los latidos por minuto?',
    opciones: [
      'Por 4',
      'Por 6, que es el factor que corresponde a una toma de 10 segundos',
      'Por 10, que es el factor que corresponde a una toma de 6 segundos',
      'Por 2, porque el minuto tiene dos mitades de treinta segundos cada una',
    ],
    correcta: 0,
    explicacion:
      'Sesenta segundos entre quince dan cuatro, así que la toma de 15 s se multiplica por 4. Los distractores son los factores correctos de las otras tomas habituales: ×6 para 10 segundos y ×10 para 6 segundos, y se cruzan porque las tres se aprenden en la misma tabla. Dato para recordar: el factor siempre es 60 dividido entre los segundos que dura la toma, así que se puede reconstruir sin memorizar la tabla entera.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.1 — Frecuencia cardíaca y fórmulas de FCmáx',
    etiquetas: ['pulso', 'conversión', 'lpm'],
  },
  {
    id: 'C2-007',
    modulo: 'c2-cardiovascular',
    bloque: 'C',
    tipo: 'unica',
    nivel: 'recuerdo',
    dificultad: 2,
    enunciado: '¿Cuál es el rango normal de frecuencia cardíaca en reposo en el adulto sano?',
    opciones: [
      '60–100 lpm',
      '40–60 lpm, que es el rango habitual del deportista de resistencia entrenado',
      '100–140 lpm, que corresponde al esfuerzo ligero de un adulto no entrenado',
      '30–50 lpm, que es el valor esperable en cualquier persona en reposo absoluto',
    ],
    correcta: 0,
    explicacion:
      'El rango clínico normal del adulto en reposo es de 60 a 100 lpm; por debajo de 60 se habla de bradicardia. El distractor más tentador es el de 40–60, que es un rango real —el del deportista de resistencia bien entrenado—, pero es una adaptación al entrenamiento y no el valor de referencia de la población general. Dato para recordar: en un deportista, una FC de reposo de 45 lpm es la firma de un corazón eficiente, no un hallazgo que preocupe.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.1 — Frecuencia cardíaca y fórmulas de FCmáx',
    etiquetas: ['FC en reposo', 'bradicardia', 'valores normales'],
  },
  {
    id: 'C2-008',
    modulo: 'c2-cardiovascular',
    bloque: 'C',
    tipo: 'unica',
    nivel: 'recuerdo',
    dificultad: 2,
    enunciado: '¿Qué es el volumen sistólico?',
    opciones: [
      'La cantidad de sangre que el ventrículo expulsa en cada latido',
      'La cantidad total de sangre que el corazón bombea a lo largo de un minuto',
      'El volumen de sangre que queda en el ventrículo al terminar la contracción',
      'La cantidad de sangre que circula por el organismo en su conjunto, o volemia',
    ],
    correcta: 0,
    explicacion:
      'El volumen sistólico es lo que sale del ventrículo en un solo latido, en torno a 70 ml en reposo. El distractor más tentador es el volumen por minuto, que es el gasto cardíaco: la diferencia entre los dos es exactamente el factor frecuencia, y confundirlos hace que la fórmula GC = FC × VS pierda todo su sentido. Dato para recordar: sistólico es por latido, gasto es por minuto, volemia es lo que hay en total.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.3 — Gasto cardíaco y volumen sistólico',
    etiquetas: ['volumen sistólico', 'definición', 'gasto cardíaco'],
  },
  {
    id: 'C2-009',
    modulo: 'c2-cardiovascular',
    bloque: 'C',
    tipo: 'emparejar',
    nivel: 'recuerdo',
    dificultad: 2,
    enunciado: 'Relacione cada fórmula de FCmáx con su autor.',
    izquierda: [
      'FCmáx = 220 − edad',
      'FCmáx = 216,6 − (0,84 × edad)',
      'FCmáx = 208 − (0,7 × edad)',
      'FCmáx = 206 − (0,88 × edad)',
    ],
    derecha: [
      'Fox et al. (1971)',
      'Astrand (1952)',
      'Tanaka et al. (2001)',
      'Gulati et al. (2010), en mujeres',
    ],
    pares: [
      [0, 0],
      [1, 1],
      [2, 2],
      [3, 3],
    ],
    explicacion:
      'Los pares que más se cruzan son Tanaka con Gellish, que comparten el coeficiente 0,7 y solo se separan en la constante (208 frente a 207), y Astrand con Gulati, porque las dos llevan coeficientes de dos decimales. La forma práctica de fijarlos es por la constante: 220 Fox, 216,6 Astrand, 208 Tanaka, 207 Gellish y 206 Gulati. Dato para recordar: la constante baja según avanza el año de publicación, y la más reciente es la de mujeres.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.1 — Frecuencia cardíaca y fórmulas de FCmáx',
    etiquetas: ['FCmáx', 'fórmulas', 'autores'],
  },
  {
    id: 'C2-010',
    modulo: 'c2-cardiovascular',
    bloque: 'C',
    tipo: 'emparejar',
    nivel: 'recuerdo',
    dificultad: 2,
    enunciado: 'Relacione cada estructura cardiovascular con su función.',
    izquierda: ['Ventrículo izquierdo', 'Aurícula derecha', 'Arterias', 'Capilares'],
    derecha: [
      'Expulsa la sangre oxigenada hacia la circulación mayor',
      'Recibe la sangre venosa que vuelve del organismo',
      'Conducen la sangre desde el corazón hacia los tejidos',
      'Permiten el intercambio de gases y nutrientes con el tejido',
    ],
    pares: [
      [0, 0],
      [1, 1],
      [2, 2],
      [3, 3],
    ],
    explicacion:
      'El par que más se falla es el de las arterias: se definen como «las que llevan sangre oxigenada» y en realidad se definen por la dirección —salen del corazón—, lo que explica que la arteria pulmonar lleve sangre venosa. El ventrículo izquierdo es el de la circulación mayor y por eso su pared es la más gruesa. Dato para recordar: arteria y vena se distinguen por hacia dónde van, no por el oxígeno que transportan.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.2 — Anatomía y ciclo cardíaco',
    etiquetas: ['anatomía', 'circulación', 'corazón'],
  },
  {
    id: 'C2-011',
    modulo: 'c2-cardiovascular',
    bloque: 'C',
    tipo: 'multiple',
    nivel: 'recuerdo',
    dificultad: 2,
    enunciado:
      'Seleccione las TRES adaptaciones que produce el entrenamiento de resistencia sobre el sistema cardiovascular.',
    opciones: [
      'Aumento del volumen sistólico',
      'Aumento de la volemia total',
      'Descenso de la frecuencia cardíaca en reposo',
      'Aumento de la frecuencia cardíaca máxima alcanzable en esfuerzo',
      'Descenso del gasto cardíaco máximo durante el ejercicio intenso',
    ],
    correctas: [0, 1, 2],
    explicacion:
      'Las tres adaptaciones reales son más sangre en circulación, más sangre por latido y menos latidos en reposo. El distractor más tentador es el aumento de la FCmáx, porque parece la conclusión lógica de «el corazón mejora»: la FCmáx depende de la edad y no se mueve con el entrenamiento. Y el gasto cardíaco máximo sube, no baja. Dato para recordar: el entrenamiento cambia cuánta sangre mueves por latido, no cuántos latidos alcanzas.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.4 — Adaptaciones cardiovasculares al entrenamiento',
    etiquetas: ['adaptaciones', 'resistencia', 'volumen sistólico'],
  },
  {
    id: 'C2-012',
    modulo: 'c2-cardiovascular',
    bloque: 'C',
    tipo: 'vf',
    nivel: 'recuerdo',
    dificultad: 2,
    enunciado:
      'Con meses de entrenamiento de resistencia bien planificado, la frecuencia cardíaca máxima de un deportista aumenta de forma apreciable.',
    correcta: false,
    explicacion:
      'Falso. La frecuencia cardíaca máxima es un techo que depende fundamentalmente de la edad y no se eleva con el entrenamiento; de hecho tiende a descender ligeramente en deportistas muy entrenados. Lo que sí cambia, y mucho, es la frecuencia en reposo, que baja, y el volumen sistólico, que sube. La confusión viene de asumir que si todo mejora, el máximo también. Dato para recordar: lo que se entrena es cuánta sangre mueves en cada latido, no cuántos latidos alcanzas.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.4 — Adaptaciones cardiovasculares al entrenamiento',
    etiquetas: ['FCmáx', 'adaptaciones', 'entrenamiento'],
  },
  {
    id: 'C2-013',
    modulo: 'c2-cardiovascular',
    bloque: 'C',
    tipo: 'unica',
    nivel: 'comprension',
    dificultad: 2,
    enunciado:
      'Dos hombres de 30 años, uno sedentario y otro ciclista profesional, hacen una prueba de esfuerzo máxima. ¿Qué diferencia cabe esperar en su FCmáx?',
    opciones: [
      'Ninguna diferencia relevante: la FCmáx depende de la edad, no del nivel de entrenamiento',
      'El ciclista alcanzará una FCmáx bastante más alta gracias a su corazón entrenado',
      'El sedentario alcanzará una FCmáx muy superior porque su corazón es menos eficiente',
      'El ciclista tendrá una FCmáx más baja en la misma proporción en que baja su FC de reposo',
    ],
    correcta: 0,
    explicacion:
      'La FCmáx es prácticamente independiente del estado de forma: dos personas de la misma edad llegan a valores parecidos aunque una de ellas rinda el triple. El distractor más tentador es el último, porque parte de un hecho cierto —el ciclista sí tiene la FC de reposo mucho más baja— y lo extiende al máximo, donde no aplica. Dato para recordar: la adaptación se ve en el reposo y en el volumen sistólico, no en el techo de latidos.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.4 — Adaptaciones cardiovasculares al entrenamiento',
    etiquetas: ['FCmáx', 'entrenamiento', 'comparación'],
  },
  {
    id: 'C2-014',
    modulo: 'c2-cardiovascular',
    bloque: 'C',
    tipo: 'unica',
    nivel: 'comprension',
    dificultad: 2,
    enunciado:
      '¿En qué se diferencia la adaptación cardíaca al trabajo dinámico de resistencia de la adaptación al trabajo isométrico de fuerza?',
    opciones: [
      'La resistencia dilata la cavidad ventricular y eleva el volumen sistólico; la fuerza engrosa la pared y eleva la fuerza de contracción',
      'La resistencia engrosa la pared ventricular y la fuerza dilata la cavidad del ventrículo izquierdo',
      'Las dos producen exactamente la misma adaptación estructural sobre el músculo cardíaco',
      'Solo el trabajo de resistencia modifica el corazón; el trabajo de fuerza no produce cambio alguno',
    ],
    correcta: 0,
    explicacion:
      'El trabajo dinámico impone sobrecarga de volumen: entra más sangre, el ventrículo se dilata y expulsa más por latido. El isométrico impone sobrecarga de presión: la pared se engrosa para vencer resistencias altas. El distractor más tentador es el que invierte los dos términos, porque conserva la pareja correcta de conceptos y solo cambia a quién corresponde cada uno. Dato para recordar: volumen dilata, presión engrosa.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.4 — Adaptaciones cardiovasculares al entrenamiento',
    etiquetas: ['adaptaciones', 'dilatación', 'hipertrofia'],
  },
  {
    id: 'C2-015',
    modulo: 'c2-cardiovascular',
    bloque: 'C',
    tipo: 'unica',
    nivel: 'comprension',
    dificultad: 3,
    enunciado:
      '¿Por qué el entrenamiento de resistencia hace descender la frecuencia cardíaca en reposo?',
    opciones: [
      'Porque con más volumen sistólico el corazón mueve la misma sangre por minuto con menos latidos',
      'Porque el corazón entrenado necesita bombear un volumen total de sangre menor en reposo',
      'Porque el descenso de la volemia obliga al corazón a reducir su ritmo de trabajo basal',
      'Porque la FCmáx desciende con el entrenamiento y arrastra consigo a la de reposo',
    ],
    correcta: 0,
    explicacion:
      'La cadena es una sola: más volemia llena mejor el ventrículo, un ventrículo mejor llenado expulsa más por latido, y con más sangre por latido el corazón cubre el mismo gasto con menos latidos. El distractor más tentador dice que el corazón entrenado bombea menos sangre en reposo, y es falso: las necesidades metabólicas en reposo son las mismas, lo que cambia es cómo las cubre. Dato para recordar: el gasto cardíaco en reposo no baja, baja la frecuencia necesaria para lograrlo.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.4 — Adaptaciones cardiovasculares al entrenamiento',
    etiquetas: ['FC en reposo', 'volumen sistólico', 'adaptaciones'],
  },
  {
    id: 'C2-016',
    modulo: 'c2-cardiovascular',
    bloque: 'C',
    tipo: 'unica',
    nivel: 'comprension',
    dificultad: 2,
    enunciado:
      '¿Qué diferencia al método de Karvonen de aplicar directamente un porcentaje sobre la FCmáx?',
    opciones: [
      'Karvonen aplica el porcentaje sobre la frecuencia de reserva y después le suma la FC de reposo',
      'Karvonen aplica el porcentaje sobre la FCmáx estimada y después le resta la FC de reposo medida esa mañana',
      'Karvonen estima la FCmáx con una fórmula distinta antes de aplicar el porcentaje deseado',
      'Karvonen calcula el porcentaje sobre el gasto cardíaco en lugar de sobre la frecuencia',
    ],
    correcta: 0,
    explicacion:
      'Karvonen trabaja sobre el margen entre reposo y máximo: toma el porcentaje de la reserva y le suma de vuelta la FC de reposo. El distractor más tentador resta en lugar de sumar, y produce cifras absurdamente bajas que delatan el error. La ventaja de Karvonen es que individualiza: dos personas con la misma FCmáx y distinta FC de reposo reciben zonas distintas. Dato para recordar: por eso el mismo 70 % da un valor más alto en Karvonen que en el porcentaje directo.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.1 — Frecuencia cardíaca y fórmulas de FCmáx',
    etiquetas: ['Karvonen', 'FC de reserva', 'prescripción'],
  },
  {
    id: 'C2-017',
    modulo: 'c2-cardiovascular',
    bloque: 'C',
    tipo: 'unica',
    nivel: 'comprension',
    dificultad: 3,
    enunciado:
      '¿Por qué existen cinco fórmulas de FCmáx distintas en lugar de una sola validada para todos?',
    opciones: [
      'Porque cada una se obtuvo en una población distinta y todas son estimaciones con un error de varios latidos',
      'Porque cada una corresponde a un deporte concreto y hay que elegirla por la modalidad practicada',
      'Porque las más antiguas quedaron invalidadas y solo debe usarse la más reciente de las cinco',
      'Porque cada fórmula se aplica a una zona de entrenamiento diferente dentro de la sesión',
    ],
    correcta: 0,
    explicacion:
      'Las cinco son ecuaciones de regresión obtenidas en muestras distintas, y ninguna mide: todas estiman, con un error estándar del orden de diez latidos. Por eso conviene elegir la más cercana a la población del deportista y verificar después con la sensación o con una prueba. El distractor más tentador es el de la modalidad deportiva, porque suena a individualización seria: lo que diferencia a las fórmulas es la población de la muestra, no el deporte. Dato para recordar: la fórmula orienta, la prueba de campo confirma.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.1 — Frecuencia cardíaca y fórmulas de FCmáx',
    etiquetas: ['FCmáx', 'estimación', 'error'],
  },
  {
    id: 'C2-018',
    modulo: 'c2-cardiovascular',
    bloque: 'C',
    tipo: 'multiple',
    nivel: 'comprension',
    dificultad: 2,
    enunciado: 'Seleccione las TRES afirmaciones correctas sobre el gasto cardíaco.',
    opciones: [
      'Es el producto de la frecuencia cardíaca por el volumen sistólico',
      'Aumenta durante el ejercicio por el ascenso de sus dos factores',
      'Su valor máximo es mayor en un deportista entrenado que en un sedentario',
      'En reposo es más bajo en el deportista entrenado que en el sedentario de la misma edad y talla',
      'Se expresa en mililitros por latido, igual que el volumen sistólico',
    ],
    correctas: [0, 1, 2],
    explicacion:
      'El gasto cardíaco es frecuencia por volumen sistólico, sube en ejercicio porque suben los dos factores, y su techo es mayor en el entrenado. El distractor más tentador es el del reposo: el deportista tiene la frecuencia más baja, pero su volumen sistólico es mayor, y el producto sale igual —las necesidades metabólicas en reposo son las mismas para todos. La última confunde unidades: el gasto se expresa por minuto. Dato para recordar: en reposo el gasto se iguala; en máximo, no.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.3 — Gasto cardíaco y volumen sistólico',
    etiquetas: ['gasto cardíaco', 'ejercicio', 'adaptaciones'],
  },
  {
    id: 'C2-019',
    modulo: 'c2-cardiovascular',
    bloque: 'C',
    tipo: 'ordenar',
    nivel: 'comprension',
    dificultad: 2,
    enunciado:
      'Ordene el recorrido de una gota de sangre desde que vuelve del músculo hasta que sale de nuevo hacia él.',
    elementos: [
      'Llega a la aurícula derecha por las venas cavas',
      'Pasa al ventrículo derecho y sale por la arteria pulmonar',
      'Se oxigena en los capilares pulmonares',
      'Vuelve a la aurícula izquierda por las venas pulmonares',
      'Pasa al ventrículo izquierdo y sale por la aorta hacia los tejidos',
    ],
    ordenCorrecto: [0, 1, 2, 3, 4],
    explicacion:
      'El circuito es derecha primero, pulmón, izquierda después: la sangre que vuelve del cuerpo entra por la derecha, se oxigena en el pulmón y sale por la izquierda. El error más frecuente es empezar por la aurícula izquierda porque se asocia «izquierda» con «primera» al leer un esquema. Dato para recordar: el lado derecho manda la sangre al pulmón y el izquierdo al resto del cuerpo, y por eso el ventrículo izquierdo tiene la pared más gruesa.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.2 — Anatomía y ciclo cardíaco',
    etiquetas: ['circulación', 'anatomía', 'secuencia'],
  },
  {
    id: 'C2-020',
    modulo: 'c2-cardiovascular',
    bloque: 'C',
    tipo: 'unica',
    nivel: 'comprension',
    dificultad: 2,
    enunciado: '¿Qué distingue la circulación menor de la circulación mayor?',
    opciones: [
      'La menor va del corazón al pulmón y vuelve; la mayor va del corazón al resto del organismo',
      'La menor recorre la mitad inferior del cuerpo y la mayor recorre la mitad superior',
      'La menor transporta únicamente sangre oxigenada y la mayor únicamente sangre venosa',
      'La menor corresponde al reposo y la mayor se activa durante el ejercicio de alta intensidad sostenida',
    ],
    correcta: 0,
    explicacion:
      'La circulación menor o pulmonar sale del ventrículo derecho, va al pulmón y vuelve a la aurícula izquierda; la mayor o sistémica sale del ventrículo izquierdo y recorre todo el organismo. El distractor más tentador es el del oxígeno, porque en la circulación menor ocurre justo lo contrario de lo que se espera: la arteria pulmonar lleva sangre pobre en oxígeno y las venas pulmonares la llevan rica. Dato para recordar: menor es la del pulmón, y es la excepción de la regla arteria-oxígeno.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.2 — Anatomía y ciclo cardíaco',
    etiquetas: ['circulación menor', 'circulación mayor', 'anatomía'],
  },
  {
    id: 'C2-021',
    modulo: 'c2-cardiovascular',
    bloque: 'C',
    tipo: 'multiple',
    nivel: 'comprension',
    dificultad: 3,
    enunciado: 'Seleccione las DOS afirmaciones correctas sobre las fórmulas de FCmáx.',
    opciones: [
      'Fox y Tanaka dan resultados distintos, y la diferencia crece con la edad del sujeto',
      'Todas son estimaciones poblacionales y ninguna sustituye a una prueba de esfuerzo',
      'Todas dan el mismo resultado si el sujeto se encuentra correctamente hidratado',
      'La fórmula de Gulati se aplica a hombres mayores de sesenta años exclusivamente',
      'Aplicar Fox a una mujer de cincuenta años subestima notablemente su FCmáx real',
    ],
    correctas: [0, 1],
    explicacion:
      'Fox y Tanaka divergen y la diferencia crece con la edad —a los 20 años Fox da 200 y Tanaka 194; a los 60, Fox da 160 y Tanaka 166—, y las cinco son estimaciones de población que no sustituyen a una prueba de esfuerzo. El distractor más tentador es el último, porque el sentido del sesgo es el contrario: Fox da 170 a los 50, y Gulati, la fórmula de mujeres, da 162, así que Fox sobreestima. Dato para recordar: al cruzar el punto donde las rectas se cortan, el sesgo cambia de signo.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.1 — Frecuencia cardíaca y fórmulas de FCmáx',
    etiquetas: ['FCmáx', 'fórmulas', 'comparación'],
  },
  {
    id: 'C2-022',
    modulo: 'c2-cardiovascular',
    bloque: 'C',
    tipo: 'calculo',
    nivel: 'aplicacion',
    dificultad: 1,
    enunciado:
      'Calcule la frecuencia cardíaca máxima estimada de un hombre de 45 años con la fórmula de Fox et al. (1971).',
    respuesta: 175,
    tolerancia: 1,
    unidad: 'lpm',
    pasos: [
      'Fox et al. (1971): FCmáx = 220 − edad',
      'FCmáx = 220 − 45',
      'FCmáx = 175 lpm',
    ],
    explicacion:
      'Fox no lleva coeficiente: se resta la edad directamente de 220. El error más frecuente es aplicar por costumbre otra de las cinco fórmulas cuando el enunciado nombra una en concreto: con Tanaka el mismo sujeto daría 208 − 31,5 = 176,5 lpm, y con Astrand 216,6 − 37,8 = 178,8 lpm. Son diferencias de pocos latidos, pero al multiplicarlas por el porcentaje de la zona se trasladan a la prescripción. Dato para recordar: la fórmula la elige el enunciado, no la costumbre.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.1 — Frecuencia cardíaca y fórmulas de FCmáx',
    etiquetas: ['FCmáx', 'Fox', 'cálculo'],
  },
  {
    id: 'C2-023',
    modulo: 'c2-cardiovascular',
    bloque: 'C',
    tipo: 'calculo',
    nivel: 'aplicacion',
    dificultad: 2,
    enunciado:
      'Calcule la frecuencia cardíaca máxima estimada de una mujer de 52 años con la fórmula de Gulati et al. (2010).',
    respuesta: 160.2,
    tolerancia: 0.6,
    unidad: 'lpm',
    pasos: [
      'Gulati et al. (2010): FCmáx = 206 − (0,88 × edad)',
      'FCmáx = 206 − (0,88 × 52) = 206 − 45,76',
      'FCmáx = 160,24 ≈ 160,2 lpm',
    ],
    explicacion:
      'Gulati es la fórmula validada en mujeres y para esta deportista da 160,2 lpm. Aplicar Fox por defecto daría 220 − 52 = 168 lpm, casi ocho latidos por encima: al prescribir el límite superior de R2 al 90 %, esa diferencia son siete latidos de más en la zona objetivo, suficiente para convertir una sesión de umbral en una sesión rota. Dato para recordar: la población de origen de la fórmula no es un detalle bibliográfico, se traduce en latidos.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.1 — Frecuencia cardíaca y fórmulas de FCmáx',
    etiquetas: ['FCmáx', 'Gulati', 'cálculo'],
  },
  {
    id: 'C2-024',
    modulo: 'c2-cardiovascular',
    bloque: 'C',
    tipo: 'calculo',
    nivel: 'aplicacion',
    dificultad: 2,
    enunciado:
      'Un deportista tiene una FCmáx de 190 lpm y una FC en reposo de 60 lpm. Calcule su frecuencia objetivo al 70 % por el método de Karvonen.',
    respuesta: 151,
    tolerancia: 1,
    unidad: 'lpm',
    pasos: [
      'FC de reserva = FCmáx − FC en reposo = 190 − 60 = 130 lpm',
      'Karvonen: FC objetivo = FC en reposo + (FC de reserva × intensidad)',
      'FC objetivo = 60 + (130 × 0,70) = 60 + 91',
      'FC objetivo = 151 lpm',
    ],
    explicacion:
      'Karvonen aplica el porcentaje sobre el margen de trabajo y devuelve la FC de reposo a la suma. El error más frecuente es olvidar ese último paso y responder 91 lpm, un valor que ni siquiera llega a la zona de recuperación. El segundo error es aplicar el 70 % directamente sobre la FCmáx, que daría 133 lpm: dieciocho latidos menos, otra zona distinta. Dato para recordar: en Karvonen el porcentaje se aplica a la reserva, nunca al máximo.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.1 — Frecuencia cardíaca y fórmulas de FCmáx',
    etiquetas: ['Karvonen', 'FC de reserva', 'cálculo'],
  },
  {
    id: 'C2-025',
    modulo: 'c2-cardiovascular',
    bloque: 'C',
    tipo: 'calculo',
    nivel: 'aplicacion',
    dificultad: 2,
    enunciado:
      'Durante un esfuerzo submáximo, un deportista mantiene una frecuencia cardíaca de 150 lpm con un volumen sistólico de 100 ml. Calcule su gasto cardíaco en litros por minuto.',
    respuesta: 15,
    tolerancia: 0.3,
    unidad: 'L/min',
    pasos: [
      'Gasto cardíaco = frecuencia cardíaca × volumen sistólico',
      'GC = 150 lpm × 100 ml = 15 000 ml/min',
      'Convertir a litros: 15 000 ÷ 1000',
      'GC = 15 L/min',
    ],
    explicacion:
      'El cálculo es una multiplicación, y donde se pierde el ítem es en la conversión final: el producto sale en mililitros por minuto y el gasto cardíaco se expresa en litros por minuto, así que hay que dividir entre mil. Responder 15 000 no es un error de concepto, pero sí de unidad, y una unidad mal puesta en una historia clínica es un error real. Dato para recordar: en reposo el gasto ronda los 5 L/min, así que 15 L/min es un valor coherente con un esfuerzo submáximo.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.3 — Gasto cardíaco y volumen sistólico',
    etiquetas: ['gasto cardíaco', 'cálculo', 'unidades'],
  },
  {
    id: 'C2-026',
    modulo: 'c2-cardiovascular',
    bloque: 'C',
    tipo: 'caso',
    nivel: 'aplicacion',
    dificultad: 2,
    viñeta:
      'Al terminar una serie, un entrenador toma el pulso de su deportista durante 15 segundos y cuenta 34 latidos. El deportista tiene 30 años y la sesión pide trabajo en R1, entre el 65 y el 75 % de la FCmáx estimada por Fox.',
    enunciado: '¿Qué debe concluir el entrenador?',
    opciones: [
      'Que está a 136 lpm, dentro de R1, porque su FCmáx estimada es de 190 lpm',
      'Que está a 136 lpm y por encima de R1, así que debe bajar el ritmo de inmediato',
      'Que está a 34 lpm, un valor de bradicardia que obliga a detener la sesión',
      'Que está a 204 lpm, por encima de su FCmáx estimada, y debe parar del todo',
    ],
    correcta: 0,
    explicacion:
      'Treinta y cuatro latidos en 15 segundos son 34 × 4 = 136 lpm. Con Fox, la FCmáx a los 30 años es 190, y R1 va de 123,5 a 142,5 lpm: el deportista está dentro. El distractor más tentador multiplica por 6 en lugar de por 4 y da 204 lpm, un valor imposible que debería delatar el error por sí solo, y aun así es el fallo más habitual porque el factor 6 corresponde a la toma de 10 segundos. Dato para recordar: comprueba siempre que el resultado sea fisiológicamente posible.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.1 — Frecuencia cardíaca y fórmulas de FCmáx',
    etiquetas: ['pulso', 'conversión', 'zonas', 'prescripción'],
  },
  {
    id: 'C2-027',
    modulo: 'c2-cardiovascular',
    bloque: 'C',
    tipo: 'caso',
    nivel: 'aplicacion',
    dificultad: 3,
    viñeta:
      'Un corredor de fondo de 28 años lleva seis años entrenando. En una revisión rutinaria le miden una frecuencia cardíaca en reposo de 43 lpm y llega preocupado a la sesión: le han dicho que ese valor está por debajo de lo normal.',
    enunciado: '¿Qué corresponde explicarle?',
    opciones: [
      'Que es la adaptación esperable de un corazón entrenado, que mueve más sangre por latido y necesita menos latidos',
      'Que su corazón se ha vuelto menos eficiente y por eso bombea con una frecuencia tan baja',
      'Que necesita reducir de inmediato el volumen de entrenamiento hasta recuperar los 60 lpm',
      'Que se trata de un error de medición, porque una frecuencia así es incompatible con la vida',
    ],
    correcta: 0,
    explicacion:
      'La bradicardia del deportista es la firma de la adaptación: más volemia, mejor llenado ventricular, mayor volumen sistólico y, por tanto, menos latidos para el mismo gasto cardíaco en reposo. El distractor más tentador es reducir el volumen de entrenamiento, porque nace de aplicar el rango clínico de 60–100 lpm a una población para la que no fue pensado. Dato para recordar: en un corredor entrenado 43 lpm es un resultado del entrenamiento, no un síntoma.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.4 — Adaptaciones cardiovasculares al entrenamiento',
    etiquetas: ['bradicardia', 'adaptaciones', 'FC en reposo'],
  },
  {
    id: 'C2-028',
    modulo: 'c2-cardiovascular',
    bloque: 'C',
    tipo: 'caso',
    nivel: 'aplicacion',
    dificultad: 3,
    viñeta:
      'Una entrenadora prepara un programa de acondicionamiento para un grupo de mujeres de entre 50 y 60 años que llevan años sin actividad física regular. Necesita fijar las zonas de trabajo y duda con qué fórmula estimar la FCmáx.',
    enunciado: '¿Qué elección es la más adecuada y por qué?',
    opciones: [
      'Gulati, porque se validó en mujeres asintomáticas de mediana edad, que es exactamente esta población',
      'Fox, porque es la más difundida y su simplicidad reduce el riesgo de error de cálculo',
      'Astrand, porque es la más antigua y por tanto la que más años lleva contrastándose',
      'Cualquiera de las cinco, porque a esas edades todas las fórmulas convergen en el mismo valor',
    ],
    correcta: 0,
    explicacion:
      'Gulati se obtuvo justamente en mujeres asintomáticas de mediana edad, así que es la que mejor describe a este grupo. El distractor más tentador es Fox por difusión y simplicidad: a los 55 años Fox da 165 lpm y Gulati 157,6, casi ocho latidos de diferencia que desplazan todas las zonas hacia arriba en un grupo desentrenado, que es donde menos conviene equivocarse por exceso. Dato para recordar: la fórmula se elige por la población, no por la costumbre.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.1 — Frecuencia cardíaca y fórmulas de FCmáx',
    etiquetas: ['FCmáx', 'Gulati', 'prescripción', 'población'],
  },
];
