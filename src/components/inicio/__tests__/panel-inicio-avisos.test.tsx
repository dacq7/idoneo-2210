// src/components/inicio/__tests__/panel-inicio-avisos.test.tsx
// Proyecto `componentes`, jsdom (ADR-016).
//
// Los casos en que la portada daba un **consejo falso** en un estado alcanzable:
// los dos bloqueantes que el `code-reviewer` encontró en el Paso 14 y los
// relevantes que salieron con ellos.
//
// ══ POR QUÉ VIVEN EN SU PROPIO ARCHIVO ══
// Por dos razones, y la primera es mecánica: `panel-inicio.test.tsx` llegó a
// **306 líneas de código** al derivar sus fixtures del catálogo en el Paso 15, y
// la compuerta `max-lines` de ADR-022 la paró. Es el mismo aviso que la fila del
// Paso 12 en `REVISIONES.md` dejó escrito —«margen cero: una línea más y la
// compuerta salta sin aviso»— cumpliéndose.
//
// La segunda es que agrupan bien: el archivo hermano prueba **qué recomienda**
// la portada; este prueba **qué NO puede llegar a decir**. Son dos preguntas
// distintas sobre el mismo componente.

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
import type { EstadoProgreso, IntentoSimulacro, SesionCronometro } from '@/lib/tipos';
import { PanelInicio } from '../panel-inicio';

const HOY = fechaLocalDe(new Date());

/** Los publicados de verdad, derivados del catálogo. Crece en los pasos 15–17. */
const PUBLICADOS = MODULOS.filter((m) => m.estadoContenido === 'completo');

/**
 * Estado que marca **todos** los módulos publicados como dominados.
 *
 * Los casos que necesitan «no queda nada por estudiar» lo construían con un
 * literal de un solo módulo, porque cuando se escribieron solo C5 estaba
 * publicado. Al publicar el bloque D entero dejaron de alcanzar su escalón:
 * quedaban 8 módulos sin dominar y la portada, con razón, ofrecía uno.
 */
function todosDominados(): EstadoProgreso['modulos'] {
  return Object.fromEntries(
    PUBLICADOS.map((m) => [
      m.slug,
      {
        teoriaLeida: true,
        tarjetasVistas: 15,
        practicaCompletada: true,
        mejorQuiz: 90,
        intentosQuiz: 1,
        dominado: true,
        ultimaVisita: null,
      },
    ]),
  );
}

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

function montar() {
  return render(<PanelInicio modulos={MODULOS_PROPS} bloques={BLOQUES_PROPS} />);
}

beforeEach(() => {
  reiniciarTodo();
});

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
      modulos: todosDominados(),
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
    // `a1-celula` y `b2-principios` NO están publicados: su progreso no puede
    // contar. Se eligen del catálogo para que el test no dependa de cuáles lo
    // estén en cada paso.
    const sinPublicar = MODULOS.filter((m) => m.estadoContenido !== 'completo').slice(0, 2);
    sembrar({
      diagnosticoHecho: true,
      intentos: [intentoDiagnostico()],
      modulos: {
        [PUBLICADOS[0].slug]: dominado,
        ...Object.fromEntries(sinPublicar.map((m) => [m.slug, dominado])),
      },
    });
    montar();
    await waitFor(() => expect(screen.getByText('Dónde estás')).toBeDefined());
    expect(screen.getByText(`1/${PUBLICADOS.length}`)).toBeDefined();
    expect(screen.queryByText(`3/${PUBLICADOS.length}`)).toBeNull();
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
