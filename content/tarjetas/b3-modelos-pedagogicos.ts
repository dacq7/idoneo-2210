// content/tarjetas/b3-modelos-pedagogicos.ts
// B3 · Modelos pedagógicos del deporte. 15 tarjetas.
// El módulo es nominal: se pregunta qué propone cada modelo y quién lo firma.
// El mazo carga los seis modelos, sus autores de referencia y las cuatro
// categorías tácticas de juego, que es lo que decide la transferencia.
import type { Tarjeta } from '@/lib/tipos';

export const TARJETAS_MODULO: Tarjeta[] = [
  {
    id: 'B3-T01',
    modulo: 'b3-modelos-pedagogicos',
    tipo: 'clasificacion',
    frente: 'Modelos básicos y modelos emergentes: ¿en qué se separan?',
    reverso:
      'Los básicos (tradicional o técnico) van de la técnica a la táctica y el deportista reproduce. Los emergentes empiezan por el juego y su problema táctico, y el deportista decide, prueba y construye la solución.',
  },
  {
    id: 'B3-T02',
    modulo: 'b3-modelos-pedagogicos',
    tipo: 'definicion',
    frente: '¿Qué caracteriza al modelo técnico o tradicional?',
    reverso:
      'Va de la técnica a la táctica: primero el gesto en ejercicio analítico y descontextualizado, después el juego. Se apoya en el mando directo. Sus dos costes: se aprende a ejecutar sin saber cuándo, y se tarda mucho en jugar.',
  },
  {
    id: 'B3-T03',
    modulo: 'b3-modelos-pedagogicos',
    tipo: 'dato',
    frente: '¿Cuándo es correcto el enfoque analítico tradicional?',
    reverso:
      'En gestos cerrados, sin oposición y con una única solución mecánicamente eficiente: salto de trampolín, lanzamiento de jabalina, saque. Lo que hace mal es enseñar deportes de invasión como si fueran gestos cerrados.',
  },
  {
    id: 'B3-T04',
    modulo: 'b3-modelos-pedagogicos',
    tipo: 'definicion',
    frente: 'Modelo comprensivo: idea central y autores',
    reverso:
      'Teaching Games for Understanding (TGfU), de Bunker y Thorpe. El problema del principiante no es la falta de técnica sino la falta de comprensión táctica: se empieza por el juego y la técnica aparece cuando el deportista la necesita.',
  },
  {
    id: 'B3-T05',
    modulo: 'b3-modelos-pedagogicos',
    tipo: 'definicion',
    frente: '¿Qué es un juego modificado y qué regla lo gobierna?',
    reverso:
      'Una versión simplificada del deporte que conserva su lógica táctica y rebaja la exigencia técnica. Se cambian espacio, número de jugadores, móvil o reglas. La regla: se simplifica la EJECUCIÓN, nunca la DECISIÓN.',
  },
  {
    id: 'B3-T06',
    modulo: 'b3-modelos-pedagogicos',
    tipo: 'clasificacion',
    frente: 'Las cuatro categorías tácticas de juego',
    reverso:
      'Invasión (fútbol, baloncesto): ocupar el espacio del rival. Cancha dividida (voleibol, tenis): enviar el móvil donde no lo devuelvan. Bate y campo (béisbol, sóftbol): golpear y correr. Blanco o diana (golf, bolos): precisión sobre un objetivo fijo.',
  },
  {
    id: 'B3-T07',
    modulo: 'b3-modelos-pedagogicos',
    tipo: 'dato',
    frente: '¿Entre qué deportes transfiere el aprendizaje táctico?',
    reverso:
      'Dentro de la misma categoría de juego. Lo aprendido en un deporte de invasión —desmarque, apoyo, ocupación de espacios— transfiere a otro de invasión aunque cambie el gesto. Entre categorías distintas, no.',
  },
  {
    id: 'B3-T08',
    modulo: 'b3-modelos-pedagogicos',
    tipo: 'definicion',
    frente: 'Modelo constructivista: qué propone',
    reverso:
      'Que el conocimiento no se transmite, se construye. El entrenador plantea el problema y organiza la tarea; no da la solución. El error deja de ser un fallo y pasa a ser información sobre qué hipótesis del deportista no funcionó.',
  },
  {
    id: 'B3-T09',
    modulo: 'b3-modelos-pedagogicos',
    tipo: 'dato',
    frente: 'Dos consecuencias prácticas del modelo constructivista',
    reverso:
      'Las preguntas valen más que las correcciones, y hay que dar tiempo a que el deportista pruebe antes de intervenir. Un entrenador que corrige a los dos segundos ha impedido el aprendizaje que iba a producirse.',
  },
  {
    id: 'B3-T10',
    modulo: 'b3-modelos-pedagogicos',
    tipo: 'definicion',
    frente: 'Modelo integrado técnico-táctico',
    reverso:
      'Ni técnica primero ni táctica primero: las dos a la vez, siempre dentro de una situación de juego con sentido. Cada tarea tiene un objetivo táctico y un contenido técnico asociado, y ninguno se trabaja al margen del otro.',
  },
  {
    id: 'B3-T11',
    modulo: 'b3-modelos-pedagogicos',
    tipo: 'definicion',
    frente: 'Modelo de educación deportiva: autor y propósito',
    reverso:
      'De Siedentop. No busca solo enseñar a jugar, sino reproducir la CULTURA del deporte dentro de la sesión, con la autonomía y la responsabilidad que eso exige.',
  },
  {
    id: 'B3-T12',
    modulo: 'b3-modelos-pedagogicos',
    tipo: 'clasificacion',
    frente: 'Los seis rasgos de la educación deportiva',
    reverso:
      'Temporada larga en vez de unidades sueltas · afiliación estable a un equipo · competición formal con calendario · registro de resultados y estadísticas · festividad · evento culminante. Su marca es el reparto de roles: arbitrar, entrenar, anotar, gestionar material.',
  },
  {
    id: 'B3-T13',
    modulo: 'b3-modelos-pedagogicos',
    tipo: 'definicion',
    frente: 'Modelo ludotécnico: para qué deportes y para qué',
    reverso:
      'Para deportes individuales (atletismo, natación), donde no hay oposición ni problema táctico que resolver. Usa el juego como medio para aprender la TÉCNICA: el gesto se practica dentro de una situación lúdica con reglas.',
  },
  {
    id: 'B3-T14',
    modulo: 'b3-modelos-pedagogicos',
    tipo: 'clasificacion',
    frente: 'Comprensivo y ludotécnico: los dos usan el juego, ¿para qué cada uno?',
    reverso:
      'El comprensivo lo usa para que emerja el PROBLEMA TÁCTICO en deportes de oposición. El ludotécnico, para hacer motivante el aprendizaje de un GESTO TÉCNICO donde no hay táctica que comprender.',
  },
  {
    id: 'B3-T15',
    modulo: 'b3-modelos-pedagogicos',
    tipo: 'dato',
    frente: '¿De qué depende la elección del modelo pedagógico?',
    reverso:
      'De tres cosas: el tipo de deporte (abierto con oposición o cerrado sin ella), el nivel del deportista y el objetivo de la sesión. No hay un modelo correcto para todo, y un mismo entrenador alterna según lo que enseñe ese día.',
  },
];
