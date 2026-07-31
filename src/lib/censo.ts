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

import { censarBanco } from '@/content/banco/indice';
import { MODULOS } from '@/content/estructura';
import type { CensoModulo } from './simulacro';

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
