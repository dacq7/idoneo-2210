// src/components/inicio/__tests__/panel-inicio.test.tsx
// Proyecto `componentes`, jsdom (ADR-016).
//
// La portada decide **qué debería hacer el usuario ahora**, y esa decisión
// depende por completo de lo que haya en `localStorage` tras hidratar: sesión a
// medias, diagnóstico hecho, plan del día, cola de repaso, módulos dominados.
// Ninguna función pura lo expresa, y equivocarse aquí manda al usuario a la
// pantalla equivocada cada vez que abre la app.
//
// Los seis escalones de prioridad se prueban uno a uno, en orden, porque lo que
// hay que fijar no es que cada uno funcione: es **cuál gana a cuál**.

import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BLOQUES, MODULOS } from '@/content/estructura';
import {
  crearEstadoInicial,
  guardarEstado,
  guardarSesion,
  reiniciarTodo,
} from '@/lib/almacenamiento';
import { fechaLocalDe, sumarDias } from '@/lib/fechas';
import { crearTarjetaSRS } from '@/lib/srs';
import type { EstadoProgreso, IntentoSimulacro, SesionCronometro } from '@/lib/tipos';
import { PanelInicio } from '../panel-inicio';

const HOY = fechaLocalDe(new Date());

const MODULOS_PROPS = MODULOS.map((m) => ({
  slug: m.slug,
  titulo: m.titulo,
  bloque: m.bloque,
  orden: m.orden,
  minutosEstimados: m.minutosEstimados,
  prerequisitos: m.prerequisitos,
  publicado: m.estadoContenido === 'completo',
}));
const BLOQUES_PROPS = BLOQUES.map((b) => ({ id: b.id, pesoExamen: b.pesoExamen }));

function sembrar(cambios: Partial<EstadoProgreso> = {}) {
  guardarEstado({ ...crearEstadoInicial(new Date().toISOString()), ...cambios });
}

function intentoDiagnostico(): IntentoSimulacro {
  const cero = { correctas: 0, total: 0 };
  return {
    id: '1', tipo: 'diagnostico', ambito: 'global', semilla: 1,
    iniciadoEn: '2026-07-31T10:00:00.000Z', terminadoEn: '2026-07-31T10:35:00.000Z',
    segundosUsados: 2100, totalItems: 30, itemIds: [], respuestas: [], puntaje: 50,
    desglose: {
      porBloque: { A: cero, B: cero, C: cero, D: cero },
      porModulo: {},
      porNivel: { recuerdo: cero, comprension: cero, aplicacion: cero },
    },
  };
}

function sesionCronometro(tipo: SesionCronometro['tipo'], ambito: string): SesionCronometro {
  return {
    intentoId: '999', tipo, ambito, semilla: 999, iniciadoEnMs: Date.now() - 60_000,
    duracionSegundos: 7200, itemIds: ['C5-001'], respuestas: {}, avisosVistos: [],
  };
}

function montar() {
  return render(<PanelInicio modulos={MODULOS_PROPS} bloques={BLOQUES_PROPS} />);
}

beforeEach(() => {
  reiniciarTodo();
});

