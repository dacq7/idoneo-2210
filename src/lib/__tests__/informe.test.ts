import { describe, expect, it } from 'vitest';
import { ITEMS } from '@/content/banco/c5-umbrales-zonas';
import { BLOQUES, MODULOS } from '@/content/estructura';
import { esqIntento } from '@/lib/esquemas-progreso';
import {
  calcularDesglose,
  calcularPuntaje,
  calcularVeredicto,
  compararConAnterior,
  construirInforme,
  construirIntento,
  detectarPatrones,
  intentoAnteriorComparable,
  MIN_ITEMS_TEMA_PRIORITARIO,
  NOTA_VEREDICTO,
  temasPrioritarios,
} from '@/lib/informe';
import type {
  BloqueId,
  DesgloseIntento,
  IntentoSimulacro,
  Item,
  NivelCognitivo,
  RespuestaItem,
} from '@/lib/tipos';

/* ══════════════════════════════════════════════════════════════════
   Fixtures

   Sin reloj y sin mocks: el motor recibe todo por parámetro (§19, §22
   regla 6). Las fechas que aparecen son literales dentro de los datos.
   ══════════════════════════════════════════════════════════════════ */

function conteo(correctas: number, total: number) {
  return { correctas, total };
}

function desglose(cambios: Partial<DesgloseIntento> = {}): DesgloseIntento {
  return {
    porBloque: {
      A: conteo(0, 0),
      B: conteo(0, 0),
      C: conteo(0, 0),
      D: conteo(0, 0),
    },
    porModulo: {},
    porNivel: {
      recuerdo: conteo(0, 0),
      comprension: conteo(0, 0),
      aplicacion: conteo(0, 0),
    },
    ...cambios,
  };
}

function respuesta(itemId: string, correcta: boolean, valor: unknown = 0): RespuestaItem {
  return { itemId, respuesta: valor, correcta, segundos: 10, marcada: false };
}

function intento(cambios: Partial<IntentoSimulacro> = {}): IntentoSimulacro {
  return {
    id: '1785182400000',
    tipo: 'final',
    ambito: 'global',
    semilla: 1785182400000,
    iniciadoEn: '2026-07-30T20:00:00.000Z',
    terminadoEn: '2026-07-30T22:00:00.000Z',
    segundosUsados: 7200,
    totalItems: 2,
    itemIds: ['C5-001', 'C5-002'],
    respuestas: [respuesta('C5-001', true), respuesta('C5-002', false)],
    puntaje: 50,
    desglose: desglose(),
    ...cambios,
  };
}

describe('calcularPuntaje', () => {
  it('redondea sobre el TOTAL presentado, no sobre lo respondido', () => {
    // El invariante que hace comparable un auto-envío con un examen terminado a
    // mano: dejar en blanco no mejora el puntaje.
    const rs = [respuesta('a', true), respuesta('b', true)];
    expect(calcularPuntaje(rs, 2)).toBe(100);
    expect(calcularPuntaje(rs, 4)).toBe(50);
  });

  it('no revienta con total 0 ni con total negativo', () => {
    expect(calcularPuntaje([], 0)).toBe(0);
    expect(calcularPuntaje([], -3)).toBe(0);
  });

  it('redondea al entero más cercano', () => {
    // 1 de 3 = 33,33 → 33
    expect(calcularPuntaje([respuesta('a', true)], 3)).toBe(33);
    // 2 de 3 = 66,67 → 67
    expect(calcularPuntaje([respuesta('a', true), respuesta('b', true)], 3)).toBe(67);
  });
});

