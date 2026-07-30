import { describe, expect, it } from 'vitest';
import { validarCatalogo, type Catalogo } from '../validar-catalogo';
import type { Bloque, Item, Modulo, NivelCognitivo, Tarjeta, TipoItem } from '@/lib/tipos';

/* ─── Catálogo mínimo válido ──────────────────────────────────────── */

const EXPLICACION =
  'R1 corresponde al umbral aeróbico (VT1) y va del 65 al 75 %: es la zona de máxima ' +
  'oxidación de lípidos. El distractor más tentador es R0, porque las dos se perciben como ' +
  'suaves; la diferencia es que R1 sí produce adaptación aeróbica y R0 solo recupera. ' +
  'Dato para recordar: R1 es la zona del fondo largo del maratonista.';

function modulo(slug: string, extra: Partial<Modulo> = {}): Modulo {
  return {
    slug,
    bloque: 'C',
    orden: 1,
    titulo: 'Umbrales y zonas de entrenamiento',
    subtitulo: 'R0 a R3+, VT1 y VT2, MLSS y los modelos de distribución.',
    minutosEstimados: 45,
    objetivos: [
      'Ubicar las zonas R0, R1, R2 y R3 por su porcentaje de FCmáx',
      'Explicar el objetivo fisiológico de cada zona',
      'Definir MLSS y situarlo respecto a VT1 y VT2',
    ],
    conceptosClave: ['MLSS', 'VAM', 'HIIT'],
    prerequisitos: [],
    estadoContenido: 'en-preparacion',
    ...extra,
  };
}

/** Los 29 módulos que exige el validador: uno real y 28 de relleno. */
function veintinueveModulos(primero: Modulo): Modulo[] {
  const relleno = Array.from({ length: 28 }, (_, i) =>
    modulo(`d${i + 1}-relleno-${i + 1}`, { bloque: 'D', orden: i + 1 }),
  );
  return [primero, ...relleno];
}

const BLOQUES_VALIDOS: Bloque[] = [
  { id: 'A', numeroCartilla: 1, titulo: 'Ciencias Básicas', descripcion: 'x', pesoExamen: 0.2, color: 'a', modulos: [] },
  { id: 'B', numeroCartilla: 2, titulo: 'Pedagogía', descripcion: 'x', pesoExamen: 0.22, color: 'b', modulos: [] },
  { id: 'C', numeroCartilla: 3, titulo: 'Ciencias Aplicadas', descripcion: 'x', pesoExamen: 0.33, color: 'c', modulos: [] },
  { id: 'D', numeroCartilla: 4, titulo: 'Entrenamiento', descripcion: 'x', pesoExamen: 0.25, color: 'd', modulos: [] },
];

function catalogo(extra: Partial<Catalogo> = {}): Catalogo {
  return {
    bloques: BLOQUES_VALIDOS,
    modulos: veintinueveModulos(modulo('c5-umbrales-zonas')),
    erratas: [],
    glosario: [],
    datosDuros: [],
    banco: {},
    tarjetas: {},
    blueprints: {},
    slugsConTeoria: new Set(),
    ...extra,
  };
}

function item(id: string, extra: Partial<Item> = {}): Item {
  return {
    id,
    modulo: 'c5-umbrales-zonas',
    bloque: 'C',
    tipo: 'unica',
    nivel: 'recuerdo',
    dificultad: 1,
    enunciado: '¿En qué rango porcentual se ubica la zona R1?',
    explicacion: EXPLICACION,
    referencia: 'Cartilla 3, Tema 2, Subtema 2.6.1 — Umbral Ventilatorio 1',
    etiquetas: ['R1'],
    opciones: ['65–75 %', 'Menos del 65 %', '80–90 %', '90–95 %'],
    correcta: 0,
    ...extra,
  } as Item;
}

