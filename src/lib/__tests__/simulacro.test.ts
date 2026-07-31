import { describe, expect, it } from 'vitest';
import { ITEMS } from '@/content/banco/c5-umbrales-zonas';
import { BLUEPRINTS, blueprintQuiz } from '@/content/blueprint-examen';
import { MODULOS } from '@/content/estructura';
import {
  armarSimulacro,
  barajar,
  calificar,
  crearRng,
  diagnosticarViabilidad,
  itemsDeIntentosRecientes,
  medirCobertura,
  presentarItem,
  presentarTanda,
  sinResponder,
  type CensoModulo,
} from '@/lib/simulacro';
import type {
  BlueprintExamen,
  Item,
  ItemCalculo,
  ItemCaso,
  ItemEmparejar,
  ItemMultiple,
  ItemOrdenar,
  ItemUnica,
  ItemVerdaderoFalso,
} from '@/lib/tipos';

/* ══════════════════════════════════════════════════════════════════
   Fixtures

   Los ítems son datos literales: se leen mejor escritos que generados.
   Para el banco grande se usa el banco real de C5 (28 ítems, los 7 tipos).
   ══════════════════════════════════════════════════════════════════ */

/** Mínimo legal de explicación (200 caracteres). El contenido no importa aquí:
 *  estos ítems ejercitan el motor, no el validador. */
const EXPLICACION =
  'R2 se expresa como 75–85 % del VO₂máx y como 80–90 % de la FCmáx: son dos escalas ' +
  'distintas para la misma zona. El distractor más tentador es leerlas como rangos en ' +
  'conflicto. Dato para recordar: antes de aplicar un porcentaje, pregunta porcentaje de qué.';

const BASE = {
  modulo: 'c5-umbrales-zonas',
  bloque: 'C' as const,
  nivel: 'recuerdo' as const,
  dificultad: 1 as const,
  explicacion: EXPLICACION,
  referencia: 'Cartilla 3, Tema 2, Subtema 2.6 — Zonas de entrenamiento',
  etiquetas: ['zonas'],
};

const UNICA: ItemUnica = {
  ...BASE,
  id: 'C5-901',
  tipo: 'unica',
  enunciado: '¿En qué rango porcentual se ubica la zona R1?',
  opciones: ['65–75 %', 'Por debajo del 65 %', '80–90 %', '90–95 %'],
  correcta: 0,
};

const CASO: ItemCaso = {
  ...BASE,
  id: 'C5-902',
  tipo: 'caso',
  viñeta:
    'Una corredora prepara su primer maratón y entrena cinco sesiones semanales a un ritmo ' +
    'en el que solo puede decir frases cortas. Llega fatigada y no completa los fondos largos.',
  enunciado: '¿Qué ajuste corresponde hacer al plan?',
  opciones: [
    'Bajar la mayoría de las sesiones a R1',
    'Subir las sesiones a R3',
    'Reducir el número de sesiones sin tocar la intensidad',
    'Cambiar los fondos por series máximas',
  ],
  correcta: 0,
};

const MULTIPLE: ItemMultiple = {
  ...BASE,
  id: 'C5-903',
  tipo: 'multiple',
  enunciado: 'Seleccione las DOS adaptaciones que corresponden al trabajo en la zona R3.',
  opciones: [
    'Aumento de la densidad capilar',
    'Aumento de la densidad mitocondrial',
    'Aumento de los triglicéridos intramusculares',
    'Aumento de la volemia',
    'Eliminación acelerada de desechos metabólicos',
  ],
  correctas: [0, 1],
};

const VF: ItemVerdaderoFalso = {
  ...BASE,
  id: 'C5-904',
  tipo: 'vf',
  enunciado: 'El máximo estado estable de lactato (MLSS) se ubica dentro de la zona R1.',
  correcta: false,
};

const EMPAREJAR: ItemEmparejar = {
  ...BASE,
  id: 'C5-905',
  tipo: 'emparejar',
  enunciado: 'Relacione cada zona de entrenamiento con su objetivo principal.',
  izquierda: ['R0', 'R1 (VT1)', 'R2 (VT2)', 'R3'],
  derecha: [
    'Recuperación activa',
    'Máxima oxidación de lípidos',
    'Oxidación del glucógeno',
    'Potencia aeróbica',
  ],
  pares: [
    [0, 0],
    [1, 1],
    [2, 2],
    [3, 3],
  ],
};

const CALCULO: ItemCalculo = {
  ...BASE,
  id: 'C5-906',
  tipo: 'calculo',
  enunciado: 'Calcule el 65 % de la FCmáx de un entrenador de 40 años según Fox et al. (1971).',
  respuesta: 117,
  tolerancia: 1,
  unidad: 'lpm',
  pasos: ['FCmáx = 220 − 40 = 180 lpm', 'FC objetivo = 180 × 0,65 = 117 lpm'],
};

const ORDENAR: ItemOrdenar = {
  ...BASE,
  id: 'C5-907',
  tipo: 'ordenar',
  enunciado: 'Ordene las siguientes intensidades de trabajo de menor a mayor.',
  elementos: ['R0 — recuperación', 'R1 — VT1', 'R2 — VT2', 'R3 — potencia aeróbica'],
  ordenCorrecto: [0, 1, 2, 3],
};

/** Los 7 tipos, con la respuesta correcta y una incorrecta de cada uno. */
const CANONICOS: { item: Item; correcta: unknown; incorrecta: unknown }[] = [
  { item: UNICA, correcta: 0, incorrecta: 2 },
  { item: CASO, correcta: 0, incorrecta: 3 },
  { item: MULTIPLE, correcta: [0, 1], incorrecta: [0, 2] },
  { item: VF, correcta: false, incorrecta: true },
  {
    item: EMPAREJAR,
    correcta: [
      [0, 0],
      [1, 1],
      [2, 2],
      [3, 3],
    ],
    incorrecta: [
      [0, 1],
      [1, 0],
      [2, 2],
      [3, 3],
    ],
  },
  { item: CALCULO, correcta: 117, incorrecta: 130 },
  { item: ORDENAR, correcta: [0, 1, 2, 3], incorrecta: [3, 2, 1, 0] },
];

/** Ítem sintético de opción única. Para bancos grandes donde el texto no importa. */
function itemSintetico(
  id: string,
  modulo: string,
  bloque: 'A' | 'B' | 'C' | 'D',
  nivel: Item['nivel'] = 'recuerdo',
  tipo: 'unica' = 'unica',
): Item {
  return {
    ...BASE,
    id,
    modulo,
    bloque,
    nivel,
    tipo,
    enunciado: `Enunciado del ítem ${id} con longitud suficiente.`,
    opciones: ['a', 'b', 'c', 'd'],
    correcta: 0,
  };
}

