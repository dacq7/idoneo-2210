// src/components/plan/__tests__/vista-plan.test.tsx
// Proyecto `componentes`, jsdom (ADR-016).
//
// Los tres casos viven en el ciclo de vida y ninguna función pura los expresa:
// `VistaPlan` no recibe el plan por prop, lo **genera** con lo que hay en
// `localStorage` tras hidratar —fecha de examen, diagnóstico y dominados— y con
// la fecha local leída en un efecto.
//
// El caso 1 es el requisito del paso: **el plan tiene que seguir siendo útil
// sin fecha de examen**. Un plan que se niega a existir hasta que le den un dato
// deja al usuario donde estaba, y es el estado de la mayoría al abrir la app.

import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BLOQUES, MODULOS } from '@/content/estructura';
import { crearEstadoInicial, guardarEstado, reiniciarTodo } from '@/lib/almacenamiento';
import { fechaLocalDe, sumarDias } from '@/lib/fechas';
import type { EstadoProgreso } from '@/lib/tipos';
import { VistaPlan } from '../vista-plan';

const HOY = fechaLocalDe(new Date());

function sembrar(cambios: Partial<EstadoProgreso> = {}) {
  guardarEstado({ ...crearEstadoInicial(new Date().toISOString()), ...cambios });
}

function montar() {
  return render(<VistaPlan modulos={MODULOS} bloques={BLOQUES} />);
}

beforeEach(() => {
  reiniciarTodo();
});

describe('VistaPlan', () => {
  it('SIN fecha de examen genera un plan útil y lo dice', async () => {
    // El requisito del paso.
    montar();
    await waitFor(() => expect(screen.getByText('El plan completo')).toBeDefined());

    expect(screen.getByText('Las próximas seis semanas')).toBeDefined();
    expect(screen.getByText(/no has puesto la fecha del examen/)).toBeDefined();
    // Y ofrece dónde ponerla, en vez de solo lamentarlo.
    expect(screen.getByRole('link', { name: 'Ir a Ajustes' })).toBeDefined();
  });

  it('CON fecha de examen usa los días reales y no avisa de fecha ausente', async () => {
    sembrar({ fechaExamen: sumarDias(HOY, 30) });
    montar();
    await waitFor(() => expect(screen.getByText('Hasta tu examen')).toBeDefined());
    expect(screen.queryByText(/no has puesto la fecha del examen/)).toBeNull();
  });

  it('sin diagnóstico invita a hacerlo y explica qué mejora', async () => {
    montar();
    await waitFor(() =>
      expect(screen.getByText('Este plan mejora mucho con el diagnóstico')).toBeDefined(),
    );
    expect(screen.getByRole('link', { name: 'Hacer el diagnóstico' })).toBeDefined();
  });

  it('los módulos del plan enlazan a su teoría', async () => {
    montar();
    await waitFor(() => expect(screen.getByText('El plan completo')).toBeDefined());
    const enlaces = screen.getAllByRole('link').filter((a) => a.getAttribute('href')?.startsWith('/modulos/'));
    expect(enlaces.length).toBeGreaterThan(0);
  });

  it('el examen HOY da el plan de una sola noche, sin teoría nueva', async () => {
    sembrar({ fechaExamen: HOY });
    montar();
    await waitFor(() => expect(screen.getByText(/hoy o ya pasó/)).toBeDefined());
    // Aparece dos veces: en «Por aquí ibas» y en el calendario completo.
    expect(screen.getAllByText(/Última noche/).length).toBeGreaterThan(0);
    // Cero enlaces a módulos: no se manda a estudiar teoría la noche antes.
    const aModulos = screen
      .getAllByRole('link')
      .filter((a) => a.getAttribute('href')?.startsWith('/modulos/'));
    expect(aModulos).toHaveLength(0);
  });
});