describe('PanelInicio — la prioridad de la acción principal', () => {
  it('1 · un simulacro a medias GANA a todo: el cronómetro sigue corriendo', async () => {
    sembrar({ diagnosticoHecho: true, intentos: [intentoDiagnostico()] });
    guardarSesion(sesionCronometro('final', 'global'));
    montar();

    await waitFor(() => expect(screen.getByText('Tienes un examen a medias')).toBeDefined());
    expect(screen.getByRole('link', { name: /Retomarlo ahora/ }).getAttribute('href')).toBe(
      '/simulacros/final',
    );
  });

  it('el simulacro a medias lleva al ámbito correcto', async () => {
    guardarSesion(sesionCronometro('bloque', 'C'));
    montar();
    await waitFor(() =>
      expect(screen.getByRole('link', { name: /Retomarlo ahora/ }).getAttribute('href')).toBe(
        '/simulacros/bloque/C',
      ),
    );
  });

  it('2 · sin diagnóstico, ES el diagnóstico', async () => {
    montar();
    await waitFor(() => expect(screen.getByText('Empieza por el diagnóstico')).toBeDefined());
    expect(screen.getByRole('link', { name: /Hacer el diagnóstico/ }).getAttribute('href')).toBe(
      '/diagnostico',
    );
  });

  it('3 · con diagnóstico hecho, lo que toca hoy según el plan', async () => {
    sembrar({ diagnosticoHecho: true, intentos: [intentoDiagnostico()] });
    montar();
    // Solo C5 está publicado, así que el plan del día es C5.
    await waitFor(() =>
      expect(screen.getByRole('link', { name: /Estudiar este módulo/ }).getAttribute('href')).toBe(
        '/modulos/c5-umbrales-zonas',
      ),
    );
  });

  it('4 · con el módulo del día ya dominado, gana la cola de repaso', async () => {
    sembrar({
      diagnosticoHecho: true,
      intentos: [intentoDiagnostico()],
      modulos: {
        'c5-umbrales-zonas': {
          teoriaLeida: true, tarjetasVistas: 15, practicaCompletada: true,
          mejorQuiz: 90, intentosQuiz: 1, dominado: true, ultimaVisita: null,
        },
      },
      colaRepaso: { 'C5-T01': crearTarjetaSRS('C5-T01', HOY) },
    });
    montar();
    await waitFor(() => expect(screen.getByText('Toca repasar')).toBeDefined());
    expect(screen.getByRole('link', { name: /Empezar el repaso/ }).getAttribute('href')).toBe(
      '/repaso',
    );
  });

  it('6 · con todo dominado y nada que repasar, lo dice en vez de inventar trabajo', async () => {
    sembrar({
      diagnosticoHecho: true,
      intentos: [intentoDiagnostico()],
      modulos: {
        'c5-umbrales-zonas': {
          teoriaLeida: true, tarjetasVistas: 15, practicaCompletada: true,
          mejorQuiz: 90, intentosQuiz: 1, dominado: true, ultimaVisita: null,
        },
      },
    });
    montar();
    await waitFor(() =>
      expect(screen.getByText('Vas al día con lo que hay publicado')).toBeDefined(),
    );
  });
});

describe('PanelInicio — el resto de la pantalla', () => {
  it('el denominador de módulos dominados son los PUBLICADOS, no los 29', async () => {
    // Mostrar 0/29 haría creer al usuario que va tarde cuando va al día: 28 de
    // los 29 no están escritos todavía.
    montar();
    await waitFor(() => expect(screen.getByText('Dónde estás')).toBeDefined());
    expect(screen.getByText('0/1')).toBeDefined();
    expect(screen.getByText(/Hay 1 de 29 módulos publicados/)).toBeDefined();
  });

  it('da acceso a /plan y /diagnostico, que no caben en la barra (A-01)', async () => {
    montar();
    await waitFor(() => expect(screen.getByText('Prepararte con método')).toBeDefined());
    expect(screen.getByRole('link', { name: /Tu plan de estudio/ }).getAttribute('href')).toBe(
      '/plan',
    );
    expect(screen.getByRole('link', { name: /Diagnóstico inicial/ })).toBeDefined();
  });

  it('con el diagnóstico hecho, ofrece repetirlo en vez de hacerlo', async () => {
    sembrar({ diagnosticoHecho: true, intentos: [intentoDiagnostico()] });
    montar();
    await waitFor(() => expect(screen.getByText(/Repetir el diagnóstico/)).toBeDefined());
  });

  it('toca la racha al abrir, una vez', async () => {
    montar();
    await waitFor(() => expect(screen.getByText('1')).toBeDefined());
    expect(screen.getByText(/día seguido/)).toBeDefined();
  });

  it('no pinta la racha cuando todavía no hay ninguna', async () => {
    // `tocarRacha` la pone a 1 al montar, así que el caso de 0 solo existe
    // antes del efecto. Lo que se comprueba es que el componente no pinta un
    // «0 días seguidos», que sería un reproche.
    const { container } = render(<PanelInicio modulos={[]} bloques={BLOQUES_PROPS} />);
    expect(container.textContent).not.toContain('0 días seguidos');
  });

  it('sin ningún módulo publicado lo dice, en vez de ofrecer un módulo inexistente', async () => {
    // La versión anterior de este test renderizaba ANTES de sembrar y afirmaba
    // el escalón del diagnóstico, así que pasaba igual quitándole el
    // `publicado: false` — no cubría nada. Lo cazó el `code-reviewer` con un
    // mutante. Ahora siembra primero y comprueba el escalón 7 de verdad.
    sembrar({ diagnosticoHecho: true, intentos: [intentoDiagnostico()] });
    render(
      <PanelInicio
        modulos={MODULOS_PROPS.map((m) => ({ ...m, publicado: false }))}
        bloques={BLOQUES_PROPS}
      />,
    );
    await waitFor(() =>
      expect(screen.getByText('Vas al día con lo que hay publicado')).toBeDefined(),
    );
    expect(screen.getByText(/Todavía no hay ningún módulo publicado/)).toBeDefined();
  });
});

