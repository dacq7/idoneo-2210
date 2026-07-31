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

  /* ── C1 · Vías energéticas (paso 16) ── */
  {
    termino: 'Fosfocreatina',
    definicion:
      'Compuesto de alta energía almacenado en la fibra muscular que cede su grupo fosfato al ADP para regenerar ATP de forma inmediata y sin oxígeno. Sostiene entre 5 y 15 segundos de esfuerzo máximo, según la intensidad y las reservas disponibles.',
    modulo: 'c1-vias-energeticas',
    sinonimos: ['PCr', 'Creatina fosfato'],
  },
  {
    termino: 'Creatina quinasa',
    definicion:
      'Enzima que cataliza la transferencia del fosfato entre la fosfocreatina y el ADP, en los dos sentidos: durante el esfuerzo regenera ATP y durante la recuperación repone las reservas de fosfocreatina. En sangre se usa además como biomarcador de daño muscular.',
    modulo: 'c1-vias-energeticas',
    sinonimos: ['CK', 'Creatín quinasa'],
  },
  {
    termino: 'Glucólisis',
    definicion:
      'Vía citoplasmática que degrada la glucosa hasta piruvato con un rendimiento neto de 2 ATP y 2 NADH. Con oxígeno suficiente el piruvato entra a la mitocondria; sin él se reduce a lactato. Es una sola vía con dos finales posibles, no dos vías distintas.',
    modulo: 'c1-vias-energeticas',
  },
  {
    termino: 'Ciclo de Krebs',
    definicion:
      'Secuencia de reacciones que ocurre en la matriz mitocondrial y oxida el acetil-CoA produciendo NADH, FADH₂ y GTP. No genera casi ATP directamente: su función es alimentar de transportadores reducidos a la cadena de transporte de electrones, que es donde se paga el grueso de la factura.',
    modulo: 'c1-vias-energeticas',
    sinonimos: ['Ciclo del ácido cítrico', 'Ciclo de los ácidos tricarboxílicos'],
  },

  /* ── C2 · Sistema cardiovascular (paso 16) ── */
  {
    termino: 'Frecuencia cardíaca máxima',
    definicion:
      'Número máximo de latidos por minuto que alcanza el corazón en esfuerzo máximo. Depende fundamentalmente de la edad y no aumenta con el entrenamiento. Se estima con fórmulas de regresión —Fox, Astrand, Tanaka, Gellish o Gulati— que arrastran un error de unos diez latidos.',
    modulo: 'c2-cardiovascular',
    sinonimos: ['FCmáx', 'FC máxima'],
  },
  {
    termino: 'Volumen sistólico',
    definicion:
      'Cantidad de sangre que el ventrículo expulsa en cada latido, en torno a 70 ml en reposo. Es la variable que más mejora con el entrenamiento de resistencia y la que explica que la frecuencia cardíaca de reposo descienda en el deportista entrenado.',
    modulo: 'c2-cardiovascular',
  },

  /* ── C3 · Sistema respiratorio y VO₂máx (paso 16) ── */
  {
    termino: 'Diferencia arteriovenosa',
    definicion:
      'Diferencia entre el contenido de oxígeno de la sangre arterial y el de la venosa: mide cuánto oxígeno extrae el tejido de la sangre que lo atraviesa. Pasa de unos 5 ml por 100 ml en reposo a 15–17 ml por 100 ml en ejercicio intenso.',
    modulo: 'c3-respiratorio-vo2',
    sinonimos: ['Diferencia a-vO₂'],
  },
  {
    termino: 'Ventilación',
    definicion:
      'Proceso mecánico de movilizar aire entre la atmósfera y el alvéolo. Durante el ejercicio aumenta por el ascenso de la frecuencia respiratoria y del volumen corriente. En una persona sana no es el factor que limita el VO₂máx: el techo lo pone el transporte de oxígeno.',
    modulo: 'c3-respiratorio-vo2',
    sinonimos: ['Ventilación pulmonar'],
  },

  /* ── C4 · Sistemas nervioso, digestivo y osteomuscular (paso 16) ── */
  {
    termino: 'Propiocepción',
    definicion:
      'Información sobre la posición y el movimiento del cuerpo obtenida sin recurrir a la vista, a partir de receptores situados en músculos, tendones y articulaciones. Es entrenable con trabajo de equilibrio e inestabilidad, y en eso se basan los programas de prevención de esguinces.',
    modulo: 'c4-nervioso-digestivo-osteomuscular',
  },
  {
    termino: 'Huso muscular',
    definicion:
      'Receptor situado en el vientre muscular que detecta el grado de estiramiento y la velocidad a la que se produce. Dispara el reflejo miotático, que responde con una contracción protectora, y por eso estirar de forma brusca resulta contraproducente.',
    modulo: 'c4-nervioso-digestivo-osteomuscular',
  },
  {
    termino: 'Contracción excéntrica',
    definicion:
      'Contracción isotónica en la que el músculo se alarga mientras frena una carga que lo supera. Genera más tensión que la concéntrica reclutando menos unidades motoras, de modo que cada fibra activa soporta más: de ahí su mayor microdaño y el dolor muscular tardío.',
    modulo: 'c4-nervioso-digestivo-osteomuscular',
  },
  {
    termino: 'Fibra tipo II',
    definicion:
      'Fibra muscular rápida, de metabolismo predominantemente glucolítico, capaz de generar mucha fuerza en poco tiempo y con baja resistencia a la fatiga. Se recluta en último lugar, así que solo se alcanza con intensidad alta o con velocidad de ejecución alta.',
    modulo: 'c4-nervioso-digestivo-osteomuscular',
    sinonimos: ['Fibra rápida', 'Fibra blanca'],
  },

  /* ── C6 · Biomecánica (paso 16) ── */
  {
    termino: 'Cinética',
    definicion:
      'Rama de la biomecánica que estudia las fuerzas que producen o modifican el movimiento: fuerzas, momentos, presiones y sus efectos sobre el aparato locomotor. Responde al porqué del movimiento.',
    modulo: 'c6-biomecanica',
  },
  {
    termino: 'Cinemática',
    definicion:
      'Rama de la biomecánica que describe el movimiento —posición, desplazamiento, velocidad, aceleración y ángulos— sin atender a las fuerzas que lo causan. Responde al qué pasa, no al porqué.',
    modulo: 'c6-biomecanica',
  },
  {
    termino: 'Centro de gravedad',
    definicion:
      'Punto teórico en el que se considera concentrada toda la masa del cuerpo. En posición anatómica se sitúa en torno al 55 % de la estatura, a la altura de la segunda vértebra sacra, y puede quedar fuera del cuerpo cuando este cambia de forma.',
    modulo: 'c6-biomecanica',
    sinonimos: ['CG', 'Centro de masas'],
  },
  {
    termino: 'Cadena cinemática',
    definicion:
      'Conjunto de segmentos articulados que actúan de forma coordinada. Es abierta cuando el extremo distal se mueve libre —extensión de rodilla en máquina— y cerrada cuando está fijo contra una resistencia —sentadilla—. La cerrada reparte la carga entre varias articulaciones; la abierta la concentra.',
    modulo: 'c6-biomecanica',
  },

  /* ── C7 · Nutrición deportiva (paso 16) ── */
  {
    termino: 'Índice glucémico',
    definicion:
      'Medida de la velocidad con la que un alimento eleva la glucosa en sangre respecto a un alimento de referencia. Mide rapidez, no cantidad: antes del esfuerzo interesan los hidratos de bajo índice glucémico y en la recuperación los de alto.',
    modulo: 'c7-nutricion-deportiva',
    sinonimos: ['IG'],
  },
  {
    termino: 'Ventana de recuperación',
    definicion:
      'Período de 30 a 60 minutos posterior al esfuerzo en el que el músculo capta glucosa con mayor facilidad, de modo que reponer entonces acelera la recarga de glucógeno. No es un plazo absoluto: pasada esa hora se sigue reponiendo, solo que más despacio.',
    modulo: 'c7-nutricion-deportiva',
    sinonimos: ['Ventana metabólica', 'Ventana anabólica'],
  },
  {
    termino: 'Bebida isotónica',
    definicion:
      'Bebida cuya concentración de solutos es similar a la del plasma sanguíneo y que aporta agua, hidratos de carbono y electrolitos a la vez. Se indica en esfuerzos de más de 60 minutos; una bebida hipertónica retrasaría el vaciado gástrico en lugar de rehidratar.',
    modulo: 'c7-nutricion-deportiva',
  },
  {
    termino: 'Gasto energético total',
    definicion:
      'Suma de la energía que consume el organismo en un día: metabolismo basal, que es con diferencia el componente mayor, efecto térmico de los alimentos, en torno al 10 %, y gasto por actividad física, que es el único realmente modificable a corto plazo.',
    modulo: 'c7-nutricion-deportiva',
    sinonimos: ['GET'],
  },

  /* ── C8 · Psicología del deporte (paso 16) ── */
  {
    termino: 'Condicionamiento operante',
    definicion:
      'Teoría del aprendizaje de Skinner según la cual la conducta se modifica en función de sus consecuencias. Los refuerzos, positivos o negativos, aumentan la conducta; los castigos la disminuyen. Refuerzo negativo y castigo no son lo mismo.',
    modulo: 'c8-psicologia-deporte',
  },
  {
    termino: 'Aprendizaje vicario',
    definicion:
      'Aprendizaje por observación de un modelo, descrito por Bandura. Exige atención, retención, capacidad de reproducción y motivación. Un modelo de nivel cercano suele enseñar más que uno perfecto, porque el observador se ve capaz de reproducir lo que ve.',
    modulo: 'c8-psicologia-deporte',
    sinonimos: ['Aprendizaje social', 'Aprendizaje por observación', 'Modelado'],
  },
  {
    termino: 'Refuerzo positivo',
    definicion:
      'Procedimiento que añade un estímulo agradable tras una conducta para que esta se repita con mayor frecuencia. Para que enseñe debe ser específico, inmediato y referido al proceso: un elogio genérico y tardío no le dice al deportista qué debe repetir.',
    modulo: 'c8-psicologia-deporte',
  },
  {
    termino: 'Activación mental',
    definicion:
      'Nivel de alerta psicofisiológica del deportista. Su relación con el rendimiento tiene forma de U invertida: existe un punto óptimo y el rendimiento cae tanto por defecto como por exceso. Cuanto más fina y compleja es la tarea, más bajo es ese punto óptimo.',
    modulo: 'c8-psicologia-deporte',
    sinonimos: ['Arousal', 'Nivel de activación'],
  },

  /* ── C9 · Prevención y control del dopaje (paso 16) ── */
  {
    termino: 'AMA/WADA',
    definicion:
      'Agencia Mundial Antidopaje. Elabora el Código Mundial Antidopaje y la Lista de sustancias y métodos prohibidos, que revisa cada año, y acredita los laboratorios. No juzga: los recursos los resuelve en última instancia el Tribunal de Arbitraje Deportivo.',
    modulo: 'c9-dopaje',
    sinonimos: ['Agencia Mundial Antidopaje', 'WADA', 'AMA'],
  },
  {
    termino: 'Localización fallida',
    definicion:
      'Incumplimiento de la obligación de declarar el paradero o de estar disponible para un control. Constituye la infracción 2.4 cuando se acumulan tres incumplimientos, en cualquier combinación, dentro de un período de doce meses; la ventana es móvil y no coincide con el año natural.',
    modulo: 'c9-dopaje',
    sinonimos: ['Incumplimiento de localización', 'Fallo de paradero'],
  },
  {
    termino: 'Asociación prohibida',
    definicion:
      'Infracción 2.10 del Código Mundial Antidopaje: colaborar en el ámbito deportivo con personal de apoyo que cumple sanción por dopaje. Alcanza a entrenadores, médicos y preparadores, y no depende de que la relación sea remunerada.',
    modulo: 'c9-dopaje',
  },

  /* ── B1 · Fundamentos de la pedagogía del deporte (paso 17) ── */
  {
    termino: 'Entrenabilidad',
    definicion:
      'Grado en que un deportista responde a un estímulo de entrenamiento. No es su nivel actual: el principiante tiene poca capacidad y mucha entrenabilidad, y el deportista de élite mucha capacidad y muy poca. Depende de la edad y el momento madurativo, del nivel de partida, de la carga genética y del estado de salud y descanso.',
    modulo: 'b1-fundamentos-pedagogia',
  },
  {
    termino: 'Forma deportiva',
    definicion:
      'Estado de disposición óptima para rendir. Es temporal por definición: se construye, se alcanza y se pierde, y ninguna planificación la vuelve permanente. Esa caducidad es la razón de que exista la planificación, que decide cuándo debe aparecer el pico.',
    modulo: 'b1-fundamentos-pedagogia',
  },
  {
    termino: 'Capacidad motriz',
    definicion:
      'Conjunto de cualidades que permiten al deportista realizar y controlar el movimiento. Se divide en condicionales —fuerza, resistencia, velocidad y flexibilidad, dependientes del músculo y del metabolismo— y coordinativas —equilibrio, ritmo, orientación, reacción, diferenciación, acoplamiento y adaptación, dependientes del sistema nervioso.',
    modulo: 'b1-fundamentos-pedagogia',
    sinonimos: ['Capacidades motrices', 'Cualidades motrices'],
  },
  {
    termino: 'Adaptación',
    definicion:
      'Cambio estable del organismo en respuesta a cargas repetidas, específico del estímulo aplicado. Ocurre durante la recuperación y no durante la sesión: entrenar es aplicar el estímulo, adaptarse es descansar. Se distingue de la forma deportiva en que la adaptación es estable y la forma, temporal.',
    modulo: 'b1-fundamentos-pedagogia',
  },

  /* ── B2 · Principios (paso 17) ── */
  {
    termino: 'Sobrecarga',
    definicion:
      'Principio biológico según el cual el estímulo debe superar el nivel al que el organismo ya está habituado para provocar adaptación. Es una condición puntual —cuánto hoy— y se complementa con la progresión, que es temporal: cuánto más y cuándo. Sobrecarga sin progresión estanca; progresión sin sobrecarga es aumentar la nada.',
    modulo: 'b2-principios',
  },
  {
    termino: 'Retornos en disminución',
    definicion:
      'Principio biológico según el cual, a medida que sube el nivel del deportista, la misma carga produce cada vez menos mejora. Es la entrenabilidad vista desde el otro lado, y su respuesta operativa es el principio de variabilidad: cambiar el estímulo, no solo su magnitud. No debe confundirse con la reversibilidad, que describe la pérdida de lo ganado al cesar el entrenamiento.',
    modulo: 'b2-principios',
    sinonimos: ['Rendimientos decrecientes', 'Retornos decrecientes'],
  },

  /* ── B3 · Modelos pedagógicos (paso 17) ── */
  {
    termino: 'Modelo comprensivo',
    definicion:
      'Modelo pedagógico de Bunker y Thorpe, conocido por sus siglas inglesas TGfU (Teaching Games for Understanding). Sostiene que la carencia principal del principiante no es técnica sino de comprensión táctica, y por eso va del juego a la técnica mediante juegos modificados que rebajan la exigencia de ejecución sin tocar el problema táctico.',
    modulo: 'b3-modelos-pedagogicos',
    sinonimos: ['TGfU', 'Teaching Games for Understanding', 'Enseñanza comprensiva'],
  },
  {
    termino: 'Modelo constructivista',
    definicion:
      'Modelo pedagógico que parte de que el conocimiento no se transmite sino que se construye: el entrenador plantea el problema y organiza la tarea en lugar de dar la solución. El error deja de ser un fallo que corregir y pasa a ser información sobre qué hipótesis del deportista no funcionó.',
    modulo: 'b3-modelos-pedagogicos',
  },
  {
    termino: 'Modelo integrado técnico-táctico',
    definicion:
      'Modelo pedagógico que rechaza la disyuntiva entre empezar por la técnica o por la táctica y trabaja las dos a la vez dentro de situaciones de juego con sentido. Cada tarea lleva un objetivo táctico y un contenido técnico asociados, y ninguno se trabaja al margen del otro.',
    modulo: 'b3-modelos-pedagogicos',
    sinonimos: ['Modelo integrado'],
  },

  /* ── B4 · Componentes didácticos (paso 17) ── */
  {
    termino: 'Didáctica',
    definicion:
      'Rama de la pedagogía que estudia el proceso de enseñanza y aprendizaje. No es un método ni un conjunto de métodos: la metodología reúne los métodos y el criterio para elegir entre ellos, y el método es el camino concreto que se acaba recorriendo.',
    modulo: 'b4-componentes-didacticos',
  },
  {
    termino: 'Método',
    definicion:
      'Camino concreto y ordenado que se recorre para alcanzar un objetivo. Ocupa el tercer escalón de la escala didáctica, entre la metodología —que es el conjunto de métodos disponibles con su criterio de elección— y la tarea, que es lo que el deportista ejecuta.',
    modulo: 'b4-componentes-didacticos',
  },
  {
    termino: 'Tarea deportiva',
    definicion:
      'Unidad mínima de trabajo con la que se construye una sesión. Para estar bien planteada necesita cuatro cosas: un objetivo claro, un contenido, una organización —espacio, material, agrupamiento y tiempo— y unos criterios de éxito. Se clasifica en cerrada o abierta según la incertidumbre del entorno.',
    modulo: 'b4-componentes-didacticos',
    sinonimos: ['Tarea'],
  },
  {
    termino: 'Programación',
    definicion:
      'Segunda fase del proceso de entrenamiento: concreta la planificación en contenidos, sesiones y cargas. La planificación decide el destino —qué objetivos y en qué orden— y la programación traza la ruta. Le siguen la ejecución, el control y la evaluación.',
    modulo: 'b4-componentes-didacticos',
  },

  /* ── B5 · Estilos de enseñanza (paso 17) ── */
  {
    termino: 'Mando directo',
    definicion:
      'Estilo de enseñanza tradicional en el que el entrenador decide todo —qué, cómo, cuándo se empieza y cuándo se para— y la ejecución es simultánea a su señal. Es el indicado cuando un error de ejecución termina en lesión y cuando el grupo es muy numeroso y el tiempo escaso.',
    modulo: 'b5-estilos-ensenanza',
  },
  {
    termino: 'Microenseñanza',
    definicion:
      'Estilo de participación en el que el entrenador informa a un pequeño grupo de alumnos-monitores y cada uno de ellos enseña a su propio subgrupo. Es el estilo que más decisiones cede: no delega solo la corrección, como la enseñanza recíproca, sino la enseñanza misma.',
    modulo: 'b5-estilos-ensenanza',
  },
  {
    termino: 'Descubrimiento guiado',
    definicion:
      'Estilo de implicación cognitiva en el que el entrenador no da la respuesta pero la conoce de antemano, y formula preguntas encadenadas que conducen al deportista hasta ella, reorientando cuando la búsqueda se desvía. Se distingue de la resolución de problemas en que allí varias soluciones son válidas y no hay destino previsto.',
    modulo: 'b5-estilos-ensenanza',
  },
  {
    termino: 'Enseñanza modular',
    definicion:
      'Estilo de organización que divide el contenido en módulos con sus criterios de superación y permite que cada deportista avance según su nivel y su ritmo, en vez de según el calendario del grupo. Es la respuesta a un grupo heterogéneo: ajusta el itinerario a la persona y no la persona al itinerario.',
    modulo: 'b5-estilos-ensenanza',
  },

  /* ── B6 · Aprendizaje y sesión (paso 17) ── */
  {
    termino: 'Coordinación gruesa',
    definicion:
      'Segunda fase del aprendizaje de la técnica, en la que el deportista consigue el gesto de forma aproximada: movimiento tosco, gasto de energía alto, ritmo irregular y acciones que sobran. El gesto ya existe, pero es caro y poco fiable.',
    modulo: 'b6-aprendizaje-sesion',
  },
  {
    termino: 'Coordinación fina',
    definicion:
      'Tercera fase del aprendizaje de la técnica, en la que el gesto gana economía, ritmo y precisión. Su límite es que solo se sostiene en condiciones estables: con fatiga, oposición o presión todavía se rompe, y salir de ahí exige repeticiones con perturbación y no más repeticiones limpias.',
    modulo: 'b6-aprendizaje-sesion',
  },
  {
    termino: 'Fase sensible',
    definicion:
      'Período del desarrollo en el que una capacidad responde de forma especialmente favorable al estímulo de entrenamiento. Es una ventana de mayor rentabilidad, no la única oportunidad: fuera de ella la capacidad sigue mejorando, con más tiempo y más esfuerzo. Las coordinativas se sitúan entre los 6 y los 12 años y la fuerza máxima después del pico de crecimiento.',
    modulo: 'b6-aprendizaje-sesion',
    sinonimos: ['Fases sensibles', 'Período sensible'],
  },
  {
    termino: 'Fase asociativa',
    definicion:
      'Segundo estadio del aprendizaje motor, en el que el deportista encadena las partes del movimiento y depura el error. Corresponde a la coordinación fina. Va precedida de la fase cognitiva, en la que piensa cada parte, y seguida de la autónoma, cuyo indicador práctico es poder atender a otra cosa mientras se ejecuta.',
    modulo: 'b6-aprendizaje-sesion',
  },

  /* ── A1 · Célula (paso 17) ── */
  {
    termino: 'Célula procariota',
    definicion:
      'Célula sin núcleo definido: su ADN, circular y sin histonas, está libre en el citoplasma, y carece de orgánulos delimitados por membrana. Mide entre 1 y 5 µm. Los únicos organismos procariotas son las bacterias y las arqueas; las cianobacterias, antes llamadas algas verdeazuladas, pertenecen al primer grupo.',
    modulo: 'a1-celula',
  },
  {
    termino: 'Célula eucariota',
    definicion:
      'Célula con núcleo delimitado por envoltura nuclear y con orgánulos membranosos —mitocondrias, retículo, aparato de Golgi, lisosomas—. Su ADN es lineal y se organiza en cromosomas con histonas. Son eucariotas los protozoos, los hongos, las plantas y los animales.',
    modulo: 'a1-celula',
  },
  {
    termino: 'Orgánulo',
    definicion:
      'Estructura especializada del interior celular que cumple una función concreta. Casi todos están delimitados por membrana; el ribosoma es la excepción notable, porque no la tiene y es el encargado de sintetizar las proteínas.',
    modulo: 'a1-celula',
    sinonimos: ['Organelo', 'Orgánulos'],
  },
  {
    termino: 'Mitosis',
    definicion:
      'División celular que produce dos células hijas con la misma dotación cromosómica que la madre. Consta de profase, metafase, anafase y telofase, seguidas de la citocinesis. Ocurre en las células somáticas y es la que permite el crecimiento y la reparación de los tejidos, incluida la del músculo dañado por el trabajo excéntrico.',
    modulo: 'a1-celula',
  },
  {
    termino: 'Meiosis',
    definicion:
      'División celular con dos divisiones sucesivas que produce cuatro células hijas con la mitad de los cromosomas, es decir haploides. Ocurre en las células germinales, genera variabilidad genética por entrecruzamiento y reparto al azar, y sirve para formar los gametos.',
    modulo: 'a1-celula',
  },

  /* ── A2 · Terminología anatómica (paso 17) ── */
  {
    termino: 'Posición anatómica',
    definicion:
      'Postura de referencia desde la que se definen todos los términos anatómicos: de pie y erguido, mirada al frente, brazos extendidos a los lados y palmas hacia adelante, con los pies juntos y paralelos. La palma hacia adelante no es un detalle menor: con la palma hacia el muslo el radio y el cúbito quedan cruzados y las referencias del antebrazo se invierten.',
    modulo: 'a2-terminologia-anatomica',
  },
  {
    termino: 'Plano sagital',
    definicion:
      'Plano que divide el cuerpo en mitad derecha y mitad izquierda. En él ocurren la flexión y la extensión, que giran sobre un eje transversal o latero-lateral. El eje es siempre perpendicular al plano, nunca homónimo.',
    modulo: 'a2-terminologia-anatomica',
  },
  {
    termino: 'Plano frontal',
    definicion:
      'Plano que divide el cuerpo en parte anterior y parte posterior, también llamado coronal. En él ocurren la abducción, la aducción y la flexión lateral, que giran sobre un eje sagital o anteroposterior.',
    modulo: 'a2-terminologia-anatomica',
    sinonimos: ['Plano coronal'],
  },
  {
    termino: 'Plano transversal',
    definicion:
      'Plano que divide el cuerpo en parte superior y parte inferior, también llamado horizontal o axial. En él ocurren las rotaciones interna y externa, que giran sobre el eje longitudinal o vertical.',
    modulo: 'a2-terminologia-anatomica',
    sinonimos: ['Plano horizontal', 'Plano axial'],
  },
  {
    termino: 'Abducción',
    definicion:
      'Movimiento que aleja un segmento de la línea media del cuerpo, en el plano frontal. Su opuesto es la aducción, que lo acerca; la d de aducción ayuda a recordarlo, porque adiciona. Separar los brazos en cruz es abducción de hombro.',
    modulo: 'a2-terminologia-anatomica',
  },

  /* ── A3 · Tejidos, órganos y sistemas (paso 17) ── */
  {
    termino: 'Tejido óseo',
    definicion:
      'Tejido conjuntivo con matriz mineralizada, vivo y en remodelación permanente. Lo forman tres células: el osteoblasto, que sintetiza matriz nueva; el osteocito, que mantiene el tejido y detecta la carga mecánica; y el osteoclasto, multinucleado, que reabsorbe la matriz.',
    modulo: 'a3-tejidos-organos-sistemas',
  },
  {
    termino: 'Osteoblasto',
    definicion:
      'Célula del tejido óseo que forma hueso nuevo sintetizando la matriz que después se mineraliza. Cuando queda atrapado dentro de la matriz que él mismo fabricó, pasa a ser osteocito. No debe confundirse con el osteoclasto, que hace lo contrario: reabsorber.',
    modulo: 'a3-tejidos-organos-sistemas',
  },
  {
    termino: 'Hueso esponjoso',
    definicion:
      'Organización del tejido óseo en red de trabéculas con huecos, presente en las epífisis de los huesos largos y en los huesos cortos y planos. Aloja la médula ósea roja, donde ocurre la hematopoyesis. Sus trabéculas se orientan siguiendo las líneas de fuerza que atraviesan el hueso.',
    modulo: 'a3-tejidos-organos-sistemas',
    sinonimos: ['Hueso trabecular'],
  },
  {
    termino: 'Articulación sinovial',
    definicion:
      'Articulación móvil, o diartrosis, formada por superficies óseas recubiertas de cartílago, cápsula fibrosa, membrana sinovial que produce el líquido, ligamentos y, en algunas, meniscos y bursas. El líquido sinovial lubrica y nutre el cartílago, que carece de vasos propios.',
    modulo: 'a3-tejidos-organos-sistemas',
    sinonimos: ['Diartrosis'],
  },
  {
    termino: 'Hematopoyesis',
    definicion:
      'Formación de las células de la sangre —glóbulos rojos, glóbulos blancos y plaquetas—. Ocurre en la médula ósea roja, alojada en el hueso esponjoso, y es una de las funciones del hueso junto con el sostén, la protección y el almacenamiento de calcio y fósforo.',
    modulo: 'a3-tejidos-organos-sistemas',
  },

  /* ── A4 · Nutrientes (paso 17) ── */
  {
    termino: 'Monosacárido',
    definicion:
      'Carbohidrato formado por una sola unidad, la forma más simple: glucosa, fructosa y galactosa. Dos unidades unidas forman un disacárido —sacarosa, lactosa, maltosa— y muchas encadenadas un polisacárido —almidón, glucógeno, celulosa—.',
    modulo: 'a4-nutrientes',
  },
  {
    termino: 'Valor biológico',
    definicion:
      'Medida de la calidad de una proteína: qué aminoácidos esenciales aporta, en qué proporción y con qué digestibilidad. Alto en huevo, leche, carne y pescado; bajo en legumbres y cereales, a los que les escasean la metionina y la lisina respectivamente. Bajo valor biológico significa incompleta por sí sola, no de mala calidad: legumbre más cereal da una proteína completa.',
    modulo: 'a4-nutrientes',
  },
  {
    termino: 'Grasa trans',
    definicion:
      'Grasa con dobles enlaces en configuración trans, de origen mayoritariamente industrial por hidrogenación parcial. Es la de peor perfil porque hace las dos cosas desfavorables a la vez: eleva el colesterol LDL y reduce el HDL. Es la única grasa cuya recomendación es un consumo lo más bajo posible, no la moderación.',
    modulo: 'a4-nutrientes',
  },
  {
    termino: 'Micronutriente',
    definicion:
      'Nutriente que no aporta energía y se necesita en cantidades pequeñas, medidas en miligramos o microgramos: vitaminas y minerales. Se distingue del macronutriente, que aporta energía y se mide en gramos. Que no aporte calorías no lo hace prescindible.',
    modulo: 'a4-nutrientes',
  },

  /* ── A5 · Sistemas energéticos y biomarcadores (paso 17) ── */
  {
    termino: 'Sistema aláctico',
    definicion:
      'Sistema energético anaeróbico que emplea el ATP libre y la fosfocreatina, y sostiene entre 5 y 15 segundos de esfuerzo máximo. Su nombre significa literalmente sin lactato: sus subproductos son creatina y fosfato inorgánico. La enzima de su reacción es la creatina quinasa.',
    modulo: 'a5-sistemas-energeticos-biomarcadores',
    sinonimos: ['Sistema de los fosfágenos', 'Sistema anaeróbico aláctico'],
  },
  {
    termino: 'Sistema láctico',
    definicion:
      'Sistema energético anaeróbico que degrada glucosa y glucógeno sin oxígeno, con lactato como subproducto característico. Sostiene el esfuerzo entre los 30 segundos y los 2 minutos y rinde 2 ATP netos por molécula de glucosa, frente a los 30 de la vía aeróbica en músculo esquelético.',
    modulo: 'a5-sistemas-energeticos-biomarcadores',
    sinonimos: ['Glucólisis anaeróbica', 'Sistema anaeróbico láctico'],
  },
  {
    termino: 'Biomarcador',
    definicion:
      'Variable biológica medible que informa del estado del organismo. En el deporte se agrupan en cuatro familias: de rendimiento y daño muscular (lactato, creatina quinasa, mioglobina), de salud (glucosa, hemoglobina, hematocrito, ferritina), de estrés oxidativo (malondialdehído, relación GSH/GSSG) y hormonales (testosterona, cortisol, IGF-1).',
    modulo: 'a5-sistemas-energeticos-biomarcadores',
  },
  {
    termino: 'Relación testosterona/cortisol',
    definicion:
      'Cociente entre la hormona anabólica de referencia y la catabólica, usado para vigilar la sobrecarga. Se interpreta por su caída respecto al valor basal del propio deportista: un descenso del 30 % o más señala sobrecarga. No existe un umbral absoluto universal, porque el valor depende de las unidades de medida y de la persona, así que un análisis aislado sin medición previa no informa.',
    modulo: 'a5-sistemas-energeticos-biomarcadores',
    sinonimos: ['Cociente testosterona/cortisol', 'Índice T/C'],
  },

  /* ── A6 · Estadística (paso 17) ── */
  {
    termino: 'Media aritmética',
    definicion:
      'Suma de todos los valores dividida entre el número de datos. Su ventaja es que utiliza toda la información disponible; su desventaja, que un solo valor extremo la desplaza. Cuando hay un dato muy alejado del resto, la mediana describe mejor al grupo.',
    modulo: 'a6-estadistica',
    sinonimos: ['Promedio'],
  },
  {
    termino: 'Mediana',
    definicion:
      'Valor central de la lista una vez ordenada. Con un número impar de datos ocupa la posición (N+1)/2; con un número par es el promedio de las posiciones N/2 y (N/2)+1. Ordenar primero es el paso que más se olvida, y sin él el resultado no significa nada.',
    modulo: 'a6-estadistica',
  },
  {
    termino: 'Desviación estándar',
    definicion:
      'Raíz cuadrada de la varianza. Mide cuánto se separan los datos entre sí y, a diferencia de la varianza, se expresa en las mismas unidades que los datos originales, lo que la hace interpretable. Dos grupos con la misma media pueden tener desviaciones muy distintas y no parecerse en nada.',
    modulo: 'a6-estadistica',
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
