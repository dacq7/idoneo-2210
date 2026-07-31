import { describe, expect, it } from 'vitest';
import { BLOQUES, MODULOS } from '@/content/estructura';
import { diasEntre } from '@/lib/fechas';
import {
  DIAS_RESERVADOS,
  DIAS_SIN_FECHA,
  diaVigente,
  generarPlan,
  MINUTOS_DIARIOS_EXIGENTES,
  tareasDeHoy,
} from '@/lib/plan';
import type { DesgloseIntento, Plan } from '@/lib/tipos';

/* ══════════════════════════════════════════════════════════════════
   Fixtures

   Fechas literales, nunca `new Date()`: el motor recibe `hoy` como
   parámetro justamente para no necesitar mocks (§19, §22 regla 6).
   ══════════════════════════════════════════════════════════════════ */

const HOY = '2026-08-01';

function plan(cambios: Partial<Parameters<typeof generarPlan>[0]> = {}): Plan {
  return generarPlan({
    hoy: HOY,
    fechaExamen: '2026-10-01', // 61 días
    modulos: MODULOS,
    bloques: BLOQUES,
    diagnostico: null,
    dominados: [],
    ...cambios,
  });
}

/** Todos los slugs de módulo que aparecen en el plan, en orden de aparición. */
function ordenDeModulos(p: Plan): string[] {
  return p.dias.flatMap((d) =>
    d.tareas.filter((t) => t.clase === 'modulo').map((t) => (t as { slug: string }).slug),
  );
}

function desglose(porModulo: DesgloseIntento['porModulo']): DesgloseIntento {
  const cero = { correctas: 0, total: 0 };
  return {
    porBloque: { A: cero, B: cero, C: cero, D: cero },
    porModulo,
    porNivel: { recuerdo: cero, comprension: cero, aplicacion: cero },
  };
}

describe('generarPlan — prerequisitos', () => {
  it('NUNCA coloca un módulo antes que su prerequisito', () => {
    // La restricción dura del motor: violarla produce un plan que manda
    // estudiar zonas de entrenamiento antes que vías energéticas.
    const orden = ordenDeModulos(plan());
    const posicion = new Map(orden.map((slug, i) => [slug, i]));

    for (const modulo of MODULOS) {
      const mio = posicion.get(modulo.slug);
      expect(mio).toBeDefined();
      for (const pre of modulo.prerequisitos) {
        expect(posicion.get(pre)!).toBeLessThan(mio!);
      }
    }
  });

  it('los 29 módulos aparecen exactamente una vez', () => {
    const orden = ordenDeModulos(plan());
    expect(orden).toHaveLength(MODULOS.length);
    expect(new Set(orden).size).toBe(MODULOS.length);
  });

  it('respeta los prerequisitos aunque el diagnóstico empuje al dependiente', () => {
    // C5 depende de C1, C2 y C3. Aunque sea el peor del diagnóstico, no puede
    // adelantarse: la prioridad es restricción BLANDA, el prerequisito no.
    const orden = ordenDeModulos(
      plan({ diagnostico: desglose({ 'c5-umbrales-zonas': { correctas: 0, total: 10 } }) }),
    );
    const pos = (s: string) => orden.indexOf(s);
    for (const pre of ['c1-vias-energeticas', 'c2-cardiovascular', 'c3-respiratorio-vo2']) {
      expect(pos(pre)).toBeLessThan(pos('c5-umbrales-zonas'));
    }
  });

  it('no se cuelga si hubiera un ciclo de prerequisitos', () => {
    // Error de contenido, no de código —el validador ya lo impide—, pero un
    // plan subóptimo es preferible a una página que no carga.
    const ciclo = [
      { ...MODULOS[0], slug: 'x', prerequisitos: ['y'] },
      { ...MODULOS[1], slug: 'y', prerequisitos: ['x'] },
    ];
    const p = plan({ modulos: ciclo });
    expect(ordenDeModulos(p).sort()).toEqual(['x', 'y']);
  });
});

