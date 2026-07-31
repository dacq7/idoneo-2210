import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { EstadoProgreso, IntentoSimulacro, SesionCronometro } from '@/lib/tipos';

// OJO: aquí no puede haber un `import` estático de @/lib/almacenamiento.
// vi.resetModules() solo afecta a las importaciones dinámicas posteriores, y el
// módulo cachea estado (snapshot, memoria, localStorageUsable, oyentes). Cada
// caso lo carga con cargar(), que devuelve una instancia limpia.

/* ─── Doble de window ─────────────────────────────────────────────── */

type ModoFallo =
  | 'ninguno'
  /** Safari incógnito: setItem lanza siempre, también la sonda. */
  | 'privado'
  /** Disco lleno: la sonda de 1 byte pasa, la escritura real falla. */
  | 'cuota';

const CLAVE_SONDA = '__idoneo_prueba__';

interface Sonda {
  almacen: Map<string, string>;
  escriturasFallidas: number;
  oyentes: Map<string, ((evento: unknown) => void)[]>;
  disparar: (clave: string | null) => void;
}

function crearVentana(modo: ModoFallo, semilla: Record<string, string> = {}) {
  const almacen = new Map<string, string>(Object.entries(semilla));
  const oyentes = new Map<string, ((evento: unknown) => void)[]>();
  const sonda: Sonda = {
    almacen,
    escriturasFallidas: 0,
    oyentes,
    disparar: (clave) => {
      for (const fn of oyentes.get('storage') ?? []) fn({ key: clave });
    },
  };

  const ventana = {
    localStorage: {
      getItem: (k: string) => almacen.get(k) ?? null,
      setItem: (k: string, v: string) => {
        const esSonda = k === CLAVE_SONDA;
        if (modo === 'privado' || (modo === 'cuota' && !esSonda)) {
          sonda.escriturasFallidas += 1;
          throw new Error('QuotaExceededError');
        }
        almacen.set(k, v);
      },
      removeItem: (k: string) => {
        almacen.delete(k);
      },
    },
    addEventListener: (tipo: string, fn: (evento: unknown) => void) => {
      oyentes.set(tipo, [...(oyentes.get(tipo) ?? []), fn]);
    },
    removeEventListener: (tipo: string, fn: (evento: unknown) => void) => {
      oyentes.set(tipo, (oyentes.get(tipo) ?? []).filter((f) => f !== fn));
    },
  };

  return { ventana, sonda };
}

/** Carga una instancia limpia del módulo con el window pedido. */
async function cargar(modo: ModoFallo = 'ninguno', semilla: Record<string, string> = {}) {
  vi.resetModules();
  const { ventana, sonda } = crearVentana(modo, semilla);
  vi.stubGlobal('window', ventana);
  const mod = await import('@/lib/almacenamiento');
  return { mod, sonda };
}

const CLAVE_ESTADO = 'idoneo2210:estado';
const CLAVE_SESION = 'idoneo2210:sesion';
const CLAVE_ILEGIBLE = 'idoneo2210:estado-ilegible';

const AHORA = '2026-07-29T22:30:00.000Z';

function estadoValido(cambios: Partial<EstadoProgreso> = {}): EstadoProgreso {
  return {
    version: 1,
    creadoEn: '2026-07-01T10:00:00.000Z',
    diagnosticoHecho: true,
    modulos: {
      'c5-umbrales-zonas': {
        teoriaLeida: true,
        tarjetasVistas: 15,
        practicaCompletada: true,
        mejorQuiz: 90,
        intentosQuiz: 2,
        dominado: true,
        ultimaVisita: '2026-07-28T20:00:00.000Z',
      },
    },
    colaRepaso: {
      'C5-T07': {
        id: 'C5-T07',
        facilidad: 2.5,
        intervaloDias: 3,
        repeticiones: 2,
        proximaRevision: '2026-08-01',
      },
    },
    intentos: [],
    racha: { dias: 5, ultimoDiaActivo: '2026-07-28' },
    preferencias: { tema: 'oscuro', sonido: false, ultimoRespaldo: null },
    ...cambios,
  };
}

function sesion(intentoId: string, respuestas: SesionCronometro['respuestas'] = {}): SesionCronometro {
  return {
    intentoId,
    tipo: 'final',
    ambito: 'global',
    semilla: 1234,
    iniciadoEnMs: 1_800_000_000_000,
    duracionSegundos: 7200,
    itemIds: ['C5-001', 'C5-002'],
    respuestas,
    avisosVistos: [],
  };
}