/** Un ítem válido del tipo pedido, para armar lotes que pasen las cuotas. */
function itemDeTipo(id: string, tipo: TipoItem, nivel: NivelCognitivo, dificultad: 1 | 2 | 3): Item {
  const base = { ...item(id), nivel, dificultad };
  switch (tipo) {
    case 'vf':
      return { ...base, tipo: 'vf', correcta: false } as Item;
    case 'multiple':
      return {
        ...base,
        tipo: 'multiple',
        opciones: ['R0', 'R1', 'R2', 'R3', 'R3+'],
        correctas: [0, 1],
      } as Item;
    case 'calculo':
      return {
        ...base,
        tipo: 'calculo',
        respuesta: 117,
        tolerancia: 1,
        unidad: 'lpm',
        pasos: ['FCmáx = 220 − 40 = 180 lpm', '180 × 0,65 = 117 lpm'],
      } as Item;
    default:
      return base;
  }
}

/** n ítems que cumplen las cuotas: 43 % recuerdo, 32 % comprensión, 25 %
 *  aplicación, las tres dificultades y cuatro tipos distintos. */
function loteValido(n: number, prefijo = 'C5', extra: Partial<Item> = {}): Item[] {
  const tipos: TipoItem[] = ['unica', 'multiple', 'vf', 'calculo'];
  const recuerdo = Math.ceil(n * 0.43);
  const comprension = Math.ceil(n * 0.32);
  return Array.from({ length: n }, (_, i) => {
    const nivel: NivelCognitivo =
      i < recuerdo ? 'recuerdo' : i < recuerdo + comprension ? 'comprension' : 'aplicacion';
    const id = `${prefijo}-${String(i + 1).padStart(3, '0')}`;
    return {
      ...itemDeTipo(id, tipos[i % tipos.length], nivel, ((i % 3) + 1) as 1 | 2 | 3),
      ...extra,
    } as Item;
  });
}

function tarjeta(id: string): Tarjeta {
  return {
    id,
    modulo: 'c5-umbrales-zonas',
    frente: '¿Qué marca el VT1?',
    reverso: 'El punto donde la ventilación crece más rápido que el consumo de oxígeno.',
    tipo: 'definicion',
  };
}

/* ─── Línea base ──────────────────────────────────────────────────── */

describe('validarCatalogo — línea base', () => {
  it('un catálogo de 29 módulos en preparación y sin contenido no da errores', async () => {
    const r = await validarCatalogo(catalogo());
    expect(r.errores).toEqual([]);
    expect(r.avisos).toHaveLength(29);
    expect(r.resumen).toEqual({
      modulos: 29,
      completos: 0,
      items: 0,
      tarjetas: 0,
      erratas: 0,
      glosario: 0,
    });
  });

  it('detecta que no hay 29 módulos', async () => {
    const r = await validarCatalogo(catalogo({ modulos: [modulo('c5-umbrales-zonas')] }));
    expect(r.errores).toContain('estructura — hay 1 módulos declarados, deben ser 29');
  });

  it('detecta pesos de bloque que no suman 1', async () => {
    const bloques = BLOQUES_VALIDOS.map((b) => (b.id === 'A' ? { ...b, pesoExamen: 0.5 } : b));
    const r = await validarCatalogo(catalogo({ bloques }));
    expect(r.errores.some((e) => e.includes('deben sumar 1'))).toBe(true);
  });

  it('sigue ubicando un ítem malo por id y mensaje', async () => {
    const r = await validarCatalogo(
      catalogo({
        banco: {
          'c5-umbrales-zonas': async () => [item('C5-001', { explicacion: 'corta' })],
        },
      }),
    );
    expect(r.errores).toContain(
      'banco/c5-umbrales-zonas/C5-001 — explicacion: la explicación debe tener al menos 200 caracteres',
    );
  });
});

/* ─── Hueco 1 · recorrido inverso del índice ──────────────────────── */

