// content/tarjetas/c8-psicologia-deporte.ts
// C8 · Psicología del deporte. 15 tarjetas.
// El módulo no tiene datos duros propios en content/datos-duros.ts: lo que cae
// son parejas teoría–autor y clasificaciones. Las tarjetas cubren los siete
// autores, la distinción refuerzo/castigo —que es lo que más se falla—, la U
// invertida de la activación y las técnicas por fase de la sesión.
import type { Tarjeta } from '@/lib/tipos';

export const TARJETAS_MODULO: Tarjeta[] = [
  {
    id: 'C8-T01',
    modulo: 'c8-psicologia-deporte',
    tipo: 'clasificacion',
    frente: 'Las teorías del aprendizaje y sus autores',
    reverso:
      'Condicionamiento clásico → Pavlov. Condicionamiento operante → Skinner. Aprendizaje vicario o social → Bandura. Zona de desarrollo próximo → Vygotsky. Aprendizaje significativo → Ausubel. Desarrollo cognitivo por etapas → Piaget. Ley del efecto → Thorndike.',
  },
  {
    id: 'C8-T02',
    modulo: 'c8-psicologia-deporte',
    tipo: 'definicion',
    frente: 'Un verbo por autor, para no cruzarlos',
    reverso:
      'Pavlov ASOCIA estímulos. Skinner REFUERZA consecuencias. Bandura OBSERVA modelos. Vygotsky ACOMPAÑA con ayuda. Ausubel ANCLA lo nuevo en lo sabido. Piaget describe ETAPAS de maduración.',
  },
  {
    id: 'C8-T03',
    modulo: 'c8-psicologia-deporte',
    tipo: 'definicion',
    frente: '¿Qué es el refuerzo positivo?',
    reverso:
      'Añadir un estímulo agradable tras una conducta para que se repita más. Positivo y negativo indican si se AÑADE o se QUITA algo, no si es bueno o malo.',
  },
  {
    id: 'C8-T04',
    modulo: 'c8-psicologia-deporte',
    tipo: 'clasificacion',
    frente: 'Refuerzo negativo frente a castigo',
    reverso:
      'Refuerzo negativo: retira algo desagradable y AUMENTA la conducta. Castigo: DISMINUYE la conducta. Todo refuerzo suma conducta; todo castigo la resta. Que los dos suenen desagradables no los iguala.',
  },
  {
    id: 'C8-T05',
    modulo: 'c8-psicologia-deporte',
    tipo: 'definicion',
    frente: 'Las 4 condiciones del aprendizaje vicario (Bandura)',
    reverso:
      'Atención al modelo · retención de lo visto · capacidad de reproducirlo · motivación para hacerlo. Un modelo de nivel cercano suele enseñar más que uno perfecto: se aprende mirando a quien uno cree que puede imitar.',
  },
  {
    id: 'C8-T06',
    modulo: 'c8-psicologia-deporte',
    tipo: 'definicion',
    frente: 'Activación y rendimiento: ¿qué forma tiene la relación?',
    reverso:
      'Una U invertida: hay un nivel óptimo de activación, y tanto por debajo (apatía) como por encima (nervios) el rendimiento cae. Activar a alguien que ya está pasado de vueltas empeora el resultado.',
  },
  {
    id: 'C8-T07',
    modulo: 'c8-psicologia-deporte',
    tipo: 'definicion',
    frente: '¿De qué depende el nivel óptimo de activación?',
    reverso:
      'De la complejidad y la precisión de la tarea: a más finura, MENOS activación. El tiro con arco pide calma; el lanzamiento de peso admite mucha más excitación. El grito que ayuda a un levantador arruina la serie de un tirador.',
  },
  {
    id: 'C8-T08',
    modulo: 'c8-psicologia-deporte',
    tipo: 'clasificacion',
    frente: 'Motivación intrínseca y extrínseca',
    reverso:
      'Intrínseca: nace del disfrute de la propia actividad. Extrínseca: nace de premios, trofeos o reconocimiento. La intrínseca sostiene la práctica a largo plazo, y abusar de premios externos puede erosionarla.',
  },
  {
    id: 'C8-T09',
    modulo: 'c8-psicologia-deporte',
    tipo: 'clasificacion',
    frente: 'El ciclo vital y lo que predomina en cada etapa',
    reverso:
      'Infancia: juego y patrones motores básicos. Adolescencia: identidad y comparación con los iguales — es donde se concentra el abandono deportivo. Adultez: consolidación del rendimiento. Vejez: autonomía y salud funcional.',
  },
  {
    id: 'C8-T10',
    modulo: 'c8-psicologia-deporte',
    tipo: 'clasificacion',
    frente: 'Técnicas psicológicas por fase de la sesión',
    reverso:
      'Parte inicial: objetivos del día y activación mental. Parte principal: visualización antes de ejecutar, autoinstrucciones durante, feedback específico al cerrar. Vuelta a la calma: respiración, relajación y reflexión. Se activa al empezar y se desactiva al terminar.',
  },
  {
    id: 'C8-T11',
    modulo: 'c8-psicologia-deporte',
    tipo: 'definicion',
    frente: '¿Qué es la visualización o imaginería?',
    reverso:
      'Representar mentalmente el gesto con el máximo detalle antes de ejecutarlo. Activa parcialmente los mismos circuitos que la ejecución real. No sustituye al entrenamiento, pero permite ensayar cuando no se puede entrenar — por ejemplo durante una lesión.',
  },
  {
    id: 'C8-T12',
    modulo: 'c8-psicologia-deporte',
    tipo: 'definicion',
    frente: '¿Cómo debe ser un refuerzo para que enseñe?',
    reverso:
      'Específico e inmediato. Un «muy bien» al final de la serie no dice qué se hizo bien; «buen apoyo del pie en ese saque» sí. Refuerza el gesto, no a la persona, y hazlo mientras la conducta está fresca.',
  },
  {
    id: 'C8-T13',
    modulo: 'c8-psicologia-deporte',
    tipo: 'clasificacion',
    frente: '¿Cómo es un buen objetivo deportivo?',
    reverso:
      'Concreto y medible · alcanzable pero exigente · centrado en el proceso más que en el resultado · con metas intermedias. Fija lo que depende del deportista: si el objetivo depende del rival, puede hacerlo todo bien y aun así fracasar.',
  },
  {
    id: 'C8-T14',
    modulo: 'c8-psicologia-deporte',
    tipo: 'definicion',
    frente: '¿Qué es la zona de desarrollo próximo?',
    reverso:
      'La distancia entre lo que el aprendiz hace solo y lo que puede hacer con ayuda de alguien más capaz. Justifica proponer tareas ligeramente por encima de lo que domina y retirar la ayuda después. Es de Vygotsky.',
  },
  {
    id: 'C8-T15',
    modulo: 'c8-psicologia-deporte',
    tipo: 'definicion',
    frente: '¿Qué es el aprendizaje significativo?',
    reverso:
      'El que ancla lo nuevo en lo que el aprendiz ya sabe, en lugar de memorizarlo suelto. Es de Ausubel. En la pista: se explica el saque nuevo apoyándose en el gesto que el deportista ya domina.',
  },
];