describe('calcularDesglose', () => {
  const items = ITEMS.slice(0, 6);

  it('cuenta por bloque, módulo y nivel', () => {
    const rs = items.map((it, i) => respuesta(it.id, i % 2 === 0));
    const d = calcularDesglose(items, rs);

    expect(d.porBloque.C.total).toBe(6);
    expect(d.porBloque.C.correctas).toBe(3);
    expect(d.porModulo['c5-umbrales-zonas'].total).toBe(6);
    const totalNivel = d.porNivel.recuerdo.total + d.porNivel.comprension.total + d.porNivel.aplicacion.total;
    expect(totalNivel).toBe(6);
  });

  it('SIEMPRE inicializa los 4 bloques y los 3 niveles, aunque no se toquen', () => {
    // Es lo que permite leer `porBloque.B.total` sin comprobar existencia, y lo
    // que `esqIntento` exige desde ADR-023. Sin esto, el informe reventaba con
    // «Cannot read properties of undefined» en la pantalla de resultados.
    const d = calcularDesglose(items, [respuesta(items[0].id, true)]);
    for (const b of ['A', 'B', 'C', 'D'] as BloqueId[]) expect(d.porBloque[b]).toEqual(conteo(b === 'C' ? 1 : 0, b === 'C' ? 1 : 0));
    for (const n of ['recuerdo', 'comprension', 'aplicacion'] as NivelCognitivo[]) {
      expect(d.porNivel[n]).toBeDefined();
    }
  });

  it('lo que produce PASA el esquema de intento', () => {
    // Cierra el círculo con ADR-023: si el motor produjera un desglose que el
    // esquema rechaza, el intento iría a cuarentena al releerlo y el usuario
    // perdería su historial sin que nada lo avisara.
    const d = calcularDesglose(items, items.map((it) => respuesta(it.id, true)));
    expect(esqIntento.safeParse(intento({ desglose: d })).success).toBe(true);
  });

  it('ignora una respuesta cuyo ítem ya no existe, sin lanzar', () => {
    // Pasa al revisar un intento viejo tras publicar contenido (pasos 15–17).
    const d = calcularDesglose(items, [respuesta('ZZ-999', true), respuesta(items[0].id, true)]);
    expect(d.porBloque.C.total).toBe(1);
  });

  it('no cuenta dos veces un ítem repetido en items', () => {
    const d = calcularDesglose([items[0], items[0]], [respuesta(items[0].id, true)]);
    expect(d.porBloque.C.total).toBe(1);
  });
});

describe('calcularVeredicto — las seis fronteras', () => {
  it('parte en 60, 75 y 85', () => {
    expect(calcularVeredicto(59).clave).toBe('riesgo');
    expect(calcularVeredicto(60).clave).toBe('camino');
    expect(calcularVeredicto(74).clave).toBe('camino');
    expect(calcularVeredicto(75).clave).toBe('listo');
    expect(calcularVeredicto(84).clave).toBe('listo');
    expect(calcularVeredicto(85).clave).toBe('solido');
  });

  it('cubre los extremos', () => {
    expect(calcularVeredicto(0).clave).toBe('riesgo');
    expect(calcularVeredicto(100).clave).toBe('solido');
  });

  it('cada veredicto trae mensaje accionable y token de color', () => {
    for (const p of [0, 65, 78, 95]) {
      const v = calcularVeredicto(p);
      expect(v.mensaje.length).toBeGreaterThan(40);
      expect(['exito', 'primary', 'aviso', 'destructive']).toContain(v.color);
    }
  });

  it('NUNCA afirma ser el corte oficial de COLEF, y la nota lo dice', () => {
    // Requisito de §22 regla 11 y de la licencia (§1): la app no conoce el corte
    // real del examen. El texto que lo aclara se comprueba aquí para que nadie
    // lo suavice sin que salte un test.
    expect(NOTA_VEREDICTO).toContain('criterios internos');
    expect(NOTA_VEREDICTO).toContain('COLEF');
    for (const p of [0, 60, 75, 85, 100]) {
      expect(calcularVeredicto(p).mensaje.toLowerCase()).not.toContain('aprobado');
    }
  });
});