/* ══════════════════════════════════════════════════════════════════
   Los dos bloqueantes del `code-reviewer`

   Los dos son de la misma familia: la portada daba un consejo FALSO en
   una combinación de estado alcanzable. Y en un caso se quedaba clavada
   ahí para siempre, dejando los demás escalones sin alcanzar.
   ══════════════════════════════════════════════════════════════════ */

describe('PanelInicio — B1: una sesión vencida no puede secuestrar la portada', () => {
  function sesionVencida(): SesionCronometro {
    return {
      intentoId: '888',
      tipo: 'final',
      ambito: 'global',
      semilla: 888,
      // Empezada hace tres días, con dos horas de duración.
      iniciadoEnMs: Date.now() - 3 * 24 * 3600_000,
      duracionSegundos: 7200,
      itemIds: ['C5-001'],
      respuestas: {},
      avisosVistos: [],
    };
  }

  it('NO afirma que el cronómetro sigue corriendo cuando llegó a cero hace días', async () => {
    guardarSesion(sesionVencida());
    montar();
    await waitFor(() => expect(screen.getByText('Se te acabó el tiempo de un examen')).toBeDefined());
    expect(screen.queryByText(/El cronómetro sigue corriendo/)).toBeNull();
  });

  it('y ofrece cerrarlo, no «retomarlo»', async () => {
    guardarSesion(sesionVencida());
    montar();
    await waitFor(() => expect(screen.getByRole('link', { name: /Ver cómo quedó/ })).toBeDefined());
  });

  it('con la sesión VIVA sí dice que el reloj corre', async () => {
    guardarSesion({ ...sesionVencida(), iniciadoEnMs: Date.now() - 60_000 });
    montar();
    await waitFor(() => expect(screen.getByText('Tienes un examen a medias')).toBeDefined());
    expect(screen.getByText(/El cronómetro sigue corriendo/)).toBeDefined();
  });

  it('una sesión de quiz no manda a una ruta de simulacro inexistente', async () => {
    // `TipoIntento` admite 'quiz' aunque hoy nadie escriba esas sesiones. El
    // ternario original producía `/simulacros/bloque/c5-…`, un 404 silencioso.
    guardarSesion({
      ...sesionVencida(),
      tipo: 'quiz',
      ambito: 'c5-umbrales-zonas',
      iniciadoEnMs: Date.now() - 60_000,
      duracionSegundos: null,
    });
    montar();
    await waitFor(() =>
      expect(screen.getByRole('link', { name: /Retomarlo ahora/ }).getAttribute('href')).toBe(
        '/modulos/c5-umbrales-zonas/quiz',
      ),
    );
  });
});

