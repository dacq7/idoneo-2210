import { describe, expect, it } from 'vitest';
import { esqTarjetaSRS } from '@/lib/esquemas';
import { sumarDias } from '@/lib/fechas';
import {
  colaDelDia,
  crearTarjetaSRS,
  encolar,
  FACILIDAD_INICIAL,
  FACILIDAD_MAX,
  FACILIDAD_MIN,
  LIMITE_COLA_DIARIA,
  MAX_INTERVALO_DIAS,
  programarSiguiente,
  registrarRevision,
  resumirRepaso,
} from '@/lib/srs';
import type { TarjetaSRS } from '@/lib/tipos';

/* ══════════════════════════════════════════════════════════════════
   Fixtures

   Fechas literales, nunca `new Date()` ni mocks de reloj: estas funciones
   reciben `hoy` como parámetro justamente para no necesitarlos (§19, §22
   regla 6). Si un test de este archivo necesitara un mock, sería la señal
   de que el motor dejó de ser puro.
   ══════════════════════════════════════════════════════════════════ */

const HOY = '2026-07-30';
const MANANA = '2026-07-31';

/** Los ids imitan los reales ('C5-T07' para tarjeta, 'C5-014' para ítem)
 *  porque varias aserciones pasan por `esqTarjetaSRS`, que exige mín. 3 caracteres. */
function tarjeta(cambios: Partial<TarjetaSRS> = {}): TarjetaSRS {
  return {
    id: 'C5-T01',
    facilidad: FACILIDAD_INICIAL,
    intervaloDias: 0,
    repeticiones: 0,
    proximaRevision: HOY,
    ...cambios,
  };
}

function comoCola(...tarjetas: TarjetaSRS[]): Record<string, TarjetaSRS> {
  return Object.fromEntries(tarjetas.map((t) => [t.id, t]));
}

/** El contrato de persistencia: si una tarjeta no pasa este esquema,
 *  `intentarMigrar` rechaza el EstadoProgreso ENTERO y el progreso del
 *  usuario se va a cuarentena. Ver ADR-008 y §22 regla 12. */
function esPersistible(t: TarjetaSRS) {
  return esqTarjetaSRS.safeParse(t);
}

/* ══════════════════════════════════════════════════════════════════
   crearTarjetaSRS
   ══════════════════════════════════════════════════════════════════ */

describe('crearTarjetaSRS', () => {
  it('nace con la facilidad inicial y sin repeticiones', () => {
    expect(crearTarjetaSRS('C5-T01', HOY)).toEqual({
      id: 'C5-T01',
      facilidad: 2.5,
      intervaloDias: 0,
      repeticiones: 0,
      proximaRevision: HOY,
    });
  });

  it('vence el mismo día en que se crea: entra en la cola de hoy', () => {
    const cola = comoCola(crearTarjetaSRS('C5-T01', HOY));
    expect(colaDelDia(cola, HOY)).toHaveLength(1);
  });

  it('la tarjeta recién creada es persistible', () => {
    expect(esPersistible(crearTarjetaSRS('C5-T01', HOY)).success).toBe(true);
  });

  it('normaliza un ISO completo a YYYY-MM-DD', () => {
    // Un handler que pase `new Date().toISOString()` en vez de `soloFecha(...)`
    // no puede escribir una fecha que el esquema rechace.
    const t = crearTarjetaSRS('C5-T01', '2026-07-30T15:42:11.000Z');
    expect(t.proximaRevision).toBe(HOY);
    expect(esPersistible(t).success).toBe(true);
  });

  it('una tarjeta creada con ISO completo sigue entrando en la cola de su propio día', () => {
    // Sin normalizar, '2026-07-30T15:42:11.000Z' <= '2026-07-30' es false
    // como string y la tarjeta queda invisible para siempre.
    const cola = encolar({}, ['C5-T01'], '2026-07-30T15:42:11.000Z');
    expect(colaDelDia(cola, HOY)).toHaveLength(1);
    expect(resumirRepaso(cola, HOY)).toEqual({
      pendientesHoy: 1,
      totalEnCola: 1,
      proximoEnDias: null,
    });
  });
});

/* ══════════════════════════════════════════════════════════════════
   programarSiguiente — al fallar
   ══════════════════════════════════════════════════════════════════ */