describe('temasPrioritarios', () => {
  const modulos = MODULOS.map((m) => ({ slug: m.slug, titulo: m.titulo, bloque: m.bloque }));

  it('excluye módulos con menos de 3 ítems evaluados', () => {
    // Con 1 o 2 ítems, un 0 % dice más del muestreo que del usuario.
    const d = desglose({
      porModulo: {
        'c5-umbrales-zonas': conteo(0, 2),
        'd2-carga': conteo(1, 4),
      },
    });
    const temas = temasPrioritarios(d, modulos);
    expect(temas.map((t) => t.modulo)).toEqual(['d2-carga']);
  });

  it('MIN_ITEMS_TEMA_PRIORITARIO es el umbral, y es 3', () => {
    expect(MIN_ITEMS_TEMA_PRIORITARIO).toBe(3);
    const d = desglose({ porModulo: { 'd2-carga': conteo(0, 3) } });
    expect(temasPrioritarios(d, modulos)).toHaveLength(1);
  });

  it('ordena de peor a mejor y corta en 5', () => {
    const d = desglose({
      porModulo: Object.fromEntries(
        MODULOS.slice(0, 8).map((m, i) => [m.slug, conteo(i, 10)]),
      ),
    });
    const temas = temasPrioritarios(d, modulos);
    expect(temas).toHaveLength(5);
    expect(temas[0].porcentaje).toBeLessThanOrEqual(temas[4].porcentaje);
    expect(temas[0].modulo).toBe(MODULOS[0].slug);
  });

  it('desempata por más ítems evaluados: más evidencia va primero', () => {
    const d = desglose({
      porModulo: {
        'a1-celula': conteo(0, 3),
        'd2-carga': conteo(0, 9),
      },
    });
    expect(temasPrioritarios(d, modulos)[0].modulo).toBe('d2-carga');
  });

  it('es determinista: el mismo desglose da el mismo orden', () => {
    const d = desglose({
      porModulo: { 'a1-celula': conteo(2, 5), 'd2-carga': conteo(2, 5), 'b2-principios': conteo(2, 5) },
    });
    expect(temasPrioritarios(d, modulos)).toEqual(temasPrioritarios(d, modulos));
  });

  it('un módulo que ya no está en el catálogo no rompe: cae al slug', () => {
    const d = desglose({ porModulo: { 'zz-borrado': conteo(0, 5) } });
    const [tema] = temasPrioritarios(d, modulos);
    expect(tema.titulo).toBe('zz-borrado');
    expect(tema.bloque).toBe('A');
  });

  it('devuelve vacío cuando nada llega al mínimo', () => {
    expect(temasPrioritarios(desglose({ porModulo: { 'a1-celula': conteo(0, 2) } }), modulos)).toEqual([]);
  });
});

describe('detectarPatrones', () => {
  it('detecta "sabe las definiciones pero no las aplica"', () => {
    // El patrón que el producto pide por nombre: recuerdo alto, aplicación baja.
    const d = desglose({
      porNivel: {
        recuerdo: conteo(9, 10),
        comprension: conteo(0, 0),
        aplicacion: conteo(2, 10),
      },
    });
    const [mensaje] = detectarPatrones(d);
    expect(mensaje).toContain('definiciones');
    expect(mensaje).toContain('Práctica');
  });

  it('detecta el patrón inverso: razona bien y se le escapan los datos', () => {
    const d = desglose({
      porNivel: {
        recuerdo: conteo(2, 10),
        comprension: conteo(0, 0),
        aplicacion: conteo(9, 10),
      },
    });
    expect(detectarPatrones(d)[0]).toContain('datos exactos');
  });

  it('NO inventa un patrón cuando no lo hay', () => {
    // Un informe que siempre encuentra algo que decir enseña a no leerlo.
    const d = desglose({
      porNivel: {
        recuerdo: conteo(7, 10),
        comprension: conteo(7, 10),
        aplicacion: conteo(7, 10),
      },
    });
    expect(detectarPatrones(d)).toEqual([]);
  });

  it('exige muestra suficiente: con 4 ítems por nivel no afirma nada', () => {
    const d = desglose({
      porNivel: {
        recuerdo: conteo(4, 4),
        comprension: conteo(0, 0),
        aplicacion: conteo(0, 4),
      },
    });
    expect(detectarPatrones(d)).toEqual([]);
  });

  it('el umbral de diferencia es 25 puntos, no menos', () => {
    const casi = desglose({
      porNivel: { recuerdo: conteo(8, 10), comprension: conteo(0, 0), aplicacion: conteo(6, 10) },
    });
    expect(detectarPatrones(casi)).toEqual([]);
    const justo = desglose({
      porNivel: { recuerdo: conteo(8, 10), comprension: conteo(0, 0), aplicacion: conteo(55, 100) },
    });
    expect(detectarPatrones(justo).length).toBeGreaterThan(0);
  });

  it('detecta memorización sin comprensión', () => {
    const d = desglose({
      porNivel: {
        recuerdo: conteo(8, 10),
        comprension: conteo(2, 10),
        aplicacion: conteo(0, 0),
      },
    });
    expect(detectarPatrones(d).some((m) => m.includes('distractores'))).toBe(true);
  });

  it('detecta que el problema es cobertura, no un tema puntual', () => {
    const d = desglose({
      porBloque: {
        A: conteo(1, 10),
        B: conteo(2, 10),
        C: conteo(2, 10),
        D: conteo(9, 10),
      },
    });
    expect(detectarPatrones(d).some((m) => m.includes('cobertura'))).toBe(true);
  });
});

