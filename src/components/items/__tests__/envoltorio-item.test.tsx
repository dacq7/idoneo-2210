// src/components/items/__tests__/envoltorio-item.test.tsx
//
// El test de regresión del bloqueante del Paso 9 (ADR-016).
//
// Qué protege: `<Control key={item.id} />` en `envoltorio-item.tsx`. React solo
// desmonta la hoja cuando cambia el TIPO de elemento, así que sin `key`, dos
// ítems consecutivos del mismo `tipo` reutilizan la instancia y arrastran su
// estado local. C5 tiene 4 `calculo`, 3 `multiple`, 3 `caso` y 2 `emparejar` en
// 28 ítems, y una tanda saca 8 o 10: la adyacencia no es hipotética.
//
// El daño es silencioso, y por eso hace falta un test y no un ojo: el segundo
// `calculo` aparece con el número tecleado en el primero mientras `valor` sigue
// en `null`. El usuario ve su respuesta escrita, no toca nada, `onCambio` no se
// dispara y el ítem se califica EN BLANCO. Nada en pantalla lo delata.
//
// Es la única clase de defecto que no se puede probar con funciones puras: vive
// en la reconciliación, no en la lógica.

import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EnvoltorioItem } from '../envoltorio-item';
import type { ItemCalculo, ItemUnica } from '@/lib/tipos';

const BASE = {
  modulo: 'c5-umbrales-zonas',
  bloque: 'C' as const,
  nivel: 'aplicacion' as const,
  dificultad: 2 as const,
  explicacion: 'x'.repeat(200),
  referencia: 'Cartilla 3, Tema 2, Subtema 2.6 — Zonas de entrenamiento',
  etiquetas: ['prueba'],
};

function calculo(id: string, enunciado: string): ItemCalculo {
  return {
    ...BASE,
    id,
    tipo: 'calculo',
    enunciado,
    respuesta: 117,
    tolerancia: 1,
    unidad: 'lpm',
    pasos: ['FCmáx = 220 − edad', 'FC objetivo = FCmáx × 0,65'],
  };
}

function unica(id: string, enunciado: string): ItemUnica {
  return {
    ...BASE,
    id,
    tipo: 'unica',
    enunciado,
    opciones: ['A', 'B', 'C', 'D'],
    correcta: 0,
  };
}

describe('EnvoltorioItem — aislamiento entre ítems consecutivos', () => {
  it('un segundo `calculo` NO hereda el texto tecleado en el primero', async () => {
    const usuario = userEvent.setup();
    const onCambio = vi.fn();

    const props = (item: ItemCalculo) => ({
      item,
      valor: null,
      modo: 'respondiendo' as const,
      onCambio,
      numero: 1,
      total: 2,
    });

    const { rerender } = render(<EnvoltorioItem {...props(calculo('C5-011', 'Primero'))} />);

    const primero = screen.getByRole('textbox');
    await usuario.type(primero, '126,2');
    expect((primero as HTMLInputElement).value).toBe('126,2');

    // Mismo `tipo`, distinto ítem: es exactamente la transición que reutilizaba
    // la instancia. `valor` sigue en null, así que el campo debe salir vacío.
    rerender(<EnvoltorioItem {...props(calculo('C5-017', 'Segundo'))} />);

    expect(screen.getByText('Segundo')).toBeDefined();
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('');
  });

  it('una segunda `unica` NO conserva la opción marcada en la primera', async () => {
    const usuario = userEvent.setup();

    const props = (item: ItemUnica) => ({
      item,
      valor: null,
      modo: 'respondiendo' as const,
      onCambio: vi.fn(),
      numero: 1,
      total: 2,
    });

    const { rerender } = render(<EnvoltorioItem {...props(unica('C5-001', 'Primera'))} />);
    await usuario.click(screen.getByRole('button', { name: /A/ }));

    rerender(<EnvoltorioItem {...props(unica('C5-002', 'Segunda'))} />);

    // Con `valor` en null ninguna opción puede quedar marcada.
    for (const boton of screen.getAllByRole('button')) {
      expect(boton.getAttribute('aria-pressed')).not.toBe('true');
    }
  });

  it('el mismo ítem re-renderizado SÍ conserva su estado local', async () => {
    const usuario = userEvent.setup();
    const item = calculo('C5-011', 'El mismo');

    const props = (numero: number) => ({
      item,
      valor: null,
      modo: 'respondiendo' as const,
      onCambio: vi.fn(),
      numero,
      total: 2,
    });

    const { rerender } = render(<EnvoltorioItem {...props(1)} />);
    await usuario.type(screen.getByRole('textbox'), '117');

    // La `key` no debe remontar por cualquier cambio de props: si lo hiciera,
    // el usuario perdería lo tecleado cada vez que el padre re-renderiza.
    rerender(<EnvoltorioItem {...props(1)} />);

    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('117');
  });
});