describe('programarSiguiente · al fallar', () => {
  it('reinicia repeticiones, pone el intervalo en 1 día y baja la facilidad 0,2', () => {
    expect(programarSiguiente(tarjeta({ repeticiones: 4, intervaloDias: 22 }), false, HOY)).toEqual({
      id: 'C5-T01',
      facilidad: 2.3,
      intervaloDias: 1,
      repeticiones: 0,
      proximaRevision: MANANA,
    });
  });

  it('reprograma para mañana, no para hoy', () => {
    expect(programarSiguiente(tarjeta(), false, HOY).proximaRevision).toBe(sumarDias(HOY, 1));
  });

  it('no muta la tarjeta que recibe', () => {
    const original = tarjeta({ repeticiones: 4, intervaloDias: 22 });
    const copia = { ...original };
    programarSiguiente(original, false, HOY);
    expect(original).toEqual(copia);
  });

  it('la facilidad no baja de 1,3 por muchos fallos que se acumulen', () => {
    let t = tarjeta();
    for (let i = 0; i < 20; i++) t = programarSiguiente(t, false, HOY);
    expect(t.facilidad).toBe(FACILIDAD_MIN);
  });

  it('desde el suelo, fallar otra vez lo deja en el suelo', () => {
    expect(programarSiguiente(tarjeta({ facilidad: FACILIDAD_MIN }), false, HOY).facilidad).toBe(1.3);
  });

  it('cada paso hacia el suelo es persistible', () => {
    let t = tarjeta();
    for (let i = 0; i < 20; i++) {
      t = programarSiguiente(t, false, HOY);
      expect(esPersistible(t).success).toBe(true);
    }
  });
});

/* ══════════════════════════════════════════════════════════════════
   programarSiguiente — al acertar
   ══════════════════════════════════════════════════════════════════ */

describe('programarSiguiente · al acertar', () => {
  it('la 1.ª repetición programa a 1 día', () => {
    expect(programarSiguiente(tarjeta(), true, HOY)).toEqual({
      id: 'C5-T01',
      facilidad: 2.6,
      intervaloDias: 1,
      repeticiones: 1,
      proximaRevision: sumarDias(HOY, 1),
    });
  });

  it('la 2.ª repetición programa a 3 días', () => {
    const t = programarSiguiente(tarjeta({ repeticiones: 1, intervaloDias: 1, facilidad: 2.6 }), true, HOY);
    expect(t.intervaloDias).toBe(3);
    expect(t.repeticiones).toBe(2);
    expect(t.proximaRevision).toBe(sumarDias(HOY, 3));
  });

  it('de la 3.ª en adelante multiplica el intervalo por la facilidad', () => {
    // Intervalo 3 y facilidad 2,7 → nueva facilidad 2,8 → round(3 × 2,8) = 8
    const t = programarSiguiente(tarjeta({ repeticiones: 2, intervaloDias: 3, facilidad: 2.7 }), true, HOY);
    expect(t.intervaloDias).toBe(8);
    expect(t.proximaRevision).toBe(sumarDias(HOY, 8));
  });

  it('multiplica por la facilidad NUEVA, no por la vieja', () => {
    // Intervalo 10, facilidad 1,3 → nueva 1,4. Con la nueva: 14. Con la vieja: 13.
    expect(
      programarSiguiente(tarjeta({ repeticiones: 3, intervaloDias: 10, facilidad: 1.3 }), true, HOY)
        .intervaloDias,
    ).toBe(14);
  });

  it('multiplica el intervalo VIEJO, no el que acaba de calcular', () => {
    // Intervalo 20, facilidad 2,0 → nueva 2,1 → round(20 × 2,1) = 42.
    expect(
      programarSiguiente(tarjeta({ repeticiones: 3, intervaloDias: 20, facilidad: 2.0 }), true, HOY)
        .intervaloDias,
    ).toBe(42);
  });

  it('la secuencia canónica de intervalos es 1 · 3 · 8 · 22', () => {
    let t = tarjeta();
    const intervalos: number[] = [];
    for (let i = 0; i < 4; i++) {
      t = programarSiguiente(t, true, HOY);
      intervalos.push(t.intervaloDias);
    }
    expect(intervalos).toEqual([1, 3, 8, 22]);
  });

  it('la facilidad sube 0,1 por acierto y no pasa de 2,8', () => {
    let t = tarjeta();
    for (let i = 0; i < 20; i++) t = programarSiguiente(t, true, HOY);
    expect(t.facilidad).toBe(FACILIDAD_MAX);
  });

  it('no muta la tarjeta que recibe', () => {
    const original = tarjeta({ repeticiones: 2, intervaloDias: 3, facilidad: 2.7 });
    const copia = { ...original };
    programarSiguiente(original, true, HOY);
    expect(original).toEqual(copia);
  });

  it('nunca programa un intervalo menor a 1 día', () => {
    // Un respaldo con repeticiones altas e intervalo 0 pasa `esqTarjetaSRS`
    // (intervaloDias solo exige min(0)). Si el intervalo saliera 0, la
    // próxima revisión sería HOY otra vez y la cola no drenaría jamás.
    const importada = tarjeta({ repeticiones: 5, intervaloDias: 0 });
    expect(esPersistible(importada).success).toBe(true);

    const t = programarSiguiente(importada, true, HOY);
    expect(t.intervaloDias).toBeGreaterThanOrEqual(1);
    expect(t.proximaRevision).not.toBe(HOY);
  });
});

