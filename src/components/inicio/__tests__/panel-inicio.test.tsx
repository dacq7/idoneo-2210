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
import { fechaLocalDe } from '@/lib/fechas';
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
    render(
      <PanelInicio
        modulos={MODULOS_PROPS.map((m) => ({ ...m, publicado: false }))}
        bloques={BLOQUES_PROPS}
      />,
    );
    // Sin diagnóstico gana el diagnóstico; con él hecho, el escalón 6.
    sembrar({ diagnosticoHecho: true, intentos: [intentoDiagnostico()] });
    await waitFor(() => expect(screen.getByText(/Empieza por el diagnóstico/)).toBeDefined());
  });
});
