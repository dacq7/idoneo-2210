import { describe, expect, it } from 'vitest';
import { esqSesionCronometro } from '@/lib/esquemas';
import {
  avisoPendiente,
  estadoItem,
  inicioCoherente,
  marcarAvisoVisto,
  restantes,
  resumirNavegacion,
  seAcabo,
  severidad,
  transcurridos,
  TEXTO_AVISO,
  UMBRALES_AVISO,
  type UmbralAviso,
} from '@/lib/cronometro';
import type { SesionCronometro } from '@/lib/tipos';

/* ══════════════════════════════════════════════════════════════════
   Fixtures

   Instantes literales, nunca `Date.now()` ni mocks de reloj: el motor
   recibe `ahoraMs` como parámetro justamente para no necesitarlos
   (§19, §22 regla 6). Si un test de este archivo necesitara un mock,
   sería la señal de que el motor dejó de ser puro.
   ══════════════════════════════════════════════════════════════════ */

/** 2026-07-30T20:00:00Z. Un instante cualquiera, fijo. */
const INICIO = 1_785_182_400_000;
const MINUTO = 60_000;

function sesion(cambios: Partial<SesionCronometro> = {}): SesionCronometro {
  return {
    intentoId: String(INICIO),
    tipo: 'final',
    ambito: 'global',
    semilla: INICIO,
    iniciadoEnMs: INICIO,
    duracionSegundos: 120 * 60,
    itemIds: ['C5-001', 'C5-002', 'C5-003'],
    respuestas: {},
    avisosVistos: [],
    ...cambios,
  };
}

describe('transcurridos', () => {
  it('cuenta los segundos desde el inicio', () => {
    expect(transcurridos(sesion(), INICIO + 90_000)).toBe(90);
  });

  it('devuelve 0 en el instante exacto del arranque', () => {
    expect(transcurridos(sesion(), INICIO)).toBe(0);
  });

  it('nunca es negativo si el reloj del sistema se movió hacia atrás', () => {
    // Cambio de hora, ajuste NTP o el usuario tocando la hora del móvil.
    expect(transcurridos(sesion(), INICIO - 10 * MINUTO)).toBe(0);
  });

  it('devuelve 0 —y no NaN— con un iniciadoEnMs no finito', () => {
    expect(transcurridos(sesion({ iniciadoEnMs: NaN }), INICIO)).toBe(0);
  });
});

describe('restantes', () => {
  it('descuenta el tiempo real transcurrido', () => {
    // El caso de §17 paso 11: 10 min de 120 → quedan 6600 s.
    expect(restantes(sesion(), INICIO + 10 * MINUTO)).toBe(6600);
  });

  it('devuelve null cuando la sesión no tiene límite', () => {
    expect(restantes(sesion({ duracionSegundos: null }), INICIO + MINUTO)).toBeNull();
  });

  it('se queda en 0 y no baja de ahí', () => {
    expect(restantes(sesion(), INICIO + 300 * MINUTO)).toBe(0);
  });

  it('NO regala tiempo por cerrar la pestaña: solo depende del reloj', () => {
    // El invariante del paso. Dos lecturas separadas por dos horas de pestaña
    // cerrada dan exactamente lo mismo que si hubiera estado abierta, porque
    // ninguna de las dos consulta un contador en memoria.
    const s = sesion();
    expect(restantes(s, INICIO + 30 * MINUTO)).toBe(90 * 60);
    expect(restantes(s, INICIO + 119 * MINUTO)).toBe(60);
  });

  it('trata una duración no finita como sesión AGOTADA, no como sesión sin límite', () => {
    // Es la decisión que impide el fallo descrito en ADR-019: degradar a `null`
    // convertiría un simulacro cronometrado en uno eterno.
    expect(restantes(sesion({ duracionSegundos: NaN }), INICIO)).toBe(0);
  });
});

