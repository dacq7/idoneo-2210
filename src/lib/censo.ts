// src/lib/censo.ts — helper de servidor para las rutas de simulacro.
//
// Sin directiva de cliente. **No lo importa ningún Client Component**: importa
// `content/estructura` y `content/banco/indice`, y un import estático de esos
// desde el navegador metería los 29 módulos completos en el bundle (ADR-010).
// Lo llaman las páginas, que son Server Components.
//
// Su trabajo: convertir el conteo por módulo que devuelve `censarBanco()` en la
// lista `CensoModulo[]` que consume `diagnosticarViabilidad`, que es lo único
// que cruza la frontera hacia el cliente: tres campos por módulo.

import { cargarBancoModulo, censarBanco } from '@/content/banco/indice';
import { MODULOS } from '@/content/estructura';
import type { BlueprintExamen, Item } from './tipos';
import type { CensoModulo } from './simulacro';

/** Los ítems del blueprint que de verdad puede elegir `armarSimulacro`. */
function esElegible(item: Item, bp: BlueprintExamen): boolean {
  return (
    (bp.tiposPermitidos === undefined || bp.tiposPermitidos.includes(item.tipo)) &&
    (bp.dificultadesPermitidas === undefined || bp.dificultadesPermitidas.includes(item.dificultad))
  );
}

/**
 * Censo de los módulos indicados, o de los 29 si no se acota.
 *
 * Un módulo sin banco cuenta 0 y **sí aparece** en la lista: es lo que permite
 * que la portada diga «faltan 72» en vez de callarse los módulos vacíos.
 */
export async function censarModulos(slugs?: readonly string[]): Promise<CensoModulo[]> {
  const conteos = await censarBanco();
  const alcance = slugs === undefined ? MODULOS : MODULOS.filter((m) => slugs.includes(m.slug));
  return alcance.map((modulo) => ({
    slug: modulo.slug,
    bloque: modulo.bloque,
    disponibles: conteos[modulo.slug] ?? 0,
  }));
}

/**
 * Censo **para un blueprint concreto**, contando solo los ítems que ese
 * blueprint puede elegir de verdad.
 *
 * ══ POR QUÉ HACE FALTA, Y POR QUÉ NO BASTABA EL CENSO NORMAL ══
 * `PENDIENTES.md` lo dejó anotado desde el Paso 11 para resolverlo aquí: el
 * diagnóstico es el primer blueprint que **filtra** —`tiposPermitidos:
 * ['unica','emparejar','caso']` y dificultades 1 y 2— y el censo de ítems
 * *publicados* es entonces una **cota superior**. Podía decir «viable» y no
 * serlo: C5 tiene 28 ítems publicados, pero cuántos de ellos son de esos tres
 * tipos **y** de dificultad 1 o 2 es otra cuenta.
 *
 * La nota proponía dos salidas: llevar la distribución conjunta tipo ×
 * dificultad en el censo, o cargar el banco en el servidor y contar. **Se elige
 * la segunda**, y por bastante margen: la conjunta son 21 números por módulo
 * (7 tipos × 3 dificultades) que cruzan la frontera y hay que mantener en
 * sincronía con `TipoItem`, mientras que contar aquí es exacto por
 * construcción, cuesta un `filter` y **no cambia lo que viaja al cliente** —
 * sigue siendo un número por módulo. El coste es cargar el banco en el
 * servidor, que ya se pagaba en `censarBanco` y se paga en build.
 *
 * Marca cada entrada con `filtradoPara` para que `diagnosticarViabilidad` sepa
 * que puede fiarse (ADR-025).
 */
export async function censarModulosPara(
  bp: BlueprintExamen,
  slugs?: readonly string[],
): Promise<CensoModulo[]> {
  const alcance = slugs === undefined ? MODULOS : MODULOS.filter((m) => slugs.includes(m.slug));
  const entradas = await Promise.all(
    alcance.map(async (modulo) => {
      const items = await cargarBancoModulo(modulo.slug);
      return {
        slug: modulo.slug,
        bloque: modulo.bloque,
        disponibles: items.filter((it) => esElegible(it, bp)).length,
        filtradoPara: bp.id,
      };
    }),
  );
  return entradas;
}

/**
 * Un módulo publicado al que mandar a quien no puede hacer el simulacro todavía.
 * Devuelve el de mayor banco: es el que da la mejor alternativa real.
 */
export async function moduloAlternativo(): Promise<{ slug: string; titulo: string } | null> {
  const conteos = await censarBanco();
  const candidatos = MODULOS.filter(
    (m) => m.estadoContenido === 'completo' && (conteos[m.slug] ?? 0) > 0,
  ).sort((a, b) => (conteos[b.slug] ?? 0) - (conteos[a.slug] ?? 0) || a.slug.localeCompare(b.slug));

  const elegido = candidatos[0];
  return elegido ? { slug: elegido.slug, titulo: elegido.titulo } : null;
}
