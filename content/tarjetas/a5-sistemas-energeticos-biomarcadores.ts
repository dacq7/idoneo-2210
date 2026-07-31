// content/tarjetas/a5-sistemas-energeticos-biomarcadores.ts
// A5 · Sistemas aeróbico y anaeróbico · Biomarcadores. 15 tarjetas.
// Dos mitades: los tres sistemas energéticos con sus duraciones y subproductos
// —donde «aláctico» significa literalmente sin lactato— y los biomarcadores con
// sus rangos, incluida la relación testosterona/cortisol, que se vigila por su
// caída sobre el basal propio y no por un umbral universal.
import type { Tarjeta } from '@/lib/tipos';

export const TARJETAS_MODULO: Tarjeta[] = [
  {
    id: 'A5-T01',
    modulo: 'a5-sistemas-energeticos-biomarcadores',
    tipo: 'clasificacion',
    frente: 'Los tres sistemas energéticos por duración',
    reverso:
      'Anaeróbico aláctico o de los fosfágenos: 5–15 s de esfuerzo máximo. Anaeróbico láctico o glucólisis anaeróbica: 30 s a 2 min. Aeróbico u oxidativo: desde 2–3 min, sin límite práctico.',
  },
  {
    id: 'A5-T02',
    modulo: 'a5-sistemas-energeticos-biomarcadores',
    tipo: 'dato',
    frente: '¿Qué significa «aláctico» y qué subproducto genera ese sistema?',
    reverso:
      'Significa literalmente SIN LACTATO. Sus subproductos son creatina y fosfato inorgánico. El lactato es la firma del sistema LÁCTICO, y por eso los dos se llaman como se llaman.',
  },
  {
    id: 'A5-T03',
    modulo: 'a5-sistemas-energeticos-biomarcadores',
    tipo: 'dato',
    frente: 'ATP libre y sistema fosfágeno: ¿cuánto dura cada uno?',
    reverso:
      'ATP libre —el que ya está en la fibra, sin regenerar nada—: 2–3 s. Sistema fosfágeno completo, con la fosfocreatina que lo regenera: 5–15 s. El rango es real: depende de la intensidad y de las reservas de PCr de ese día.',
  },
  {
    id: 'A5-T04',
    modulo: 'a5-sistemas-energeticos-biomarcadores',
    tipo: 'formula',
    frente: 'La reacción de la fosfocreatina y su enzima',
    reverso:
      'PCr + ADP → Creatina + ATP. La enzima es la CREATINA QUINASA, la misma que aparece en la analítica como CK y sirve de marcador de daño muscular.',
  },
  {
    id: 'A5-T05',
    modulo: 'a5-sistemas-energeticos-biomarcadores',
    tipo: 'dato',
    frente: 'ATP por molécula de glucosa: anaeróbico frente a aeróbico',
    reverso:
      'Glucólisis anaeróbica: 2 ATP netos, más lactato. Vía aeróbica completa: 30–32 ATP, y en MÚSCULO ESQUELÉTICO son 30. La diferencia de un orden de magnitud explica que el aeróbico sostenga esfuerzos de horas.',
  },
  {
    id: 'A5-T06',
    modulo: 'a5-sistemas-energeticos-biomarcadores',
    tipo: 'dato',
    frente: '¿De qué depende que sean 30 o 32 ATP?',
    reverso:
      'De la lanzadera que use el tejido para meter los electrones en la mitocondria. Malato-aspartato (corazón, hígado, riñón): 32. Glicerol-3-fosfato (músculo esquelético y cerebro): 30. Para un entrenador, la cifra que importa es 30.',
  },
  {
    id: 'A5-T07',
    modulo: 'a5-sistemas-energeticos-biomarcadores',
    tipo: 'clasificacion',
    frente: 'Sustrato de cada sistema energético',
    reverso:
      'Aláctico: ATP libre y fosfocreatina. Láctico: glucosa y glucógeno. Aeróbico: carbohidratos y grasas. Solo el aeróbico usa oxígeno, y solo él puede oxidar grasa.',
  },
  {
    id: 'A5-T08',
    modulo: 'a5-sistemas-energeticos-biomarcadores',
    tipo: 'dato',
    frente: '¿Los tres sistemas se turnan uno detrás de otro?',
    reverso:
      'No: funcionan A LA VEZ, y lo que cambia es cuál domina. En el primer segundo de un sprint ya trabaja el aeróbico, aunque su contribución sea despreciable; a los diez minutos de carrera continua el aláctico sigue disponible para un cambio de ritmo.',
  },
  {
    id: 'A5-T09',
    modulo: 'a5-sistemas-energeticos-biomarcadores',
    tipo: 'definicion',
    frente: '¿Qué es un biomarcador y cuáles son sus cuatro familias?',
    reverso:
      'Una variable biológica medible que informa del estado del organismo. Familias: de rendimiento y daño muscular (lactato, CK, mioglobina) · de salud (glucosa, hemoglobina, hematocrito, ferritina, ácido úrico, hs-PCR) · de estrés oxidativo (MDA, GSH/GSSG) · hormonales (testosterona, cortisol, su relación, IGF-1).',
  },
  {
    id: 'A5-T10',
    modulo: 'a5-sistemas-energeticos-biomarcadores',
    tipo: 'dato',
    frente: 'Valores de referencia: glucosa, lactato y cortisol',
    reverso:
      'Glucosa en ayunas: 70–100 mg/dL. Lactato en reposo: 0,5–2,2 mmol/L. Cortisol matutino: 6–23 µg/dL.',
  },
  {
    id: 'A5-T11',
    modulo: 'a5-sistemas-energeticos-biomarcadores',
    tipo: 'dato',
    frente: 'Valores de referencia: hemoglobina, hematocrito y ferritina',
    reverso:
      'Hemoglobina: hombres 13,8–17,2 · mujeres 12,1–15,1 g/dL. Hematocrito: hombres 40–52 % · mujeres 36–48 %. Ferritina: hombres 20–250 · mujeres 12–150 ng/mL.',
  },
  {
    id: 'A5-T12',
    modulo: 'a5-sistemas-energeticos-biomarcadores',
    tipo: 'dato',
    frente: 'Valores de referencia: CK, mioglobina y testosterona total',
    reverso:
      'Creatina quinasa: hombres 55–170 · mujeres 30–135 U/L. Mioglobina: 10–95 ng/mL. Testosterona total: hombres 270–1070 · mujeres 15–70 ng/dL.',
  },
  {
    id: 'A5-T13',
    modulo: 'a5-sistemas-energeticos-biomarcadores',
    tipo: 'dato',
    frente: '¿Cómo se interpreta la relación testosterona/cortisol?',
    reverso:
      'Se vigila la CAÍDA respecto al valor basal del propio deportista: un descenso del 30 % o más señala sobrecarga. No hay umbral absoluto universal, porque el cociente depende de las unidades y de la persona. Sin una medición previa con la que comparar, un análisis aislado no dice nada.',
  },
  {
    id: 'A5-T14',
    modulo: 'a5-sistemas-energeticos-biomarcadores',
    tipo: 'dato',
    frente: '¿Qué informan la CK y la mioglobina tras una sesión?',
    reverso:
      'Daño muscular, sobre todo tras trabajo excéntrico. No indican lesión por sí solas: indican trabajo. Lo que informa de verdad es la CINÉTICA, es decir cuánto tardan en volver a la línea de base.',
  },
  {
    id: 'A5-T15',
    modulo: 'a5-sistemas-energeticos-biomarcadores',
    tipo: 'dato',
    frente: '¿Por qué la ferritina avisa antes que la hemoglobina?',
    reverso:
      'Porque la ferritina es el DEPÓSITO de hierro y se vacía mucho antes de que la hemoglobina descienda. Una deportista con hemoglobina normal y ferritina en el suelo ya tiene un problema, aunque el hemograma parezca correcto.',
  },
];