describe('generarPlan — prioridad', () => {
  it('adelanta lo que el diagnóstico dice que fallas', () => {
    const sinDiag = ordenDeModulos(plan());
    const conDiag = ordenDeModulos(
      plan({
        diagnostico: desglose({
          'a6-estadistica': { correctas: 0, total: 8 },
          'c9-dopaje': { correctas: 8, total: 8 },
        }),
      }),
    );
    // a6 no tiene prerequisitos, así que nada le impide subir.
    expect(conDiag.indexOf('a6-estadistica')).toBeLessThan(sinDiag.indexOf('a6-estadistica'));
  });

  it('un módulo dominado sigue en el plan', () => {
    const p = plan({ dominados: ['a6-estadistica'] });
    expect(ordenDeModulos(p)).toContain('a6-estadistica');
  });

  it('un dominado baja A LA MITAD, no a cero: sigue por delante de lo casi perfecto', () => {
    // La distinción que importa y que el test anterior NO capturaba —un mutante
    // con factor 0 lo pasaba—. Repasar lo dominado vale algo, así que un módulo
    // dominado del bloque C (0.6 × 0.33 × 0.5 = 0.099) tiene que ir por delante
    // de uno del mismo bloque que el diagnóstico dice casi perfecto
    // (0.1 × 0.33 = 0.033). Con factor 0 quedaría detrás.
    const dosDelC = MODULOS.filter((m) =>
      ['c8-psicologia-deporte', 'c9-dopaje'].includes(m.slug),
    );
    const orden = ordenDeModulos(
      plan({
        modulos: dosDelC,
        dominados: ['c8-psicologia-deporte'],
        diagnostico: desglose({ 'c9-dopaje': { correctas: 9, total: 10 } }),
      }),
    );
    expect(orden).toEqual(['c8-psicologia-deporte', 'c9-dopaje']);
  });

  it('pesa más un módulo del bloque C que uno del A con la misma debilidad', () => {
    // C vale 33 % del examen y A el 20 %. Sin diagnóstico los dos tienen la
    // misma debilidad por defecto, así que decide el peso.
    const soloDos = MODULOS.filter((m) => ['a1-celula', 'c8-psicologia-deporte'].includes(m.slug));
    const orden = ordenDeModulos(plan({ modulos: soloDos }));
    expect(orden[0]).toBe('c8-psicologia-deporte');
  });

  it('es determinista: dos llamadas iguales dan el mismo plan', () => {
    expect(plan()).toEqual(plan());
  });
});

describe('generarPlan — los 3 días reservados', () => {
  it('reserva los últimos 3 días y no mete materia nueva en ellos', () => {
    const p = plan();
    const ultimos = p.dias.slice(-DIAS_RESERVADOS);
    expect(ultimos).toHaveLength(3);
    for (const dia of ultimos) {
      expect(dia.tareas.every((t) => t.clase !== 'modulo')).toBe(true);
    }
  });

  it('el primero de los tres es el simulacro final', () => {
    const p = plan();
    const [primero] = p.dias.slice(-DIAS_RESERVADOS);
    expect(primero.tareas[0].clase).toBe('simulacro');
  });

  it('los otros dos son revisión de errores y tarjetas', () => {
    const p = plan();
    const [, segundo, tercero] = p.dias.slice(-DIAS_RESERVADOS);
    expect(segundo.tareas.every((t) => t.clase === 'repaso')).toBe(true);
    expect(
      tercero.tareas.some((t) => t.clase !== 'modulo' && t.descripcion.includes('Última noche')),
    ).toBe(true);
  });
});

describe('generarPlan — sin fecha de examen', () => {
  it('SIGUE siendo útil: genera plan con horizonte por defecto', () => {
    // Requisito del paso. La mayoría abre la app antes de tener fecha, y un
    // plan que se niega a existir deja al usuario donde estaba.
    const p = plan({ fechaExamen: undefined });
    expect(p.dias.length).toBeGreaterThan(0);
    expect(ordenDeModulos(p)).toHaveLength(MODULOS.length);
    expect(p.diasDisponibles).toBe(DIAS_SIN_FECHA);
  });

  it('y lo DICE, en vez de fingir que el usuario puso una fecha', () => {
    const p = plan({ fechaExamen: undefined });
    expect(p.advertencias.some((a) => a.includes('fecha del examen'))).toBe(true);
  });

  it('el horizonte por defecto no dispara la advertencia de ritmo imposible', () => {
    // Si DIAS_SIN_FECHA fuera muy corto, todo usuario nuevo vería «esto no es
    // realista» el primer día, que es la peor bienvenida posible.
    const p = plan({ fechaExamen: undefined });
    expect(p.advertencias.some((a) => a.includes('min diarios'))).toBe(false);
  });

  it('con fecha NO emite la advertencia de fecha ausente', () => {
    expect(plan().advertencias.some((a) => a.includes('fecha del examen'))).toBe(false);
  });
});

