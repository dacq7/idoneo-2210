import { describe, expect, it } from 'vitest';
import {
  CUOTAS,
  CUOTAS_BLOQUE_C,
  cuotasDelBloque,
  esqItem,
  esqItemCalculo,
  esqItemCaso,
  esqItemEmparejar,
  esqItemMultiple,
  esqItemOrdenar,
  esqItemUnica,
  esqModulo,
  esqTarjeta,
  verificarCuotas,
} from '@/lib/esquemas';
import type { Item, NivelCognitivo, TipoItem } from '@/lib/tipos';

/* ─── Ayudas ──────────────────────────────────────────────────────── */

/** 200+ caracteres, con la estructura que exige el blueprint:
 *  por qué la correcta lo es → por qué falla el distractor → dato para recordar. */
const EXPLICACION =
  'R1 corresponde al umbral aeróbico (VT1) y va del 65 al 75 %: es la zona de máxima ' +
  'oxidación de lípidos. El distractor más tentador es R0, porque las dos se perciben como ' +
  'suaves; la diferencia es que R1 sí produce adaptación aeróbica y R0 solo recupera. ' +
  'Dato para recordar: R1 es la zona del fondo largo del maratonista.';

const BASE = {
  modulo: 'c5-umbrales-zonas',
  bloque: 'C' as const,
  nivel: 'recuerdo' as const,
  dificultad: 1 as const,
  enunciado: '¿En qué rango porcentual se ubica la zona R1?',
  explicacion: EXPLICACION,
  referencia: 'Cartilla 3, Tema 2, Subtema 2.6.1 — Umbral Ventilatorio 1',
  etiquetas: ['R1', 'VT1'],
};

/** Un ítem válido de cada uno de los 7 tipos. */
const VALIDOS: Record<TipoItem, unknown> = {
  unica: {
    ...BASE,
    id: 'C5-001',
    tipo: 'unica',
    opciones: ['65–75 %', 'Menos del 65 %', '80–90 %', '90–95 %'],
    correcta: 0,
  },
  multiple: {
    ...BASE,
    id: 'C5-002',
    tipo: 'multiple',
    opciones: [
      'Aumento de la densidad capilar',
      'Aumento de la densidad mitocondrial',
      'Aumento de los triglicéridos intramusculares',
      'Aumento de la volemia',
      'Eliminación acelerada de desechos',
    ],
    correctas: [0, 1],
  },
  vf: {
    ...BASE,
    id: 'C5-003',
    tipo: 'vf',
    correcta: false,
  },
  emparejar: {
    ...BASE,
    id: 'C5-004',
    tipo: 'emparejar',
    izquierda: ['R0', 'R1', 'R2', 'R3'],
    derecha: ['Recuperación', 'Oxidación de lípidos', 'Glucógeno y MLSS', 'Potencia aeróbica'],
    pares: [
      [0, 0],
      [1, 1],
      [2, 2],
      [3, 3],
    ],
  },
  calculo: {
    ...BASE,
    id: 'C5-005',
    tipo: 'calculo',
    respuesta: 117,
    tolerancia: 1,
    unidad: 'lpm',
    pasos: ['Fox: FCmáx = 220 − edad', 'FCmáx = 220 − 40 = 180 lpm', '180 × 0,65 = 117 lpm'],
  },
  ordenar: {
    ...BASE,
    id: 'C5-006',
    tipo: 'ordenar',
    elementos: ['R0 — recuperación', 'R1 — umbral aeróbico', 'R2 — umbral anaeróbico'],
    ordenCorrecto: [0, 1, 2],
  },
  caso: {
    ...BASE,
    id: 'C5-007',
    tipo: 'caso',
    viñeta:
      'Una corredora prepara su primer maratón y entrena cinco sesiones semanales a un ritmo ' +
      'en el que solo puede decir frases cortas. Llega fatigada a cada sesión.',
    opciones: [
      'Bajar la mayoría de sesiones a R1',
      'Subir las sesiones a R3',
      'Mantener la intensidad y reducir a tres sesiones',
      'Cambiar los fondos por series máximas',
    ],
    correcta: 0,
  },
};

const TIPOS = Object.keys(VALIDOS) as TipoItem[];

