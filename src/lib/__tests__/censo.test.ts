// src/lib/__tests__/censo.test.ts
//
// `censarModulosPara` es la función que da nombre a ADR-025 y **no tenía ni un
// test directo**: los siete de `simulacro.test.ts` construyen `CensoModulo[]` a
// mano y solo ejercitan `diagnosticarViabilidad`. El `code-reviewer` lo
// demostró con un mutante que sobrevivía a la suite entera:
//
//     disponibles: items.filter((it) => esElegible(it, bp)).length
//   → disponibles: items.length
//
// Es decir, **la regresión exacta que ADR-025 existe para impedir** —volver a
// contar publicados en vez de elegibles— pasaba con 636/636 en verde. Con el
// contenido de hoy eso significa decir «hay 28, faltan 2» donde la verdad es
// «hay 14, faltan 16».
//
// Lección, y por eso queda escrita: ADR-025 afirmaba «tiene test propio y el
// mutante muere». Era cierto solo de la guarda de censo vacío, no de la función
// que el ADR titula. Un ADR que declara cobertura obliga a comprobar de QUÉ.

import { describe, expect, it } from 'vitest';
import { ITEMS } from '@/content/banco/c5-umbrales-zonas';
import { BLUEPRINTS, DIAGNOSTICO, FINAL } from '@/content/blueprint-examen';
import { MODULOS } from '@/content/estructura';
import { censarModulos, censarModulosPara, moduloAlternativo } from '@/lib/censo';
import { diagnosticarViabilidad } from '@/lib/simulacro';

/** Los ítems de C5 que el diagnóstico puede elegir de verdad. */
const ELEGIBLES_C5 = ITEMS.filter(
  (it) =>
    DIAGNOSTICO.tiposPermitidos!.includes(it.tipo) &&
    DIAGNOSTICO.dificultadesPermitidas!.includes(it.dificultad),
).length;

describe('censarModulosPara', () => {
  it('cuenta ELEGIBLES, no publicados — el mutante que sobrevivía a toda la suite', () => {
    expect(ELEGIBLES_C5).toBeLessThan(ITEMS.length);

    return censarModulosPara(DIAGNOSTICO).then((censo) => {
      const c5 = censo.find((m) => m.slug === 'c5-umbrales-zonas')!;
      expect(c5.disponibles).toBe(ELEGIBLES_C5);
      expect(c5.disponibles).not.toBe(ITEMS.length);
    });
  });

  it('marca cada entrada con el id del blueprint', async () => {
    // Sin `filtradoPara`, `exacto` es falso SIEMPRE y el diagnóstico queda
    // bloqueado para siempre — un fallo que solo aparecería en los pasos 15–17,
    // cuando ya hubiera contenido y siguiera diciendo que no se puede.
    const censo = await censarModulosPara(DIAGNOSTICO);
    expect(censo.every((m) => m.filtradoPara === DIAGNOSTICO.id)).toBe(true);
  });

  it('un blueprint SIN filtro cuenta lo mismo que el censo normal', async () => {
    const [filtrado, normal] = await Promise.all([censarModulosPara(FINAL), censarModulos()]);
    const porSlug = new Map(normal.map((m) => [m.slug, m.disponibles]));
    for (const m of filtrado) expect(m.disponibles).toBe(porSlug.get(m.slug));
  });

  it('acota al conjunto de slugs pedido', async () => {
    const censo = await censarModulosPara(DIAGNOSTICO, ['c5-umbrales-zonas']);
    expect(censo).toHaveLength(1);
    expect(censo[0].slug).toBe('c5-umbrales-zonas');
  });

  it('incluye los módulos vacíos en vez de omitirlos', async () => {
    // Es lo que permite que la portada diga «faltan 16» en vez de callarse los
    // módulos sin contenido.
    const censo = await censarModulosPara(DIAGNOSTICO);
    expect(censo).toHaveLength(MODULOS.length);
    expect(censo.filter((m) => m.disponibles === 0).length).toBe(MODULOS.length - 1);
  });

  it('el veredicto que produce es inviable Y exacto con el contenido de hoy', async () => {
    // El circuito completo: censo real → viabilidad real. Es lo que ve el
    // usuario en la portada del diagnóstico.
    const censo = await censarModulosPara(DIAGNOSTICO);
    const v = diagnosticarViabilidad(DIAGNOSTICO, censo);
    expect(v.viable).toBe(false);
    expect(v.exacto).toBe(true);
    expect(v.totalDisponible).toBe(ELEGIBLES_C5);
    expect(v.faltan).toBe(DIAGNOSTICO.totalItems - ELEGIBLES_C5);
  });

  it('los cuatro simulacros de bloque siguen siendo exactos sin filtro', async () => {
    const censo = await censarModulos();
    for (const id of ['bloque-A', 'bloque-B', 'bloque-C', 'bloque-D']) {
      expect(diagnosticarViabilidad(BLUEPRINTS[id], censo).exacto).toBe(true);
    }
  });
});

describe('moduloAlternativo', () => {
  it('devuelve el módulo publicado con más banco', async () => {
    // Es la salida que se ofrece a quien no puede hacer el simulacro todavía:
    // tiene que ser una alternativa real, no la primera que aparezca.
    const alt = await moduloAlternativo();
    expect(alt).not.toBeNull();
    expect(alt!.slug).toBe('c5-umbrales-zonas');
  });
});