describe('ADR-005 hueco 1 — clave huérfana en el índice', () => {
  it('detecta una clave de BANCO que no corresponde a ningún módulo', async () => {
    // El typo real: 'c5-umbrales-zona' sin la s. Antes de ADR-005 esto salía
    // verde con "Todo en orden" y el archivo entero quedaba sin validar.
    const r = await validarCatalogo(
      catalogo({
        banco: {
          'c5-umbrales-zona': async () => [item('C5-001', { explicacion: 'corta' })],
        },
      }),
    );
    expect(r.errores).toContain(
      'banco — la clave "c5-umbrales-zona" del índice no corresponde a ningún módulo',
    );
  });

  it('detecta una clave huérfana en TARJETAS', async () => {
    const r = await validarCatalogo(
      catalogo({ tarjetas: { 'c5-umbrales-zona': async () => [tarjeta('C5-T01')] } }),
    );
    expect(r.errores).toContain(
      'tarjetas — la clave "c5-umbrales-zona" del índice no corresponde a ningún módulo',
    );
  });

  it('una clave correcta no produce el error', async () => {
    const r = await validarCatalogo(
      catalogo({ banco: { 'c5-umbrales-zonas': async () => [item('C5-001')] } }),
    );
    expect(r.errores.filter((e) => e.includes('no corresponde a ningún módulo'))).toEqual([]);
  });

  it('el mensaje nombra la clave escrita, no el módulo', async () => {
    const r = await validarCatalogo(
      catalogo({ banco: { 'c5-umbrales-zonaz': async () => [] } }),
    );
    const hallado = r.errores.find((e) => e.includes('no corresponde'));
    expect(hallado).toContain('c5-umbrales-zonaz');
  });
});

/* ─── Hueco 2 · teoría MDX ────────────────────────────────────────── */

describe('ADR-005 hueco 2 — teoría de un módulo completo', () => {
  const completo = modulo('c5-umbrales-zonas', { estadoContenido: 'completo' });

  /** Un módulo 'completo' que cumple todo menos lo que se esté probando. */
  function catalogoCompleto(extra: Partial<Catalogo> = {}): Catalogo {
    return catalogo({
      modulos: veintinueveModulos(completo),
      banco: { 'c5-umbrales-zonas': async () => loteValido(28) },
      tarjetas: {
        'c5-umbrales-zonas': async () =>
          Array.from({ length: 12 }, (_, i) => tarjeta(`C5-T${String(i + 1).padStart(2, '0')}`)),
      },
      glosario: [
        { termino: 'MLSS', definicion: 'Máximo estado estable de lactato, la intensidad más alta sostenible.', modulo: 'c5-umbrales-zonas' },
        { termino: 'VAM', definicion: 'Velocidad aeróbica máxima: la más baja a la que se alcanza el VO2máx.', modulo: 'c5-umbrales-zonas' },
        { termino: 'HIIT', definicion: 'Entrenamiento interválico de alta intensidad, cerca del VO2máx.', modulo: 'c5-umbrales-zonas' },
      ],
      ...extra,
    });
  }

  it('un módulo "completo" sin .mdx produce error', async () => {
    const r = await validarCatalogo(catalogoCompleto({ slugsConTeoria: new Set() }));
    expect(r.errores).toContain(
      'teoria/c5-umbrales-zonas — módulo "completo" sin teoría: falta content/teoria/c5-umbrales-zonas.mdx',
    );
  });

  it('con su .mdx presente no produce error', async () => {
    const r = await validarCatalogo(
      catalogoCompleto({ slugsConTeoria: new Set(['c5-umbrales-zonas']) }),
    );
    expect(r.errores).toEqual([]);
  });

  it('un módulo en preparación sin .mdx no produce error', async () => {
    // Los 28 módulos de los pasos 14–17 no deben gritar por falta de teoría.
    const r = await validarCatalogo(catalogo({ slugsConTeoria: new Set() }));
    expect(r.errores.filter((e) => e.startsWith('teoria/'))).toEqual([]);
  });
});

/* ─── Formato del mensaje: sin dos puntos huérfanos ───────────────── */