/** Construye n ítems de tipo `unica` con nivel y dificultad controlados. */
function lote(
  n: number,
  nivel: NivelCognitivo = 'recuerdo',
  dificultad: 1 | 2 | 3 = 1,
): Item[] {
  return Array.from({ length: n }, (_, i) => ({
    ...BASE,
    id: `C5-${String(i + 1).padStart(3, '0')}`,
    tipo: 'unica' as const,
    nivel,
    dificultad,
    opciones: ['a', 'b', 'c', 'd'],
    correcta: 0,
  }));
}

/** Rutas de los issues, como 'campo' o 'raíz'. */
function rutas(resultado: ReturnType<typeof esqItem.safeParse>): string[] {
  if (resultado.success) return [];
  return resultado.error.issues.map((i) => i.path.join('.') || 'raíz');
}

/* ─── 1. Los 7 tipos válidos ──────────────────────────────────────── */

describe('esqItem — un ítem válido de cada tipo', () => {
  for (const tipo of TIPOS) {
    it(`acepta un ítem de tipo "${tipo}"`, () => {
      const r = esqItem.safeParse(VALIDOS[tipo]);
      expect(r.success, r.success ? '' : JSON.stringify(r.error.issues)).toBe(true);
    });
  }

  it('el módulo se importa sin lanzar y esqItem quedó construido', () => {
    // Regresión del defecto de §5 documentado en ADR-003: con los miembros
    // envueltos en superRefine, discriminatedUnion lanzaba TypeError AL IMPORTAR.
    expect(typeof esqItem.safeParse).toBe('function');
  });
});

/* ─── 2. Explicación corta ────────────────────────────────────────── */

describe('esqItem — explicación', () => {
  it('rechaza una explicación de 100 caracteres y señala el campo', () => {
    const corta = { ...(VALIDOS.unica as object), explicacion: 'x'.repeat(100) };
    const r = esqItem.safeParse(corta);
    expect(r.success).toBe(false);
    expect(rutas(r)).toContain('explicacion');
    if (!r.success) {
      expect(r.error.issues[0].message).toContain('200 caracteres');
    }
  });

  it('acepta exactamente 200 caracteres', () => {
    const justa = { ...(VALIDOS.unica as object), explicacion: 'x'.repeat(200) };
    expect(esqItem.safeParse(justa).success).toBe(true);
  });
});

/* ─── 3. Los mensajes siguen siendo localizables ──────────────────── */

describe('esqItem — calidad del mensaje de error', () => {
  it('un ítem sin opciones reporta la ruta "opciones", no la raíz', () => {
    const sinOpciones = { ...(VALIDOS.unica as Record<string, unknown>) };
    delete sinOpciones.opciones;
    const r = esqItem.safeParse(sinOpciones);
    expect(r.success).toBe(false);
    expect(rutas(r)).toContain('opciones');
    expect(rutas(r)).not.toContain('raíz');
  });

  it('un tipo inexistente falla por el discriminador', () => {
    const r = esqItem.safeParse({ ...(VALIDOS.unica as object), tipo: 'inventado' });
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.error.issues[0].code).toBe('invalid_union_discriminator');
      expect(r.error.issues[0].path).toEqual(['tipo']);
    }
  });
});

/* ─── 4. Los cinco refinamientos, vía la unión ────────────────────── */

/** Las 10 reglas de refinamiento de §5, con el ítem que las viola y el mensaje
 *  exacto que deben producir. El mensaje es funcionalidad, no cosmética: el
 *  validador del Paso 3 lo imprime para localizar un ítem entre ~750. */
