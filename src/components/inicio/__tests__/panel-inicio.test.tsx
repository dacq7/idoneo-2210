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
import { GLOSARIO } from '@/content/glosario';
import { DATOS_DUROS } from '@/content/datos-duros';
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

function sesionCronometro(tipo: SesionCronometro['tipo'], ambito: string): SesionCronometro {
  return {
    intentoId: '999', tipo, ambito, semilla: 999, iniciadoEnMs: Date.now() - 60_000,
    duracionSegundos: 7200, itemIds: ['C5-001'], respuestas: {}, avisosVistos: [],
  };
}

function montar() {
  return render(<PanelInicio
      modulos={MODULOS_PROPS}
      bloques={BLOQUES_PROPS}
      totalGlosario={GLOSARIO.length}
      totalDatosDuros={DATOS_DUROS.length}
    />);
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
    // Qué módulo concreto toca hoy lo decide `generarPlan`, que ordena por
    // debilidad × peso del bloque: cambia con cada paso de contenido, y fijar un
    // slug aquí convierte este test en un detector de pasos nuevos en vez de un
    // test de la portada. Lo que sí tiene que cumplirse siempre es que apunte a
    // un módulo PUBLICADO — mandar al usuario a uno en preparación es el fallo
    // que este escalón existe para impedir.
    const publicados = new Set(PUBLICADOS.map((m) => `/modulos/${m.slug}`));
    await waitFor(() => {
      const destino = screen
        .getByRole('link', { name: /Estudiar este módulo/ })
        .getAttribute('href');
      expect(publicados.has(destino ?? '')).toBe(true);
    });
  });

  it('4 · con el módulo del día ya dominado, gana la cola de repaso', async () => {
    sembrar({
      diagnosticoHecho: true,
      intentos: [intentoDiagnostico()],
      modulos: todosDominados(),
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
      modulos: todosDominados(),
    });
    montar();
    await waitFor(() =>
      expect(screen.getByText('Vas al día con lo que hay publicado')).toBeDefined(),
    );
  });
});

describe('PanelInicio — el resto de la pantalla', () => {
  it('el denominador de módulos dominados son los PUBLICADOS, no los 29', async () => {
    // Mostrar 0/29 haría creer al usuario que va tarde cuando va al día: los
    // módulos sin escribir no se pueden dominar.
    //
    // Las cifras se DERIVAN del catálogo. Estaban escritas como `'0/1'` y
    // «Hay 1 de 29», y caducaron al publicar el bloque D — que es justo el
    // cambio que este test debería sobrevivir.
    montar();
    await waitFor(() => expect(screen.getByText('Dónde estás')).toBeDefined());
    expect(screen.getByText(`0/${PUBLICADOS.length}`)).toBeDefined();
  });

  it('la nota «hay N de 29 publicados» aparece solo si queda catálogo por publicar', async () => {
    // Segunda caducidad de este archivo, y de la misma familia que la primera:
    // el test daba por hecho que SIEMPRE faltarían módulos. Al cerrar el paso
    // 17 el catálogo se completó y la nota desapareció — con razón, porque
    // decirle a alguien «hay 29 de 29 publicados» no informa de nada.
    //
    // La forma duradera es condicionar la aserción al estado real del
    // catálogo, no al que había el día en que se escribió el test.
    const faltanPorPublicar = PUBLICADOS.length < MODULOS.length;
    montar();
    await waitFor(() => expect(screen.getByText('Dónde estás')).toBeDefined());
    const nota = screen.queryByText(
      new RegExp(`Hay ${PUBLICADOS.length} de ${MODULOS.length} módulos publicados`),
    );
    expect(nota !== null).toBe(faltanPorPublicar);
  });

  it('da acceso a /plan, que no cabe en la barra (A-01)', async () => {
    montar();
    await waitFor(() => expect(screen.getByText('Prepararte con método')).toBeDefined());
    expect(screen.getByRole('link', { name: /Tu plan de estudio/ }).getAttribute('href')).toBe(
      '/plan',
    );
  });

  it('[A-44] no repite el diagnóstico en la lista cuando YA es la acción principal', async () => {
    // Usuario nuevo: el escalón 2 pone el diagnóstico en el botón grande.
    // Tenerlo también en la lista lo hacía aparecer dos veces en la primera
    // pantalla, compitiendo con el escalón que la portada quiere que se pulse.
    montar();
    await waitFor(() => expect(screen.getByText('Empieza por el diagnóstico')).toBeDefined());
    expect(screen.getAllByRole('link', { name: /diagnóstico/i })).toHaveLength(1);
  });

  it('[A-44] y SÍ lo ofrece en la lista cuando la acción principal es otra', async () => {
    sembrar({ diagnosticoHecho: true, intentos: [intentoDiagnostico()] });
    montar();
    await waitFor(() => expect(screen.getByText(/Repetir el diagnóstico/)).toBeDefined());
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
    const { container } = render(<PanelInicio
        modulos={[]}
        bloques={BLOQUES_PROPS}
        totalGlosario={GLOSARIO.length}
        totalDatosDuros={DATOS_DUROS.length}
      />);
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
      totalGlosario={123}
      totalDatosDuros={70}
      />,
    );
    await waitFor(() =>
      expect(screen.getByText('Vas al día con lo que hay publicado')).toBeDefined(),
    );
    expect(screen.getByText(/Todavía no hay ningún módulo publicado/)).toBeDefined();
  });
});
