// content/glosario.ts
// Unión de las "cajas de conceptos clave" de las cuatro cartillas.
// REGLA: todo conceptoClave de un módulo marcado 'completo' debe tener entrada
// aquí, o el build falla. Al terminar un módulo, se añaden sus términos.

import type { EntradaGlosario } from '@/lib/tipos';

export const GLOSARIO: EntradaGlosario[] = [
  /* ── C5 · Umbrales y zonas (módulo piloto) ── */
  {
    termino: 'Umbral aeróbico (VT1)',
    definicion:
      'Primer umbral ventilatorio. Intensidad, en torno al 65–75 % de la FCmáx, a partir de la cual la ventilación empieza a crecer más rápido que el consumo de oxígeno. Marca el techo del trabajo puramente aeróbico y la zona de máxima oxidación de grasas.',
    modulo: 'c5-umbrales-zonas',
    sinonimos: ['VT1', 'Primer umbral ventilatorio'],
  },
  {
    termino: 'Umbral anaeróbico (VT2)',
    definicion:
      'Segundo umbral ventilatorio, entre el 75–85 % del VO₂máx (80–90 % de la FCmáx). Por encima de él el lactato se acumula más rápido de lo que se elimina y el esfuerzo deja de ser sostenible. Contiene el MLSS.',
    modulo: 'c5-umbrales-zonas',
    sinonimos: ['VT2', 'Segundo umbral ventilatorio', 'Umbral láctico'],
  },
  {
    termino: 'MLSS',
    definicion:
      'Máximo estado estable de lactato: la intensidad más alta a la que la concentración de lactato en sangre se mantiene constante en el tiempo. Es el punto de referencia práctico del umbral anaeróbico y define el techo del trabajo continuo prolongado.',
    modulo: 'c5-umbrales-zonas',
    sinonimos: ['Máximo estado estable de lactato'],
  },
  {
    termino: 'IMTG',
    definicion:
      'Triglicéridos intramusculares: depósitos de grasa almacenados dentro de la fibra muscular. El entrenamiento continuo en R1 los aumenta, lo que mejora la disponibilidad de sustrato lipídico en esfuerzos largos.',
    modulo: 'c5-umbrales-zonas',
    sinonimos: ['Triglicéridos intramusculares'],
  },
  {
    termino: 'VAM',
    definicion:
      'Velocidad aeróbica máxima: la velocidad de desplazamiento más baja a la que se alcanza el VO₂máx. Sirve para prescribir intervalos en porcentaje de VAM en vez de en porcentaje de frecuencia cardíaca.',
    modulo: 'c5-umbrales-zonas',
    sinonimos: ['Velocidad aeróbica máxima'],
  },
  {
    termino: 'Potencia aeróbica',
    definicion:
      'Capacidad de trabajar cerca del VO₂máx. Se entrena en R3 (90–95 %) y produce aumento de densidad capilar, densidad mitocondrial y actividad de las enzimas oxidativas.',
    modulo: 'c5-umbrales-zonas',
  },
  {
    termino: 'Entrenamiento polarizado',
    definicion:
      'Modelo de distribución de la intensidad que concentra el volumen por debajo del VT1 y el resto por encima del VT2, evitando deliberadamente la zona intermedia (R2). Busca alto estímulo con baja fatiga acumulada.',
    modulo: 'c5-umbrales-zonas',
    sinonimos: ['Modelo polarizado'],
  },
  {
    termino: 'HIIT',
    definicion:
      'Entrenamiento interválico de alta intensidad: series submáximas cercanas al VO₂máx con recuperaciones incompletas. Se ubica en R3/R3+.',
    modulo: 'c5-umbrales-zonas',
    sinonimos: ['Entrenamiento interválico de alta intensidad'],
  },
  {
    termino: 'SIT',
    definicion:
      'Sprint interval training: repeticiones de muy corta duración a intensidad máxima o supramáxima con recuperaciones largas. Aunque el esfuerzo es de sprint, su objetivo adaptativo se ubica en el trabajo de potencia aeróbica (R3+).',
    modulo: 'c5-umbrales-zonas',
    sinonimos: ['Sprint interval training'],
  },

  /* ── Términos transversales de alto rendimiento en el examen ── */
  {
    termino: 'MET',
    definicion:
      'Equivalente metabólico. 1 MET equivale a 3,5 ml de O₂ por kilogramo de peso por minuto: el consumo aproximado en reposo. Se usa para expresar la intensidad de una actividad como múltiplo del reposo.',
    modulo: 'c3-respiratorio-vo2',
  },
  {
    termino: 'VO₂máx',
    definicion:
      'Máximo volumen de oxígeno que el organismo puede captar, transportar y utilizar por unidad de tiempo. Se calcula como gasto cardíaco por diferencia arteriovenosa y se expresa en ml/kg/min.',
    modulo: 'c3-respiratorio-vo2',
  },
  {
    termino: 'Frecuencia cardíaca de reserva',
    definicion:
      'Diferencia entre la frecuencia cardíaca máxima y la de reposo. Representa el margen de trabajo cardíaco disponible y es la base del método de Karvonen para prescribir intensidades.',
    modulo: 'c2-cardiovascular',
  },
  {
    termino: 'Gasto cardíaco',
    definicion:
      'Volumen de sangre que el corazón expulsa por minuto. Es el producto de la frecuencia cardíaca por el volumen sistólico.',
    modulo: 'c2-cardiovascular',
  },
  {
    termino: 'Densidad',
    definicion:
      'Relación entre el tiempo de trabajo activo y el tiempo total de la sesión o serie. Reducir el descanso sube la densidad y aumenta la exigencia sin tocar el peso ni el volumen.',
    modulo: 'd2-carga',
  },
  {
    termino: 'Escala de Borg (RPE)',
    definicion:
      'Escala de esfuerzo percibido con la que el deportista califica subjetivamente la intensidad. Es el instrumento estándar para estimar la carga interna cuando no hay medición objetiva.',
    modulo: 'd2-carga',
  },
  {
    termino: 'Multilateralidad',
    definicion:
      'Principio biológico que defiende una preparación multifacética, con variedad de conductas motrices, técnicas y métodos. Es especialmente pertinente en las primeras etapas de la vida deportiva.',
    modulo: 'b2-principios',
  },
  {
    termino: 'Especificidad',
    definicion:
      'Principio biológico según el cual las adaptaciones responden a las características concretas del estímulo aplicado. Se aplica después de haber desarrollado las cualidades básicas.',
    modulo: 'b2-principios',
  },
  {
    termino: 'Supercompensación',
    definicion:
      'Restablecimiento del organismo por encima del nivel inicial tras el agotamiento provocado por una carga y su recuperación. Es el mecanismo que explica la mejora del rendimiento.',
    modulo: 'b2-principios',
  },
  {
    termino: 'Objetividad',
    definicion:
      'Grado en que los resultados de una prueba están libres de sesgos o influencias ajenas al atributo medido. Se garantiza con procedimientos e instrumentos estandarizados.',
    modulo: 'a6-estadistica',
  },
  {
    termino: 'Fiabilidad',
    definicion:
      'Consistencia de una prueba: si se repite en las mismas condiciones, arroja resultados equivalentes. Una prueba puede ser fiable sin ser válida.',
    modulo: 'a6-estadistica',
  },
  {
    termino: 'Validez',
    definicion:
      'Grado en que una prueba mide efectivamente lo que dice medir. Sin validez, la precisión y la consistencia no sirven de nada.',
    modulo: 'a6-estadistica',
  },
  {
    termino: 'Responsabilidad estricta',
    definicion:
      'Principio del Artículo 2.1 del Código Mundial Antidopaje: el deportista responde por cualquier sustancia prohibida hallada en su muestra, sin que sea necesario demostrar intención. La intención puede influir en la sanción, no en la existencia de la infracción.',
    modulo: 'c9-dopaje',
  },

  /* ── D1 · Conceptualización y metodología del entrenamiento ── */
  {
    termino: 'Metodología del entrenamiento',
    definicion:
      'Cuerpo de conocimiento que estudia los métodos, medios y procedimientos con los que se dirige el proceso de entrenamiento, y que justifica por qué se eligen unos y no otros. El entrenamiento es el qué se hace; la metodología es el cómo y el porqué de ese cómo.',
    modulo: 'd1-conceptualizacion',
  },
  {
    termino: 'Nivel de formación',
    definicion:
      'Primero de los tres niveles de la Ley 2210. Habilita para dirigir al deportista principiante, en etapa de iniciación, y prioriza la base motriz multilateral, la técnica elemental y la adherencia al deporte por encima del resultado competitivo.',
    modulo: 'd1-conceptualizacion',
    sinonimos: ['Formación'],
  },
  {
    termino: 'Altos logros',
    definicion:
      'Tercero y último de los niveles de la Ley 2210. Habilita para dirigir al deportista avanzado, de rendimiento, y prioriza la individualización de la carga y la construcción de picos de forma para un calendario de competencia definido.',
    modulo: 'd1-conceptualizacion',
    sinonimos: ['Nivel de altos logros'],
  },
  {
    termino: 'Ley 2210 de 2022',
    definicion:
      'Ley colombiana sancionada el 23 de mayo de 2022 que reconoce y regula el ejercicio del entrenador deportivo. Exige acreditar idoneidad y organiza el ejercicio en tres niveles: formación, perfeccionamiento y altos logros. Quien no tiene título profesional afín acredita idoneidad aprobando una evaluación en una categoría deportiva, siendo mayor de 18 años y con 12 meses mínimo de experiencia.',
    modulo: 'd1-conceptualizacion',
    sinonimos: ['Ley 2210'],
  },

  /* ── D2 · La carga y sus componentes ── */
  {
    termino: 'Carga interna',
    definicion:
      'Respuesta que el organismo del deportista da al trabajo realizado. Se estima con frecuencia cardíaca, lactato, esfuerzo percibido o tiempo de recuperación. Una misma carga externa produce cargas internas distintas según el sueño, la salud, el nivel de entrenamiento, el calor y la altitud.',
    modulo: 'd2-carga',
  },
  {
    termino: 'Carga externa',
    definicion:
      'Trabajo prescrito y ejecutado, medido fuera del organismo: kilos, kilómetros, series, repeticiones o velocidad. Es lo que el entrenador escribe en la planilla y puede cuantificar sin consultar al deportista. Se planifica, mientras que la carga interna se controla.',
    modulo: 'd2-carga',
  },

  /* ── D3 · Capacidad física: fuerza ── */
  {
    termino: 'Fuerza máxima',
    definicion:
      'La mayor tensión que un músculo o grupo muscular puede generar en una contracción voluntaria. Se entrena por encima del 85 % del 1RM, con menos de 6 repeticiones y descansos de 2 a 5 minutos, y mejora sobre todo por adaptación nerviosa: más unidades motoras reclutadas y mejor sincronizadas.',
    modulo: 'd3-fuerza',
  },
  {
    termino: 'Fuerza explosiva',
    definicion:
      'Capacidad de generar la mayor tensión posible en el menor tiempo posible. La define la intención de mover rápido, no lo ligero de la carga: como la potencia es el producto de fuerza por velocidad, su máximo aparece con cargas medias y no con el 1RM.',
    modulo: 'd3-fuerza',
    sinonimos: ['Fuerza rápida', 'Potencia'],
  },
  {
    termino: 'Test de 1RM',
    definicion:
      'Prueba que determina la carga máxima movilizable una sola vez con técnica correcta en un ejercicio concreto. Se resuelve en 3 a 5 intentos máximos con 3 a 5 minutos de descanso, tras dos series de aproximación, y es la referencia sobre la que se calculan todos los porcentajes de prescripción.',
    modulo: 'd3-fuerza',
    sinonimos: ['1RM', 'Una repetición máxima'],
  },

  /* ── D4 · Capacidad física: resistencia ── */
  {
    termino: 'Resistencia aeróbica',
    definicion:
      'Capacidad de sostener un esfuerzo prolongado en el que el aporte de oxígeno cubre la demanda energética, retrasando la fatiga y permitiendo una recuperación rápida. Es la base sobre la que se construye el resto del trabajo de resistencia.',
    modulo: 'd4-resistencia',
  },
  {
    termino: 'Método interválico',
    definicion:
      'Método fraccionado en el que las series se separan por una pausa incompleta o pausa útil: se reanuda con el pulso todavía alto, en la franja de 120 a 140 lpm. Se llama útil porque el volumen sistólico alcanza su valor más alto durante esa pausa, y esperar la recuperación total lo convertiría en método de repeticiones.',
    modulo: 'd4-resistencia',
    sinonimos: ['Interválico', 'Entrenamiento por intervalos'],
  },
  {
    termino: 'Test de Cooper',
    definicion:
      'Prueba de campo que consiste en recorrer la mayor distancia posible en 12 minutos, con la que se estima el VO₂máx mediante la fórmula (distancia en metros − 504,9) / 44,73. Es indirecta, colectiva y de ritmo libre, así que la estrategia de dosificación forma parte de la prueba.',
    modulo: 'd4-resistencia',
  },
  {
    termino: 'Course Navette',
    definicion:
      'Prueba progresiva y máxima de ida y vuelta entre dos líneas separadas 20 metros, al ritmo de una señal sonora que arranca en 8,5 km/h y sube 0,5 km/h en cada palier de un minuto. Termina cuando el evaluado no llega a la línea a tiempo dos veces seguidas.',
    modulo: 'd4-resistencia',
    sinonimos: ['Test de Léger', 'Test de ida y vuelta de 20 metros'],
  },

  /* ── D5 · Capacidad física: velocidad ── */
  {
    termino: 'Velocidad de reacción',
    definicion:
      'Capacidad de responder a un estímulo en el menor tiempo posible, medida como el intervalo entre la aparición del estímulo y el inicio del movimiento. Es simple cuando hay un solo estímulo previsto y una sola respuesta, y compleja o discriminativa cuando hay varios estímulos posibles y el deportista debe elegir.',
    modulo: 'd5-velocidad',
    sinonimos: ['Tiempo de reacción', 'Reacción discriminativa'],
  },
  {
    termino: 'Velocidad gestual',
    definicion:
      'Capacidad de ejecutar un gesto técnico único en el menor tiempo posible: un golpeo, un remate, un lanzamiento. Se llama acíclica o segmentaria porque el gesto se realiza una sola vez y con un segmento corporal, sin repetir un ciclo de desplazamiento.',
    modulo: 'd5-velocidad',
    sinonimos: ['Velocidad acíclica', 'Velocidad segmentaria'],
  },
  {
    termino: 'Resistencia a la velocidad',
    definicion:
      'Capacidad de sostener la velocidad máxima o cercana a la máxima el mayor tiempo posible frente a la fatiga. Es el único trabajo de velocidad que se realiza con recuperación incompleta y buscando la fatiga a propósito, con predominio de la vía anaeróbica láctica.',
    modulo: 'd5-velocidad',
    sinonimos: ['Velocidad-resistencia'],
  },

  /* ── D6 · Capacidad física: flexibilidad ── */
  {
    termino: 'Movilidad articular',
    definicion:
      'Recorrido que permite una articulación por su propia estructura: forma de las superficies óseas, cápsula y ligamentos. Es un factor articular y no muscular; junto con la elasticidad muscular determina la flexibilidad que el deportista alcanza.',
    modulo: 'd6-flexibilidad',
    sinonimos: ['Movilidad'],
  },
  {
    termino: 'Elasticidad muscular',
    definicion:
      'Capacidad del músculo de deformarse y recuperar su forma y su longitud originales cuando cesa la fuerza que lo deformó. No debe confundirse con la extensibilidad, que es la capacidad de alargarse por encima de la longitud de reposo: la elasticidad describe el retorno, no la ida.',
    modulo: 'd6-flexibilidad',
    sinonimos: ['Elasticidad'],
  },
  {
    termino: 'FNP',
    definicion:
      'Facilitación neuromuscular propioceptiva: procedimiento de estiramiento que alterna fases pasivas con contracciones del propio músculo. En el método mantener-relajar se estira unos 10 s, se contrae de forma isométrica y submáxima unos 6 s, se relaja y se vuelve a estirar de 10 a 30 s. Se explica clásicamente por la inhibición autógena y la inhibición recíproca.',
    modulo: 'd6-flexibilidad',
    sinonimos: ['Facilitación neuromuscular propioceptiva', 'PNF'],
  },
  {
    termino: 'Sit and reach',
    definicion:
      'Test de campo que evalúa sobre todo la extensibilidad de los isquiosurales: sentado con las piernas extendidas y las plantas contra el cajón, se flexiona el tronco al frente sin rebotes y se mide el alcance en centímetros. En el cajón clásico el cero está en la planta del pie; en el calibrado, la planta marca 23 cm.',
    modulo: 'd6-flexibilidad',
    sinonimos: ['Test de Wells', 'Flexión profunda de tronco'],
  },

  /* ── D7 · Modelos de planificación ── */
  {
    termino: 'Modelo tradicional',
    definicion:
      'Periodización clásica formulada por Matveiev. Ordena la temporada en un macrociclo con un único pico de forma, dividido en período preparatorio, competitivo y transitorio, con relación inversa entre volumen e intensidad y desarrollo simultáneo de varias capacidades, de lo general a lo específico.',
    modulo: 'd7-modelos-planificacion',
    sinonimos: ['Periodización clásica', 'Modelo de Matveiev'],
  },
  {
    termino: 'Modelo contemporáneo',
    definicion:
      'Familia de modelos que responde al calendario denso del deporte actual concentrando la carga de una sola orientación por bloque y repartiendo la temporada en tres o cuatro macrociclos con su propio pico. Se define por tres rasgos: flexibilidad, multifuncionalidad e individualización.',
    modulo: 'd7-modelos-planificacion',
    sinonimos: ['Modelos contemporáneos', 'Planificación por bloques'],
  },
  {
    termino: 'Pico de rendimiento',
    definicion:
      'Momento en que coinciden la mejor condición física, técnica y psicológica del deportista. No se sostiene indefinidamente: se construye, se mantiene unas semanas y se pierde, por lo que planificar consiste en colocarlo sobre la fecha de la competencia objetivo.',
    modulo: 'd7-modelos-planificacion',
    sinonimos: ['Pico de forma', 'Forma deportiva máxima'],
  },

  /* ── D8 · Estructuras de la planificación ── */
  {
    termino: 'Macrociclo',
    definicion:
      'Estructura mayor de la planificación, de tres a doce meses de duración. Agrupa mesociclos y es el nivel donde se decide cuál es la competencia principal, en qué fecha cae y cómo se reparte el tiempo en períodos.',
    modulo: 'd8-estructuras',
    sinonimos: ['Macroestructura'],
  },
  {
    termino: 'Mesociclo',
    definicion:
      'Agrupación de microciclos con una orientación de carga común, de dos a seis semanas de duración, lo habitual cuatro. Es el nivel donde se decide de qué va el bloque de trabajo. El mesociclo básico se subdivide en desarrollador y estabilizador.',
    modulo: 'd8-estructuras',
    sinonimos: ['Mesoestructura'],
  },
  {
    termino: 'Microciclo',
    definicion:
      'Conjunto de sesiones de unos pocos días, de tres a diez, lo habitual siete por comodidad del calendario semanal y no por razón fisiológica. Es el nivel donde se decide la alternancia entre días de carga y días de recuperación.',
    modulo: 'd8-estructuras',
    sinonimos: ['Microestructura'],
  },
  {
    termino: 'Vuelta a la calma',
    definicion:
      'Parte final de la sesión, de cinco a diez minutos, en la que la actividad se hace progresivamente más suave para devolver el organismo a valores de reposo, favorecer la retirada de metabolitos y evitar que la sangre quede acumulada en las piernas al detenerse de golpe.',
    modulo: 'd8-estructuras',
    sinonimos: ['Parte final de la sesión', 'Enfriamiento'],
  },
];

/** Filtro del glosario en cliente. <400 entradas: no necesita índice. */
export function normalizarBusqueda(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function buscarGlosario(consulta: string): EntradaGlosario[] {
  const q = normalizarBusqueda(consulta);
  if (q.length === 0) return GLOSARIO;
  return GLOSARIO.filter((e) => {
    const campos = [e.termino, e.definicion, ...(e.sinonimos ?? [])];
    return campos.some((c) => normalizarBusqueda(c).includes(q));
  });
}