const REGLAS: { nombre: string; item: unknown; mensaje: string }[] = [
  {
    nombre: 'unica: opciones duplicadas',
    item: { ...(VALIDOS.unica as object), opciones: ['65–75 %', '65–75 %', '80–90 %', '90–95 %'] },
    mensaje: 'hay opciones duplicadas',
  },
  {
    nombre: 'caso: opciones duplicadas',
    item: { ...(VALIDOS.caso as object), opciones: ['a', 'a', 'c', 'd'] },
    mensaje: 'hay opciones duplicadas',
  },
  {
    nombre: 'multiple: índices repetidos en correctas',
    item: { ...(VALIDOS.multiple as object), correctas: [1, 1] },
    mensaje: 'correctas tiene índices repetidos',
  },
  {
    nombre: 'multiple: índice de correctas fuera de rango',
    item: { ...(VALIDOS.multiple as object), correctas: [0, 9] },
    mensaje: 'un índice de correctas está fuera de rango',
  },
  {
    nombre: 'emparejar: izquierda y derecha de largos distintos',
    item: {
      ...(VALIDOS.emparejar as object),
      derecha: ['Recuperación', 'Lípidos', 'Glucógeno', 'Potencia', 'Sobra'],
    },
    mensaje: 'izquierda y derecha deben tener el mismo largo',
  },
  {
    nombre: 'emparejar: faltan pares',
    item: {
      ...(VALIDOS.emparejar as object),
      pares: [
        [0, 0],
        [1, 1],
        [2, 2],
      ],
    },
    mensaje: 'debe haber un par por cada elemento de izquierda',
  },
  {
    nombre: 'emparejar: par fuera de rango',
    item: {
      ...(VALIDOS.emparejar as object),
      pares: [
        [0, 0],
        [1, 1],
        [2, 2],
        [9, 3],
      ],
    },
    mensaje: 'el par [9,3] está fuera de rango',
  },
  {
    nombre: 'emparejar: índice izquierdo repetido',
    item: {
      ...(VALIDOS.emparejar as object),
      pares: [
        [0, 0],
        [0, 1],
        [2, 2],
        [3, 3],
      ],
    },
    mensaje: 'el índice izquierdo 0 aparece dos veces',
  },
  {
    nombre: 'ordenar: ordenCorrecto de largo distinto a elementos',
    item: { ...(VALIDOS.ordenar as object), ordenCorrecto: [0, 1] },
    mensaje: 'ordenCorrecto debe tener un índice por elemento',
  },
  {
    nombre: 'ordenar: ordenCorrecto no es permutación de 0..n-1',
    item: { ...(VALIDOS.ordenar as object), ordenCorrecto: [0, 1, 5] },
    mensaje: 'ordenCorrecto debe ser una permutación de 0..n-1 (en el ítem canónico: [0,1,2,…])',
  },
  // Las dos reglas de ADR-005 van AL FINAL: el bloque de exports de ADR-003
  // indexa REGLAS por posición, así que insertarlas en el medio dejaría cinco
  // tests verificando la regla equivocada, y en verde.
  {
    nombre: 'multiple: opciones duplicadas (ADR-005, hueco 3)',
    item: {
      ...(VALIDOS.multiple as object),
      opciones: [
        'Aumento de la densidad capilar',
        'Aumento de la densidad capilar',
        'Aumento de los triglicéridos intramusculares',
        'Aumento de la volemia',
        'Eliminación acelerada de desechos',
      ],
    },
    mensaje: 'hay opciones duplicadas',
  },
  {
    nombre: 'emparejar: índice derecho repetido (ADR-005, hueco 4)',
    item: {
      ...(VALIDOS.emparejar as object),
      pares: [
        [0, 0],
        [1, 0],
        [2, 2],
        [3, 3],
      ],
    },
    mensaje: 'el índice derecho 0 aparece dos veces',
  },
];

describe('esqItem — refinamientos por tipo', () => {
  for (const regla of REGLAS) {
    it(`rechaza ${regla.nombre} con su mensaje exacto`, () => {
      const r = esqItem.safeParse(regla.item);
      expect(r.success).toBe(false);
      if (!r.success) {
        expect(r.error.issues.map((i) => i.message)).toContain(regla.mensaje);
      }
    });
  }

  it('cubre las 12 reglas de refinamiento (10 de §5 + 2 de ADR-005)', () => {
    // Si alguien añade una regla a esquemas.ts sin añadirla aquí, este número
    // deja de cuadrar y el descuido sale a la luz. Subió de 10/9 a 12/10 con
    // ADR-005: el hueco 3 reutiliza 'hay opciones duplicadas' y el hueco 4
    // aporta un mensaje nuevo. No aflojar estos números para que pase la suite.
    expect(REGLAS).toHaveLength(12);
    expect(new Set(REGLAS.map((r) => r.mensaje)).size).toBe(10);
  });
});

/* ─── 4-bis. Los exports por tipo conservan su refinamiento ───────── */

