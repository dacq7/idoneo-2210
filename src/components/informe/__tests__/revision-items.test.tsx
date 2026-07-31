// src/components/informe/__tests__/revision-items.test.tsx
// Proyecto `componentes`, jsdom (ADR-016).
//
// `RevisionItems` es el componente con más lógica del Paso 12 —carga diferida,
// reproducción del barajado, cuatro fases y un filtro— y el `code-reviewer` lo
// encontró sin un solo test. Es además donde vivía el peor defecto del paso.
//
// Estos casos están dentro del alcance que ADR-016 fijó para este proyecto: los
// cuatro dependen del ciclo de vida —el efecto de carga con `import()` dinámico
// y el estado que produce—, así que ninguna función pura los expresa.
//
// **El caso 2 es el que importa.** Con la tanda incompleta, `presentarTanda`
// produce un orden distinto del que vio el usuario para todo lo que venía
// después del hueco: medido por el revisor, 2 de 5 ítems señalaban una opción
// que el usuario no marcó. La pantalla se contradecía sola —«la acertaste»
// junto a un resaltado en otra opción— y este test fija que ya no lo hace.

import { describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { ITEMS } from '@/content/banco/c5-umbrales-zonas';
import type { RespuestaItem } from '@/lib/tipos';
import { RevisionItems } from '../revision-items';

const SEMILLA = 1_785_182_400_000;
const SLUGS = ['c5-umbrales-zonas'];

function respuestas(ids: readonly string[], correctas: number): RespuestaItem[] {
  return ids.map((id, i) => ({
    itemId: id,
    respuesta: 0,
    correcta: i < correctas,
    segundos: 10,
    marcada: false,
  }));
}

describe('RevisionItems', () => {
  it('carga los ítems del intento y los lista', async () => {
    const ids = ITEMS.slice(0, 4).map((it) => it.id);
    render(
      <RevisionItems
        itemIds={ids}
        respuestas={respuestas(ids, 2)}
        semilla={SEMILLA}
        slugs={SLUGS}
      />,
    );

    // Arranca en «solo las que fallé»: 2 de 4.
    await waitFor(() => expect(screen.getByText(/Mostrando 2 de 4/)).toBeDefined());
    expect(screen.queryByText(/ya no está publicada/)).toBeNull();
  });

  it('AVISA y no señala la respuesta elegida cuando falta un ítem del banco', async () => {
    // El hallazgo del `code-reviewer`. Con un hueco, el barajado del resto deja
    // de corresponder: antes que enseñar un error que el usuario no cometió, se
    // dice y se degrada.
    const ids = [...ITEMS.slice(0, 3).map((it) => it.id), 'ZZ-999'];
    render(
      <RevisionItems
        itemIds={ids}
        respuestas={respuestas(ids, 1)}
        semilla={SEMILLA}
        slugs={SLUGS}
      />,
    );

    await waitFor(() => expect(screen.getByText(/ya no está publicada/)).toBeDefined());
    expect(screen.getByText(/no se señala cuál marcaste/)).toBeDefined();

    // Ninguna OPCIÓN aparece marcada como elegida por el usuario. Se excluye el
    // botón del filtro, que también usa `aria-pressed` y sí debe estar activo.
    const marcadas = screen
      .queryAllByRole('button', { pressed: true })
      .filter((b) => b.textContent !== 'Ver solo las que fallé');
    expect(marcadas).toHaveLength(0);
  });

  it('el filtro «solo las que fallé» alterna y dice cuántas muestra', async () => {
    const ids = ITEMS.slice(0, 5).map((it) => it.id);
    render(
      <RevisionItems
        itemIds={ids}
        respuestas={respuestas(ids, 3)}
        semilla={SEMILLA}
        slugs={SLUGS}
      />,
    );

    const boton = await screen.findByRole('button', { name: 'Ver solo las que fallé' });
    expect(boton.getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByText(/Mostrando 2 de 5/)).toBeDefined();

    boton.click();
    await waitFor(() => expect(screen.getByText(/Mostrando las 5/)).toBeDefined());
  });

  it('sin fallos no ofrece el filtro: no hay nada que filtrar', async () => {
    const ids = ITEMS.slice(0, 3).map((it) => it.id);
    render(
      <RevisionItems
        itemIds={ids}
        respuestas={respuestas(ids, 3)}
        semilla={SEMILLA}
        slugs={SLUGS}
      />,
    );

    await waitFor(() =>
      expect(screen.queryByText(/Cargando las preguntas/)).toBeNull(),
    );
    expect(screen.queryByRole('button', { name: 'Ver solo las que fallé' })).toBeNull();
  });

  it('un intento cuyo módulo no existe no deja la pantalla en blanco', async () => {
    render(
      <RevisionItems
        itemIds={['ZZ-001']}
        respuestas={respuestas(['ZZ-001'], 0)}
        semilla={SEMILLA}
        slugs={['modulo-que-no-existe']}
      />,
    );

    await waitFor(() => expect(screen.getByText(/ya no está publicada/)).toBeDefined());
  });
});
