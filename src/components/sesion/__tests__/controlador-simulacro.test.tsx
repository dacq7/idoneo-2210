// src/components/sesion/__tests__/controlador-simulacro.test.tsx
// Proyecto `componentes`, jsdom (ADR-016).
//
// **Nadie montaba este componente.** El `code-reviewer` lo demostró con un
// mutante que ignoraba `destinoCierre` por completo: el diagnóstico cerraba
// hacia `/resultados` en vez de `/plan` —perdiendo el titular del Paso 13— y la
// suite entera seguía en verde.
//
// Los casos son de ciclo de vida y ninguna función pura los expresa: qué
// pantalla se monta depende de la viabilidad calculada y de lo que haya en
// `localStorage`.

import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { ITEMS } from '@/content/banco/c5-umbrales-zonas';
import { DIAGNOSTICO } from '@/content/blueprint-examen';
import { reiniciarTodo } from '@/lib/almacenamiento';
import type { CensoModulo } from '@/lib/simulacro';
import { ControladorSimulacro } from '../controlador-simulacro';

const SLUGS = ['c5-umbrales-zonas'];

/** Censo que hace VIABLE el blueprint, para poder llegar al botón. */
function censoAmplio(bp = DIAGNOSTICO): CensoModulo[] {
  return [
    { slug: 'c5-umbrales-zonas', bloque: 'C', disponibles: 500, filtradoPara: bp.id },
  ];
}

function montar(props: Partial<Parameters<typeof ControladorSimulacro>[0]> = {}) {
  return render(
    <ControladorSimulacro
      blueprint={DIAGNOSTICO}
      censo={censoAmplio()}
      slugs={SLUGS}
      tipo="diagnostico"
      ambito="global"
      bloque={null}
      alternativa={null}
      volver={{ href: '/', texto: 'Volver' }}
      {...props}
    />,
  );
}

beforeEach(() => {
  reiniciarTodo();
});

describe('ControladorSimulacro', () => {
  it('con censo insuficiente NO ofrece empezar y dice qué falta', async () => {
    const pobre: CensoModulo[] = [
      { slug: 'c5-umbrales-zonas', bloque: 'C', disponibles: 3, filtradoPara: DIAGNOSTICO.id },
    ];
    montar({ censo: pobre });
    await waitFor(() =>
      expect(screen.getByText(/Todavía no hay preguntas suficientes/)).toBeDefined(),
    );
    expect(screen.queryByRole('button', { name: 'Empezar' })).toBeNull();
    expect(screen.getByText(/faltan/)).toBeDefined();
  });

  it('con censo NO exacto tampoco lo ofrece, aunque el total alcance', async () => {
    // El censo alcanza en número pero no se contó para este blueprint: su
    // veredicto sería una cota superior (ADR-025).
    const sinMarcar: CensoModulo[] = [
      { slug: 'c5-umbrales-zonas', bloque: 'C', disponibles: 500 },
    ];
    montar({ censo: sinMarcar });
    await waitFor(() =>
      expect(screen.getByText(/todavía no se puede preparar/)).toBeDefined(),
    );
    expect(screen.queryByRole('button', { name: 'Empezar' })).toBeNull();
  });

  it('con censo viable y exacto SÍ ofrece empezar', async () => {
    montar();
    await waitFor(() => expect(screen.getByRole('button', { name: 'Empezar' })).toBeDefined());
  });

  it('RESPETA destinoCierre: el diagnóstico cierra hacia /plan', async () => {
    // El mutante que ignoraba esta prop sobrevivía a los 636 tests.
    const { container } = montar({
      destinoCierre: { href: '/plan', texto: 'Ver mi plan de estudio' },
    });
    await waitFor(() => expect(screen.getByRole('button', { name: 'Empezar' })).toBeDefined());
    screen.getByRole('button', { name: 'Empezar' }).click();

    // La tanda arranca; se cierra desde el primer ítem para llegar al resumen.
    await waitFor(() => expect(screen.getByText(/Ítem 1 de/)).toBeDefined());
    // El blueprint pide 30 y el banco de C5 da menos, así que la tanda es corta
    // y el botón de terminar aparece en el último ítem.
    const terminar = await pulsarHastaTerminar(container);
    expect(terminar).toBe(true);

    await waitFor(() =>
      expect(screen.getByRole('link', { name: 'Ver mi plan de estudio' })).toBeDefined(),
    );
    expect(screen.getByRole('link', { name: 'Ver mi plan de estudio' }).getAttribute('href')).toBe(
      '/plan',
    );
  });

  it('SIN destinoCierre cierra hacia el informe del intento', async () => {
    const { container } = montar({ tipo: 'bloque', ambito: 'C' });
    await waitFor(() => expect(screen.getByRole('button', { name: 'Empezar' })).toBeDefined());
    screen.getByRole('button', { name: 'Empezar' }).click();
    await waitFor(() => expect(screen.getByText(/Ítem 1 de/)).toBeDefined());
    await pulsarHastaTerminar(container);

    const enlace = await screen.findByRole('link', { name: 'Ver el informe completo' });
    expect(enlace.getAttribute('href')).toMatch(/^\/resultados\/\d+$/);
  });
});

/** Avanza por la tanda hasta pulsar «Terminar». Devuelve si lo consiguió. */
async function pulsarHastaTerminar(container: HTMLElement): Promise<boolean> {
  for (let i = 0; i < ITEMS.length + 5; i++) {
    const terminar = [...container.querySelectorAll('button')].find((b) =>
      /Terminar y ver el resultado/.test(b.textContent ?? ''),
    );
    if (terminar) {
      terminar.click();
      return true;
    }
    const siguiente = [...container.querySelectorAll('button')].find((b) =>
      /^Siguiente/.test(b.textContent ?? ''),
    );
    if (!siguiente) return false;
    siguiente.click();
    await waitFor(() => expect(container).toBeDefined());
  }
  return false;
}
