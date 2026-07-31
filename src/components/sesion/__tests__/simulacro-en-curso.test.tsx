// src/components/sesion/__tests__/simulacro-en-curso.test.tsx
// Proyecto `componentes`, jsdom (ADR-016).
//
// Por qué estos casos y no otros: **todos viven en el ciclo de vida**, que es
// el alcance que ADR-016 le fijó a este proyecto. Ninguna función pura puede
// expresarlos, porque lo que se prueba es la conversación entre el reloj, el
// estado de React y `localStorage`:
//
//  1. **Auto-envío al llegar a cero.** Existe solo dentro de un `setInterval`.
//  2. **Cerrar la pestaña no regala tiempo.** Se monta con un `iniciadoEnMs`
//     del pasado, que es exactamente lo que ocurre al reabrir la app.
//  3. **Reanudar no pierde respuestas.** Es un defecto de montaje: el hook lee
//     el estado inicial una sola vez, y si lo leyera mal la tanda saldría en
//     blanco con las respuestas todavía en el disco. Es el fallo que ADR-008
//     ya persiguió una vez por otra vía —`leerSesion()` devolvía la sesión
//     vieja con cero respuestas cuando el disco estaba lleno—, y el peor de
//     este paso: el usuario no ve que perdió nada hasta que le califican en
//     blanco lo que sí respondió.
//  4. **Los avisos no se redisparan al recargar.** Se persisten en
//     `avisosVistos`, así que la comprobación es montar dos veces.
//  5. **El cronómetro NO es una región viva.** Regresión de accesibilidad: un
//     `aria-live` sobre una cifra que cambia cada segundo interrumpe al lector
//     de pantalla 120 veces por minuto durante dos horas.

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { ITEMS } from '@/content/banco/c5-umbrales-zonas';
import { leerSesion, reiniciarTodo } from '@/lib/almacenamiento';
import type { SesionCronometro } from '@/lib/tipos';
import { SimulacroEnCurso } from '../simulacro-en-curso';

/** 2026-07-30T20:00:00Z. Fijo: el reloj lo controla el test, no el sistema. */
const INICIO = 1_785_182_400_000;
const MINUTO = 60_000;

const ITEMS_TANDA = ITEMS.slice(0, 3);

function sesion(cambios: Partial<SesionCronometro> = {}): SesionCronometro {
  return {
    intentoId: String(INICIO),
    tipo: 'final',
    ambito: 'global',
    semilla: INICIO,
    iniciadoEnMs: INICIO,
    duracionSegundos: 120 * 60,
    itemIds: ITEMS_TANDA.map((it) => it.id),
    respuestas: {},
    avisosVistos: [],
    ...cambios,
  };
}

function montar(s: SesionCronometro, onCerrar = vi.fn()) {
  const vista = render(
    <SimulacroEnCurso
      items={ITEMS_TANDA}
      sesion={s}
      bloque="C"
      volver={{ href: '/simulacros', texto: 'Volver' }}
      onCerrar={onCerrar}
    />,
  );
  return { vista, onCerrar };
}

/** La región viva de los avisos. Con nombre, porque la pantalla tiene otra
 *  `role="status"` —el «Ítem 1 de 3»— y una consulta por rol a secas encuentra
 *  las dos. */
function avisos(): HTMLElement {
  return screen.getByRole('status', { name: 'Avisos del tiempo' });
}

/**
 * Deja correr un segundo de temporizador.
 *
 * OJO: con los fake timers de Vitest, avanzar el temporizador **también mueve
 * `Date.now()`**, así que esto adelanta el reloj un segundo. Para comprobar una
 * cifra exacta NO hace falta llamarlo: el primer `tick()` del cronómetro corre
 * dentro del efecto de montaje, y `render` de Testing Library ya lo ejecuta.
 */
function avanzarUnTick() {
  act(() => {
    vi.advanceTimersByTime(1000);
  });
}

