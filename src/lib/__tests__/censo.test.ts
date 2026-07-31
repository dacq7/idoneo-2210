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
    // Es lo que permite que la portada diga «faltan N» en vez de callarse los
    // módulos sin contenido.
    //
    // El conteo se DERIVA del catálogo, no se escribe a mano: la versión
    // anterior fijaba `MODULOS.length - 1` porque solo C5 estaba publicado, y
    // caducó en el Paso 15 al publicar el bloque D entero. Un test que hay que
    // reescribir cada vez que se publica contenido no está midiendo el código.
    const publicados = MODULOS.filter((m) => m.estadoContenido === 'completo').length;
    const censo = await censarModulosPara(DIAGNOSTICO);
    expect(censo).toHaveLength(MODULOS.length);
    expect(censo.filter((m) => m.disponibles === 0).length).toBe(MODULOS.length - publicados);
  });

  it('el veredicto que produce es EXACTO y cuadra con el censo real', async () => {
    // El circuito completo: censo real → viabilidad real. Es lo que ve el
    // usuario en la portada del diagnóstico.
    //
    // Lo que se fija es la RELACIÓN entre censo y veredicto, no un número. La
    // versión anterior afirmaba `totalDisponible === ELEGIBLES_C5` y `viable:
    // false`, y las dos cosas caducaron al publicar el bloque D: los números
    // del contenido cambian a propósito en los pasos 15–17, la aritmética no.
    const censo = await censarModulosPara(DIAGNOSTICO);
    const v = diagnosticarViabilidad(DIAGNOSTICO, censo);
    const suma = censo.reduce((t, m) => t + m.disponibles, 0);

    expect(v.exacto).toBe(true);
    expect(v.totalDisponible).toBe(suma);
    expect(v.viable).toBe(suma >= DIAGNOSTICO.totalItems);
    expect(v.faltan).toBe(Math.max(0, DIAGNOSTICO.totalItems - suma));
  });

  it('el censo filtrado sigue contando MENOS que los publicados en C5', async () => {
    // La regresión que ADR-025 existe para impedir, fijada sobre un módulo
    // concreto en vez de sobre el total —que ahora crece con cada paso—.
    const censo = await censarModulosPara(DIAGNOSTICO, ['c5-umbrales-zonas']);
    expect(censo[0].disponibles).toBe(ELEGIBLES_C5);
    expect(censo[0].disponibles).toBeLessThan(ITEMS.length);
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