/** Blueprint mínimo, para no depender de content/blueprint-examen.ts en los
 *  casos de borde. `cuotas` suma siempre `totalItems`, como exige el validador. */
function blueprintDePrueba(
  cuotas: Record<string, number>,
  extra: Partial<BlueprintExamen> = {},
): BlueprintExamen {
  const total = Object.values(cuotas).reduce((s, n) => s + n, 0);
  return {
    id: 'prueba',
    titulo: 'Prueba',
    descripcion: 'Blueprint sintético para los tests del motor.',
    totalItems: total,
    minutos: null,
    reparto: { tipo: 'modulo', cuotas },
    porNivel: { recuerdo: total, comprension: 0, aplicacion: 0 },
    feedbackInmediato: false,
    ...extra,
  };
}

/** La respuesta correcta de un ítem *ya presentado*, en la forma que espera
 *  `calificar`. Es exactamente lo que el controlador de sesión debe producir. */
function respuestaCorrectaDe(item: Item): unknown {
  switch (item.tipo) {
    case 'unica':
    case 'caso':
      return item.correcta;
    case 'multiple':
      return item.correctas;
    case 'vf':
      return item.correcta;
    case 'calculo':
      return item.respuesta;
    case 'ordenar':
      return item.ordenCorrecto;
    case 'emparejar':
      return item.pares;
  }
}

/* ══════════════════════════════════════════════════════════════════
   PRNG y barajado
   ══════════════════════════════════════════════════════════════════ */