describe('seAcabo', () => {
  it('es false mientras queda tiempo y true al llegar a cero', () => {
    expect(seAcabo(sesion(), INICIO + 119 * MINUTO)).toBe(false);
    expect(seAcabo(sesion(), INICIO + 120 * MINUTO)).toBe(true);
  });

  it('es false para siempre en una sesión sin límite', () => {
    expect(seAcabo(sesion({ duracionSegundos: null }), INICIO + 10_000 * MINUTO)).toBe(false);
  });

  it('DETECTA el fin con una duración corrupta, en vez de colgarse en false', () => {
    // Regresión de ADR-019. Con el §7.4 literal, `restantes` daba NaN y
    // `NaN <= 0` es false: el auto-envío no se disparaba NUNCA y el usuario se
    // quedaba con un cronómetro muerto y un intento que no se cerraba.
    expect(seAcabo(sesion({ duracionSegundos: NaN }), INICIO)).toBe(true);
    expect(seAcabo(sesion({ iniciadoEnMs: NaN }), INICIO)).toBe(false);
  });
});

describe('avisoPendiente', () => {
  it('devuelve el umbral MÁS PEQUEÑO cruzado, no el mayor', () => {
    // Requisito de §7.4: si el usuario vuelve tras 15 min de ausencia no se le
    // apilan tres avisos, se le muestra el relevante. A 9 min quedan cruzados
    // el de 20 y el de 10: debe salir el de 10.
    const s = sesion({ duracionSegundos: 30 * 60 });
    expect(avisoPendiente(s, INICIO + 21 * MINUTO)).toBe(600);
  });

  it('no repite un umbral ya visto', () => {
    const s = sesion({ duracionSegundos: 30 * 60, avisosVistos: [1200, 600] });
    expect(avisoPendiente(s, INICIO + 21 * MINUTO)).toBeNull();
  });

  it('emite los tres umbrales en orden a medida que se cruzan', () => {
    let s = sesion();
    const emitidos: UmbralAviso[] = [];
    for (const minuto of [1, 101, 111, 118, 119]) {
      const aviso = avisoPendiente(s, INICIO + minuto * MINUTO);
      if (aviso !== null) {
        emitidos.push(aviso);
        s = marcarAvisoVisto(s, aviso);
      }
    }
    expect(emitidos).toEqual([1200, 600, 120]);
  });

  it('no avisa cuando el tiempo ya se agotó', () => {
    expect(avisoPendiente(sesion(), INICIO + 121 * MINUTO)).toBeNull();
  });

  it('no avisa en una sesión sin límite', () => {
    expect(avisoPendiente(sesion({ duracionSegundos: null }), INICIO + MINUTO)).toBeNull();
  });

  it('tiene texto para los tres umbrales', () => {
    for (const u of UMBRALES_AVISO) expect(TEXTO_AVISO[u].length).toBeGreaterThan(10);
  });
});

describe('marcarAvisoVisto', () => {
  it('marca también los umbrales MAYORES', () => {
    // Mostrar el de 10 min deja sin sentido el de 20.
    expect(marcarAvisoVisto(sesion(), 600).avisosVistos).toEqual([1200, 600]);
  });

  it('marcar el de 2 min los marca los tres', () => {
    expect(marcarAvisoVisto(sesion(), 120).avisosVistos).toEqual([1200, 600, 120]);
  });

  it('es idempotente', () => {
    const una = marcarAvisoVisto(sesion(), 600);
    expect(marcarAvisoVisto(una, 600).avisosVistos).toEqual(una.avisosVistos);
  });

  it('no muta la sesión que recibe', () => {
    const s = sesion();
    marcarAvisoVisto(s, 120);
    expect(s.avisosVistos).toEqual([]);
  });

  it('DESCARTA valores ajenos heredados en vez de arrastrarlos', () => {
    // La sesión se reescribe una vez por respuesta durante 120 minutos: un
    // `avisosVistos` que crece sin control se lleva cuota de localStorage en la
    // ruta que más escribe de la app.
    const s = sesion({ avisosVistos: [999, 42] });
    expect(marcarAvisoVisto(s, 120).avisosVistos).toEqual([1200, 600, 120]);
  });

  it('lo que produce sigue siendo una sesión válida para el esquema', () => {
    expect(esqSesionCronometro.safeParse(marcarAvisoVisto(sesion(), 120)).success).toBe(true);
  });
});