describe('PanelInicio — B2: el día del examen no se estudia materia nueva', () => {
  it('con el examen HOY no ofrece un módulo, y coincide con lo que dice /plan', async () => {
    // `/plan` dice «nada de teoría nueva» ese día. La portada ofrecía 45
    // minutos de módulo: dos pantallas de la misma app contradiciéndose.
    sembrar({
      diagnosticoHecho: true,
      intentos: [intentoDiagnostico()],
      fechaExamen: HOY,
    });
    montar();
    await waitFor(() => expect(screen.getByText('Tu examen es hoy')).toBeDefined());
    expect(screen.getByText(/no se estudia materia nueva/)).toBeDefined();
    expect(screen.queryByRole('link', { name: /Estudiar este módulo/ })).toBeNull();
  });

  it('con el examen ya PASADO lo dice, en vez de repetir el mismo consejo', async () => {
    sembrar({
      diagnosticoHecho: true,
      intentos: [intentoDiagnostico()],
      fechaExamen: sumarDias(HOY, -5),
    });
    montar();
    await waitFor(() => expect(screen.getByText('Tu examen ya pasó')).toBeDefined());
    expect(screen.getByText(/cambia la fecha en tu plan/)).toBeDefined();
  });

  it('un examen en el FUTURO no dispara el escalón', async () => {
    sembrar({
      diagnosticoHecho: true,
      intentos: [intentoDiagnostico()],
      fechaExamen: sumarDias(HOY, 30),
    });
    montar();
    await waitFor(() =>
      expect(screen.getByRole('link', { name: /Estudiar este módulo/ })).toBeDefined(),
    );
  });
});

describe('PanelInicio — R2 y R3', () => {
  it('el escalón 6 se alcanza cuando el plan del día no trae módulo', async () => {
    // Sin fecha de examen y con la cola vacía, el plan reparte C5 en el día 1;
    // al dominarlo, el escalón 4 lo salta y no hay repaso, así que cae al 6.
    // Es el escalón que no tenía test y el que emitía el copy de B2.
    sembrar({
      diagnosticoHecho: true,
      intentos: [intentoDiagnostico()],
      modulos: {
        'c5-umbrales-zonas': {
          teoriaLeida: true, tarjetasVistas: 15, practicaCompletada: true,
          mejorQuiz: 90, intentosQuiz: 1, dominado: true, ultimaVisita: null,
        },
      },
    });
    montar();
    await waitFor(() =>
      expect(screen.getByText('Vas al día con lo que hay publicado')).toBeDefined(),
    );
  });

  it('R3 · el numerador de dominados nunca supera al denominador', async () => {
    // Vía real: importar un respaldo con progreso de módulos que aquí no están
    // publicados. Producía «3/1 módulos dominados».
    const dominado = {
      teoriaLeida: true, tarjetasVistas: 0, practicaCompletada: true,
      mejorQuiz: 95, intentosQuiz: 1, dominado: true, ultimaVisita: null,
    };
    sembrar({
      diagnosticoHecho: true,
      intentos: [intentoDiagnostico()],
      modulos: {
        'c5-umbrales-zonas': dominado,
        'a1-celula': dominado,
        'd2-carga': dominado,
      },
    });
    montar();
    await waitFor(() => expect(screen.getByText('Dónde estás')).toBeDefined());
    expect(screen.getByText('1/1')).toBeDefined();
    expect(screen.queryByText('3/1')).toBeNull();
  });

  it('la racha no se infla al remontar', async () => {
    // El test anterior no remontaba, así que el «una vez» de su nombre no se
    // probaba.
    const vista = montar();
    await waitFor(() => expect(screen.getByText(/día seguido/)).toBeDefined());
    vista.unmount();
    montar();
    await waitFor(() => expect(screen.getByText(/día seguido/)).toBeDefined());
    expect(screen.queryByText(/2 días seguidos/)).toBeNull();
  });
});