describe('generarPlan — bordes de calendario', () => {
  it('con el examen HOY devuelve el plan de un solo día, sin teoría nueva', () => {
    const p = plan({ fechaExamen: HOY });
    expect(p.dias).toHaveLength(1);
    expect(p.dias[0].tareas[0].clase).toBe('repaso');
    expect(p.advertencias[0]).toContain('hoy o ya pasó');
  });

  it('con el examen en el PASADO tampoco revienta', () => {
    const p = plan({ fechaExamen: '2026-07-01' });
    expect(p.dias).toHaveLength(1);
    expect(p.diasDisponibles).toBe(0);
  });

  it('con 5 días para 29 módulos avisa y no revienta', () => {
    const p = plan({ fechaExamen: '2026-08-06' });
    expect(p.advertencias.some((a) => a.includes('min diarios'))).toBe(true);
    expect(ordenDeModulos(p)).toHaveLength(MODULOS.length);
  });

  it('con menos días que los reservados lo dice', () => {
    const p = plan({ fechaExamen: '2026-08-03' }); // 2 días
    expect(p.advertencias.some((a) => a.includes('3 finales'))).toBe(true);
  });

  it('nunca genera más días que los disponibles', () => {
    for (const fecha of ['2026-08-02', '2026-08-05', '2026-08-20', '2026-12-01']) {
      const p = plan({ fechaExamen: fecha });
      expect(p.dias.length).toBeLessThanOrEqual(Math.max(1, diasEntre(HOY, fecha)));
    }
  });

  it('las fechas de los días son consecutivas desde hoy', () => {
    const p = plan();
    p.dias.forEach((dia, i) => {
      expect(diasEntre(HOY, dia.fecha)).toBe(i);
      expect(dia.indice).toBe(i + 1);
    });
  });

  it('con mucho tiempo rellena los días sobrantes con repaso, no con vacío', () => {
    const p = plan({ fechaExamen: '2027-06-01' });
    expect(p.dias.every((d) => d.tareas.length > 0)).toBe(true);
    expect(p.dias.some((d) => d.tareas.every((t) => t.clase === 'repaso'))).toBe(true);
  });

  it('el objetivo diario baja al haber más días', () => {
    const apretado = plan({ fechaExamen: '2026-08-15' });
    const holgado = plan({ fechaExamen: '2026-11-01' });
    const maxMin = (p: Plan) => Math.max(...p.dias.map((d) => d.minutosTotales));
    expect(maxMin(holgado)).toBeLessThanOrEqual(maxMin(apretado));
  });

  it('MINUTOS_DIARIOS_EXIGENTES es el umbral de la advertencia', () => {
    expect(MINUTOS_DIARIOS_EXIGENTES).toBe(150);
  });
});

describe('tareasDeHoy y diaVigente', () => {
  it('tareasDeHoy devuelve las del día que coincide', () => {
    const p = plan();
    expect(tareasDeHoy(p, HOY)).toEqual(p.dias[0].tareas);
  });

  it('tareasDeHoy devuelve vacío si hoy no está en el plan', () => {
    expect(tareasDeHoy(plan(), '2027-01-01')).toEqual([]);
  });

  it('coincide con tareasDeHoy cuando el plan se generó hoy, que es lo normal', () => {
    // La app regenera el plan con `hoy` en cada visita, así que su día 1 ES
    // hoy. Este es el camino que recorre el 99 % de las veces.
    const p = plan();
    expect(diaVigente(p, HOY)?.tareas).toEqual(tareasDeHoy(p, HOY));
  });

  it('da el primer día NO pasado cuando se consulta con una fecha posterior', () => {
    // La guarda: un `Plan` ya construido consultado con otra fecha. No es el
    // caso frecuente —y el primer test que escribí para esto daba por hecho un
    // escenario que la regeneración por visita hace imposible—, pero sin ella
    // la pantalla se queda sin nada que ofrecer.
    const p = plan();
    const tercerDia = p.dias[2].fecha;
    expect(tareasDeHoy(p, tercerDia)).not.toEqual([]);
    const vigente = diaVigente(p, tercerDia);
    expect(vigente?.fecha).toBe(tercerDia);
  });

  it('salta los días ya pasados', () => {
    const p = plan();
    const vigente = diaVigente(p, p.dias[5].fecha);
    expect(vigente?.indice).toBe(6);
  });

  it('diaVigente devuelve null cuando el plan ya terminó', () => {
    expect(diaVigente(plan(), '2027-01-01')).toBeNull();
  });
});