describe('compararConAnterior', () => {
  const actual = desglose({
    porBloque: { A: conteo(8, 10), B: conteo(5, 10), C: conteo(0, 0), D: conteo(3, 10) },
  });

  it('devuelve null sin intento anterior', () => {
    expect(compararConAnterior(actual, null)).toBeNull();
  });

  it('da la diferencia en puntos porcentuales, con signo', () => {
    const previo = desglose({
      porBloque: { A: conteo(5, 10), B: conteo(5, 10), C: conteo(9, 10), D: conteo(7, 10) },
    });
    const delta = compararConAnterior(actual, previo)!;
    expect(delta.A).toBe(30);
    expect(delta.B).toBe(0);
    expect(delta.D).toBe(-40);
  });

  it('null —no 0— cuando alguno de los dos no evaluó el bloque', () => {
    // «No comparable» y «no cambió» son cosas distintas: dar 0 sería inventar.
    const previo = desglose({
      porBloque: { A: conteo(5, 10), B: conteo(0, 0), C: conteo(9, 10), D: conteo(7, 10) },
    });
    const delta = compararConAnterior(actual, previo)!;
    expect(delta.B).toBeNull();
    expect(delta.C).toBeNull();
  });
});

describe('intentoAnteriorComparable', () => {
  const final1 = intento({ id: '1', tipo: 'final', ambito: 'global' });
  const final2 = intento({ id: '2', tipo: 'final', ambito: 'global' });
  const bloqueC = intento({ id: '3', tipo: 'bloque', ambito: 'C' });

  it('encuentra el anterior del mismo tipo y ámbito', () => {
    expect(intentoAnteriorComparable([final2, bloqueC, final1], final2)?.id).toBe('1');
  });

  it('no se compara consigo mismo', () => {
    expect(intentoAnteriorComparable([final1], final1)).toBeNull();
  });

  it('no compara un bloque con otro bloque distinto', () => {
    const bloqueD = intento({ id: '4', tipo: 'bloque', ambito: 'D' });
    expect(intentoAnteriorComparable([bloqueD, bloqueC], bloqueD)).toBeNull();
  });
});