beforeEach(() => {
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

/* ══════════════════════════════════════════════════════════════════
   REQUISITO 1 · Migraciones defensivas
   ══════════════════════════════════════════════════════════════════ */

describe('intentarMigrar', () => {
  it('conserva íntegro un estado v1 válido', async () => {
    const { mod } = await cargar();
    const original = estadoValido();
    expect(mod.intentarMigrar(original)).toEqual(original);
  });

  it('rechaza una versión vieja (version 0)', async () => {
    const { mod } = await cargar();
    expect(mod.intentarMigrar({ ...estadoValido(), version: 0 })).toBeNull();
  });

  it('rechaza una versión futura (version 2) sin migrar hacia abajo', async () => {
    const { mod } = await cargar();
    expect(mod.intentarMigrar({ ...estadoValido(), version: 2 })).toBeNull();
  });

  it('rechaza un objeto sin campo version', async () => {
    const { mod } = await cargar();
    const sinVersion: Record<string, unknown> = { ...estadoValido() };
    delete sinVersion.version;
    expect(mod.intentarMigrar(sinVersion)).toBeNull();
  });

  it('rechaza un estado al que le falta un campo requerido', async () => {
    const { mod } = await cargar();
    const sinRacha: Record<string, unknown> = { ...estadoValido() };
    delete sinRacha.racha;
    expect(mod.intentarMigrar(sinRacha)).toBeNull();
  });

  it('rechaza lo que no es objeto', async () => {
    const { mod } = await cargar();
    for (const basura of [null, undefined, 'texto', 42, true]) {
      expect(mod.intentarMigrar(basura)).toBeNull();
    }
  });

  it('no tiene efectos secundarios: se llama durante el render', async () => {
    // §22 regla 6. Si escribiera, rompería el render de React.
    const { mod, sonda } = await cargar();
    mod.intentarMigrar({ version: 9 });
    expect(sonda.almacen.size).toBe(0);
  });
});

describe('migrar', () => {
  it('cae a un estado inicial con el ahoraISO recibido', async () => {
    const { mod } = await cargar();
    const nuevo = mod.migrar({ version: 2 }, AHORA);
    expect(nuevo.creadoEn).toBe(AHORA);
    expect(nuevo.version).toBe(1);
    expect(nuevo.intentos).toEqual([]);
  });

  it('devuelve el estado intacto cuando sí se puede migrar', async () => {
    const { mod } = await cargar();
    const original = estadoValido();
    expect(mod.migrar(original, AHORA)).toEqual(original);
  });
});

/* ─── Cuarentena (ADR-008): el progreso no se pierde ──────────────── */

describe('cuarentena del estado ilegible', () => {
  const casos: { nombre: string; payload: string; motivo: string }[] = [
    { nombre: 'JSON malformado', payload: '{"version":1,"racha":', motivo: 'no-json' },
    { nombre: 'JSON que no es objeto', payload: '"solo un string"', motivo: 'no-json' },
    { nombre: 'sin campo version', payload: JSON.stringify({ racha: { dias: 5 } }), motivo: 'sin-version' },
    { nombre: 'versión futura', payload: JSON.stringify({ ...estadoValido(), version: 2 }), motivo: 'version-futura' },
    { nombre: 'versión vieja', payload: JSON.stringify({ ...estadoValido(), version: 0 }), motivo: 'invalido' },
    { nombre: 'campo requerido faltante', payload: JSON.stringify({ version: 1, creadoEn: 'x' }), motivo: 'invalido' },
  ];

  for (const caso of casos) {
    it(`${caso.nombre}: aparta el payload y lo clasifica como "${caso.motivo}"`, async () => {
      const { mod } = await cargar('ninguno', { [CLAVE_ESTADO]: caso.payload });

      const estado = mod.leerEstado(AHORA);

      // El usuario no ve la app en blanco: recibe un estado usable.
      expect(estado.version).toBe(1);
      expect(estado.creadoEn).toBe(AHORA);

      // Y no perdió nada: el original sigue recuperable byte a byte.
      const apartado = mod.leerIlegible();
      expect(apartado).not.toBeNull();
      expect(apartado?.motivo).toBe(caso.motivo);
      expect(apartado?.payload).toBe(caso.payload);
      expect(apartado?.guardadoEn).toBe(AHORA);
    });
  }

  it('un estado válido nunca entra en cuarentena', async () => {
    const original = estadoValido();
    const { mod } = await cargar('ninguno', { [CLAVE_ESTADO]: JSON.stringify(original) });
    expect(mod.leerEstado(AHORA)).toEqual(original);
    expect(mod.leerIlegible()).toBeNull();
  });

  it('en la primera visita no hay nada que apartar', async () => {
    const { mod } = await cargar();
    mod.leerEstado(AHORA);
    expect(mod.leerIlegible()).toBeNull();
  });

  it('la primera cuarentena gana: un fallo posterior no la pisa', async () => {
    const { mod } = await cargar('ninguno', { [CLAVE_ESTADO]: '{"roto":' });
    mod.leerEstado(AHORA);
    const primero = mod.leerIlegible();

    // Segundo fallo, más tarde, con otro payload.
    mod.guardarEstado(estadoValido());
    const apartado2 = mod.apartarIlegible('2026-08-05T10:00:00.000Z');

    expect(apartado2?.payload).toBe(primero?.payload);
    expect(mod.leerIlegible()?.guardadoEn).toBe(AHORA);
  });

  it('descartarIlegible la borra', async () => {
    const { mod } = await cargar('ninguno', { [CLAVE_ESTADO]: '{"roto":' });
    mod.leerEstado(AHORA);
    expect(mod.leerIlegible()).not.toBeNull();
    mod.descartarIlegible();
    expect(mod.leerIlegible()).toBeNull();
  });

  it('reiniciarTodo borra también la cuarentena', async () => {
    const { mod, sonda } = await cargar('ninguno', { [CLAVE_ESTADO]: '{"roto":' });
    mod.leerEstado(AHORA);
    mod.reiniciarTodo();
    expect(mod.leerIlegible()).toBeNull();
    expect(sonda.almacen.has(CLAVE_ILEGIBLE)).toBe(false);
    expect(sonda.almacen.has(CLAVE_ESTADO)).toBe(false);
  });

  it('un registro de cuarentena ilegible no revienta', async () => {
    const { mod } = await cargar('ninguno', { [CLAVE_ILEGIBLE]: 'no es json' });
    expect(mod.leerIlegible()).toBeNull();
  });
});

/* ─── Degradación: modo privado y cuota llena ─────────────────────── */

describe('localStorage no disponible (modo privado)', () => {
  it('no revienta al guardar y nada llega a localStorage', async () => {
    const { mod, sonda } = await cargar('privado');
    expect(() => mod.guardarEstado(estadoValido())).not.toThrow();
    expect(sonda.almacen.has(CLAVE_ESTADO)).toBe(false);
    expect(sonda.escriturasFallidas).toBeGreaterThan(0);
  });

  it('el estado se lee de vuelta desde memoria', async () => {
    const { mod } = await cargar('privado');
    const estado = estadoValido({ diagnosticoHecho: false });
    mod.guardarEstado(estado);
    expect(mod.obtenerSnapshot()).toEqual(estado);
  });

  it('la sesión cronometrada también sobrevive en memoria', async () => {
    const { mod, sonda } = await cargar('privado');
    mod.guardarSesion(sesion('abc'));
    expect(mod.leerSesion()?.intentoId).toBe('abc');
    expect(sonda.almacen.has(CLAVE_SESION)).toBe(false);
  });

  it('leerEstado funciona de punta a punta sin localStorage', async () => {
    const { mod } = await cargar('privado');
    const estado = mod.leerEstado(AHORA);
    expect(estado.creadoEn).toBe(AHORA);
    expect(mod.leerEstado(AHORA)).toBe(estado);
  });
});

describe('localStorage lleno (cuota)', () => {
  it('avisa por consola y no revienta', async () => {
    const { mod, sonda } = await cargar('cuota');
    expect(() => mod.guardarEstado(estadoValido())).not.toThrow();
    expect(sonda.escriturasFallidas).toBeGreaterThan(0);
    expect(console.warn).toHaveBeenCalled();
  });

  it('leerSesion devuelve la sesión NUEVA, no la vieja del disco', async () => {
    // Regresión del defecto que §6 tenía: la sonda de 1 byte pasa con el disco
    // casi lleno, así que localStorageUsable se quedaba en true y leerCrudo
    // seguía leyendo de localStorage — devolviendo la sesión VIEJA mientras la
    // nueva estaba en memoria. En un simulacro eso es reanudar perdiendo
    // respuestas. Ver ADR-008.
    const vieja = sesion('vieja');
    const { mod } = await cargar('cuota', { [CLAVE_SESION]: JSON.stringify(vieja) });

    mod.guardarSesion(sesion('nueva', { 'C5-001': { valor: 2, segundos: 30, marcada: false } }));

    const leida = mod.leerSesion();
    expect(leida?.intentoId).toBe('nueva');
    expect(Object.keys(leida?.respuestas ?? {})).toEqual(['C5-001']);
  });

  it('el estado nuevo también se lee de vuelta y no el del disco', async () => {
    const viejo = estadoValido({ racha: { dias: 1, ultimoDiaActivo: '2026-07-01' } });
    const { mod } = await cargar('cuota', { [CLAVE_ESTADO]: JSON.stringify(viejo) });
    mod.guardarEstado(estadoValido({ racha: { dias: 9, ultimoDiaActivo: '2026-07-29' } }));
    expect(mod.obtenerSnapshot()?.racha.dias).toBe(9);
  });
});

describe('la memoria no sobrevive un recargue', () => {
  it('lo escrito en modo privado se pierde al recargar la página', async () => {
    // Expectativa honesta, no un defecto: `memoria` es de módulo. Es lo que
    // /ajustes debe comunicar al usuario en modo privado.
    const primera = await cargar('privado');
    primera.mod.guardarEstado(estadoValido());
    expect(primera.mod.obtenerSnapshot()).not.toBeNull();

    const segunda = await cargar('privado');
    expect(segunda.mod.obtenerSnapshot()).toBeNull();
  });
});

/* ══════════════════════════════════════════════════════════════════
   REQUISITO 2 · useSyncExternalStore
   ══════════════════════════════════════════════════════════════════ */

describe('obtenerSnapshot — estabilidad', () => {
  it('devuelve la MISMA referencia en llamadas sucesivas', async () => {
    // Si devolviera un objeto nuevo cada vez, useSyncExternalStore compararía
    // con Object.is, vería un cambio en cada render y entraría en bucle.
    const { mod } = await cargar('ninguno', { [CLAVE_ESTADO]: JSON.stringify(estadoValido()) });
    const a = mod.obtenerSnapshot();
    const b = mod.obtenerSnapshot();
    const c = mod.obtenerSnapshot();
    expect(a).not.toBeNull();
    expect(a).toBe(b);
    expect(b).toBe(c);
  });

  it('sin estado guardado devuelve null de forma estable', async () => {
    const { mod } = await cargar();
    const a = mod.obtenerSnapshot();
    const b = mod.obtenerSnapshot();
    expect(a).toBeNull();
    expect(Object.is(a, b)).toBe(true);
  });

  it('con un estado ilegible devuelve null de forma estable', async () => {
    const { mod } = await cargar('ninguno', { [CLAVE_ESTADO]: '{"version":' });
    const a = mod.obtenerSnapshot();
    const b = mod.obtenerSnapshot();
    expect(a).toBeNull();
    expect(Object.is(a, b)).toBe(true);
  });

  it('guardarEstado invalida el caché: la referencia siguiente es la nueva', async () => {
    const { mod } = await cargar('ninguno', { [CLAVE_ESTADO]: JSON.stringify(estadoValido()) });
    const antes = mod.obtenerSnapshot();
    const nuevo = estadoValido({ diagnosticoHecho: false });
    mod.guardarEstado(nuevo);
    const despues = mod.obtenerSnapshot();
    expect(despues).toBe(nuevo);
    expect(despues).not.toBe(antes);
  });

  it('obtenerSnapshotServidor devuelve null incluso con el caché ya poblado', async () => {
    // Es lo que hace que el primer render del servidor y el de la hidratación
    // coincidan. Poblar el caché ANTES es lo que da valor al test: si devolviera
    // el estado cacheado, el servidor renderizaría algo distinto al cliente y
    // habría mismatch de hidratación — y un test que solo lo llama con el caché
    // vacío pasaría igual, por la razón equivocada.
    const { mod } = await cargar('ninguno', { [CLAVE_ESTADO]: JSON.stringify(estadoValido()) });
    expect(mod.obtenerSnapshot()).not.toBeNull();
    expect(mod.obtenerSnapshotServidor()).toBeNull();

    mod.guardarEstado(estadoValido({ diagnosticoHecho: false }));
    expect(mod.obtenerSnapshotServidor()).toBeNull();
  });
});

describe('suscribir', () => {
  it('un evento storage de la clave de estado invalida el caché y notifica una vez', async () => {
    const original = estadoValido();
    const { mod, sonda } = await cargar('ninguno', { [CLAVE_ESTADO]: JSON.stringify(original) });
    const antes = mod.obtenerSnapshot();

    const oyente = vi.fn();
    mod.suscribir(oyente);

    // Otra pestaña escribió.
    const otro = estadoValido({ diagnosticoHecho: false });
    sonda.almacen.set(CLAVE_ESTADO, JSON.stringify(otro));
    sonda.disparar(CLAVE_ESTADO);

    expect(oyente).toHaveBeenCalledTimes(1);
    const despues = mod.obtenerSnapshot();
    expect(despues).not.toBe(antes);
    expect(despues?.diagnosticoHecho).toBe(false);
  });

  it('guardarEstado notifica a los oyentes de la MISMA pestaña', async () => {
    // Es el único cable escritura → UI dentro de la misma pestaña: los
    // navegadores no emiten `storage` en la pestaña que escribió, así que sin
    // este notificar() la app no se refresca al responder un ítem.
    const { mod } = await cargar();
    const oyente = vi.fn();
    mod.suscribir(oyente);

    mod.guardarEstado(estadoValido());
    expect(oyente).toHaveBeenCalledTimes(1);

    mod.marcarTeoriaLeida('c5-umbrales-zonas', AHORA);
    expect(oyente).toHaveBeenCalledTimes(2);
  });

  it('reiniciarTodo también notifica', async () => {
    const { mod } = await cargar();
    const oyente = vi.fn();
    mod.suscribir(oyente);
    mod.reiniciarTodo();
    expect(oyente).toHaveBeenCalledTimes(1);
  });

  it('desuscribir deja de recibir las notificaciones de guardarEstado', async () => {
    // Verifica el Set interno de oyentes, no solo el registro de window.
    const { mod } = await cargar();
    const oyente = vi.fn();
    const desuscribir = mod.suscribir(oyente);
    desuscribir();
    mod.guardarEstado(estadoValido());
    expect(oyente).not.toHaveBeenCalled();
  });

  it('un evento storage de otra clave no notifica', async () => {
    const { mod, sonda } = await cargar();
    const oyente = vi.fn();
    mod.suscribir(oyente);
    sonda.disparar(CLAVE_SESION);
    sonda.disparar(null);
    expect(oyente).not.toHaveBeenCalled();
  });

  it('desuscribir quita el oyente y el listener de window', async () => {
    const { mod, sonda } = await cargar();
    const oyente = vi.fn();
    const desuscribir = mod.suscribir(oyente);
    expect(sonda.oyentes.get('storage')).toHaveLength(1);

    desuscribir();
    expect(sonda.oyentes.get('storage')).toHaveLength(0);

    sonda.disparar(CLAVE_ESTADO);
    expect(oyente).not.toHaveBeenCalled();
  });

  it('otra pestaña puede arreglar un estado ilegible', async () => {
    const { mod, sonda } = await cargar('ninguno', { [CLAVE_ESTADO]: '{"roto":' });
    expect(mod.obtenerSnapshot()).toBeNull();

    mod.suscribir(() => {});
    sonda.almacen.set(CLAVE_ESTADO, JSON.stringify(estadoValido()));
    sonda.disparar(CLAVE_ESTADO);

    expect(mod.obtenerSnapshot()).not.toBeNull();
  });
});

/* ══════════════════════════════════════════════════════════════════
   Exportar / importar
   ══════════════════════════════════════════════════════════════════ */

describe('importarJSON', () => {
  it('rechaza un texto que no es JSON', async () => {
    const { mod } = await cargar();
    const r = mod.importarJSON('{ esto no es json');
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toContain('no es un JSON válido');
  });

  it('rechaza un respaldo con version 2 y señala el campo', async () => {
    const { mod } = await cargar();
    const r = mod.importarJSON(JSON.stringify({ ...estadoValido(), version: 2 }));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toContain('version');
  });

  it('rechazar NO escribe nada: el progreso actual sigue intacto', async () => {
    const original = estadoValido();
    const { mod, sonda } = await cargar('ninguno', { [CLAVE_ESTADO]: JSON.stringify(original) });
    mod.importarJSON('basura');
    mod.importarJSON(JSON.stringify({ version: 2 }));
    expect(sonda.almacen.get(CLAVE_ESTADO)).toBe(JSON.stringify(original));
    expect(mod.obtenerSnapshot()).toEqual(original);
  });

  it('acepta un respaldo válido', async () => {
    const { mod } = await cargar();
    const r = mod.importarJSON(JSON.stringify(estadoValido()));
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.estado.racha.dias).toBe(5);
  });

  it('aceptar TAMPOCO escribe: persistir es decisión del llamador', async () => {
    // §18.5 pide confirmación explícita antes de sobrescribir. Si importarJSON
    // persistiera, esa confirmación no serviría de nada (§22 regla 12).
    const original = estadoValido();
    const { mod, sonda } = await cargar('ninguno', { [CLAVE_ESTADO]: JSON.stringify(original) });
    const r = mod.importarJSON(JSON.stringify(estadoValido({ diagnosticoHecho: false })));
    expect(r.ok).toBe(true);
    expect(sonda.almacen.get(CLAVE_ESTADO)).toBe(JSON.stringify(original));
    expect(mod.obtenerSnapshot()).toEqual(original);
  });

  it('cierra el círculo: exportar un estado inicial y volver a importarlo', async () => {
    const { mod } = await cargar();
    const texto = mod.exportarJSON(mod.crearEstadoInicial(AHORA));
    expect(mod.importarJSON(texto).ok).toBe(true);
  });

  it('nombreArchivoRespaldo usa la fecha recibida', async () => {
    const { mod } = await cargar();
    expect(mod.nombreArchivoRespaldo('2026-07-29')).toBe('idoneo-2210-respaldo-2026-07-29.json');
  });
});

/* ══════════════════════════════════════════════════════════════════
   Mutadores de dominio
   ══════════════════════════════════════════════════════════════════ */

describe('tocarRacha', () => {
  it('suma 1 si el último día activo fue ayer', async () => {
    const { mod } = await cargar('ninguno', {
      [CLAVE_ESTADO]: JSON.stringify(estadoValido({ racha: { dias: 5, ultimoDiaActivo: '2026-07-28' } })),
    });
    mod.tocarRacha('2026-07-29', '2026-07-28', AHORA);
    expect(mod.obtenerSnapshot()?.racha).toEqual({ dias: 6, ultimoDiaActivo: '2026-07-29' });
  });

  it('no cambia nada si ya se activó hoy', async () => {
    const estado = estadoValido({ racha: { dias: 5, ultimoDiaActivo: '2026-07-29' } });
    const { mod } = await cargar('ninguno', { [CLAVE_ESTADO]: JSON.stringify(estado) });
    const antes = mod.obtenerSnapshot();
    mod.tocarRacha('2026-07-29', '2026-07-28', AHORA);
    expect(mod.obtenerSnapshot()?.racha).toEqual({ dias: 5, ultimoDiaActivo: '2026-07-29' });
    expect(mod.obtenerSnapshot()).toBe(antes);
  });

  it('se reinicia a 1 si el último día fue anteayer', async () => {
    const { mod } = await cargar('ninguno', {
      [CLAVE_ESTADO]: JSON.stringify(estadoValido({ racha: { dias: 9, ultimoDiaActivo: '2026-07-27' } })),
    });
    mod.tocarRacha('2026-07-29', '2026-07-28', AHORA);
    expect(mod.obtenerSnapshot()?.racha).toEqual({ dias: 1, ultimoDiaActivo: '2026-07-29' });
  });
});

describe('registrarQuiz', () => {
  it('mejorQuiz es el máximo histórico, no el último intento', async () => {
    const { mod } = await cargar();
    mod.registrarQuiz('c5-umbrales-zonas', 90, AHORA);
    mod.registrarQuiz('c5-umbrales-zonas', 50, AHORA);
    const m = mod.obtenerSnapshot()?.modulos['c5-umbrales-zonas'];
    expect(m?.mejorQuiz).toBe(90);
    expect(m?.intentosQuiz).toBe(2);
  });

  it('dominado cruza exactamente en 80', async () => {
    const { mod } = await cargar();
    mod.registrarQuiz('a1-celula', 79, AHORA);
    expect(mod.obtenerSnapshot()?.modulos['a1-celula']?.dominado).toBe(false);
    mod.registrarQuiz('a1-celula', 80, AHORA);
    expect(mod.obtenerSnapshot()?.modulos['a1-celula']?.dominado).toBe(true);
  });
});

describe('otros mutadores', () => {
  it('registrarTarjetasVistas nunca baja el contador', async () => {
    const { mod } = await cargar();
    mod.registrarTarjetasVistas('c5-umbrales-zonas', 12, AHORA);
    mod.registrarTarjetasVistas('c5-umbrales-zonas', 5, AHORA);
    expect(mod.obtenerSnapshot()?.modulos['c5-umbrales-zonas']?.tarjetasVistas).toBe(12);
  });

  it('todo mutador escribe ultimaVisita con el ahoraISO recibido', async () => {
    const { mod } = await cargar();
    mod.marcarTeoriaLeida('c5-umbrales-zonas', AHORA);
    expect(mod.obtenerSnapshot()?.modulos['c5-umbrales-zonas']?.ultimaVisita).toBe(AHORA);
  });

  it('los mutadores devuelven objetos nuevos, nunca mutan el anterior', async () => {
    const original = estadoValido();
    const { mod } = await cargar('ninguno', { [CLAVE_ESTADO]: JSON.stringify(original) });
    const antes = mod.obtenerSnapshot();
    mod.marcarPracticaCompletada('a1-celula', AHORA);
    const despues = mod.obtenerSnapshot();
    expect(despues).not.toBe(antes);
    expect(antes?.modulos['a1-celula']).toBeUndefined();
    expect(despues?.modulos['a1-celula']?.practicaCompletada).toBe(true);
  });

  it('guardarIntento pone el nuevo primero, enciende diagnosticoHecho y respeta el FIFO de 30', async () => {
    const { mod } = await cargar();
    const intento = (id: string, tipo: IntentoSimulacro['tipo']): IntentoSimulacro => ({
      id,
      tipo,
      ambito: 'global',
      semilla: Number(id),
      iniciadoEn: AHORA,
      terminadoEn: AHORA,
      segundosUsados: 100,
      totalItems: 10,
      itemIds: ['C5-001'],
      respuestas: [],
      puntaje: 70,
      desglose: { porBloque: {}, porModulo: {}, porNivel: {} } as IntentoSimulacro['desglose'],
    });

    expect(mod.leerEstado(AHORA).diagnosticoHecho).toBe(false);
    mod.guardarIntento(intento('1', 'diagnostico'), AHORA);
    expect(mod.obtenerSnapshot()?.diagnosticoHecho).toBe(true);

    for (let i = 2; i <= 35; i++) mod.guardarIntento(intento(String(i), 'quiz'), AHORA);
    const intentos = mod.obtenerSnapshot()?.intentos ?? [];
    expect(intentos).toHaveLength(30);
    expect(intentos[0].id).toBe('35');
    // El diagnóstico original ya salió por FIFO, pero la bandera se queda.
    expect(intentos.some((i) => i.id === '1')).toBe(false);
    expect(mod.obtenerSnapshot()?.diagnosticoHecho).toBe(true);
  });

  it('obtenerIntento encuentra el intento pedido, no el primero de la lista', async () => {
    // /resultados/[intentoId] del Paso 12 se apoya entero en esta búsqueda:
    // devolver intentos[0] mostraría el informe equivocado.
    const { mod } = await cargar();
    const intento = (id: string): IntentoSimulacro => ({
      id,
      tipo: 'quiz',
      ambito: 'c5-umbrales-zonas',
      semilla: Number(id),
      iniciadoEn: AHORA,
      terminadoEn: AHORA,
      segundosUsados: 100,
      totalItems: 10,
      itemIds: [],
      respuestas: [],
      puntaje: Number(id),
      desglose: { porBloque: {}, porModulo: {}, porNivel: {} } as IntentoSimulacro['desglose'],
    });
    mod.guardarIntento(intento('11'), AHORA);
    mod.guardarIntento(intento('22'), AHORA);
    mod.guardarIntento(intento('33'), AHORA);
    const estado = mod.obtenerSnapshot() as EstadoProgreso;

    expect(mod.obtenerIntento(estado, '22')?.puntaje).toBe(22);
    expect(mod.obtenerIntento(estado, '11')?.puntaje).toBe(11);
    expect(mod.obtenerIntento(estado, 'no-existe')).toBeNull();
  });

  it('marcarTeoriaLeida enciende la bandera, no solo la fecha', async () => {
    const { mod } = await cargar();
    mod.marcarTeoriaLeida('c5-umbrales-zonas', AHORA);
    expect(mod.obtenerSnapshot()?.modulos['c5-umbrales-zonas']?.teoriaLeida).toBe(true);
  });

  it('guardarColaRepaso reemplaza la cola completa', async () => {
    // lib/srs.ts del Paso 10 calcula la cola y la escribe entera.
    const { mod } = await cargar('ninguno', { [CLAVE_ESTADO]: JSON.stringify(estadoValido()) });
    expect(Object.keys(mod.obtenerSnapshot()?.colaRepaso ?? {})).toEqual(['C5-T07']);

    mod.guardarColaRepaso(
      {
        'C5-014': {
          id: 'C5-014',
          facilidad: 2.3,
          intervaloDias: 1,
          repeticiones: 0,
          proximaRevision: '2026-07-30',
        },
      },
      AHORA,
    );

    const cola = mod.obtenerSnapshot()?.colaRepaso ?? {};
    expect(Object.keys(cola)).toEqual(['C5-014']);
    expect(cola['C5-014'].facilidad).toBe(2.3);
  });

  it('guardarDatosPersonales guarda nombre y fecha de examen', async () => {
    const { mod } = await cargar();
    mod.guardarDatosPersonales({ nombre: 'Diego', fechaExamen: '2026-09-15' }, AHORA);
    expect(mod.obtenerSnapshot()?.nombre).toBe('Diego');
    expect(mod.obtenerSnapshot()?.fechaExamen).toBe('2026-09-15');

    // Un cambio parcial no borra el otro campo.
    mod.guardarDatosPersonales({ fechaExamen: '2026-10-01' }, AHORA);
    expect(mod.obtenerSnapshot()?.nombre).toBe('Diego');
    expect(mod.obtenerSnapshot()?.fechaExamen).toBe('2026-10-01');
  });

  it('borrarSesion la elimina de verdad', async () => {
    // Si no borra, el dialogo-reanudar del Paso 11 ofrece reanudar un
    // simulacro que ya se cerró.
    const { mod, sonda } = await cargar();
    mod.guardarSesion(sesion('abc'));
    expect(mod.leerSesion()).not.toBeNull();

    mod.borrarSesion();
    expect(mod.leerSesion()).toBeNull();
    expect(sonda.almacen.has(CLAVE_SESION)).toBe(false);
  });

  it('leerSesion descarta y limpia una sesión corrupta', async () => {
    const { mod, sonda } = await cargar('ninguno', { [CLAVE_SESION]: '{"intentoId":' });
    expect(mod.leerSesion()).toBeNull();
    expect(sonda.almacen.has(CLAVE_SESION)).toBe(false);
  });

  it('guardarPreferencias hace merge, no reemplaza', async () => {
    const { mod } = await cargar('ninguno', { [CLAVE_ESTADO]: JSON.stringify(estadoValido()) });
    mod.guardarPreferencias({ tema: 'claro' }, AHORA);
    const prefs = mod.obtenerSnapshot()?.preferencias;
    expect(prefs?.tema).toBe('claro');
    expect(prefs?.sonido).toBe(false);
  });
});

describe('necesitaRespaldo', () => {
  it('es false sin intentos, aunque la racha ya pasara de 7', async () => {
    // Con racha 30 la segunda rama daría true: así el test prueba el corte
    // temprano por falta de intentos, y no pasa por la razón equivocada.
    const { mod } = await cargar();
    const sinIntentos = estadoValido({
      intentos: [],
      racha: { dias: 30, ultimoDiaActivo: '2026-07-29' },
    });
    expect(mod.necesitaRespaldo(sinIntentos, '2026-07-29', '2026-07-22')).toBe(false);
  });

  it('la frontera de ultimoRespaldo es inclusiva', async () => {
    const { mod } = await cargar();
    const con = (ultimoRespaldo: string) =>
      estadoValido({
        intentos: [{}] as never,
        racha: { dias: 3, ultimoDiaActivo: '2026-07-29' },
        preferencias: { tema: 'oscuro', sonido: false, ultimoRespaldo },
      });
    // ultimoRespaldo === ayerHace7 → sí pide respaldo (comparación <=).
    expect(mod.necesitaRespaldo(con('2026-07-22'), '2026-07-29', '2026-07-22')).toBe(true);
    // Un día después del corte → todavía no.
    expect(mod.necesitaRespaldo(con('2026-07-23'), '2026-07-29', '2026-07-22')).toBe(false);
  });

  it('sin respaldo previo, pide respaldo a los 7 días de racha', async () => {
    const { mod } = await cargar();
    const con = (dias: number) =>
      estadoValido({ racha: { dias, ultimoDiaActivo: '2026-07-29' }, intentos: [{}] as never });
    expect(mod.necesitaRespaldo(con(6), '2026-07-29', '2026-07-22')).toBe(false);
    expect(mod.necesitaRespaldo(con(7), '2026-07-29', '2026-07-22')).toBe(true);
  });

  it('con respaldo viejo lo pide, pero solo si hoy hubo actividad', async () => {
    const { mod } = await cargar();
    const con = (ultimoRespaldo: string, ultimoDiaActivo: string) =>
      estadoValido({
        intentos: [{}] as never,
        racha: { dias: 3, ultimoDiaActivo },
        preferencias: { tema: 'oscuro', sonido: false, ultimoRespaldo },
      });
    expect(mod.necesitaRespaldo(con('2026-07-01', '2026-07-29'), '2026-07-29', '2026-07-22')).toBe(true);
    expect(mod.necesitaRespaldo(con('2026-07-01', '2026-07-20'), '2026-07-29', '2026-07-22')).toBe(false);
    expect(mod.necesitaRespaldo(con('2026-07-28', '2026-07-29'), '2026-07-29', '2026-07-22')).toBe(false);
  });

  it('DOCUMENTA UN HUECO: el uso intermitente nunca dispara el recordatorio', async () => {
    // §18.5 dice "cada 7 días de uso", pero la rama sin `ultimoRespaldo` mira
    // `racha.dias`, que son días CONSECUTIVOS y se reinicia a 1 al saltarse uno.
    // Un entrenador que estudia 3 noches por semana durante dos meses nunca ve
    // el recordatorio. Se copia §6 tal cual (el blueprint gana) y se deja el
    // hueco visible para decidirlo en el Paso 18.5, que es donde está la UI.
    const { mod } = await cargar();
    const intermitente = estadoValido({
      racha: { dias: 3, ultimoDiaActivo: '2026-07-29' },
      intentos: [{}] as never,
    });
    expect(mod.necesitaRespaldo(intermitente, '2026-07-29', '2026-05-01')).toBe(false);
  });
});

/* ══════════════════════════════════════════════════════════════════
   Sesión cronometrada — validación al leer (ADR-019)

   §6 hacía `JSON.parse(crudo) as SesionCronometro` sin comprobar nada. El
   cast es una promesa que nadie verificaba, y el precio no era un error
   visible: era un simulacro cuyo cronómetro no terminaba nunca, porque
   `restantes()` daba NaN y `NaN <= 0` es false.
   ══════════════════════════════════════════════════════════════════ */

describe('leerSesion — validación', () => {
  it('devuelve la sesión cuando el payload es válido', async () => {
    const guardada = sesion('abc', { 'C5-001': { valor: 3, segundos: 12, marcada: true } });
    const { mod } = await cargar('ninguno', { [CLAVE_SESION]: JSON.stringify(guardada) });
    expect(mod.leerSesion()).toEqual(guardada);
  });

  it('descarta —y limpia— un payload que no es una sesión', async () => {
    const { mod, sonda } = await cargar('ninguno', { [CLAVE_SESION]: '{"foo":1}' });
    expect(mod.leerSesion()).toBeNull();
    expect(sonda.almacen.has(CLAVE_SESION)).toBe(false);
  });

  it('descarta una sesión SIN duracionSegundos, que es el caso que congelaba el cierre', async () => {
    const incompleta: Partial<SesionCronometro> = { ...sesion('rota') };
    delete incompleta.duracionSegundos;
    const { mod } = await cargar('ninguno', { [CLAVE_SESION]: JSON.stringify(incompleta) });
    expect(mod.leerSesion()).toBeNull();
  });

  it('descarta una sesión con duracionSegundos o iniciadoEnMs no finitos', async () => {
    // `JSON.stringify(NaN)` produce `null`, así que este es el payload que de
    // verdad llega al disco cuando algo va mal aguas arriba.
    for (const roto of [
      { ...sesion('a'), duracionSegundos: 'mucho' },
      { ...sesion('b'), iniciadoEnMs: null },
      { ...sesion('c'), duracionSegundos: -1 },
    ]) {
      const { mod } = await cargar('ninguno', { [CLAVE_SESION]: JSON.stringify(roto) });
      expect(mod.leerSesion()).toBeNull();
    }
  });

  it('descarta una sesión sin itemIds en vez de dejar que reviente al recorrerla', async () => {
    const { mod } = await cargar('ninguno', { [CLAVE_SESION]: JSON.stringify({ ...sesion('x'), itemIds: [] }) });
    expect(mod.leerSesion()).toBeNull();
  });

  it('acepta cualquier forma de `valor`: la califica el motor, no el esquema', async () => {
    // Un ítem de emparejar responde con pares, uno de vf con un booleano y uno
    // de única con 0. Validar esa tabla aquí duplicaría `calificar` y tiraría
    // sesiones enteras por una respuesta rara en un solo ítem.
    const rica = sesion('rica', {
      'C5-001': { valor: [[0, 1], [1, 0]], segundos: 4, marcada: false },
      'C5-002': { valor: false, segundos: 2, marcada: false },
      'C5-003': { valor: 0, segundos: 1, marcada: false },
    });
    const { mod } = await cargar('ninguno', { [CLAVE_SESION]: JSON.stringify(rica) });
    expect(mod.leerSesion()).toEqual(rica);
  });

  it('una sesión ilegible NO manda el progreso a cuarentena', async () => {
    // La asimetría con ADR-008, y es deliberada: la sesión vive en su propia
    // clave, así que descartarla no toca ni un intento, ni la racha, ni la cola
    // de repaso. Lo que se pierde es un simulacro ya irreconstruible.
    const { mod, sonda } = await cargar('ninguno', {
      [CLAVE_SESION]: 'esto no es json',
      [CLAVE_ESTADO]: JSON.stringify(estadoValido({ racha: { dias: 12, ultimoDiaActivo: '2026-07-29' } })),
    });
    expect(mod.leerSesion()).toBeNull();
    expect(mod.obtenerSnapshot()?.racha.dias).toBe(12);
    expect(sonda.almacen.has(CLAVE_ILEGIBLE)).toBe(false);
  });

  it('lo que guardarSesion escribe siempre se puede volver a leer', async () => {
    // Cierra el círculo: si el esquema fuera más estricto que el escritor, el
    // simulacro perdería la sesión en la primera recarga y nadie lo vería hasta
    // que un usuario recargara a mitad de examen.
    const { mod } = await cargar();
    const original = sesion('ida-y-vuelta', { 'C5-001': { valor: 2, segundos: 9, marcada: true } });
    mod.guardarSesion(original);
    expect(mod.leerSesion()).toEqual(original);
  });
});

describe('suscribirSesion y haySesionEnCurso', () => {
  it('haySesionEnCurso refleja si hay sesión guardada', async () => {
    const { mod } = await cargar();
    expect(mod.haySesionEnCurso()).toBe(false);
    mod.guardarSesion(sesion('a'));
    expect(mod.haySesionEnCurso()).toBe(true);
    mod.borrarSesion();
    expect(mod.haySesionEnCurso()).toBe(false);
  });

  it('devuelve el MISMO booleano en lecturas seguidas', async () => {
    // Requisito de useSyncExternalStore: un snapshot que cambia de identidad en
    // cada lectura mete a React en un bucle infinito de renders. Por eso
    // `haySesionEnCurso` devuelve un booleano y no la sesión parseada.
    const { mod } = await cargar();
    mod.guardarSesion(sesion('a'));
    expect(mod.haySesionEnCurso()).toBe(mod.haySesionEnCurso());
  });

  it('el servidor siempre dice que no hay sesión', async () => {
    const { mod } = await cargar();
    expect(mod.haySesionEnCursoServidor()).toBe(false);
  });

  it('avisa a sus oyentes al guardar y al borrar', async () => {
    const { mod } = await cargar();
    const oyente = vi.fn();
    const desuscribir = mod.suscribirSesion(oyente);

    mod.guardarSesion(sesion('a'));
    expect(oyente).toHaveBeenCalledTimes(1);
    mod.borrarSesion();
    expect(oyente).toHaveBeenCalledTimes(2);

    desuscribir();
    mod.guardarSesion(sesion('b'));
    expect(oyente).toHaveBeenCalledTimes(2);
  });

  it('NO despierta a los oyentes del progreso', async () => {
    // Los dos canales están separados a propósito: durante un simulacro la
    // sesión se escribe una vez por respuesta, y si fueran uno solo cada
    // respuesta re-renderizaría el resumen de la portada, la racha y las etapas
    // sin que nada suyo haya cambiado.
    const { mod } = await cargar();
    const oyenteEstado = vi.fn();
    mod.suscribir(oyenteEstado);
    mod.guardarSesion(sesion('a'));
    expect(oyenteEstado).not.toHaveBeenCalled();
  });

  it('reacciona al evento storage de otra pestaña', async () => {
    const { mod, sonda } = await cargar();
    const oyente = vi.fn();
    mod.suscribirSesion(oyente);
    sonda.disparar(CLAVE_SESION);
    expect(oyente).toHaveBeenCalledTimes(1);
    sonda.disparar(CLAVE_ESTADO);
    expect(oyente).toHaveBeenCalledTimes(1);
  });
});