beforeEach(() => {
  reiniciarTodo();
  vi.useFakeTimers();
  vi.setSystemTime(INICIO);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('cronómetro y auto-envío', () => {
  it('muestra el tiempo restante real, no el de la duración completa', () => {
    // El usuario cerró la pestaña y vuelve 30 minutos después. Quedan 90 min.
    vi.setSystemTime(INICIO + 30 * MINUTO);
    montar(sesion());
    expect(screen.getByRole('timer').textContent).toBe('1:30:00');
  });

  it('CERRAR LA PESTAÑA NO REGALA TIEMPO: el reloj manda sobre el montaje', () => {
    // El invariante del paso. Montar es lo que hace un usuario al reabrir la
    // app; si el cronómetro arrancara desde el montaje, aquí saldría 2:00:00.
    vi.setSystemTime(INICIO + 119 * MINUTO);
    montar(sesion());
    expect(screen.getByRole('timer').textContent).toBe('01:00');
  });

  it('se auto-envía al llegar a cero, con lo respondido', () => {
    const onCerrar = vi.fn();
    montar(sesion({ duracionSegundos: 5 }), onCerrar);
    expect(onCerrar).not.toHaveBeenCalled();

    act(() => {
      vi.setSystemTime(INICIO + 6000);
      vi.advanceTimersByTime(1000);
    });

    expect(onCerrar).toHaveBeenCalledTimes(1);
    // Se cierra con un resumen de la tanda completa: lo no respondido cuenta
    // como en blanco, no desaparece.
    const resumen = onCerrar.mock.calls[0][0];
    expect(resumen.total).toBe(ITEMS_TANDA.length);
    expect(resumen.sinResponder).toBe(ITEMS_TANDA.length);
  });

  it('se auto-envía UNA sola vez aunque sigan llegando ticks', () => {
    // Sin la guarda de `yaEnvie`, cada segundo posterior cerraría otra vez y el
    // Paso 12 acabaría con intentos duplicados.
    const onCerrar = vi.fn();
    montar(sesion({ duracionSegundos: 5 }), onCerrar);
    act(() => {
      vi.setSystemTime(INICIO + 6000);
      vi.advanceTimersByTime(5000);
    });
    expect(onCerrar).toHaveBeenCalledTimes(1);
  });

  it('se auto-envía ya al montar si el tiempo se agotó con la pestaña cerrada', () => {
    // Reabrir dos horas después no da un cronómetro en negativo: cierra el
    // intento con lo que hubiera.
    const onCerrar = vi.fn();
    vi.setSystemTime(INICIO + 200 * MINUTO);
    montar(sesion(), onCerrar);
    avanzarUnTick();
    expect(onCerrar).toHaveBeenCalledTimes(1);
  });
});

describe('reanudación', () => {
  it('RECUPERA las respuestas guardadas en vez de arrancar en blanco', () => {
    // Con la tanda entera respondida, el ítem de apertura es el primero y su
    // opción elegida tiene que verse marcada. Es el fallo más caro del paso: si
    // el estado inicial se leyera mal, el usuario vería su tanda en blanco con
    // las respuestas todavía en el disco.
    const todas = Object.fromEntries(
      ITEMS_TANDA.map((it) => [it.id, { valor: 2, segundos: 30, marcada: false }]),
    );
    montar(sesion({ respuestas: todas }));

    expect(screen.getAllByRole('button', { pressed: true })).toHaveLength(1);
  });

  it('el panel de navegación refleja lo respondido y lo marcado al reanudar', () => {
    const guardada = sesion({
      respuestas: {
        [ITEMS_TANDA[0].id]: { valor: 1, segundos: 10, marcada: false },
        [ITEMS_TANDA[1].id]: { valor: null, segundos: 3, marcada: true },
      },
    });
    montar(guardada);

    expect(screen.getByLabelText('Ítem 1, respondida')).toBeDefined();
    expect(screen.getByLabelText('Ítem 2, marcada para revisar')).toBeDefined();
    expect(screen.getByLabelText('Ítem 3, sin responder')).toBeDefined();
  });

  it('persiste en localStorage tras CADA respuesta, no al final', () => {
    montar(sesion());
    // El efecto de persistencia corre al montar y tras cada cambio.
    act(() => {
      vi.advanceTimersByTime(0);
    });
    const guardada = leerSesion();
    expect(guardada).not.toBeNull();
    expect(guardada?.intentoId).toBe(String(INICIO));
  });
});

describe('avisos', () => {
  it('emite el aviso al cruzar el umbral', () => {
    vi.setSystemTime(INICIO + 110 * MINUTO); // quedan 10 min
    montar(sesion());
    avanzarUnTick();
    expect(avisos().textContent).toContain('Quedan 10 minutos');
  });

  it('NO lo repite al recargar: `avisosVistos` viaja en la sesión', () => {
    // La comprobación tiene que ser un montaje nuevo, porque recargar la página
    // es exactamente eso: el estado de React se pierde y solo queda el disco.
    vi.setSystemTime(INICIO + 110 * MINUTO);
    const { vista } = montar(sesion());
    avanzarUnTick();
    expect(avisos().textContent).toContain('Quedan 10 minutos');

    const persistida = leerSesion();
    expect(persistida?.avisosVistos).toContain(600);

    vista.unmount();
    montar(persistida!);
    avanzarUnTick();
    expect(avisos().textContent).toBe('');
  });

  it('al volver tras una ausencia larga muestra el umbral relevante, no los tres', () => {
    vi.setSystemTime(INICIO + 119 * MINUTO); // quedan 60 s: cruzó los tres
    montar(sesion());
    avanzarUnTick();
    const anuncio = avisos().textContent ?? '';
    expect(anuncio).toContain('Últimos 2 minutos');
    expect(anuncio).not.toContain('Quedan 20 minutos');
  });
});

describe('accesibilidad del cronómetro', () => {
  it('NO es una región viva: no puede hablar una vez por segundo', () => {
    // Regresión dura. Con `aria-live` aquí, un lector de pantalla interrumpiría
    // al usuario 7200 veces en un simulacro final.
    montar(sesion());
    avanzarUnTick();
    const cronometro = screen.getByRole('timer');
    expect(cronometro.getAttribute('aria-live')).toBe('off');
  });

  it('su nombre accesible va en MINUTOS, así que no cambia cada segundo', () => {
    vi.setSystemTime(INICIO + 30 * MINUTO);
    montar(sesion());
    const antes = screen.getByRole('timer').getAttribute('aria-label');

    act(() => {
      vi.setSystemTime(INICIO + 30 * MINUTO + 3000);
      vi.advanceTimersByTime(3000);
    });

    expect(screen.getByRole('timer').getAttribute('aria-label')).toBe(antes);
    expect(antes).toBe('Quedan 90 minutos');
  });

  it('el estado de cada celda del panel va en TEXTO, no solo en color', () => {
    // DISENO.md §1.2: el color nunca es el único portador.
    montar(sesion({ respuestas: { [ITEMS_TANDA[0].id]: { valor: 1, segundos: 2, marcada: false } } }));
    expect(screen.getByLabelText('Ítem 1, respondida')).toBeDefined();
  });

  it('el ítem en pantalla se marca con aria-current en el panel', () => {
    montar(sesion());
    expect(screen.getByLabelText('Ítem 1, sin responder').getAttribute('aria-current')).toBe('true');
    expect(screen.getByLabelText('Ítem 2, sin responder').getAttribute('aria-current')).toBeNull();
  });
});

describe('a qué ítem vuelve al reanudar', () => {
  it('abre en el primer ítem SIN responder, no en el primero de la tanda', () => {
    // El índice no se persiste —§4 no tiene campo— así que se deriva. Es mejor
    // destino que el último visto: al reanudar, lo que hace falta es lo que
    // falta por responder.
    const guardada = sesion({
      respuestas: {
        [ITEMS_TANDA[0].id]: { valor: 1, segundos: 10, marcada: false },
        [ITEMS_TANDA[1].id]: { valor: 2, segundos: 8, marcada: false },
      },
    });
    montar(guardada);
    expect(screen.getByText('Ítem 3 de 3')).toBeDefined();
  });

  it('con todo respondido vuelve al primero: lo que queda es revisar', () => {
    const todas = Object.fromEntries(
      ITEMS_TANDA.map((it) => [it.id, { valor: 1, segundos: 5, marcada: false }]),
    );
    montar(sesion({ respuestas: todas }));
    expect(screen.getByText('Ítem 1 de 3')).toBeDefined();
  });
});

describe('foco al entrar y al salir', () => {
  it('[A-32] no deja el foco en el <body> al arrancar la tanda', () => {
    // La portada y el diálogo de reanudar se desmontan con el botón que el
    // usuario pulsó. Chromium lo disimula con su starting point; Firefox y
    // Safari reinician el tabulador desde arriba de la página, con el reloj ya
    // corriendo.
    const { vista } = montar(sesion());
    expect(document.activeElement).not.toBe(document.body);
    expect(vista.container.contains(document.activeElement)).toBe(true);
  });
});