describe('severidad', () => {
  it('cambia en los dos umbrales de color', () => {
    expect(severidad(3600)).toBe('normal');
    expect(severidad(601)).toBe('normal');
    expect(severidad(600)).toBe('atencion');
    expect(severidad(121)).toBe('atencion');
    expect(severidad(120)).toBe('critico');
    expect(severidad(0)).toBe('critico');
  });

  it('es normal sin límite y ante un valor no finito', () => {
    expect(severidad(null)).toBe('normal');
    expect(severidad(NaN)).toBe('normal');
  });
});

describe('resumirNavegacion y estadoItem', () => {
  const conRespuestas = sesion({
    respuestas: {
      'C5-001': { valor: 2, segundos: 30, marcada: false },
      'C5-002': { valor: null, segundos: 5, marcada: true },
    },
  });

  it('cuenta respondidas, marcadas y en blanco', () => {
    expect(resumirNavegacion(conRespuestas)).toEqual({
      respondidas: 1,
      marcadas: 1,
      sinResponder: 2,
    });
  });

  it('un ítem marcado pero en blanco cuenta en las dos columnas relevantes', () => {
    // `marcadas` y `sinResponder` no son excluyentes, y el panel lo refleja.
    expect(estadoItem(conRespuestas, 'C5-002')).toBe('marcada');
  });

  it('distingue los tres estados del panel', () => {
    expect(estadoItem(conRespuestas, 'C5-001')).toBe('respondida');
    expect(estadoItem(conRespuestas, 'C5-003')).toBe('sin-responder');
  });

  it('la marca gana a la respuesta: es lo que el usuario pidió revisar', () => {
    const s = sesion({ respuestas: { 'C5-001': { valor: 0, segundos: 1, marcada: true } } });
    expect(estadoItem(s, 'C5-001')).toBe('marcada');
  });

  it('un valor `false` cuenta como respondido', () => {
    // Trampa real: el ítem de verdadero/falso responde con un booleano, y
    // comprobar la verdad del valor en vez de su ausencia daría «en blanco» a
    // todo el que respondiera «falso».
    const s = sesion({ respuestas: { 'C5-001': { valor: false, segundos: 1, marcada: false } } });
    expect(estadoItem(s, 'C5-001')).toBe('respondida');
    expect(resumirNavegacion(s).respondidas).toBe(1);
  });

  it('un valor `0` cuenta como respondido', () => {
    // La misma trampa con la primera opción de una única: su índice es 0.
    const s = sesion({ respuestas: { 'C5-001': { valor: 0, segundos: 1, marcada: false } } });
    expect(estadoItem(s, 'C5-001')).toBe('respondida');
  });
});

describe('inicioCoherente', () => {
  it('acepta una sesión que empezó en el pasado o justo ahora', () => {
    expect(inicioCoherente(sesion(), INICIO + 10 * MINUTO)).toBe(true);
    expect(inicioCoherente(sesion(), INICIO)).toBe(true);
  });

  it('RECHAZA una sesión que dice haber empezado en el futuro', () => {
    // El hueco que ADR-019 no cerró, medido por el `code-reviewer`:
    // `transcurridos()` acota con Math.max(0, …), así que un inicio futuro se
    // lee como «no ha pasado nada» y el intento no se auto-envía JAMÁS.
    const futura = sesion({ iniciadoEnMs: INICIO + 3 * 3600_000 });
    expect(inicioCoherente(futura, INICIO)).toBe(false);
    // La prueba de que el problema es real: sin esta guarda, la sesión pasa el
    // esquema y el cronómetro no llega nunca a cero.
    expect(esqSesionCronometro.safeParse(futura).success).toBe(true);
    expect(seAcabo(futura, INICIO + 200 * MINUTO)).toBe(false);
  });

  it('tolera una deriva pequeña entre el reloj y el instante de escritura', () => {
    expect(inicioCoherente(sesion({ iniciadoEnMs: INICIO + 5_000 }), INICIO)).toBe(true);
  });

  it('rechaza una sesión con instantes no usables', () => {
    expect(inicioCoherente(sesion({ iniciadoEnMs: NaN }), INICIO)).toBe(false);
    expect(inicioCoherente(sesion(), NaN)).toBe(false);
  });
});
