// src/components/sesion/__tests__/controlador-repaso.test.tsx
// Proyecto `componentes`, jsdom (ADR-016).
//
// Por qué estos tres casos y no otros: los tres solo se ven MONTANDO. `/repaso`
// no tiene props que decidan lo que muestra —lo decide `localStorage`, leído
// tras la hidratación— así que ninguna función pura puede cubrirlos.
//
//  1. **Usuario nuevo → estado vacío honesto, NO esqueleto eterno.** Es el fallo
//     que el contrato de `useEstado()` documenta en COMPONENTES.md: el hook
//     devuelve `null` de forma permanente mientras no haya nada guardado, y en
//     esta ruta ese es el caso normal de todo el mundo la primera vez. Un
//     esqueleto que no se va nunca es un bug, y solo se ve al montar.
//  2. **La cola se resuelve contra el contenido real con `import()` dinámico.**
//     Es la decisión del paso; si el mapeo id → módulo → contenido se rompe, la
//     sesión sale vacía y nadie se entera hasta abrir la app.
//  3. **Un id sin contenido publicado no deja la pantalla en blanco.**

import { describe, expect, it, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ControladorRepaso } from '../controlador-repaso';
import { fechaLocalDe } from '@/lib/fechas';
import { crearEstadoInicial, guardarEstado, reiniciarTodo } from '@/lib/almacenamiento';
import { crearTarjetaSRS } from '@/lib/srs';
import { sumarDias } from '@/lib/fechas';
import type { TarjetaSRS } from '@/lib/tipos';

const MODULOS = [
  { slug: 'c5-umbrales-zonas', titulo: 'Umbrales y zonas de entrenamiento', bloque: 'C' as const },
];

const HOY = fechaLocalDe(new Date());

function sembrarCola(...tarjetas: TarjetaSRS[]) {
  const estado = crearEstadoInicial(new Date().toISOString());
  guardarEstado({
    ...estado,
    colaRepaso: Object.fromEntries(tarjetas.map((t) => [t.id, t])),
  });
}

beforeEach(() => {
  reiniciarTodo();
});

describe('ControladorRepaso', () => {
  it('un usuario nuevo ve el estado vacío honesto, no un esqueleto eterno', async () => {
    render(<ControladorRepaso modulos={MODULOS} />);

    expect(await screen.findByText(/Todavía no hay nada que repasar/)).toBeTruthy();
    // Y la acción concreta que el brief §6.1 exige: el siguiente módulo.
    expect(screen.getByText(/Umbrales y zonas de entrenamiento/)).toBeTruthy();
  });

  it('con cola al día dice cuándo vuelve a tocar, y no rellena con nada', async () => {
    sembrarCola({ ...crearTarjetaSRS('C5-T01', HOY), proximaRevision: sumarDias(HOY, 3) });

    render(<ControladorRepaso modulos={MODULOS} />);

    expect(await screen.findByText(/tu memoria va al día/)).toBeTruthy();
    expect(screen.getByText(/dentro de 3 días/)).toBeTruthy();
    // Cero relleno: no hay ninguna sesión montada.
    expect(screen.queryByText(/Ver la respuesta/)).toBeNull();
  });

  it('resuelve ítems y tarjetas de la MISMA cola contra el contenido real', async () => {
    sembrarCola(crearTarjetaSRS('C5-T01', HOY), crearTarjetaSRS('C5-001', HOY));

    render(<ControladorRepaso modulos={MODULOS} />);

    // El contenido llega por `import()` dinámico: hay que esperar.
    // El orden NO lo decide este componente: con el mismo atraso, `colaDelDia`
    // desempata por `localeCompare`, y 'C5-001' va antes que 'C5-T01'. Por eso
    // el primer elemento es la pregunta y no la tarjeta.
    expect(await screen.findByText(/Elemento 1 de 2/)).toBeTruthy();
    expect(screen.getByText(/pregunta de Umbrales y zonas/)).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Comprobar' })).toBeTruthy();
  });

  it('una tarjeta de la cola se responde como tarjeta, no como pregunta', async () => {
    sembrarCola(crearTarjetaSRS('C5-T01', HOY));

    render(<ControladorRepaso modulos={MODULOS} />);

    expect(await screen.findByText(/tarjeta de Umbrales y zonas/)).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Ver la respuesta' })).toBeTruthy();
  });

  it('un id sin contenido publicado no deja la pantalla en blanco', async () => {
    sembrarCola(crearTarjetaSRS('Z9-T01', HOY));

    render(<ControladorRepaso modulos={MODULOS} />);

    expect(await screen.findByText(/apunta a contenido que ya no está/)).toBeTruthy();
  });
});

/* ─── Fallo de red al descargar el contenido de la cola ─────────────── */

describe('ControladorRepaso — el import() del contenido rechaza', () => {
  // §3 del brief cuenta con conectividad intermitente: un `ChunkLoadError` en
  // esta ruta no es un borde exótico, es el martes por la noche en el bus. Antes
  // de la quinta pantalla, la vista se quedaba en «cargando» PARA SIEMPRE, y la
  // guarda `preparando` bloqueaba cualquier reintento posterior.
  it('muestra la pantalla honesta con reintento, no un esqueleto eterno', async () => {
    sembrarCola(crearTarjetaSRS('C5-T01', HOY));

    // El índice de tarjetas es lo primero que `resolverElementos` pide.
    vi.doMock('@/content/tarjetas/indice', () => {
      throw new Error('ChunkLoadError: Loading chunk 886 failed');
    });

    const { ControladorRepaso: Controlador } = await import('../controlador-repaso');
    render(<Controlador modulos={MODULOS} />);

    const titulo = await screen.findByText(/No se pudo cargar el material de hoy/i);
    expect(titulo).toBeDefined();
    expect(screen.getByRole('button', { name: /Reintentar/i })).toBeDefined();

    // Y lo que de verdad importa: NO quedó un esqueleto vivo.
    expect(screen.queryByText(/Cargando tu cola de repaso/i)).toBeNull();

    vi.doUnmock('@/content/tarjetas/indice');
  });
});