describe('construirInforme', () => {
  const modulos = MODULOS.map((m) => ({ slug: m.slug, titulo: m.titulo, bloque: m.bloque }));
  const bloques = BLOQUES.map((b) => ({ id: b.id, titulo: b.titulo }));
  const items: Item[] = ITEMS.slice(0, 6);

  function intentoReal(correctas: number): IntentoSimulacro {
    const rs = items.map((it, i) => respuesta(it.id, i < correctas));
    return intento({
      totalItems: items.length,
      itemIds: items.map((it) => it.id),
      respuestas: rs,
      puntaje: calcularPuntaje(rs, items.length),
      desglose: calcularDesglose(items, rs),
    });
  }

  it('arma el informe completo de un intento real', () => {
    const inf = construirInforme(intentoReal(3), modulos, bloques, null);
    expect(inf.puntaje).toBe(50);
    expect(inf.veredicto.clave).toBe('riesgo');
    expect(inf.dominioPorBloque).toHaveLength(1);
    expect(inf.dominioPorBloque[0].bloque).toBe('C');
    expect(inf.deltaPorBloque).toBeNull();
  });

  it('OMITE los bloques que el intento no evaluó', () => {
    // Una barra al 0 % en un bloque sin ítems se lee como «lo hiciste fatal»,
    // que es lo contrario de lo que pasó.
    const inf = construirInforme(intentoReal(3), modulos, bloques, null);
    expect(inf.dominioPorBloque.map((b) => b.bloque)).not.toContain('A');
  });

  it('ordena el dominio por módulo de peor a mejor', () => {
    const inf = construirInforme(intentoReal(3), modulos, bloques, null);
    const pcts = inf.dominioPorModulo.map((m) => m.porcentaje);
    expect([...pcts].sort((a, b) => a - b)).toEqual(pcts);
  });

  it('cuenta como sin responder lo que quedó en blanco', () => {
    const rs = [respuesta('C5-001', false, null), respuesta('C5-002', true, 0)];
    const inf = construirInforme(
      intento({ respuestas: rs, desglose: calcularDesglose(items, rs) }),
      modulos,
      bloques,
      null,
    );
    expect(inf.sinResponder).toBe(1);
  });

  it('NO revienta con un desglose al que le faltan bloques', () => {
    // Regresión de ADR-023 por la otra punta: aunque el esquema ahora exige las
    // cuatro claves, el motor no debe depender de que alguien haya validado.
    // Vía de entrada histórica: un respaldo importado en /ajustes.
    const cojo = {
      porBloque: { A: conteo(1, 2) },
      porModulo: {},
      porNivel: { recuerdo: conteo(1, 2) },
    } as unknown as DesgloseIntento;
    expect(() => construirInforme(intento({ desglose: cojo }), modulos, bloques, null)).not.toThrow();
  });

  it('compara con el intento anterior cuando lo hay', () => {
    const previo = intentoReal(6);
    const actual = intentoReal(0);
    const inf = construirInforme(actual, modulos, bloques, previo);
    expect(inf.deltaPorBloque?.C).toBe(-100);
  });
});

/* ══════════════════════════════════════════════════════════════════
   ADR-023 — el esquema exige las claves que el informe lee por nombre

   Sin estos tests, revertir `porBloque` a `z.record(esqConteo)` —que es
   lo que dice §5 literal— no rompería nada visible, y el crash volvería
   por la puerta de `/ajustes`: `importarJSON` aceptaría un respaldo con
   un desglose cojo y `/resultados` se caería al leer `porBloque.B`.
   ══════════════════════════════════════════════════════════════════ */

describe('esqIntento — desglose completo (ADR-023)', () => {
  const completo = () => {
    const items = ITEMS.slice(0, 4);
    const rs = items.map((it, i) => respuesta(it.id, i % 2 === 0));
    return intento({ desglose: calcularDesglose(items, rs) });
  };

  it('acepta un desglose con los 4 bloques y los 3 niveles', () => {
    expect(esqIntento.safeParse(completo()).success).toBe(true);
  });

  it('RECHAZA un intento al que le faltan bloques', () => {
    const cojo = completo();
    const desgloseCojo = {
      ...cojo.desglose,
      porBloque: { A: conteo(1, 2) },
    };
    expect(esqIntento.safeParse({ ...cojo, desglose: desgloseCojo }).success).toBe(false);
  });

  it('RECHAZA un intento al que le faltan niveles', () => {
    const cojo = completo();
    const desgloseCojo = {
      ...cojo.desglose,
      porNivel: { recuerdo: conteo(1, 2) },
    };
    expect(esqIntento.safeParse({ ...cojo, desglose: desgloseCojo }).success).toBe(false);
  });

  it('porModulo SIGUE siendo abierto: sus claves son slugs y cambian con el contenido', () => {
    const abierto = completo();
    const conModulos = {
      ...abierto,
      desglose: {
        ...abierto.desglose,
        porModulo: { 'c5-umbrales-zonas': conteo(2, 4), 'modulo-que-no-existe-aun': conteo(0, 1) },
      },
    };
    expect(esqIntento.safeParse(conModulos).success).toBe(true);
  });
});