describe('exports por tipo (ADR-003)', () => {
  // ADR-003 aplica cada refinamiento DOS veces: al esquema por tipo y a la
  // unión. Sin estos cinco casos, alguien podría dejar `esqItemMultiple =
  // objItemMultiple` y la suite seguiría verde con el refinamiento perdido.
  const SUELTOS = [
    { nombre: 'esqItemUnica', esquema: esqItemUnica, item: REGLAS[0].item, mensaje: REGLAS[0].mensaje },
    { nombre: 'esqItemCaso', esquema: esqItemCaso, item: REGLAS[1].item, mensaje: REGLAS[1].mensaje },
    { nombre: 'esqItemMultiple', esquema: esqItemMultiple, item: REGLAS[2].item, mensaje: REGLAS[2].mensaje },
    { nombre: 'esqItemEmparejar', esquema: esqItemEmparejar, item: REGLAS[4].item, mensaje: REGLAS[4].mensaje },
    { nombre: 'esqItemOrdenar', esquema: esqItemOrdenar, item: REGLAS[8].item, mensaje: REGLAS[8].mensaje },
  ];

  for (const suelto of SUELTOS) {
    it(`${suelto.nombre} conserva su refinamiento al usarse suelto`, () => {
      const r = suelto.esquema.safeParse(suelto.item);
      expect(r.success).toBe(false);
      if (!r.success) {
        expect(r.error.issues.map((i) => i.message)).toContain(suelto.mensaje);
      }
    });
  }

  it('los exports por tipo siguen aceptando su ítem válido', () => {
    expect(esqItemUnica.safeParse(VALIDOS.unica).success).toBe(true);
    expect(esqItemMultiple.safeParse(VALIDOS.multiple).success).toBe(true);
    expect(esqItemEmparejar.safeParse(VALIDOS.emparejar).success).toBe(true);
    expect(esqItemOrdenar.safeParse(VALIDOS.ordenar).success).toBe(true);
    expect(esqItemCaso.safeParse(VALIDOS.caso).success).toBe(true);
  });
});

/* ─── 5. Formato de ids y fronteras ───────────────────────────────── */

describe('formatos', () => {
  it('acepta el id "C5-014" y rechaza "c5-014" y "C5-14"', () => {
    expect(esqItem.safeParse({ ...(VALIDOS.unica as object), id: 'C5-014' }).success).toBe(true);
    expect(esqItem.safeParse({ ...(VALIDOS.unica as object), id: 'c5-014' }).success).toBe(false);
    expect(esqItem.safeParse({ ...(VALIDOS.unica as object), id: 'C5-14' }).success).toBe(false);
  });

  it('la referencia debe empezar por "Cartilla N, Tema M"', () => {
    const r = esqItem.safeParse({
      ...(VALIDOS.unica as object),
      referencia: 'Guía del entrenador, página 40',
    });
    expect(r.success).toBe(false);
  });

  it('calculo: rechaza tolerancia 0', () => {
    const r = esqItemCalculo.safeParse({ ...(VALIDOS.calculo as object), tolerancia: 0 });
    expect(r.success).toBe(false);
  });

  it('esqModulo acepta los slugs reales y rechaza los mal formados', () => {
    const modulo = {
      bloque: 'C' as const,
      orden: 5,
      titulo: 'Umbrales y zonas de entrenamiento',
      subtitulo: 'R0 a R3+, VT1 y VT2, MLSS y los modelos de distribución.',
      minutosEstimados: 45,
      objetivos: [
        'Ubicar las zonas R0, R1, R2 y R3 por su porcentaje de FCmáx',
        'Explicar el objetivo fisiológico de cada zona',
        'Definir MLSS y situarlo respecto a VT1 y VT2',
      ],
      conceptosClave: ['MLSS', 'VAM', 'HIIT'],
      prerequisitos: ['c1-vias-energeticas'],
      estadoContenido: 'completo' as const,
    };
    // Los 29 slugs del blueprint tienen esta forma: letra minúscula + número + guiones.
    for (const slug of ['c5-umbrales-zonas', 'a1-celula', 'd8-estructuras', 'b6-aprendizaje-sesion']) {
      const r = esqModulo.safeParse({ ...modulo, slug });
      expect(r.success, `${slug} debería ser válido`).toBe(true);
    }
    for (const slug of ['C5-umbrales-zonas', 'c5_umbrales', 'umbrales-zonas', 'e1-inventado']) {
      expect(esqModulo.safeParse({ ...modulo, slug }).success, `${slug} debería fallar`).toBe(false);
    }
  });

  it('esqTarjeta acepta "C5-T07" y rechaza "C5-T7"', () => {
    const tarjeta = {
      modulo: 'c5-umbrales-zonas',
      frente: '¿Qué marca el VT1?',
      reverso: 'El punto donde la ventilación crece más rápido que el consumo de oxígeno.',
      tipo: 'definicion' as const,
    };
    expect(esqTarjeta.safeParse({ ...tarjeta, id: 'C5-T07' }).success).toBe(true);
    expect(esqTarjeta.safeParse({ ...tarjeta, id: 'C5-T7' }).success).toBe(false);
  });
});

