// src/hooks/__tests__/usar-sesion.test.tsx — proyecto `componentes` (ADR-016).
//
// Cubre la idempotencia de `terminar()`, que el `code-reviewer` marcó en el
// Paso 9. Hoy no es alcanzable desde la interfaz —el botón se desmonta al primer
// clic y `Enter` está excluido a propósito de cerrar la tanda—, pero el Paso 11
// mete auto-envío por temporizador compitiendo con el clic del usuario. El
// síntoma sería un `intentosQuiz` inflado, que es un dato que el informe del
// Paso 12 lee y presenta.
//
// Va en jsdom y no en node porque `useSesion` es un hook: su comportamiento vive
// en el ciclo de vida de React, no en una función.

import { describe, expect, it } from 'vitest';
import { act, render } from '@testing-library/react';
import { useSesion } from '../usar-sesion';
import type { Item, ItemUnica } from '@/lib/tipos';

function unica(id: string, correcta: number): ItemUnica {
  return {
    id,
    modulo: 'c5-umbrales-zonas',
    bloque: 'C',
    tipo: 'unica',
    nivel: 'recuerdo',
    dificultad: 1,
    enunciado: `Enunciado de ${id}`,
    opciones: ['A', 'B', 'C', 'D'],
    correcta,
    explicacion: 'x'.repeat(200),
    referencia: 'Cartilla 3, Tema 2, Subtema 2.6 — Zonas de entrenamiento',
    etiquetas: ['prueba'],
  };
}

/** Monta el hook y expone su API sin pintar nada. */
function montar(items: Item[]) {
  const caja: { sesion: ReturnType<typeof useSesion> | null } = { sesion: null };
  function Sonda() {
    caja.sesion = useSesion(items);
    return null;
  }
  render(<Sonda />);
  return caja as { sesion: ReturnType<typeof useSesion> };
}

describe('useSesion — terminar() es idempotente', () => {
  const items = [unica('C5-001', 0), unica('C5-002', 1)];

  it('dos llamadas seguidas devuelven el MISMO resumen, sin recalcular', () => {
    const caja = montar(items);

    act(() => {
      caja.sesion.responder(0);
    });

    let primero!: ReturnType<typeof caja.sesion.terminar>;
    let segundo!: ReturnType<typeof caja.sesion.terminar>;
    act(() => {
      primero = caja.sesion.terminar();
      // Segunda llamada DENTRO del mismo tick: es el caso que el estado no
      // puede cubrir, porque `terminada` todavía vale false en la clausura.
      segundo = caja.sesion.terminar();
    });

    expect(segundo).toBe(primero);
    expect(primero.total).toBe(2);
    expect(primero.correctas).toBe(1);
    expect(primero.sinResponder).toBe(1);
  });

  it('el puntaje no cambia al llamar terminar() una tercera vez', () => {
    const caja = montar(items);
    act(() => {
      caja.sesion.responder(0);
    });

    let puntajes: number[] = [];
    act(() => {
      puntajes = [
        caja.sesion.terminar().puntaje,
        caja.sesion.terminar().puntaje,
        caja.sesion.terminar().puntaje,
      ];
    });

    expect(new Set(puntajes).size).toBe(1);
    expect(puntajes[0]).toBe(50);
  });

  it('la calificación la hace el motor: una respuesta malformada no acierta', () => {
    const caja = montar([unica('C5-001', 0)]);

    act(() => {
      // El controlador nunca manda esto, pero una sesión restaurada corrupta sí
      // puede (el Paso 11 la lee sin Zod). `calificar` devuelve false sin lanzar.
      caja.sesion.responder('0' as unknown as number);
    });

    let resumen!: ReturnType<typeof caja.sesion.terminar>;
    act(() => {
      resumen = caja.sesion.terminar();
    });

    expect(resumen.correctas).toBe(0);
    expect(resumen.detalle[0].respondida).toBe(true);
  });
});