/* ══════════════════════════════════════════════════════════════════
   construirIntento — lo que se PERSISTE

   Su radio de daño es el estado entero: si lo que produce dejara de
   satisfacer `esqIntento`, `esqEstadoProgreso` rechaza el estado completo
   y se va a cuarentena (ADR-008 + ADR-023). El usuario perdería de vista
   módulos, cola de repaso e historial — no un intento.
   ══════════════════════════════════════════════════════════════════ */

describe('construirIntento', () => {
  const INICIO = 1_785_182_400_000;
  const items = ITEMS.slice(0, 4);

  const sesion = {
    intentoId: String(INICIO),
    tipo: 'final' as const,
    ambito: 'global',
    semilla: INICIO,
    iniciadoEnMs: INICIO,
    itemIds: items.map((it) => it.id),
  };

  const detalle = items.map((it, i) => ({
    item: it,
    valor: i,
    correcta: i < 3,
    segundos: 12,
    marcada: false,
  }));

  it('produce un intento que PASA `esqIntento`', () => {
    const intento = construirIntento(sesion, detalle, items.length, INICIO + 7_200_000);
    expect(esqIntento.safeParse(intento).success).toBe(true);
  });

  it('sobrevive al viaje completo por JSON, que es como se guarda', () => {
    // `localStorage` guarda texto: si algo no serializara —un `undefined`, un
    // `NaN`— el intento volvería distinto y el estado iría a cuarentena.
    const intento = construirIntento(sesion, detalle, items.length, INICIO + 7_200_000);
    const ida = JSON.parse(JSON.stringify(intento));
    expect(esqIntento.safeParse(ida).success).toBe(true);
    expect(ida).toEqual(intento);
  });

  it('el id es la semilla en string, que es lo que direcciona /resultados', () => {
    const intento = construirIntento(sesion, detalle, items.length, INICIO + 1000);
    expect(intento.id).toBe(String(intento.semilla));
  });

  it('segundosUsados es tiempo REAL de reloj, no la suma por ítem', () => {
    // La suma por ítem daría 48 s; el examen duró dos horas. En un cronometrado
    // lo que cuenta es cuánto duró, incluidas las pausas.
    const intento = construirIntento(sesion, detalle, items.length, INICIO + 7_200_000);
    expect(intento.segundosUsados).toBe(7200);
  });

  it('no da segundos negativos si el reloj se movió hacia atrás', () => {
    const intento = construirIntento(sesion, detalle, items.length, INICIO - 10_000);
    expect(intento.segundosUsados).toBe(0);
  });

  it('el puntaje sale sobre el total presentado, no sobre lo respondido', () => {
    const intento = construirIntento(sesion, detalle, 8, INICIO + 1000);
    expect(intento.puntaje).toBe(38); // 3 de 8
  });

  it('el desglose que arma trae las 4 claves de bloque y las 3 de nivel', () => {
    const intento = construirIntento(sesion, detalle, items.length, INICIO + 1000);
    expect(Object.keys(intento.desglose.porBloque).sort()).toEqual(['A', 'B', 'C', 'D']);
    expect(Object.keys(intento.desglose.porNivel).sort()).toEqual([
      'aplicacion',
      'comprension',
      'recuerdo',
    ]);
  });

  it('conserva itemIds sin aliasar el array de la sesión', () => {
    // Si compartieran referencia, mutar la sesión mutaría un intento ya cerrado.
    const intento = construirIntento(sesion, detalle, items.length, INICIO + 1000);
    expect(intento.itemIds).toEqual(sesion.itemIds);
    expect(intento.itemIds).not.toBe(sesion.itemIds);
  });

  it('un intento sin ninguna respuesta correcta sigue siendo válido', () => {
    const enBlanco = items.map((it) => ({
      item: it,
      valor: null,
      correcta: false,
      segundos: 0,
      marcada: false,
    }));
    const intento = construirIntento(sesion, enBlanco, items.length, INICIO + 100);
    expect(intento.puntaje).toBe(0);
    expect(esqIntento.safeParse(intento).success).toBe(true);
  });
});