/* ─── 6. verificarCuotas ──────────────────────────────────────────── */

describe('verificarCuotas', () => {
  it('detecta un módulo con 100 % recuerdo', () => {
    const fallos = verificarCuotas(lote(30, 'recuerdo'));
    expect(fallos.some((f) => f.includes('comprension'))).toBe(true);
    expect(fallos.some((f) => f.includes('aplicacion'))).toBe(true);
  });

  it('detecta menos de 25 ítems', () => {
    const fallos = verificarCuotas(lote(24));
    expect(fallos.some((f) => f.includes('el mínimo es 25'))).toBe(true);
  });

  it('con la lista vacía devuelve solo el fallo de mínimo', () => {
    expect(verificarCuotas([])).toEqual(['tiene 0 ítems, el mínimo es 25']);
  });

  it('detecta menos de 3 ítems en alguna dificultad', () => {
    const fallos = verificarCuotas(lote(30, 'recuerdo', 1));
    expect(fallos.some((f) => f.includes('dificultad 2'))).toBe(true);
    expect(fallos.some((f) => f.includes('dificultad 3'))).toBe(true);
  });

  it('detecta menos de 4 tipos distintos', () => {
    const fallos = verificarCuotas(lote(30));
    expect(fallos.some((f) => f.includes('tipos distintos'))).toBe(true);
  });

  it('un módulo bien repartido no produce fallos', () => {
    // 26 ítems: 12 recuerdo (46 %) · 8 comprensión (31 %) · 6 aplicación (23 %),
    // ≥3 de cada dificultad y 4 tipos distintos.
    const items: Item[] = [];
    const niveles: NivelCognitivo[] = [
      ...Array<NivelCognitivo>(12).fill('recuerdo'),
      ...Array<NivelCognitivo>(8).fill('comprension'),
      ...Array<NivelCognitivo>(6).fill('aplicacion'),
    ];
    const tipos: TipoItem[] = ['unica', 'multiple', 'vf', 'calculo'];
    niveles.forEach((nivel, i) => {
      const plantilla = VALIDOS[tipos[i % tipos.length]] as Item;
      items.push({
        ...plantilla,
        id: `C5-${String(i + 1).padStart(3, '0')}`,
        nivel,
        dificultad: ((i % 3) + 1) as 1 | 2 | 3,
      });
    });
    expect(verificarCuotas(items)).toEqual([]);
  });

  it('respeta unas reglas alternativas pasadas por parámetro', () => {
    const reglasFlojas = {
      minimoItems: 5,
      minNivel: { recuerdo: 0, comprension: 0, aplicacion: 0 },
      minPorDificultad: 0,
      minTiposDistintos: 1,
    };
    expect(verificarCuotas(lote(5), reglasFlojas)).toEqual([]);
  });

  it('las cuotas por omisión son las de CUOTAS', () => {
    const items = lote(30, 'recuerdo');
    expect(verificarCuotas(items)).toEqual(verificarCuotas(items, CUOTAS));
  });
});

/* ─── 7. Cuota del bloque C (ADR-005, hueco 5) ────────────────────── */

describe('cuotasDelBloque', () => {
  it('el bloque C exige 28 ítems y los demás 25', () => {
    expect(cuotasDelBloque('C').minimoItems).toBe(28);
    expect(cuotasDelBloque('A').minimoItems).toBe(25);
    expect(cuotasDelBloque('B').minimoItems).toBe(25);
    expect(cuotasDelBloque('D').minimoItems).toBe(25);
  });

  it('25 ítems bastan en el bloque D pero no en el C', () => {
    // §14.4 y el entregable del paso 16 piden ≥28 en el bloque C. Antes de
    // ADR-005 el mínimo era global y el paso 16 se declaraba cumplido con 25.
    const items = lote(25);
    expect(verificarCuotas(items, cuotasDelBloque('C'))).toContain(
      'tiene 25 ítems, el mínimo es 28',
    );
    expect(verificarCuotas(items, cuotasDelBloque('D'))).not.toContain(
      'tiene 25 ítems, el mínimo es 25',
    );
  });

  it('solo cambia el mínimo de ítems, no el resto de las reglas', () => {
    expect({ ...CUOTAS_BLOQUE_C, minimoItems: CUOTAS.minimoItems }).toEqual(CUOTAS);
  });
});