describe('formato del detalle del issue', () => {
  it('un error de campo lleva el prefijo "campo: "', async () => {
    const r = await validarCatalogo(
      catalogo({
        banco: { 'c5-umbrales-zonas': async () => [item('C5-001', { explicacion: 'corta' })] },
      }),
    );
    expect(r.errores).toContain(
      'banco/c5-umbrales-zonas/C5-001 — explicacion: la explicación debe tener al menos 200 caracteres',
    );
  });

  it('un refinamiento de colección no lleva prefijo ni dos puntos huérfanos', async () => {
    // §8 imprimía `C5-001 — : hay opciones duplicadas`, porque los issues de
    // refinamiento tienen `path` vacío. El ámbito ya identifica el ítem.
    const r = await validarCatalogo(
      catalogo({
        banco: {
          'c5-umbrales-zonas': async () => [
            item('C5-001', { opciones: ['a', 'a', 'b', 'c'] } as Partial<Item>),
          ],
        },
      }),
    );
    expect(r.errores).toContain('banco/c5-umbrales-zonas/C5-001 — hay opciones duplicadas');
    expect(r.errores.some((e) => e.includes('— :'))).toBe(false);
  });

  it('ningún error del catálogo contiene dos puntos huérfanos', async () => {
    const r = await validarCatalogo(
      catalogo({
        modulos: [{ ...modulo('c5-umbrales-zonas'), titulo: 'x' }],
        erratas: [{ id: 'X-01', tipo: 'contradiccion', tema: 'x', ubicacion: 'y', diceLaCartilla: 'z', loCorrecto: 'w', comoResponder: 'v', modulos: [] }],
        banco: {
          'c5-umbrales-zonas': async () => [
            item('C5-001', { opciones: ['a', 'a', 'b', 'c'] } as Partial<Item>),
          ],
        },
      }),
    );
    expect(r.errores.length).toBeGreaterThan(3);
    expect(r.errores.filter((e) => e.includes('— :'))).toEqual([]);
  });
});

/* ─── .mdx huérfano: AVISO, no error ─────────────────────────────── */

describe('ADR-005 — .mdx huérfano en content/teoria/', () => {
  it('un .mdx que no corresponde a ningún módulo produce AVISO, no error', async () => {
    const r = await validarCatalogo(catalogo({ slugsConTeoria: new Set(['d2-cargas']) }));
    expect(r.avisos).toContain('teoria — content/teoria/d2-cargas.mdx no corresponde a ningún módulo');
    expect(r.errores).toEqual([]);
  });

  it('un .mdx de un módulo declarado no produce aviso', async () => {
    // Tener teoría antes de voltear el módulo a 'completo' es el flujo normal.
    const r = await validarCatalogo(catalogo({ slugsConTeoria: new Set(['c5-umbrales-zonas']) }));
    expect(r.avisos.filter((a) => a.startsWith('teoria —'))).toEqual([]);
    expect(r.errores).toEqual([]);
  });

  it('distingue el .mdx huérfano de la clave huérfana: uno avisa, la otra falla', async () => {
    const r = await validarCatalogo(
      catalogo({
        slugsConTeoria: new Set(['c5-umbrales-zona']),
        banco: { 'c5-umbrales-zona': async () => [] },
      }),
    );
    expect(r.avisos.some((a) => a.includes('c5-umbrales-zona.mdx'))).toBe(true);
    expect(r.errores).toContain(
      'banco — la clave "c5-umbrales-zona" del índice no corresponde a ningún módulo',
    );
  });
});

/* ─── Hueco 5 · cuota del bloque C dentro del validador ───────────── */

describe('ADR-005 hueco 5 — el validador aplica la cuota por bloque', () => {
  it('un módulo completo del bloque C con 25 ítems incumple la cuota', async () => {
    const completo = modulo('c5-umbrales-zonas', { estadoContenido: 'completo', bloque: 'C' });
    const r = await validarCatalogo(
      catalogo({
        modulos: veintinueveModulos(completo),
        slugsConTeoria: new Set(['c5-umbrales-zonas']),
        banco: { 'c5-umbrales-zonas': async () => loteValido(25) },
      }),
    );
    expect(r.errores).toContain(
      'banco/c5-umbrales-zonas — cuota incumplida: tiene 25 ítems, el mínimo es 28',
    );
  });

  it('el mismo módulo en el bloque D con 25 ítems no incumple el mínimo', async () => {
    const completo = modulo('d2-carga', { estadoContenido: 'completo', bloque: 'D' });
    const r = await validarCatalogo(
      catalogo({
        modulos: [completo, ...veintinueveModulos(modulo('c5-umbrales-zonas')).slice(0, 28)],
        slugsConTeoria: new Set(['d2-carga']),
        banco: {
          'd2-carga': async () =>
            loteValido(25, 'D2', { modulo: 'd2-carga', bloque: 'D' }),
        },
      }),
    );
    expect(r.errores.filter((e) => e.includes('el mínimo es'))).toEqual([]);
  });
});