/* ══════════════════════════════════════════════════════════════════
   programarSiguiente — invariantes de persistencia

   El motor puede producir cualquier estado; el que no pase `esqTarjetaSRS`
   manda TODO el progreso del usuario a cuarentena. Estos tests atan el
   motor a su esquema.
   ══════════════════════════════════════════════════════════════════ */

describe('programarSiguiente · invariantes de persistencia', () => {
  it('mantiene la facilidad dentro de [1,3 · 2,8] en una secuencia larga y mezclada', () => {
    let t = tarjeta();
    // Patrón determinista que alterna rachas de aciertos y de fallos.
    for (let i = 0; i < 300; i++) {
      t = programarSiguiente(t, i % 7 !== 0, HOY);
      expect(t.facilidad).toBeGreaterThanOrEqual(FACILIDAD_MIN);
      expect(t.facilidad).toBeLessThanOrEqual(FACILIDAD_MAX);
      expect(esPersistible(t).success).toBe(true);
    }
  });

  it('la facilidad nunca arrastra más de 2 decimales', () => {
    let t = tarjeta();
    for (let i = 0; i < 300; i++) {
      t = programarSiguiente(t, i % 3 === 0, HOY);
      expect(Math.round(t.facilidad * 100)).toBeCloseTo(t.facilidad * 100, 9);
    }
  });

  it('25 aciertos seguidos no revientan ni producen una fecha imposible', () => {
    // Con la facilidad en el techo el intervalo crece exponencialmente
    // (3 · 8 · 22 · 62 · …). Sin tope, `sumarDias` acaba construyendo un Date
    // fuera de rango y `toISOString()` lanza RangeError dentro de un handler;
    // antes de eso ya emite años expandidos ('+112632-03') que el esquema rechaza.
    let t = tarjeta();
    for (let i = 0; i < 25; i++) {
      t = programarSiguiente(t, true, HOY);
      expect(esPersistible(t).success).toBe(true);
      expect(t.proximaRevision).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
    expect(t.intervaloDias).toBeLessThanOrEqual(MAX_INTERVALO_DIAS);
  });

  it('un intervalo absurdo heredado de un respaldo no rompe la siguiente revisión', () => {
    // `esqTarjetaSRS` no le pone techo a intervaloDias: este respaldo es válido.
    const importada = tarjeta({ repeticiones: 9, intervaloDias: 40_000_000 });
    expect(esPersistible(importada).success).toBe(true);

    const t = programarSiguiente(importada, true, HOY);
    expect(esPersistible(t).success).toBe(true);
    expect(t.intervaloDias).toBeLessThanOrEqual(MAX_INTERVALO_DIAS);
  });

  it('fallar después de un intervalo tope vuelve a dejarlo en 1 día', () => {
    const t = programarSiguiente(tarjeta({ repeticiones: 9, intervaloDias: MAX_INTERVALO_DIAS }), false, HOY);
    expect(t.intervaloDias).toBe(1);
    expect(t.proximaRevision).toBe(MANANA);
  });
});

/* ══════════════════════════════════════════════════════════════════
   registrarRevision
   ══════════════════════════════════════════════════════════════════ */

describe('registrarRevision', () => {
  it('crea la entrada si el elemento no estaba en la cola', () => {
    const cola = registrarRevision({}, 'C5-014', true, HOY);
    expect(cola['C5-014']).toMatchObject({ id: 'C5-014', repeticiones: 1, intervaloDias: 1 });
  });

  it('un elemento nuevo que se falla queda programado para mañana', () => {
    expect(registrarRevision({}, 'C5-014', false, HOY)['C5-014']).toMatchObject({
      repeticiones: 0,
      intervaloDias: 1,
      facilidad: 2.3,
      proximaRevision: MANANA,
    });
  });

  it('avanza el progreso del elemento que ya estaba', () => {
    const cola = comoCola(tarjeta({ repeticiones: 2, intervaloDias: 3, facilidad: 2.7 }));
    expect(registrarRevision(cola, 'C5-T01', true, HOY)['C5-T01']).toMatchObject({
      repeticiones: 3,
      intervaloDias: 8,
    });
  });

  it('no muta la cola original ni la tarjeta original', () => {
    const original = tarjeta({ repeticiones: 2, intervaloDias: 3 });
    const cola = comoCola(original);
    const instantanea = JSON.stringify(cola);

    registrarRevision(cola, 'C5-T01', true, HOY);

    expect(JSON.stringify(cola)).toBe(instantanea);
    expect(original.repeticiones).toBe(2);
  });

  it('deja intactas las demás entradas de la cola', () => {
    const otra = tarjeta({ id: 'C5-T02', repeticiones: 5, intervaloDias: 40 });
    const cola = comoCola(tarjeta(), otra);
    expect(registrarRevision(cola, 'C5-T01', true, HOY)['C5-T02']).toEqual(otra);
  });
});

/* ══════════════════════════════════════════════════════════════════
   encolar
   ══════════════════════════════════════════════════════════════════ */

describe('encolar', () => {
  it('añade los elementos que no estaban, venciendo hoy', () => {
    const cola = encolar({}, ['C5-T01', 'C5-T02'], HOY);
    expect(Object.keys(cola)).toEqual(['C5-T01', 'C5-T02']);
    expect(cola['C5-T01'].proximaRevision).toBe(HOY);
  });

  it('es idempotente: no reinicia el progreso de un elemento que ya estaba', () => {
    // La regla que impide que ver una tarjeta dos veces borre su progreso.
    const avanzada = tarjeta({ repeticiones: 6, intervaloDias: 40, facilidad: 2.8, proximaRevision: '2026-09-08' });
    const cola = encolar(comoCola(avanzada), ['C5-T01'], HOY);
    expect(cola['C5-T01']).toEqual(avanzada);
  });

  it('encolar dos veces seguidas da el mismo resultado', () => {
    const una = encolar({}, ['C5-T01', 'C5-T02'], HOY);
    expect(encolar(una, ['C5-T01', 'C5-T02'], '2026-08-15')).toEqual(una);
  });

  it('mezcla nuevos y existentes sin tocar a los existentes', () => {
    const avanzada = tarjeta({ repeticiones: 6, intervaloDias: 40 });
    const cola = encolar(comoCola(avanzada), ['C5-T01', 'C5-T02'], HOY);
    expect(cola['C5-T01']).toEqual(avanzada);
    expect(cola['C5-T02'].repeticiones).toBe(0);
  });

  it('ids repetidos en la misma llamada crean una sola entrada', () => {
    const cola = encolar({}, ['C5-T01', 'C5-T01', 'C5-T01'], HOY);
    expect(Object.keys(cola)).toEqual(['C5-T01']);
  });

  it('no muta la cola original', () => {
    const cola = comoCola(tarjeta());
    encolar(cola, ['C5-T02'], HOY);
    expect(Object.keys(cola)).toEqual(['C5-T01']);
  });

  it('una lista vacía devuelve una cola equivalente', () => {
    const cola = comoCola(tarjeta());
    expect(encolar(cola, [], HOY)).toEqual(cola);
  });
});

/* ══════════════════════════════════════════════════════════════════
   colaDelDia
   ══════════════════════════════════════════════════════════════════ */

describe('colaDelDia', () => {
  it('incluye las vencidas y las de hoy, y excluye las futuras', () => {
    const cola = comoCola(
      tarjeta({ id: 'C5-T01', proximaRevision: '2026-07-25' }),
      tarjeta({ id: 'C5-T02', proximaRevision: HOY }),
      tarjeta({ id: 'C5-T03', proximaRevision: MANANA }),
      tarjeta({ id: 'C5-T04', proximaRevision: '2026-12-31' }),
    );
    expect(colaDelDia(cola, HOY).map((t) => t.id)).toEqual(['C5-T01', 'C5-T02']);
  });

  it('prioriza las más atrasadas', () => {
    const cola = comoCola(
      tarjeta({ id: 'C5-T01', proximaRevision: HOY }),
      tarjeta({ id: 'C5-T02', proximaRevision: '2026-07-01' }),
      tarjeta({ id: 'C5-T03', proximaRevision: '2026-07-20' }),
    );
    expect(colaDelDia(cola, HOY).map((t) => t.id)).toEqual(['C5-T02', 'C5-T03', 'C5-T01']);
  });

  it('desempata por id cuando el atraso es el mismo', () => {
    const cola = comoCola(
      tarjeta({ id: 'C5-T09', proximaRevision: HOY }),
      tarjeta({ id: 'C5-T02', proximaRevision: HOY }),
      tarjeta({ id: 'C5-T05', proximaRevision: HOY }),
    );
    expect(colaDelDia(cola, HOY).map((t) => t.id)).toEqual(['C5-T02', 'C5-T05', 'C5-T09']);
  });

  it('el orden no depende del orden de inserción de la cola', () => {
    const a = tarjeta({ id: 'C5-T01', proximaRevision: HOY });
    const b = tarjeta({ id: 'C5-T02', proximaRevision: HOY });
    const c = tarjeta({ id: 'C5-T03', proximaRevision: HOY });
    expect(colaDelDia(comoCola(a, b, c), HOY).map((t) => t.id)).toEqual(
      colaDelDia(comoCola(c, b, a), HOY).map((t) => t.id),
    );
  });

  it('respeta el límite diario de 30', () => {
    const cola = comoCola(
      ...Array.from({ length: 45 }, (_, i) =>
        tarjeta({ id: `C5-T${String(i).padStart(2, '0')}`, proximaRevision: HOY }),
      ),
    );
    expect(LIMITE_COLA_DIARIA).toBe(30);
    expect(colaDelDia(cola, HOY)).toHaveLength(30);
  });

  it('cuando recorta, conserva las más atrasadas', () => {
    // 5 muy atrasadas + 40 de hoy, con límite 5.
    const cola = comoCola(
      ...Array.from({ length: 5 }, (_, i) =>
        tarjeta({ id: `C5-T0${i}`, proximaRevision: '2026-07-01' }),
      ),
      ...Array.from({ length: 40 }, (_, i) =>
        tarjeta({ id: `C5-T9${String(i).padStart(2, '0')}`, proximaRevision: HOY }),
      ),
    );
    expect(colaDelDia(cola, HOY, 5).map((t) => t.id)).toEqual([
      'C5-T00',
      'C5-T01',
      'C5-T02',
      'C5-T03',
      'C5-T04',
    ]);
  });

  it('acepta un límite explícito', () => {
    const cola = comoCola(
      ...Array.from({ length: 10 }, (_, i) => tarjeta({ id: `C5-T0${i}`, proximaRevision: HOY })),
    );
    expect(colaDelDia(cola, HOY, 3)).toHaveLength(3);
    expect(colaDelDia(cola, HOY, 0)).toHaveLength(0);
  });

  it('una cola vacía devuelve una lista vacía', () => {
    expect(colaDelDia({}, HOY)).toEqual([]);
  });

  it('una cola sin nada vencido devuelve una lista vacía', () => {
    expect(colaDelDia(comoCola(tarjeta({ proximaRevision: MANANA })), HOY)).toEqual([]);
  });

  it('no muta la cola que recibe', () => {
    const cola = comoCola(
      tarjeta({ id: 'C5-T01', proximaRevision: HOY }),
      tarjeta({ id: 'C5-T02', proximaRevision: '2026-07-01' }),
    );
    const instantanea = JSON.stringify(cola);
    colaDelDia(cola, HOY);
    expect(JSON.stringify(cola)).toBe(instantanea);
  });
});

/* ══════════════════════════════════════════════════════════════════
   resumirRepaso
   ══════════════════════════════════════════════════════════════════ */

describe('resumirRepaso', () => {
  it('cuenta las pendientes de hoy y el total de la cola', () => {
    const cola = comoCola(
      tarjeta({ id: 'C5-T01', proximaRevision: '2026-07-20' }),
      tarjeta({ id: 'C5-T02', proximaRevision: HOY }),
      tarjeta({ id: 'C5-T03', proximaRevision: '2026-08-05' }),
    );
    expect(resumirRepaso(cola, HOY)).toEqual({
      pendientesHoy: 2,
      totalEnCola: 3,
      proximoEnDias: 6,
    });
  });

  it('proximoEnDias es la futura más cercana, no la primera de la cola', () => {
    const cola = comoCola(
      tarjeta({ id: 'C5-T01', proximaRevision: '2026-09-30' }),
      tarjeta({ id: 'C5-T02', proximaRevision: '2026-08-02' }),
      tarjeta({ id: 'C5-T03', proximaRevision: '2026-08-20' }),
    );
    expect(resumirRepaso(cola, HOY).proximoEnDias).toBe(3);
  });

  it('una cola vacía no tiene próximo repaso', () => {
    expect(resumirRepaso({}, HOY)).toEqual({
      pendientesHoy: 0,
      totalEnCola: 0,
      proximoEnDias: null,
    });
  });

  it('sin futuras, proximoEnDias es null aunque la cola no esté vacía', () => {
    // El estado vacío honesto de /repaso distingue estos dos casos con
    // pendientesHoy: aquí hay 2 por hacer, así que null no significa
    // "no hay nada", significa "no hay nada DESPUÉS de hoy".
    const cola = comoCola(
      tarjeta({ id: 'C5-T01', proximaRevision: HOY }),
      tarjeta({ id: 'C5-T02', proximaRevision: '2026-07-01' }),
    );
    expect(resumirRepaso(cola, HOY)).toEqual({
      pendientesHoy: 2,
      totalEnCola: 2,
      proximoEnDias: null,
    });
  });

  it('el día en que no queda nada pendiente informa cuándo vuelve a haber', () => {
    const cola = comoCola(tarjeta({ proximaRevision: '2026-08-06' }));
    expect(resumirRepaso(cola, HOY)).toEqual({
      pendientesHoy: 0,
      totalEnCola: 1,
      proximoEnDias: 7,
    });
  });

  it('no muta la cola que recibe', () => {
    const cola = comoCola(tarjeta({ proximaRevision: '2026-08-06' }));
    const instantanea = JSON.stringify(cola);
    resumirRepaso(cola, HOY);
    expect(JSON.stringify(cola)).toBe(instantanea);
  });
});

/* ══════════════════════════════════════════════════════════════════
   Recorrido de extremo a extremo

   Un ciclo realista: se encola, se falla, se acierta y se comprueba que
   la cola del día refleja cada paso.
   ══════════════════════════════════════════════════════════════════ */

describe('ciclo completo de una tarjeta', () => {
  it('fallar la devuelve mañana; acertar la aleja progresivamente', () => {
    let cola = encolar({}, ['C5-T01'], HOY);
    expect(colaDelDia(cola, HOY).map((t) => t.id)).toEqual(['C5-T01']);

    // Falla hoy → vuelve mañana, y hoy ya no aparece.
    cola = registrarRevision(cola, 'C5-T01', false, HOY);
    expect(colaDelDia(cola, HOY)).toEqual([]);
    expect(colaDelDia(cola, MANANA).map((t) => t.id)).toEqual(['C5-T01']);

    // Acierta mañana → 1 día más.
    cola = registrarRevision(cola, 'C5-T01', true, MANANA);
    expect(cola['C5-T01'].proximaRevision).toBe('2026-08-01');

    // Acierta otra vez → 3 días.
    cola = registrarRevision(cola, 'C5-T01', true, '2026-08-01');
    expect(cola['C5-T01']).toMatchObject({ repeticiones: 2, intervaloDias: 3 });
    expect(cola['C5-T01'].proximaRevision).toBe('2026-08-04');

    expect(esPersistible(cola['C5-T01']).success).toBe(true);
  });

  it('encolar de nuevo un elemento en curso no lo devuelve a la cola de hoy', () => {
    let cola = encolar({}, ['C5-T01'], HOY);
    cola = registrarRevision(cola, 'C5-T01', true, HOY);
    // El usuario vuelve a ver la tarjeta en la etapa Tarjetas del módulo.
    cola = encolar(cola, ['C5-T01'], HOY);
    expect(colaDelDia(cola, HOY)).toEqual([]);
  });
});