describe('crearRng', () => {
  it('produce la misma secuencia con la misma semilla en dos llamadas independientes', () => {
    const a = Array.from({ length: 20 }, crearRng(42));
    const b = Array.from({ length: 20 }, crearRng(42));
    expect(a).toEqual(b);
  });

  it('produce secuencias distintas con semillas distintas', () => {
    const a = Array.from({ length: 20 }, crearRng(42));
    const b = Array.from({ length: 20 }, crearRng(43));
    expect(a).not.toEqual(b);
  });

  it('devuelve valores en el intervalo [0, 1)', () => {
    const rng = crearRng(2026);
    for (let i = 0; i < 500; i++) {
      const v = rng();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  it('acepta semillas de timestamp sin perder determinismo', () => {
    // La semilla real es Date.now(), que excede 32 bits: crearRng la trunca.
    // Truncada o no, la misma semilla debe reproducir la misma secuencia.
    const semilla = 1_769_800_000_000;
    expect(Array.from({ length: 10 }, crearRng(semilla))).toEqual(
      Array.from({ length: 10 }, crearRng(semilla)),
    );
  });
});

describe('barajar', () => {
  it('no muta la lista original', () => {
    const original = [1, 2, 3, 4, 5];
    barajar(original, crearRng(7));
    expect(original).toEqual([1, 2, 3, 4, 5]);
  });

  it('conserva exactamente los mismos elementos', () => {
    const original = ['a', 'b', 'c', 'd', 'e', 'f'];
    const mezclado = barajar(original, crearRng(7));
    expect([...mezclado].sort()).toEqual([...original].sort());
  });

  it('con la misma semilla da la misma permutación', () => {
    const original = [1, 2, 3, 4, 5, 6, 7, 8];
    expect(barajar(original, crearRng(99))).toEqual(barajar(original, crearRng(99)));
  });

  it('maneja listas vacías y de un solo elemento', () => {
    expect(barajar([], crearRng(1))).toEqual([]);
    expect(barajar([42], crearRng(1))).toEqual([42]);
  });
});

/* ══════════════════════════════════════════════════════════════════
   calificar — los 7 tipos
   ══════════════════════════════════════════════════════════════════ */

describe('calificar', () => {
  it.each(CANONICOS.map((c) => [c.item.tipo, c] as const))(
    'califica bien la respuesta correcta y la incorrecta de un ítem "%s"',
    (_tipo, caso) => {
      expect(calificar(caso.item, caso.correcta)).toBe(true);
      expect(calificar(caso.item, caso.incorrecta)).toBe(false);
    },
  );

  it('acepta el índice 0 como respuesta válida y no lo confunde con "sin responder"', () => {
    expect(calificar(UNICA, 0)).toBe(true);
    expect(sinResponder(0)).toBe(false);
  });

  it('acepta false como respuesta válida de un ítem V/F', () => {
    expect(calificar(VF, false)).toBe(true);
    expect(sinResponder(false)).toBe(false);
  });

  describe('cálculo', () => {
    it('acepta el valor exacto y los extremos de la tolerancia', () => {
      expect(calificar(CALCULO, 117)).toBe(true);
      expect(calificar(CALCULO, 116)).toBe(true);
      expect(calificar(CALCULO, 118)).toBe(true);
    });

    it('rechaza justo fuera de la tolerancia', () => {
      expect(calificar(CALCULO, 115.9)).toBe(false);
      expect(calificar(CALCULO, 118.1)).toBe(false);
    });

    it('rechaza NaN e Infinity sin lanzar', () => {
      expect(calificar(CALCULO, NaN)).toBe(false);
      expect(calificar(CALCULO, Infinity)).toBe(false);
      expect(calificar(CALCULO, -Infinity)).toBe(false);
    });

    it('rechaza el número escrito como texto', () => {
      // El componente de cálculo normaliza la coma decimal ANTES de responder:
      // si llega un string, es que alguien se saltó esa conversión.
      expect(calificar(CALCULO, '117')).toBe(false);
    });
  });

  describe('múltiple', () => {
    it('no depende del orden en que el usuario marcó las opciones', () => {
      expect(calificar(MULTIPLE, [1, 0])).toBe(true);
    });

    it('tolera una selección repetida', () => {
      expect(calificar(MULTIPLE, [0, 1, 1])).toBe(true);
    });

    it('rechaza una selección de más y una de menos', () => {
      expect(calificar(MULTIPLE, [0, 1, 2])).toBe(false);
      expect(calificar(MULTIPLE, [0])).toBe(false);
    });

    it('rechaza el array que contiene un elemento no numérico', () => {
      // Contrato del docblock: "cualquier otra forma se califica como incorrecta".
      // Filtrar el intruso en silencio calificaría [0, 1, "x"] como correcta.
      expect(calificar(MULTIPLE, [0, 1, 'x'])).toBe(false);
      expect(calificar(MULTIPLE, ['0', '1'])).toBe(false);
      expect(calificar(MULTIPLE, [0, null, 1])).toBe(false);
    });
  });

  describe('ordenar', () => {
    it('exige el orden exacto', () => {
      expect(calificar(ORDENAR, [0, 1, 2, 3])).toBe(true);
      expect(calificar(ORDENAR, [0, 1, 3, 2])).toBe(false);
    });

    it('rechaza un array de largo distinto', () => {
      expect(calificar(ORDENAR, [0, 1, 2])).toBe(false);
      expect(calificar(ORDENAR, [0, 1, 2, 3, 0])).toBe(false);
    });

    it('rechaza posiciones no numéricas', () => {
      expect(calificar(ORDENAR, ['0', '1', '2', '3'])).toBe(false);
    });
  });

  describe('emparejar', () => {
    it('no depende del orden en que llegan las filas', () => {
      const alReves = [
        [3, 3],
        [2, 2],
        [1, 1],
        [0, 0],
      ];
      expect(calificar(EMPAREJAR, alReves)).toBe(true);
    });

    it('rechaza un índice izquierdo repetido aunque el conteo cuadre', () => {
      const repetido = [
        [0, 0],
        [0, 0],
        [2, 2],
        [3, 3],
      ];
      expect(calificar(EMPAREJAR, repetido)).toBe(false);
    });

    it('rechaza pares incompletos, mal formados o fuera de rango', () => {
      expect(
        calificar(EMPAREJAR, [
          [0, 0],
          [1, 1],
          [2, 2],
        ]),
      ).toBe(false);
      expect(
        calificar(EMPAREJAR, [
          [0, 0],
          [1, 1],
          [2, 2],
          [3],
        ]),
      ).toBe(false);
      expect(
        calificar(EMPAREJAR, [
          [0, 0],
          [1, 1],
          [2, 2],
          [9, 9],
        ]),
      ).toBe(false);
    });

    it('rechaza pares con componentes no numéricos', () => {
      expect(
        calificar(EMPAREJAR, [
          [0, 0],
          [1, 1],
          [2, 2],
          ['3', '3'],
        ]),
      ).toBe(false);
    });
  });

  describe('respuestas basura', () => {
    const BASURA: [string, unknown][] = [
      ['null', null],
      ['undefined', undefined],
      ['string', 'no sé'],
      ['string vacío', ''],
      ['array vacío', []],
      ['array corto', [0]],
      ['array de no-números', ['a', 'b']],
      ['array anidado mal formado', [[0]]],
      ['par con texto', [[0, 'a']]],
      ['par de tres', [[0, 1, 2]]],
      ['objeto', { correcta: 0 }],
      ['NaN', NaN],
      ['booleano suelto', true],
      ['número negativo', -1],
      ['número enorme', 9_999_999],
    ];

    it.each(
      CANONICOS.flatMap(({ item }) =>
        BASURA.map(([nombre, valor]) => [item.tipo, nombre, item, valor] as const),
      ),
    )('un ítem "%s" con %s nunca lanza y nunca acierta', (_tipo, _nombre, item, valor) => {
      let resultado: boolean | undefined;
      expect(() => {
        resultado = calificar(item, valor);
      }).not.toThrow();
      expect(resultado).toBe(false);
    });

    it('tampoco lanza con ningún ítem real del banco de C5', () => {
      for (const item of ITEMS) {
        for (const [, valor] of BASURA) {
          expect(() => calificar(item, valor)).not.toThrow();
        }
      }
    });
  });
});

/* ══════════════════════════════════════════════════════════════════
   sinResponder
   ══════════════════════════════════════════════════════════════════ */

describe('sinResponder', () => {
  it.each([
    ['null', null],
    ['undefined', undefined],
    ['array vacío', []],
    ['string vacío', ''],
    ['string de espacios', '   '],
  ])('considera %s como "en blanco"', (_nombre, valor) => {
    expect(sinResponder(valor)).toBe(true);
  });

  it.each([
    ['el índice 0', 0],
    ['false', false],
    ['un array con una selección', [0]],
    ['un texto escrito', 'algo'],
    ['NaN', NaN],
  ])('considera %s como respondido, aunque esté errado', (_nombre, valor) => {
    expect(sinResponder(valor)).toBe(false);
  });

  it('distingue "en blanco" de "errado" en un ítem real', () => {
    // Los dos se califican false, pero solo uno cuenta como no respondido.
    expect(calificar(UNICA, 2)).toBe(false);
    expect(sinResponder(2)).toBe(false);
    expect(calificar(UNICA, null)).toBe(false);
    expect(sinResponder(null)).toBe(true);
  });
});

/* ══════════════════════════════════════════════════════════════════
   itemsDeIntentosRecientes
   ══════════════════════════════════════════════════════════════════ */

describe('itemsDeIntentosRecientes', () => {
  it('deduplica los ids repetidos entre intentos', () => {
    const intentos = [
      { itemIds: ['C5-001', 'C5-002', 'C5-003'] },
      { itemIds: ['C5-003', 'C5-004'] },
    ];
    expect(itemsDeIntentosRecientes(intentos)).toEqual([
      'C5-001',
      'C5-002',
      'C5-003',
      'C5-004',
    ]);
  });

  it('solo mira los 2 intentos más recientes por defecto', () => {
    const intentos = [
      { itemIds: ['C5-001'] },
      { itemIds: ['C5-002'] },
      { itemIds: ['C5-003'] },
    ];
    expect(itemsDeIntentosRecientes(intentos)).toEqual(['C5-001', 'C5-002']);
  });

  it('respeta un número de intentos distinto', () => {
    const intentos = [
      { itemIds: ['C5-001'] },
      { itemIds: ['C5-002'] },
      { itemIds: ['C5-003'] },
    ];
    expect(itemsDeIntentosRecientes(intentos, 3)).toEqual(['C5-001', 'C5-002', 'C5-003']);
    expect(itemsDeIntentosRecientes(intentos, 0)).toEqual([]);
  });

  it('devuelve una lista vacía sin intentos', () => {
    expect(itemsDeIntentosRecientes([])).toEqual([]);
  });
});

/* ══════════════════════════════════════════════════════════════════
   presentarItem — el barajado reproducible

   Es el punto más delicado del motor: si el remapeo de índices se
   desalinea, el usuario ve la pantalla correcta y recibe la nota
   equivocada, sin que nada falle visiblemente.
   ══════════════════════════════════════════════════════════════════ */

describe('presentarItem', () => {
  const SEMILLAS = [0, 1, 2, 3, 7, 42, 99, 2026, 123_456];

  it.each(CANONICOS.map((c) => [c.item.tipo, c.item] as const))(
    'un ítem "%s" barajado y respondido con el índice remapeado se califica correcto',
    (_tipo, item) => {
      for (const semilla of SEMILLAS) {
        const presentado = presentarItem(item, crearRng(semilla));
        expect(calificar(presentado, respuestaCorrectaDe(presentado))).toBe(true);
      }
    },
  );

  it('mantiene la consistencia sobre los 28 ítems reales del banco de C5', () => {
    for (const item of ITEMS) {
      for (const semilla of SEMILLAS) {
        const presentado = presentarItem(item, crearRng(semilla));
        expect(calificar(presentado, respuestaCorrectaDe(presentado))).toBe(true);
      }
    }
  });

  it('sigue siendo consistente si se presenta un ítem ya presentado', () => {
    // El ítem canónico tiene ordenCorrecto [0..n-1], pero tras presentarlo ya no.
    // El remapeo debe funcionar sobre cualquier permutación de partida.
    for (const { item } of CANONICOS) {
      const unaVez = presentarItem(item, crearRng(11));
      const dosVeces = presentarItem(unaVez, crearRng(22));
      expect(calificar(dosVeces, respuestaCorrectaDe(dosVeces))).toBe(true);
    }
  });

  it('no muta el ítem fuente', () => {
    const antes = JSON.parse(JSON.stringify(ITEMS));
    for (const item of ITEMS) presentarItem(item, crearRng(5));
    expect(JSON.parse(JSON.stringify(ITEMS))).toEqual(antes);
  });

  it('devuelve una copia también para vf y calculo, que no tienen nada que barajar', () => {
    // El banco es un singleton de ES module: devolver la misma referencia dejaría
    // que una mutación en la UI corrompiera el banco de toda la sesión.
    expect(presentarItem(VF, crearRng(1))).not.toBe(VF);
    expect(presentarItem(VF, crearRng(1))).toEqual(VF);
    expect(presentarItem(CALCULO, crearRng(1))).not.toBe(CALCULO);
    expect(presentarItem(CALCULO, crearRng(1))).toEqual(CALCULO);
  });

  describe('única y caso', () => {
    it('el índice correcto sigue apuntando al mismo texto', () => {
      for (const semilla of SEMILLAS) {
        const p = presentarItem(UNICA, crearRng(semilla)) as ItemUnica;
        expect(p.opciones[p.correcta]).toBe(UNICA.opciones[UNICA.correcta]);
        expect([...p.opciones].sort()).toEqual([...UNICA.opciones].sort());
      }
    });

    it('efectivamente baraja con alguna semilla', () => {
      const permutaciones = new Set(
        SEMILLAS.map((s) => (presentarItem(UNICA, crearRng(s)) as ItemUnica).opciones.join('|')),
      );
      expect(permutaciones.size).toBeGreaterThan(1);
    });
  });

  describe('múltiple', () => {
    it('los índices correctos siguen apuntando a los mismos textos', () => {
      for (const semilla of SEMILLAS) {
        const p = presentarItem(MULTIPLE, crearRng(semilla)) as ItemMultiple;
        const textos = p.correctas.map((i) => p.opciones[i]).sort();
        const esperados = MULTIPLE.correctas.map((i) => MULTIPLE.opciones[i]).sort();
        expect(textos).toEqual(esperados);
      }
    });

    it('devuelve los índices correctos ordenados', () => {
      for (const semilla of SEMILLAS) {
        const p = presentarItem(MULTIPLE, crearRng(semilla)) as ItemMultiple;
        expect(p.correctas).toEqual([...p.correctas].sort((a, b) => a - b));
      }
    });
  });

  describe('emparejar', () => {
    it('baraja la columna derecha y deja la izquierda intacta', () => {
      const p = presentarItem(EMPAREJAR, crearRng(3)) as ItemEmparejar;
      expect(p.izquierda).toEqual(EMPAREJAR.izquierda);
      expect([...p.derecha].sort()).toEqual([...EMPAREJAR.derecha].sort());
    });

    it('cada par sigue uniendo los mismos dos textos', () => {
      for (const semilla of SEMILLAS) {
        const p = presentarItem(EMPAREJAR, crearRng(semilla)) as ItemEmparejar;
        for (const [i, d] of p.pares) {
          const dOriginal = EMPAREJAR.pares.find(([oi]) => oi === i)![1];
          expect(p.derecha[d]).toBe(EMPAREJAR.derecha[dOriginal]);
        }
      }
    });
  });

  describe('ordenar', () => {
    it('ordenCorrecto[k] apunta a la posición, en el array barajado, del elemento que va en el lugar k', () => {
      // Es la semántica que documenta el comentario del motor. Verificarla
      // contra los textos —no contra los índices— es lo que la hace real.
      for (const semilla of SEMILLAS) {
        const p = presentarItem(ORDENAR, crearRng(semilla)) as ItemOrdenar;
        for (let k = 0; k < ORDENAR.elementos.length; k++) {
          const canonico = ORDENAR.elementos[ORDENAR.ordenCorrecto[k]];
          expect(p.elementos[p.ordenCorrecto[k]]).toBe(canonico);
        }
      }
    });

    it('ordenCorrecto sigue siendo una permutación completa', () => {
      for (const semilla of SEMILLAS) {
        const p = presentarItem(ORDENAR, crearRng(semilla)) as ItemOrdenar;
        expect([...p.ordenCorrecto].sort((a, b) => a - b)).toEqual([0, 1, 2, 3]);
      }
    });

    it('responder en el orden en que el usuario los ve, pero mal, se califica falso', () => {
      const p = presentarItem(ORDENAR, crearRng(1)) as ItemOrdenar;
      const alReves = [...p.ordenCorrecto].reverse();
      expect(calificar(p, alReves)).toBe(false);
    });
  });
});

describe('presentarTanda', () => {
  it('equivale a recorrer la tanda con un solo rng', () => {
    const rng = crearRng(777);
    const manual = ITEMS.map((it) => presentarItem(it, rng));
    expect(presentarTanda(ITEMS, 777)).toEqual(manual);
  });

  it('es reproducible: misma semilla ⇒ misma pantalla', () => {
    expect(presentarTanda(ITEMS, 555)).toEqual(presentarTanda(ITEMS, 555));
  });

  it('depende del orden de la tanda, que es lo que se quiere reproducir', () => {
    const alReves = [...ITEMS].reverse();
    expect(presentarTanda(alReves, 555)).not.toEqual([...presentarTanda(ITEMS, 555)].reverse());
  });

  it('deja toda la tanda calificable sin desalineaciones', () => {
    for (const p of presentarTanda(ITEMS, 31_415)) {
      expect(calificar(p, respuestaCorrectaDe(p))).toBe(true);
    }
  });
});

/* ══════════════════════════════════════════════════════════════════
   armarSimulacro
   ══════════════════════════════════════════════════════════════════ */

describe('armarSimulacro', () => {
  /** Banco sintético: 4 módulos del bloque A con 8 ítems cada uno. */
  const BANCO_4x8: Item[] = ['a1', 'a2', 'a3', 'a4'].flatMap((modulo) =>
    Array.from({ length: 8 }, (_, i) =>
      itemSintetico(`${modulo.toUpperCase()}-${String(i).padStart(3, '0')}`, modulo, 'A'),
    ),
  );

  it('con la misma semilla devuelve los mismos ids en el mismo orden', () => {
    const bp = blueprintQuiz('c5-umbrales-zonas');
    const a = armarSimulacro(bp, ITEMS, 12_345).map((it) => it.id);
    const b = armarSimulacro(bp, ITEMS, 12_345).map((it) => it.id);
    expect(a).toEqual(b);
    expect(a).toHaveLength(bp.totalItems);
  });

  it('con semillas distintas devuelve selecciones distintas', () => {
    const bp = blueprintQuiz('c5-umbrales-zonas');
    const a = armarSimulacro(bp, ITEMS, 1).map((it) => it.id);
    const b = armarSimulacro(bp, ITEMS, 2).map((it) => it.id);
    expect(a).not.toEqual(b);
  });

  it('nunca repite un ítem', () => {
    for (const semilla of [1, 2, 3, 42, 2026]) {
      const ids = armarSimulacro(BLUEPRINTS.final, ITEMS, semilla).map((it) => it.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it('satisface el reparto por módulo exactamente cuando hay banco suficiente', () => {
    const bp = blueprintDePrueba({ a1: 2, a2: 3, a3: 4, a4: 1 });
    const cobertura = medirCobertura(bp, armarSimulacro(bp, BANCO_4x8, 42));
    expect(cobertura.total).toBe(10);
    expect(cobertura.porUnidad).toEqual({
      a1: { obtenido: 2, objetivo: 2 },
      a2: { obtenido: 3, objetivo: 3 },
      a3: { obtenido: 4, objetivo: 4 },
      a4: { obtenido: 1, objetivo: 1 },
    });
  });

  it('rellena desde el pool global cuando un módulo no tiene ítems', () => {
    // El caso real de hoy: 28 de los 29 módulos están en preparación.
    const soloA1 = BANCO_4x8.filter((it) => it.modulo === 'a1'); // 8 ítems
    const bp = blueprintDePrueba({ a1: 2, a2: 2, a3: 2 }); // totalItems = 6
    const seleccion = armarSimulacro(bp, soloA1, 42);

    // Entrega el simulacro completo aunque a2 y a3 estén vacíos…
    expect(seleccion).toHaveLength(6);
    expect(new Set(seleccion.map((it) => it.id)).size).toBe(6);
    expect(seleccion.every((it) => it.modulo === 'a1')).toBe(true);
    // …a costa de que a1 supere su cuota: el reparto cede antes que la longitud.
    expect(medirCobertura(bp, seleccion).porUnidad.a1).toEqual({ obtenido: 6, objetivo: 2 });
  });

  it('entrega un simulacro corto, sin repetir, cuando el banco global no alcanza', () => {
    const banco = BANCO_4x8.slice(0, 3);
    const bp = blueprintDePrueba({ a1: 9 });
    const seleccion = armarSimulacro(bp, banco, 1);

    expect(seleccion).toHaveLength(3);
    expect(new Set(seleccion.map((it) => it.id)).size).toBe(3);
  });

  it('devuelve una lista vacía con el banco vacío, en vez de lanzar', () => {
    const bp = blueprintDePrueba({ a1: 5 });
    expect(armarSimulacro(bp, [], 1)).toEqual([]);
  });

  it('respeta tiposPermitidos y dificultadesPermitidas', () => {
    const bp = BLUEPRINTS.diagnostico;
    const seleccion = armarSimulacro(bp, ITEMS, 99);

    expect(seleccion.length).toBeGreaterThan(0);
    for (const item of seleccion) {
      expect(bp.tiposPermitidos).toContain(item.tipo);
      expect(bp.dificultadesPermitidas).toContain(item.dificultad);
    }
  });

  it('reparte por bloque cuando el blueprint lo pide', () => {
    const banco: Item[] = [
      ...Array.from({ length: 6 }, (_, i) => itemSintetico(`A1-${100 + i}`, 'a1', 'A')),
      ...Array.from({ length: 6 }, (_, i) => itemSintetico(`B1-${100 + i}`, 'b1', 'B')),
    ];
    const bp: BlueprintExamen = {
      ...blueprintDePrueba({}),
      totalItems: 5,
      reparto: { tipo: 'bloque', cuotas: { A: 2, B: 3 } },
      porNivel: { recuerdo: 5, comprension: 0, aplicacion: 0 },
    };
    const cobertura = medirCobertura(bp, armarSimulacro(bp, banco, 8));
    expect(cobertura.porUnidad).toEqual({
      A: { obtenido: 2, objetivo: 2 },
      B: { obtenido: 3, objetivo: 3 },
    });
  });

  it('penaliza los ítems recientes cuando hay alternativas disponibles', () => {
    const bp = blueprintDePrueba({ a1: 3 });
    const soloA1 = BANCO_4x8.filter((it) => it.modulo === 'a1');
    const primero = armarSimulacro(bp, soloA1, 5).map((it) => it.id);
    const segundo = armarSimulacro(bp, soloA1, 5, primero).map((it) => it.id);

    expect(segundo.filter((id) => primero.includes(id))).toHaveLength(0);
  });

  it('los recientes penalizan sin prohibir: si no hay de dónde más, igual entrega el simulacro', () => {
    const bp = blueprintDePrueba({ a1: 3 });
    const soloTres = BANCO_4x8.filter((it) => it.modulo === 'a1').slice(0, 3);
    const todos = soloTres.map((it) => it.id);
    expect(armarSimulacro(bp, soloTres, 5, todos)).toHaveLength(3);
  });

  it('entrega la selección barajada, no agrupada por módulo', () => {
    // El muestreo recorre unidad por unidad; sin el barajado final el usuario
    // vería los 4 ítems de a1, luego los 4 de a2, y así.
    const bp = blueprintDePrueba({ a1: 4, a2: 4, a3: 4, a4: 4 });
    const modulos = armarSimulacro(bp, BANCO_4x8, 3).map((it) => it.modulo);
    const transiciones = modulos.filter((m, i) => i > 0 && m !== modulos[i - 1]).length;
    // Agrupado por módulo darían 3 transiciones; barajado, muchas más.
    expect(transiciones).toBeGreaterThan(8);
  });

  it('no muta el blueprint compartido ni el banco recibido', () => {
    // BLUEPRINTS es un singleton de módulo: si armarSimulacro tocara porNivel,
    // porTipo o las cuotas, el segundo simulacro de la sesión saldría sesgado.
    const bp = BLUEPRINTS.final;
    const bpAntes = JSON.parse(JSON.stringify(bp));
    const banco = [...ITEMS];
    const bancoAntes = banco.map((it) => it.id);

    armarSimulacro(bp, banco, 7);

    expect(JSON.parse(JSON.stringify(bp))).toEqual(bpAntes);
    expect(banco.map((it) => it.id)).toEqual(bancoAntes);
  });

  it('dos llamadas seguidas con el mismo blueprint compartido no se contaminan', () => {
    const bp = BLUEPRINTS.final;
    const primera = armarSimulacro(bp, ITEMS, 7).map((it) => it.id);
    armarSimulacro(bp, ITEMS, 999);
    const tercera = armarSimulacro(bp, ITEMS, 7).map((it) => it.id);
    expect(tercera).toEqual(primera);
  });

  it('reproduce ids exactos para una semilla fija (regresión de determinismo)', () => {
    // Golden test: cualquier cambio en el orden de comparación, en el consumo
    // del rng o en la heurística de elección rompe esta fila. Si se rompe a
    // propósito, hay que actualizarla — y entender que ningún intento viejo
    // se podrá volver a reproducir.
    const bp = blueprintQuiz('c5-umbrales-zonas');
    expect(armarSimulacro(bp, ITEMS, 42).map((it) => it.id)).toEqual([
      'C5-007',
      'C5-004',
      'C5-012',
      'C5-028',
      'C5-009',
      'C5-022',
      'C5-017',
      'C5-008',
      'C5-021',
      'C5-026',
    ]);
  });

  it('el resultado sigue siendo calificable de punta a punta', () => {
    const bp = blueprintQuiz('c5-umbrales-zonas');
    const seleccion = armarSimulacro(bp, ITEMS, 2026);
    for (const presentado of presentarTanda(seleccion, 2026)) {
      expect(calificar(presentado, respuestaCorrectaDe(presentado))).toBe(true);
    }
  });
});

/* ══════════════════════════════════════════════════════════════════
   medirCobertura
   ══════════════════════════════════════════════════════════════════ */

describe('medirCobertura', () => {
  it('mide unidad, nivel y tipo sobre un caso conocido por módulo', () => {
    const bp: BlueprintExamen = {
      ...blueprintDePrueba({ a1: 2, a2: 1 }),
      porNivel: { recuerdo: 2, comprension: 1, aplicacion: 0 },
      porTipo: { unica: 2, vf: 1 },
    };
    const items: Item[] = [
      itemSintetico('A1-001', 'a1', 'A', 'recuerdo'),
      itemSintetico('A1-002', 'a1', 'A', 'recuerdo'),
      itemSintetico('A2-001', 'a2', 'A', 'aplicacion'),
    ];

    expect(medirCobertura(bp, items)).toEqual({
      total: 3,
      porUnidad: {
        a1: { obtenido: 2, objetivo: 2 },
        a2: { obtenido: 1, objetivo: 1 },
      },
      porNivel: {
        recuerdo: { obtenido: 2, objetivo: 2 },
        comprension: { obtenido: 0, objetivo: 1 },
        aplicacion: { obtenido: 1, objetivo: 0 },
      },
      porTipo: {
        unica: { obtenido: 3, objetivo: 2 },
        vf: { obtenido: 0, objetivo: 1 },
      },
    });
  });

  it('mide por bloque cuando el reparto es por bloque', () => {
    const bp: BlueprintExamen = {
      ...blueprintDePrueba({}),
      totalItems: 3,
      reparto: { tipo: 'bloque', cuotas: { A: 2, C: 1 } },
      porNivel: { recuerdo: 3, comprension: 0, aplicacion: 0 },
    };
    const items: Item[] = [
      itemSintetico('A1-001', 'a1', 'A'),
      itemSintetico('A1-002', 'a1', 'A'),
      itemSintetico('C1-001', 'c1', 'C'),
    ];

    expect(medirCobertura(bp, items).porUnidad).toEqual({
      A: { obtenido: 2, objetivo: 2 },
      C: { obtenido: 1, objetivo: 1 },
    });
  });

  it('deja porTipo vacío cuando el blueprint no declara cuotas por tipo', () => {
    const bp = blueprintDePrueba({ a1: 1 });
    expect(medirCobertura(bp, [itemSintetico('A1-001', 'a1', 'A')]).porTipo).toEqual({});
  });

  it('reporta el déficit real de un simulacro armado con banco incompleto', () => {
    // Con 28 ítems de un solo módulo, el simulacro final de 100 sale corto:
    // la cobertura debe decirlo, no maquillarlo.
    const bp = BLUEPRINTS.final;
    const cobertura = medirCobertura(bp, armarSimulacro(bp, ITEMS, 7));

    expect(cobertura.total).toBe(ITEMS.length);
    expect(cobertura.porUnidad['c5-umbrales-zonas']).toEqual({ obtenido: 28, objetivo: 4 });
    expect(cobertura.porUnidad['a1-celula']).toEqual({ obtenido: 0, objetivo: 3 });
    expect(cobertura.porNivel.recuerdo.objetivo).toBe(40);
    expect(cobertura.porNivel.recuerdo.obtenido).toBeLessThan(40);
  });
});

/* ══════════════════════════════════════════════════════════════════
   Reproducibilidad de un intento — el invariante que sostiene /resultados
   ══════════════════════════════════════════════════════════════════ */

describe('reproducir un intento guardado', () => {
  it('los itemIds guardados más la semilla reconstruyen la pantalla exacta', () => {
    const bp = blueprintQuiz('c5-umbrales-zonas');
    const semilla = 1_769_800_000_000;

    // Lo que ocurre durante el intento.
    const seleccion = armarSimulacro(bp, ITEMS, semilla);
    const itemIds = seleccion.map((it) => it.id);
    const pantalla = presentarTanda(seleccion, semilla);

    // Lo que ocurre al abrir /resultados/[intentoId]: no se re-muestrea,
    // se reconstruye desde los ids guardados.
    const porId = new Map(ITEMS.map((it) => [it.id, it]));
    const reconstruida = presentarTanda(
      itemIds.map((id) => porId.get(id)!),
      semilla,
    );

    expect(reconstruida).toEqual(pantalla);
  });

  it('un tipo de ítem que no consume rng no desalinea la tanda', () => {
    // vf y calculo salen del switch sin llamar al rng: el flujo del generador
    // depende de los tipos presentes, así que la tanda debe reconstruirse
    // completa, no ítem por ítem con semillas sueltas.
    const tanda: Item[] = [VF, UNICA, CALCULO, MULTIPLE, ORDENAR];
    expect(presentarTanda(tanda, 123)).toEqual(presentarTanda(tanda, 123));
    for (const p of presentarTanda(tanda, 123)) {
      expect(calificar(p, respuestaCorrectaDe(p))).toBe(true);
    }
  });
});

/* ══════════════════════════════════════════════════════════════════
   Viabilidad — ¿alcanza el banco para armar este examen?

   Es la comprobación que impide el peor fallo silencioso de este paso:
   `armarSimulacro` rellena desde el pool global cuando falta contenido, así
   que un «simulacro final de 100 ítems» con solo C5 publicado devolvería 28
   ítems del mismo módulo presentados como el examen completo, y un porcentaje
   sobre ellos presentado como el pronóstico del usuario.
   ══════════════════════════════════════════════════════════════════ */

describe('diagnosticarViabilidad', () => {
  const CENSO_COMPLETO: CensoModulo[] = MODULOS.map((m) => ({
    slug: m.slug,
    bloque: m.bloque,
    disponibles: 30,
  }));

  /** El censo REAL de hoy: C5 con sus 28 ítems y los otros 28 módulos a cero. */
  const CENSO_HOY: CensoModulo[] = MODULOS.map((m) => ({
    slug: m.slug,
    bloque: m.bloque,
    disponibles: m.slug === 'c5-umbrales-zonas' ? ITEMS.length : 0,
  }));

  it('declara INVIABLE el simulacro final con el contenido de hoy', () => {
    const v = diagnosticarViabilidad(BLUEPRINTS.final, CENSO_HOY);
    expect(v.viable).toBe(false);
    expect(v.totalRequerido).toBe(100);
    expect(v.totalDisponible).toBe(ITEMS.length);
    expect(v.faltan).toBe(100 - ITEMS.length);
  });

  it('declara INVIABLE el simulacro del bloque C con el contenido de hoy', () => {
    // 40 ítems pedidos, 28 publicados en el único módulo completo del bloque.
    const v = diagnosticarViabilidad(BLUEPRINTS['bloque-C'], CENSO_HOY);
    expect(v.viable).toBe(false);
    expect(v.faltan).toBe(40 - ITEMS.length);
  });

  it('declara viable el final cuando los 29 módulos tienen contenido', () => {
    const v = diagnosticarViabilidad(BLUEPRINTS.final, CENSO_COMPLETO);
    expect(v.viable).toBe(true);
    expect(v.faltan).toBe(0);
    expect(v.deficits).toEqual([]);
    expect(v.repartoIncumplido).toBe(false);
  });

  it('NO cuenta ítems de bloques ajenos al armar un simulacro de bloque', () => {
    // El relleno de `armarSimulacro` sale de las unidades del reparto, no del
    // banco entero. Contar todo daría un «viable» falso en cuanto los pasos
    // 15–17 publiquen otros bloques, y el usuario recibiría un examen del
    // bloque C relleno con preguntas del A.
    const soloBloqueA: CensoModulo[] = MODULOS.map((m) => ({
      slug: m.slug,
      bloque: m.bloque,
      disponibles: m.bloque === 'A' ? 100 : 0,
    }));
    const v = diagnosticarViabilidad(BLUEPRINTS['bloque-C'], soloBloqueA);
    expect(v.viable).toBe(false);
    expect(v.totalDisponible).toBe(0);
  });

  it('avisa del reparto incumplido cuando hay total de sobra pero un módulo corto', () => {
    // Caso de los pasos 15–17: contenido suficiente en conjunto, repartido
    // desigual. El examen se arma —y se dice que el reparto no será el real.
    const desigual: CensoModulo[] = MODULOS.map((m) => ({
      slug: m.slug,
      bloque: m.bloque,
      disponibles: m.slug === 'c5-umbrales-zonas' ? 0 : 30,
    }));
    const v = diagnosticarViabilidad(BLUEPRINTS.final, desigual);
    expect(v.viable).toBe(true);
    expect(v.repartoIncumplido).toBe(true);
    expect(v.deficits.map((d) => d.clave)).toContain('c5-umbrales-zonas');
  });

  it('ordena los déficits del más grave al más leve', () => {
    const censo: CensoModulo[] = MODULOS.map((m) => ({
      slug: m.slug,
      bloque: m.bloque,
      disponibles: m.slug === 'c1-vias-energeticas' ? 0 : m.slug === 'c2-cardiovascular' ? 3 : 30,
    }));
    const v = diagnosticarViabilidad(BLUEPRINTS.final, censo);
    // c1 pide 5 y tiene 0 (déficit 5); c2 pide 4 y tiene 3 (déficit 1).
    expect(v.deficits[0].clave).toBe('c1-vias-energeticas');
  });

  it('un censo vacío no revienta: dice que falta todo', () => {
    const v = diagnosticarViabilidad(BLUEPRINTS.final, []);
    expect(v.viable).toBe(false);
    expect(v.totalDisponible).toBe(0);
    expect(v.faltan).toBe(100);
  });

  it('marca el veredicto como NO exacto si el blueprint filtra por tipo', () => {
    // El diagnóstico del Paso 13 limita tipos y dificultades, y el censo cuenta
    // ítems publicados, no elegibles: ahí el veredicto es una cota superior y
    // hay que ampliar el censo. Que lo diga en vez de fingir precisión.
    expect(diagnosticarViabilidad(BLUEPRINTS.diagnostico, CENSO_COMPLETO).exacto).toBe(false);
    expect(diagnosticarViabilidad(BLUEPRINTS.final, CENSO_COMPLETO).exacto).toBe(true);
  });

  it('es coherente con lo que armarSimulacro entrega de verdad', () => {
    // El vínculo entre el diagnóstico y la realidad: si dice inviable, armar
    // devuelve MENOS ítems de los pedidos. Sin este test, `diagnosticarViabilidad`
    // podría derivar de `armarSimulacro` sin que nada lo señale.
    const v = diagnosticarViabilidad(BLUEPRINTS.final, CENSO_HOY);
    expect(v.viable).toBe(false);
    const armado = armarSimulacro(BLUEPRINTS.final, ITEMS, 42);
    expect(armado.length).toBeLessThan(BLUEPRINTS.final.totalItems);
    expect(armado.length).toBe(v.totalDisponible);
  });

  it('sin déficit, armarSimulacro sí entrega el examen completo y sin repetir', () => {
    const banco: Item[] = MODULOS.flatMap((m) =>
      Array.from({ length: 30 }, (_, i) => ({
        ...ITEMS[i % ITEMS.length],
        id: `${m.slug}-${String(i).padStart(3, '0')}`,
        modulo: m.slug,
        bloque: m.bloque,
      })),
    );
    const v = diagnosticarViabilidad(BLUEPRINTS.final, CENSO_COMPLETO);
    expect(v.viable).toBe(true);
    const armado = armarSimulacro(BLUEPRINTS.final, banco, 7);
    expect(armado.length).toBe(100);
    expect(new Set(armado.map((it) => it.id)).size).toBe(100);
  });
});

/* ── El contrato de `exacto`, fijado hoy y no dentro de dos pasos ──── */

describe('Viabilidad.exacto — contrato para el Paso 13', () => {
  const CENSO: CensoModulo[] = MODULOS.map((m) => ({
    slug: m.slug,
    bloque: m.bloque,
    disponibles: 30,
  }));

  it('es false en cuanto el blueprint filtra por tipo O por dificultad', () => {
    // Cota superior: el censo cuenta ítems PUBLICADOS, no ELEGIBLES, así que
    // con filtros el veredicto puede decir «viable» y no serlo. La UI lo trata
    // como «no se puede preparar» en vez de fiarse.
    const soloTipos: BlueprintExamen = { ...BLUEPRINTS.final, tiposPermitidos: ['unica'] };
    const soloDificultad: BlueprintExamen = { ...BLUEPRINTS.final, dificultadesPermitidas: [1] };
    expect(diagnosticarViabilidad(soloTipos, CENSO).exacto).toBe(false);
    expect(diagnosticarViabilidad(soloDificultad, CENSO).exacto).toBe(false);
  });

  it('el diagnóstico del Paso 13 caerá en ese caso, y por eso está fijado aquí', () => {
    expect(BLUEPRINTS.diagnostico.tiposPermitidos).toBeDefined();
    expect(diagnosticarViabilidad(BLUEPRINTS.diagnostico, CENSO).exacto).toBe(false);
  });

  it('los dos simulacros que este paso entrega SÍ son exactos', () => {
    expect(diagnosticarViabilidad(BLUEPRINTS.final, CENSO).exacto).toBe(true);
    expect(diagnosticarViabilidad(BLUEPRINTS['bloque-C'], CENSO).exacto).toBe(true);
  });
});

/* ══════════════════════════════════════════════════════════════════
   ADR-025 — `exacto` con censo filtrado

   El diagnóstico es el primer blueprint que filtra por tipo Y por
   dificultad. Con el censo de ítems *publicados*, su veredicto era una
   cota superior: podía decir «viable» y no serlo.
   ══════════════════════════════════════════════════════════════════ */

describe('diagnosticarViabilidad — censo filtrado (ADR-025)', () => {
  const publicados: CensoModulo[] = MODULOS.map((m) => ({
    slug: m.slug,
    bloque: m.bloque,
    disponibles: 30,
  }));

  const filtradoParaDiagnostico: CensoModulo[] = MODULOS.map((m) => ({
    slug: m.slug,
    bloque: m.bloque,
    disponibles: 30,
    filtradoPara: BLUEPRINTS.diagnostico.id,
  }));

  it('sigue siendo NO exacto con un censo de publicados', () => {
    expect(diagnosticarViabilidad(BLUEPRINTS.diagnostico, publicados).exacto).toBe(false);
  });

  it('es EXACTO cuando el censo se contó para ese mismo blueprint', () => {
    expect(diagnosticarViabilidad(BLUEPRINTS.diagnostico, filtradoParaDiagnostico).exacto).toBe(
      true,
    );
  });

  it('un censo filtrado para OTRO blueprint no vale', () => {
    // Sus cuentas son de otros tipos y otras dificultades: fiarse sería el
    // mismo error con más pasos.
    const paraElFinal = MODULOS.map((m) => ({
      slug: m.slug,
      bloque: m.bloque,
      disponibles: 30,
      filtradoPara: BLUEPRINTS.final.id,
    }));
    expect(diagnosticarViabilidad(BLUEPRINTS.diagnostico, paraElFinal).exacto).toBe(false);
  });

  it('basta con que UNA entrada no esté filtrada para perder la exactitud', () => {
    const mezclado = [...filtradoParaDiagnostico];
    mezclado[3] = { ...mezclado[3], filtradoPara: undefined };
    expect(diagnosticarViabilidad(BLUEPRINTS.diagnostico, mezclado).exacto).toBe(false);
  });

  it('un censo vacío no se declara exacto por vacuidad', () => {
    // `[].every(...)` es `true`, así que sin la guarda de longitud un censo sin
    // entradas afirmaría exactitud sobre cero evidencia.
    expect(diagnosticarViabilidad(BLUEPRINTS.diagnostico, []).exacto).toBe(false);
  });

  it('los blueprints SIN filtro siguen siendo exactos con el censo normal', () => {
    expect(diagnosticarViabilidad(BLUEPRINTS.final, publicados).exacto).toBe(true);
    expect(diagnosticarViabilidad(BLUEPRINTS['bloque-C'], publicados).exacto).toBe(true);
  });

  it('el diagnóstico con el contenido de HOY es inviable, y por partida doble', () => {
    // C5 tiene 28 ítems publicados, pero el diagnóstico solo admite `unica`,
    // `emparejar` y `caso` de dificultad 1 o 2: la cuenta real es menor.
    const elegiblesC5 = ITEMS.filter(
      (it) =>
        BLUEPRINTS.diagnostico.tiposPermitidos!.includes(it.tipo) &&
        BLUEPRINTS.diagnostico.dificultadesPermitidas!.includes(it.dificultad),
    ).length;
    expect(elegiblesC5).toBeLessThan(ITEMS.length);

    const censoHoy: CensoModulo[] = MODULOS.map((m) => ({
      slug: m.slug,
      bloque: m.bloque,
      disponibles: m.slug === 'c5-umbrales-zonas' ? elegiblesC5 : 0,
      filtradoPara: BLUEPRINTS.diagnostico.id,
    }));
    const v = diagnosticarViabilidad(BLUEPRINTS.diagnostico, censoHoy);
    expect(v.viable).toBe(false);
    expect(v.exacto).toBe(true);
    expect(v.totalDisponible).toBe(elegiblesC5);
  });
});
