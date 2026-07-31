// content/tarjetas/c1-vias-energeticas.ts
// C1 · Vías energéticas y fisiología del ejercicio. 15 tarjetas.
// Cubren los 8 datos duros del módulo: DD-001 (ATP libre), DD-002 (fosfágeno),
// DD-003 (reacción de la PCr), DD-004 (glucólisis anaeróbica), DD-005 (fase
// citoplasmática), DD-006 (ATP por glucosa), DD-007 (palmitato) y DD-008
// (localización de cada fase).
import type { Tarjeta } from '@/lib/tipos';

export const TARJETAS_MODULO: Tarjeta[] = [
  {
    id: 'C1-T01',
    modulo: 'c1-vias-energeticas',
    tipo: 'dato',
    frente: '¿Cuánto dura el ATP libre almacenado en la fibra?',
    reverso:
      '2–3 segundos de esfuerzo máximo. Es el ATP que ya está en la fibra listo para gastarse sin regenerar nada: se agota casi al arrancar.',
  },
  {
    id: 'C1-T02',
    modulo: 'c1-vias-energeticas',
    tipo: 'dato',
    frente: '¿Cuánto dura el sistema fosfágeno completo?',
    reverso:
      '5–15 segundos de esfuerzo máximo, y es un rango real: depende de la intensidad a la que se trabaje y de cuánta fosfocreatina haya acumulada ese día. No hay un número único.',
  },
  {
    id: 'C1-T03',
    modulo: 'c1-vias-energeticas',
    tipo: 'formula',
    frente: 'La reacción de la fosfocreatina y su enzima',
    reverso:
      'PCr + ADP → Creatina + ATP, catalizada por la creatina quinasa. Es reversible: durante el esfuerzo se gasta PCr para fabricar ATP; en la recuperación se gasta ATP para reponer PCr, y esa reposición sí es aeróbica.',
  },
  {
    id: 'C1-T04',
    modulo: 'c1-vias-energeticas',
    tipo: 'dato',
    frente: 'Glucólisis anaeróbica: producto y duración',
    reverso:
      'Produce lactato, por reducción del piruvato mediante la lactato deshidrogenasa. Predomina entre los 30 segundos y los 2 minutos de esfuerzo.',
  },
  {
    id: 'C1-T05',
    modulo: 'c1-vias-energeticas',
    tipo: 'dato',
    frente: 'Rendimiento neto de la fase citoplasmática de la glucólisis',
    reverso:
      '2 ATP netos y 2 NADH por glucosa. Brutos son 4 ATP, pero la vía invierte 2 en arrancar. Lo que se pregunta casi siempre es el neto.',
  },
  {
    id: 'C1-T06',
    modulo: 'c1-vias-energeticas',
    tipo: 'dato',
    frente: '¿Cuánto ATP rinde una glucosa oxidada por completo?',
    reverso:
      '30–32 ATP, y 30 en el músculo esquelético. Quien decide dentro del rango es la lanzadera del NADH citoplasmático: malato-aspartato → 32 (corazón, hígado, riñón); glicerol-3-fosfato → 30 (músculo esquelético y cerebro).',
  },
  {
    id: 'C1-T07',
    modulo: 'c1-vias-energeticas',
    tipo: 'clasificacion',
    frente: '¿Dónde ocurre cada fase del metabolismo aeróbico?',
    reverso:
      'Glucólisis → citoplasma. Ciclo de Krebs → matriz mitocondrial. Cadena transportadora de electrones → membrana interna de la mitocondria. β-oxidación → matriz mitocondrial, previa entrada del ácido graso por la carnitina.',
  },
  {
    id: 'C1-T08',
    modulo: 'c1-vias-energeticas',
    tipo: 'dato',
    frente: '¿Cuánto ATP rinde la oxidación completa de un palmitato?',
    reverso:
      '≈106 ATP netos. Sale de 31 NADH × 2,5 + 15 FADH₂ × 1,5 + 8 GTP, menos los 2 ATP que cuesta activar el ácido graso. Aun así, más del triple que una glucosa: la grasa gana en cantidad y pierde en velocidad.',
  },
  {
    id: 'C1-T09',
    modulo: 'c1-vias-energeticas',
    tipo: 'definicion',
    frente: '¿Qué significa que una vía sea «aláctica»?',
    reverso:
      'Que resintetiza ATP sin producir lactato. Es el sello del sistema fosfágeno y lo que lo separa de la glucólisis anaeróbica, que es igual de anaeróbica pero sí lo produce.',
  },
  {
    id: 'C1-T10',
    modulo: 'c1-vias-energeticas',
    tipo: 'definicion',
    frente: '¿Qué destino tiene el lactato?',
    reverso:
      'No es un residuo terminal: sale de la fibra, otras fibras y el corazón lo oxidan como combustible, y el hígado lo reconvierte en glucosa por el ciclo de Cori. Tampoco causa las agujetas, que son daño mecánico de la fibra.',
  },
  {
    id: 'C1-T11',
    modulo: 'c1-vias-energeticas',
    tipo: 'definicion',
    frente: '¿Qué diferencia la glucólisis anaeróbica de la aeróbica?',
    reverso:
      'Nada hasta el piruvato: es la misma vía citoplasmática. Lo que cambia es el destino del piruvato — con oxígeno entra a la mitocondria, sin oxígeno se reduce a lactato. Una vía con dos finales, no dos vías.',
  },
  {
    id: 'C1-T12',
    modulo: 'c1-vias-energeticas',
    tipo: 'clasificacion',
    frente: 'Las cuatro vías por duración de predominio',
    reverso:
      'ATP libre: 2–3 s. Sistema fosfágeno: 5–15 s. Glucólisis anaeróbica: 30 s – 2 min. Metabolismo aeróbico: más de 2–3 min. Cuanto más rápida es la vía, menos dura y menos ATP total entrega.',
  },
  {
    id: 'C1-T13',
    modulo: 'c1-vias-energeticas',
    tipo: 'definicion',
    frente: '¿Las vías energéticas funcionan por relevos?',
    reverso:
      'No. Las tres funcionan a la vez desde el primer segundo y lo único que cambia es cuál aporta la mayor parte del ATP. Las tablas de duración describen predominio, no encendido y apagado.',
  },
  {
    id: 'C1-T14',
    modulo: 'c1-vias-energeticas',
    tipo: 'clasificacion',
    frente: '%1RM, vía energética y descanso',
    reverso:
      '>85 % 1RM · <15 s · <6 reps → aláctico, descanso de 2 a 5 min. 70–85 % · 20–40 s · 6–12 reps → láctico, descanso de 30 s a 1\'30". ≥45 s · ≥15 reps → aeróbico, descanso ≤30 s.',
  },
  {
    id: 'C1-T15',
    modulo: 'c1-vias-energeticas',
    tipo: 'definicion',
    frente: '¿Por qué la grasa no sirve para un sprint si almacena más energía?',
    reverso:
      'Porque la β-oxidación es lenta: tiene muchos pasos y depende del transporte por carnitina, así que entrega ATP despacio. Un sprint exige potencia, no reservas. La grasa es el depósito grande; la fosfocreatina es el grifo rápido.',
  },
];
